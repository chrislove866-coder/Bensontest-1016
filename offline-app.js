/**
 * 自主檢查表離線版：外框邏輯
 *   - 載入共用的自主檢查表畫面（PAGES['self-check']）
 *   - 工地（工程名稱）切換、新增／改名／刪除
 *   - 備份匯出（下載 .json）／匯入
 *   - 註冊 Service Worker，讓第一次開啟後沒有網路也能使用
 */
(function () {
  const content = document.getElementById('content');
  const sel = document.getElementById('olProject');
  const dlg = document.getElementById('olDialog');
  const fileInput = document.getElementById('olImportFile');
  const statusEl = document.getElementById('olStatus');
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const O = window.OFFLINE;

  function showPage() {
    const page = window.PAGES['self-check'];
    content.innerHTML = page.render();
    page.mount(content);
    document.title = `自主檢查表 離線版｜${window.SK_STORE.projectName()}`;
  }
  function renderSelect() {
    sel.innerHTML = O.projects().map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
    sel.value = O.current();
  }

  sel.addEventListener('change', async () => {
    await O.setCurrent(sel.value);
    showPage();
  });

  /* ---------- 工地管理 ---------- */
  function manageHTML(msg = '') {
    const list = O.projects();
    return `
      <div class="pj-box">
        <div class="pj-head">
          <h3>工地（工程名稱）</h3>
          <button class="sk-dlg-x" data-x aria-label="關閉">✕</button>
        </div>
        <p class="pj-hint">工地名稱會印在檢查表的「工程名稱」。每個工地各有一整套檢查表。</p>
        <ul class="pj-list">
          ${list.map(p => `
            <li data-id="${esc(p.id)}">
              <input class="pj-input" value="${esc(p.name)}" maxlength="50" aria-label="工地名稱" />
              <button class="ac-save" data-rename hidden>儲存</button>
              <button class="ac-del" data-delete ${list.length === 1 ? 'disabled title="至少要保留一個工地"' : ''}>刪除</button>
            </li>`).join('')}
        </ul>
        <form class="pj-add" data-add>
          <input name="name" placeholder="新工地名稱，例如：中壢長鴻" maxlength="50" required />
          <button class="sk-fill" type="submit">＋ 新增工地</button>
        </form>
        <div class="pj-msg" ${msg ? '' : 'hidden'}>${esc(msg)}</div>
      </div>`;
  }
  async function run(fn, okMsg) {
    let msg = okMsg;
    try { await fn(); } catch (e) { msg = e.message; }
    renderSelect();
    showPage();
    dlg.innerHTML = manageHTML(msg);
  }
  document.getElementById('olManage').addEventListener('click', () => {
    dlg.innerHTML = manageHTML();
    dlg.showModal();
  });

  /* ---------- 備份 ---------- */
  function backupHTML(msg = '') {
    return `
      <div class="pj-box ol-backup">
        <div class="pj-head">
          <h3>💾 備份</h3>
          <button class="sk-dlg-x" data-x aria-label="關閉">✕</button>
        </div>
        <p>檢查表只存在這台裝置。換手機、清除瀏覽器資料或裝置故障前，請先匯出備份檔，存到電腦或雲端硬碟。</p>
        <div class="ol-backup-actions">
          <button class="ol-btn" data-export>⬇ 匯出備份檔（所有工地與檢查表）</button>
          <button class="ol-btn" data-import>⬆ 匯入備份檔</button>
        </div>
        <div class="ol-tip">匯入會「合併」資料：相同的工地與檢查表以備份檔內容為準，其他資料保留。</div>
        <div class="pj-msg" ${msg ? '' : 'hidden'}>${esc(msg)}</div>
      </div>`;
  }
  document.getElementById('olBackup').addEventListener('click', () => {
    dlg.innerHTML = backupHTML();
    dlg.showModal();
  });
  async function exportBackup() {
    const data = await O.exportBackup();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `自主檢查表備份_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return `已匯出 ${data.forms.filter(f => f.version > 0).length} 份已填寫的檢查表（共 ${data.projects.length} 個工地）`;
  }
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    let msg;
    try {
      const r = await O.importBackup(JSON.parse(await file.text()));
      msg = `已匯入 ${r.projects} 個工地、${r.forms} 份檢查表`;
      renderSelect();
      showPage();
    } catch (e) {
      msg = e instanceof SyntaxError ? '檔案格式不正確，無法讀取' : e.message;
    }
    dlg.innerHTML = backupHTML(msg);
    if (!dlg.open) dlg.showModal();
  });

  /* ---------- 視窗事件（工地管理與備份共用） ---------- */
  dlg.addEventListener('click', async e => {
    if (e.target === dlg || e.target.closest('[data-x]')) { dlg.close(); return; }
    if (e.target.closest('[data-export]')) { dlg.innerHTML = backupHTML(await exportBackup()); return; }
    if (e.target.closest('[data-import]')) { fileInput.click(); return; }
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const p = O.projects().find(x => x.id === li.dataset.id);
    if (e.target.closest('[data-rename]')) {
      const name = li.querySelector('.pj-input').value.trim();
      run(() => O.renameProject(p.id, name), `已改名為「${name}」`);
    }
    if (e.target.closest('[data-delete]')) {
      const n = await O.savedCount(p.id);
      const warn = n ? `\n\n⚠ 這個工地有 ${n} 份已填寫的檢查表，刪除後無法復原。建議先匯出備份。` : '';
      if (!confirm(`確定刪除工地「${p.name}」？${warn}`)) return;
      run(() => O.deleteProject(p.id), `已刪除「${p.name}」`);
    }
  });
  dlg.addEventListener('input', e => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const p = O.projects().find(x => x.id === li.dataset.id);
    li.querySelector('[data-rename]').hidden = e.target.value.trim() === p.name;
  });
  dlg.addEventListener('keydown', e => {
    const li = e.target.closest('li[data-id]');
    if (li && e.key === 'Enter') { e.preventDefault(); li.querySelector('[data-rename]').click(); }
  });
  dlg.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    run(async () => { const p = await O.addProject(name); await O.setCurrent(p.id); }, `已新增「${name}」`);
  });

  /* ---------- 離線快取 ---------- */
  function setStatus(text) {
    statusEl.textContent = text;
    statusEl.hidden = !text;
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ready = () => setStatus('✓ 可離線使用');
      if (reg.active) ready();
      navigator.serviceWorker.ready.then(ready);
    }).catch(() => setStatus(''));
  }

  /* ---------- 啟動 ---------- */
  (async () => {
    try {
      await O.init();
      renderSelect();
      showPage();
    } catch (e) {
      content.innerHTML = `<div class="sk-empty">無法啟動：${esc(e.message)}</div>`;
    }
  })();
})();
