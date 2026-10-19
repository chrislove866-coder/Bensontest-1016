/**
 * 自主檢查表離線版：外框邏輯
 *   - 載入共用的自主檢查表畫面（PAGES['self-check']）
 *   - 公司名稱（印在表頭，可空白）；工地（工程名稱）切換、新增／改名／刪除
 *   - 自訂範本：自己新增、修改、刪除整份檢查表（或複製現有範本再改）
 *   - 備份匯出（下載 .json）／匯入；有填寫內容超過 7 天沒備份時提醒
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
    document.title = `自主檢查表｜${window.SK_STORE.projectName()}｜酪梨營造工具箱`;
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
          <h3>公司與工地</h3>
          <button class="sk-dlg-x" data-x aria-label="關閉">✕</button>
        </div>
        <form class="pj-company" data-company>
          <label for="olCompany">公司名稱（印在檢查表最上方，可空白）</label>
          <div class="pj-row">
            <input id="olCompany" name="company" value="${esc(O.company())}" placeholder="例如：○○營造有限公司" maxlength="40" />
            <button class="ac-save" type="submit">儲存</button>
          </div>
        </form>
        <h4 class="pj-sub">工地（工程名稱）</h4>
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
    await O.markBackedUp();
    checkRemind();
    return `已匯出 ${data.forms.filter(f => f.version > 0).length} 份已填寫的檢查表（共 ${data.projects.length} 個工地）`;
  }
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    let msg;
    try {
      const r = await O.importBackup(JSON.parse(await file.text()));
      msg = `已匯入 ${r.projects} 個工地、${r.forms} 份檢查表${r.templates ? `、${r.templates} 份自訂範本` : ''}`;
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
    if (e.target.matches('[data-company]')) {
      const name = e.target.company.value.trim();
      run(() => O.setCompany(name), name ? `公司名稱已改為「${name}」` : '公司名稱已清空，表頭會留白');
      return;
    }
    const name = e.target.name.value.trim();
    run(async () => { const p = await O.addProject(name); await O.setCurrent(p.id); }, `已新增「${name}」`);
  });

  /* ---------- 超過 7 天沒備份提醒 ---------- */
  const remindEl = document.getElementById('olRemind');
  const backupBtn = document.getElementById('olBackup');
  let remindLater = false; // 按「稍後」：這次開啟不再跳出提醒列（備份按鈕仍顯示紅點）
  async function checkRemind() {
    let due = null;
    try { if (ready) due = await O.backupDue(); } catch (e) {}
    backupBtn.classList.toggle('ol-btn-alert', !!due);
    remindEl.hidden = !due || remindLater || location.hash !== '#/self-check';
    if (due) {
      document.getElementById('olRemindText').textContent = due.never
        ? `⚠ 檢查表已經填了 ${due.days} 天，還沒備份過。手機遺失或換手機會找不回來，建議匯出備份檔。`
        : `⚠ 已經 ${due.days} 天沒備份了，建議匯出備份檔，存到電腦或雲端硬碟。`;
    }
  }
  remindEl.addEventListener('click', e => {
    const b = e.target.closest('[data-remind]');
    if (!b) return;
    if (b.dataset.remind === 'backup') backupBtn.click();
    else { remindLater = true; remindEl.hidden = true; }
  });
  // 填表視窗關閉（可能剛儲存）時重新檢查；dialog 的 close 事件不會往上傳，要用捕獲階段
  content.addEventListener('close', () => checkRemind(), true);

  /* ---------- 自訂範本：自己新增整份檢查表 ---------- */
  const tpDlg = document.getElementById('olTpl');
  let ed = null;   // 編輯中的範本 { id（新增時空白）, category, title, sub, items: [[檢查項目, 管理標準]] }
  let edSnap = '';
  let cats = [];   // 工作類別（給輸入框的建議清單）
  const edDirty = () => !!ed && JSON.stringify(ed) !== edSnap;

  async function showList(msg = '') {
    ed = null;
    const all = await O.templates();
    const mine = O.customTemplates();
    const ids = Object.keys(mine).sort();
    const every = Object.keys(all.templates).sort();
    tpDlg.innerHTML = `
      <div class="tp-box">
        <div class="pj-head">
          <h3>📋 檢查表範本</h3>
          <button class="sk-dlg-x" data-tp="close" aria-label="關閉">✕</button>
        </div>
        <p class="pj-hint">自己新增的範本會出現在每個工地的檢查表清單。內建範本不能改，可以「複製」一份再修改。</p>
        <h4 class="pj-sub">我的範本（${ids.length}）</h4>
        ${ids.length ? `<ul class="tp-list">${ids.map(id => `
          <li>
            <div><b>${esc(mine[id].title)}</b><small>${esc(mine[id].category)}・${mine[id].items.length} 項</small></div>
            <button class="ac-save" data-tp="edit" data-id="${id}">修改</button>
            <button class="ac-del" data-tp="delete" data-id="${id}">刪除</button>
          </li>`).join('')}</ul>` : '<div class="tp-empty">還沒有自訂範本</div>'}
        <button class="sk-fill tp-new" data-tp="new">＋ 新增空白範本</button>
        <div class="tp-copy">
          <label for="tpCopyFrom">或從現有範本複製一份再修改：</label>
          <div class="pj-row">
            <select id="tpCopyFrom">
              ${all.categories.map(c => `
                <optgroup label="${esc(c)}">
                  ${every.filter(id => all.templates[id].category === c)
                    .map(id => `<option value="${id}">${esc(all.templates[id].title)}</option>`).join('')}
                </optgroup>`).join('')}
            </select>
            <button class="ac-save" data-tp="copy">複製</button>
          </div>
        </div>
        <div class="pj-msg" ${msg ? '' : 'hidden'}>${esc(msg)}</div>
      </div>`;
  }

  function renderEditor(msg = '') {
    const box = tpDlg.querySelector('.tp-box');
    const top = box ? box.scrollTop : 0;
    tpDlg.innerHTML = `
      <div class="tp-box tp-edit">
        <div class="pj-head">
          <h3>${ed.id ? '修改範本' : '新增範本'}</h3>
          <button class="sk-dlg-x" data-tp="back" aria-label="返回範本清單">✕</button>
        </div>
        <div class="tp-fields">
          <label>工作類別
            <input data-ed="category" value="${esc(ed.category)}" list="tpCats" maxlength="20" placeholder="選現有的類別，或自己取新的" />
          </label>
          <datalist id="tpCats">${cats.map(c => `<option value="${esc(c)}"></option>`).join('')}</datalist>
          <label>檢查表名稱
            <input data-ed="title" value="${esc(ed.title)}" maxlength="60" placeholder="例如：屋頂防水施工自主檢查表" />
          </label>
          <label>分項工程名稱（印在表上，可空白）
            <input data-ed="sub" value="${esc(ed.sub)}" maxlength="60" placeholder="例如：防水工程" />
          </label>
        </div>
        <h4 class="pj-sub">檢查項目（${ed.items.length}）</h4>
        <p class="pj-hint">空白的項目不會儲存。同一個檢查項目有好幾條標準時，檢查項目填一樣的字，列印時會合併成一格。</p>
        <ol class="tp-items">
          ${ed.items.map(([name, std], i) => `
            <li>
              <span class="tp-no">${i + 1}.</span>
              <div class="tp-item-fields">
                <textarea data-it="0" data-i="${i}" rows="1" maxlength="200" placeholder="檢查項目">${esc(name)}</textarea>
                <textarea data-it="1" data-i="${i}" rows="2" maxlength="300" placeholder="管理標準（例如：誤差 5mm 以內）">${esc(std)}</textarea>
              </div>
              <div class="tp-item-btns">
                <button data-tp="up" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="往上移">↑</button>
                <button data-tp="down" data-i="${i}" ${i === ed.items.length - 1 ? 'disabled' : ''} aria-label="往下移">↓</button>
                <button data-tp="del-item" data-i="${i}" aria-label="刪除此項">✕</button>
              </div>
            </li>`).join('')}
        </ol>
        <button class="sk-btn" data-tp="add-item">＋ 新增一項</button>
        <div class="pj-msg" ${msg ? '' : 'hidden'}>${esc(msg)}</div>
        <div class="tp-actions">
          <button class="sk-btn" data-tp="back">取消</button>
          <button class="sk-btn sk-btn-primary" data-tp="save">💾 儲存範本</button>
        </div>
      </div>`;
    tpDlg.querySelector('.tp-box').scrollTop = top;
  }
  async function startEdit(id, src) {
    cats = (await O.templates()).categories;
    ed = { id, category: src.category, title: src.title, sub: src.sub || '', items: src.items.map(([n, s]) => [n, s || '']) };
    edSnap = JSON.stringify(ed);
    renderEditor();
    tpDlg.querySelector('.tp-box').scrollTop = 0;
    if (!ed.title) tpDlg.querySelector('[data-ed="category"]').focus();
  }
  function leaveEditor() {
    if (edDirty() && !confirm('範本還沒儲存，確定要離開嗎？\n\n要保留內容請按「取消」，再按「💾 儲存範本」。')) return;
    showList();
  }
  async function saveEditor(btn) {
    const changed = JSON.stringify(ed.items) !== JSON.stringify(JSON.parse(edSnap).items);
    if (ed.id && changed) {
      const n = await O.templateUsage(ed.id);
      if (n && !confirm(`已有 ${n} 份填寫過的「${JSON.parse(edSnap).title}」。\n\n舊紀錄的標記會照項目順序保留：刪掉或調換順序的話，舊的標記可能對到別的項目。建議先匯出備份。\n\n確定要儲存嗎？`)) return;
    }
    btn.disabled = true;
    try {
      await O.saveTemplate(ed.id, ed);
      const title = ed.title.trim();
      const isNew = !ed.id;
      showPage();
      await showList(isNew ? `已新增「${title}」，每個工地的檢查表清單都加上了這份` : `已儲存「${title}」`);
    } catch (e) {
      btn.disabled = false;
      renderEditor(e.message);
    }
  }

  document.getElementById('olTemplates').addEventListener('click', async () => {
    await showList();
    tpDlg.showModal();
  });
  // Esc：編輯中先詢問；點視窗外面不關閉（避免誤觸遺失內容）
  tpDlg.addEventListener('cancel', e => {
    e.preventDefault();
    if (ed) leaveEditor(); else tpDlg.close();
  });
  tpDlg.addEventListener('click', async e => {
    const b = e.target.closest('[data-tp]');
    if (!b) return;
    const a = b.dataset.tp;
    const i = +b.dataset.i;
    const all = await O.templates();
    if (a === 'close') tpDlg.close();
    if (a === 'back') leaveEditor();
    if (a === 'new') startEdit('', { category: '', title: '', sub: '', items: [['', ''], ['', ''], ['', '']] });
    if (a === 'copy') {
      const t = all.templates[tpDlg.querySelector('#tpCopyFrom').value];
      startEdit('', { ...t, title: `${t.title}（自訂）` });
    }
    if (a === 'edit') startEdit(b.dataset.id, O.customTemplates()[b.dataset.id]);
    if (a === 'delete') {
      const t = O.customTemplates()[b.dataset.id];
      const n = await O.templateUsage(b.dataset.id);
      const warn = n
        ? `\n\n⚠ 已有 ${n} 份填寫過的「${t.title}」，會一起刪除且無法復原。建議先匯出備份。`
        : '\n\n各工地裡這份還沒填寫的空白表也會一起移除。';
      if (!confirm(`確定刪除範本「${t.title}」？${warn}`)) return;
      await O.deleteTemplate(b.dataset.id);
      showPage();
      showList(`已刪除「${t.title}」`);
    }
    if (a === 'save') saveEditor(b);
    if (a === 'add-item') {
      ed.items.push(['', '']);
      renderEditor();
      const boxes = tpDlg.querySelectorAll('[data-it="0"]');
      boxes[boxes.length - 1].focus();
    }
    if (a === 'del-item') {
      ed.items.splice(i, 1);
      if (!ed.items.length) ed.items.push(['', '']); // 至少留一項
      renderEditor();
    }
    if (a === 'up' || a === 'down') {
      const j = a === 'up' ? i - 1 : i + 1;
      [ed.items[i], ed.items[j]] = [ed.items[j], ed.items[i]];
      renderEditor();
    }
  });
  tpDlg.addEventListener('input', e => {
    const t = e.target;
    if (!ed) return;
    if (t.dataset.ed) ed[t.dataset.ed] = t.value;
    if (t.dataset.it) ed.items[+t.dataset.i][+t.dataset.it] = t.value;
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

  /* ---------- 封面與工具切換（#/ 封面、#/self-check 自主檢查表；手機返回鍵可回封面） ---------- */
  const cover = document.getElementById('cover');
  const bar = document.getElementById('olBar');
  let toolShown = false;
  let ready = false; // 裝置資料庫載入完成前，只能顯示封面
  function route() {
    const tool = ready && location.hash === '#/self-check';
    cover.hidden = tool;
    bar.hidden = !tool;
    content.hidden = !tool;
    if (tool && !toolShown) showPage();
    toolShown = tool;
    checkRemind();
    if (!tool) document.title = '酪梨營造工具箱';
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  /* ---------- 封面「最新更新」（data/updates.json 由 更新紀錄.md 產生） ---------- */
  const SEEN_KEY = 'ol-seen-update';
  async function renderNews() {
    let list;
    try { list = await (await fetch('data/updates.json')).json(); } catch (e) { return; }
    if (!Array.isArray(list) || !list.length) return;
    let seen = null;
    try { seen = localStorage.getItem(SEEN_KEY); } catch (e) {}
    const block = u => `
      <div class="cv-news-day">
        <div class="cv-news-date">${esc(u.date)}${seen && u.date > seen ? '<span class="cv-new">NEW</span>' : ''}</div>
        <ul>${u.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`;
    const listEl = document.getElementById('cvNewsList');
    const more = document.getElementById('cvNewsMore');
    listEl.innerHTML = list.slice(0, 1).map(block).join('');
    more.hidden = list.length <= 1;
    more.onclick = () => { listEl.innerHTML = list.map(block).join(''); more.hidden = true; };
    document.getElementById('cvNews').hidden = false;
    try { localStorage.setItem(SEEN_KEY, list[0].date); } catch (e) {} // 下次開啟只標示更新的日期
  }

  /* ---------- 啟動 ---------- */
  // 封面不需要資料庫，先顯示；資料庫載入完成後才可進入工具（或直接回到原本開著的工具）
  route();
  renderNews();
  (async () => {
    try {
      await O.init();
      renderSelect();
      ready = true;
      route();
    } catch (e) {
      cover.hidden = true;
      content.hidden = false;
      content.innerHTML = `<div class="sk-empty">無法啟動：${esc(e.message)}</div>`;
    }
  })();
})();
