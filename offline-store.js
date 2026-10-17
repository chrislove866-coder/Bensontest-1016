/**
 * 自主檢查表離線版：資料存在裝置本身（瀏覽器 IndexedDB），不需伺服器、不需網路
 * 提供與主網站相同介面的 SK_STORE（見 web-prototype/js/selfcheck-store-server.js），
 * 另加 OFFLINE 物件管理「工地」（工程名稱）與備份匯出／匯入。
 *
 * 資料：
 *   forms 表：每份檢查表 { id, project, template, location, date, contractor, sub, timing, marks,
 *             notes, review, signs, version, createdAt, updatedAt }
 *   kv 表   ：projects（工地清單 [{id, name}]）、current（目前工地 id）
 * 新增工地時，自動為每份範本建立一份空白檢查表（與主網站相同）。
 */
(function () {
  const DB_NAME = 'selfcheck-offline';
  const BACKUP_APP = 'selfcheck-offline';
  let dbp = null;
  let tplCache = null;

  /* ---------- IndexedDB 小工具 ---------- */
  function db() {
    dbp = dbp || new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const d = req.result;
        d.createObjectStore('forms', { keyPath: 'id' }).createIndex('project', 'project');
        d.createObjectStore('kv', { keyPath: 'key' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(new Error('無法開啟裝置上的資料庫（可能是瀏覽器的無痕模式或儲存空間不足）'));
    });
    return dbp;
  }
  async function tx(stores, mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction(stores, mode);
      let result;
      Promise.resolve(fn(t)).then(r => { result = r; }, reject);
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error || new Error('資料庫寫入失敗'));
      t.onabort = () => reject(t.error || new Error('資料庫寫入失敗（可能是儲存空間不足）'));
    });
  }
  const req = r => new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  const kvGet = async key => (await tx(['kv'], 'readonly', t => req(t.objectStore('kv').get(key))))?.value;
  const kvSet = (key, value) => tx(['kv'], 'readwrite', t => { t.objectStore('kv').put({ key, value }); });
  const newId = p => p + Math.random().toString(16).slice(2, 10) + Date.now().toString(16).slice(-4);
  const now = () => Math.floor(Date.now() / 1000);

  /* ---------- 範本 ---------- */
  async function templates() {
    if (!tplCache) {
      const res = await fetch('data/templates.json');
      if (!res.ok) throw new Error('無法讀取檢查表範本');
      tplCache = await res.json();
    }
    return tplCache;
  }

  function blankForm(project, tid, n, location = '') {
    const t = now();
    return {
      id: newId('L'), project, template: tid, location, date: '', contractor: '', sub: '', timing: [],
      marks: Array(n).fill(null), notes: {}, review: { status: null, date: '', title: '' }, signs: {},
      version: 0, createdAt: t, updatedAt: t,
    };
  }
  async function projectSet(project) {
    const tpl = (await templates()).templates;
    return Object.keys(tpl).sort().map(tid => blankForm(project, tid, tpl[tid].items.length));
  }

  /* ---------- 工地（工程名稱） ---------- */
  let projects = [];
  let current = null;

  async function init() {
    projects = (await kvGet('projects')) || [];
    current = await kvGet('current');
    if (!projects.length) await addProject('我的工地');
    if (!projects.some(p => p.id === current)) await setCurrent(projects[0].id);
    const all = await templates();
    const tpl = all.templates;
    // 範本調整（例如 2026-10-17 把 49 號併入 23 號）：依 migrations 把舊表單的標記搬到新位置
    for (const m of all.migrations || []) {
      const stale = (await tx(['forms'], 'readonly', t => req(t.objectStore('forms').getAll())))
        .filter(f => f.template === m.template && f.marks.length === m.fromItems);
      if (!stale.length || !tpl[m.template]) continue;
      const n = tpl[m.template].items.length;
      await tx(['forms'], 'readwrite', t => stale.forEach(f => {
        const marks = Array(n).fill(null), notes = {};
        m.map.forEach((to, from) => {
          marks[to] = f.marks[from];
          if (f.notes && f.notes[from] != null) notes[to] = f.notes[from];
        });
        t.objectStore('forms').put({ ...f, marks, notes });
      }));
    }
    // 範本新增後（例如 46 號），每個工地補上該範本的空白表
    for (const p of projects) {
      const have = new Set((await formsOf(p.id)).map(f => f.template));
      const missing = Object.keys(tpl).sort().filter(t => !have.has(t));
      if (missing.length) {
        await tx(['forms'], 'readwrite', t => missing.forEach(tid =>
          t.objectStore('forms').put(blankForm(p.id, tid, tpl[tid].items.length))));
      }
    }
  }
  const formsOf = project => tx(['forms'], 'readonly', t =>
    req(t.objectStore('forms').index('project').getAll(project)));

  function cleanName(name, exceptId) {
    name = String(name || '').trim();
    if (!name || name.length > 50) throw new Error('工地名稱需為 1～50 個字');
    if (projects.some(p => p.name === name && p.id !== exceptId)) throw new Error(`工地「${name}」已存在`);
    return name;
  }
  async function addProject(name) {
    const p = { id: newId('P'), name: cleanName(name) };
    const set = await projectSet(p.id);
    projects = [...projects, p];
    await tx(['forms', 'kv'], 'readwrite', t => {
      set.forEach(f => t.objectStore('forms').put(f));
      t.objectStore('kv').put({ key: 'projects', value: projects });
    });
    return p;
  }
  async function renameProject(id, name) {
    const n = cleanName(name, id);
    projects = projects.map(p => (p.id === id ? { ...p, name: n } : p));
    await kvSet('projects', projects);
  }
  async function deleteProject(id) {
    if (projects.length === 1) throw new Error('至少要保留一個工地');
    const ids = (await formsOf(id)).map(f => f.id);
    projects = projects.filter(p => p.id !== id);
    await tx(['forms', 'kv'], 'readwrite', t => {
      ids.forEach(fid => t.objectStore('forms').delete(fid));
      t.objectStore('kv').put({ key: 'projects', value: projects });
    });
    if (current === id) await setCurrent(projects[0].id);
  }
  async function setCurrent(id) { current = id; await kvSet('current', id); }
  const savedCount = async id => (await formsOf(id)).filter(f => f.version > 0).length;

  /* ---------- 備份 ---------- */
  async function exportBackup() {
    const forms = await tx(['forms'], 'readonly', t => req(t.objectStore('forms').getAll()));
    return { app: BACKUP_APP, format: 1, exportedAt: new Date().toISOString(), projects, current, forms };
  }
  // 合併匯入：同 id 的工地／表單以備份檔為準，其餘保留
  async function importBackup(data) {
    if (!data || data.app !== BACKUP_APP || !Array.isArray(data.projects) || !Array.isArray(data.forms)) {
      throw new Error('這不是自主檢查表離線版的備份檔');
    }
    const okForm = f => f && typeof f.id === 'string' && typeof f.project === 'string' && Array.isArray(f.marks);
    const forms = data.forms.filter(okForm);
    const byId = new Map(projects.map(p => [p.id, p]));
    data.projects.forEach(p => { if (p && p.id && p.name) byId.set(p.id, { id: p.id, name: String(p.name).slice(0, 50) }); });
    projects = [...byId.values()];
    await tx(['forms', 'kv'], 'readwrite', t => {
      forms.forEach(f => t.objectStore('forms').put(f));
      t.objectStore('kv').put({ key: 'projects', value: projects });
    });
    await init(); // 補齊缺少的範本
    return { projects: data.projects.length, forms: forms.length };
  }

  /* ---------- 與主網站相同介面的 SK_STORE ---------- */
  window.SK_STORE = {
    templates,
    async listForms() {
      const tpl = (await templates()).templates;
      return (await formsOf(current))
        .filter(f => tpl[f.template]) // 已移除的範本（例如併入其他表）不顯示
        .map(({ signs, ...f }) => ({ ...f, signed: Object.keys(signs || {}) }));
    },
    async getForm(id) {
      const f = await tx(['forms'], 'readonly', t => req(t.objectStore('forms').get(id)));
      if (!f) throw new Error('找不到此檢查表，可能已被刪除');
      return f;
    },
    async saveForm(id, body) {
      const f = await this.getForm(id);
      if (!body.date) throw new Error('請填寫檢查日期');
      const fields = ['location', 'date', 'contractor', 'sub', 'timing', 'marks', 'notes', 'review', 'signs', 'extras'];
      fields.forEach(k => { f[k] = body[k]; });
      f.version += 1;
      f.updatedAt = now();
      await tx(['forms'], 'readwrite', t => { t.objectStore('forms').put(f); });
      return f;
    },
    async createForm({ template, location }) {
      const tpl = (await templates()).templates[template];
      if (!tpl) throw new Error('請選擇檢查表種類');
      const f = blankForm(current, template, tpl.items.length, String(location || '').trim().slice(0, 100));
      await tx(['forms'], 'readwrite', t => { t.objectStore('forms').put(f); });
      return f;
    },
    deleteForm: id => tx(['forms'], 'readwrite', t => { t.objectStore('forms').delete(id); }),
    canDelete: () => true,
    projectName: () => (projects.find(p => p.id === current) || {}).name || '',
  };

  window.OFFLINE = {
    init,
    projects: () => projects,
    current: () => current,
    setCurrent, addProject, renameProject, deleteProject, savedCount,
    exportBackup, importBackup,
  };
})();
