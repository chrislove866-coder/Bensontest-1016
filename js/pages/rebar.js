/**
 * 鋼筋快查（主網站與離線版共用，原始檔在 web-prototype/js/pages/rebar.js）
 * 選鋼筋號數、混凝土強度 fc'、鋼筋強度 fy → 受拉伸展長度、受拉搭接長度（甲／乙級）、受壓伸展與搭接長度、保護層。
 *
 * 依據：建築物混凝土結構設計規範（內政部 112 年 8 月修正，113 年 1 月 1 日生效）
 *   25.4.1.4 √fc' ≤ 26.5（fc' 超過 700 以 700 計）
 *   25.4.2.1、表 25.4.2.3 受拉伸展長度（簡化式，≥30 cm）；表 25.4.2.5 修正因數 ψt ψe λ（ψt·ψe ≤ 1.7）
 *   25.4.9 受壓伸展長度（≥20 cm）
 *   表 25.5.2.1 受拉搭接（甲級 1.0ψg·ℓd、乙級 1.3ψg·ℓd，≥30 cm；ψg 只用在搭接：≤4200 1.0、5000 1.08、5600 1.15）
 *   25.5.5.1 受壓搭接（fc' < 210 增加 1/3）
 *   表 20.5.1.3.1 場鑄無預力混凝土保護層（含 113 年勘誤：「格柵小梁」）
 *   彎鉤：表 25.3.1、25.3.2 彎鉤尺寸；ℓdh 一般用 25.4.3.5～25.4.3.8 簡便公式（標準圖 S1-00D 同此，193 格驗算一致），
 *         並列 25.4.3.1 主要公式（ACI 318-19 同款，ψr 1.0～1.6）；耐震接頭用 18.5.5.1（S1-00D 耐震表另取與一般值之大值，4 格較長）
 * 數值一律無條件進位到整數公分（與結構標準圖 S1-00C 表格相同；2026-11-23 用實際工地結構標準圖 72 個數值驗算一致）。
 * 與美國 ACI 318-19 公式相同（6.6、5.3 為 ACI 25、20 [psi] 換算 kgf/cm²），差別：ACI 把 ψg 乘在 ℓd，台灣只乘在搭接。
 */
(function () {
  const KEY = 'rebarTool';
  // CNS 560 標稱直徑（cm）
  const BARS = [
    ['D10', '#3', 0.953], ['D13', '#4', 1.27], ['D16', '#5', 1.59], ['D19', '#6', 1.91], ['D22', '#7', 2.22],
    ['D25', '#8', 2.54], ['D29', '#9', 2.87], ['D32', '#10', 3.22], ['D36', '#11', 3.58],
  ];
  const FCS = [210, 245, 280, 350, 420, 490, 560];
  const FYS = [
    { fy: 2800, name: 'SD280', g: 1.0 },
    { fy: 4200, name: 'SD420W', g: 1.0 },
    { fy: 5000, name: 'SD490W', g: 1.08 },
    { fy: 5600, name: 'SD550W', g: 1.15 },
  ];
  const SMALL = ['D10', 'D13', 'D16', 'D19']; // D19 及較小：係數 6.6（其他情況 4.4）

  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const up = x => Math.ceil(x - 1e-9); // 無條件進位到整數公分（避免 73.0000001 變 74）
  const r1 = x => (Math.round(x * 10) / 10).toString();

  let st = load();
  function load() {
    const d = { bar: 'D19', fc: 280, fy: 4200, fyAuto: true, tight: false, epoxy: 0, light: false, hkCover: true };
    try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return d; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* 私密瀏覽等情況不存 */ } }

  /* ---------- 計算 ---------- */
  function calc(barId, s = st) {
    const [id, no, db] = BARS.find(b => b[0] === barId);
    const small = SMALL.includes(id);
    const fy = s.fy, fc = s.fc;
    const g = (FYS.find(f => f.fy === fy) || { g: 1 }).g;
    const lam = s.light ? 0.75 : 1.0;
    const pe = s.epoxy || 1.0;
    const sq = Math.sqrt(Math.min(fc, 700));
    const k = s.tight ? (small ? 4.4 : 3.5) : (small ? 6.6 : 5.3);
    const ldRaw = pt => fy * Math.min(pt * pe, 1.7) / (k * lam * sq) * db;
    const ld = pt => Math.max(30, up(ldRaw(pt)));
    const lap = (pt, cls) => Math.max(30, up(cls * g * ldRaw(pt)));
    const ldcA = 0.075 * fy / (lam * sq) * db, ldcB = 0.0044 * fy * db;
    const ldc = Math.max(20, up(Math.max(ldcA, ldcB)));
    let lscRaw = (fy <= 4200 ? 0.0073 * fy : 0.013 * fy - 24) * db;
    if (fc < 210) lscRaw *= 4 / 3;
    const lsc = Math.max(30, up(lscRaw));

    // 彎鉤錨定長度 ℓdh（彎鉤的環氧樹脂因數只有 1.2；cover＝側面保護層 ≥6.5 cm 且 90° 延伸段保護層 ≥5 cm、在柱核心內）
    const cover = s.hkCover !== false;
    const hpe = s.epoxy ? 1.2 : 1.0;
    const hMin = Math.max(8 * db, 15);
    const capFc = { D29: 490, D32: 420, D36: 350 }[id] || 700;              // 25.4.3.5 各號數 fc' 上限
    const hAltRaw = 0.075 * fy * hpe / Math.sqrt(Math.min(fc, capFc)) * db * (cover ? 0.7 : 1) * (s.light ? 1.3 : 1);
    const ldhAlt = up(Math.max(hAltRaw, hMin));
    const psiC = fc < 420 ? fc / 1050 + 0.6 : 1.0;                           // 表 25.4.3.2
    const psiO = cover ? 1.0 : 1.25;
    const hMain = pr => up(Math.max(fy * hpe * pr * psiO * psiC / (23 * lam * sq) * Math.pow(db, 1.5), hMin));
    const hSeisRaw = 0.06 * fy * db / (lam * sq);                             // 18.5.5.1
    const ldhSeis = up(Math.max(hSeisRaw, s.light ? Math.max(10 * db, 19) : hMin));
    // 彎鉤尺寸（表 25.3.1、25.3.2），單位 cm
    const big = ['D29', 'D32', 'D36'].includes(id);
    const tieOk = !big;                                                      // 箍筋限 D25 以下
    const tieSmall = ['D10', 'D13', 'D16'].includes(id);
    const geo = {
      bend: big ? 8 : 6,
      ext90: 12 * db, a1: (12 + (big ? 4 : 3) + 1) * db,
      ext180: Math.max(4 * db, 6.5),
      tBend: tieSmall ? 4 : 6,
      t90: tieSmall ? Math.max(6 * db, 7.5) : 12 * db,
      t135: Math.max(6 * db, 7.5),
    };
    return {
      id, no, db, small, fy, fc, g, lam, pe, sq, k,
      ldRawN: ldRaw(1), ldRawT: ldRaw(1.3),
      ldN: ld(1), ldT: ld(1.3),
      lapAN: lap(1, 1.0), lapAT: lap(1.3, 1.0),
      lapBN: lap(1, 1.3), lapBT: lap(1.3, 1.3),
      ldcA, ldcB, ldc, lscRaw, lsc,
      cover, hpe, capFc, hAltRaw, ldhAlt, psiC, psiO, hMainLo: hMain(1.0), hMainHi: hMain(1.6), hSeisRaw, ldhSeis, hMin, geo, tieOk,
    };
  }

  // 保護層（表 20.5.1.3.1，mm）；本工具只列 D10～D36
  function covers(id) {
    const big = !['D10', 'D13', 'D16'].includes(id); // D19 以上
    return [
      ['直接澆在土上、永久接觸土壤', '基礎、筏基底面、基樁帽底', 75],
      ['外露於大氣或接觸土壤', big ? '外牆、地下室外牆外側、外露梁柱（D19 以上）' : '外牆、地下室外牆外側、外露梁柱（D16 以下）', big ? 50 : 40],
      ['室內：樓板、牆、格柵小梁', '不淋雨、不接觸土壤（D36 以下）', 20],
      ['室內：梁、柱、柱墩', '量到箍筋外側；一般小梁也算梁', 40],
      ['接觸海水或腐蝕性環境', '', 100],
    ];
  }

  /* ---------- 畫面 ---------- */
  const chip = (k, v, label, on, sub = '') =>
    `<button type="button" class="rb-chip${on ? ' on' : ''}" data-k="${k}" data-v="${v}">${label}${sub ? `<small>${sub}</small>` : ''}</button>`;
  const cm = (n, db) => `<b>${n}</b><span class="rb-u">cm</span>${db ? `<em>≈ ${Math.round(n / db)} db</em>` : ''}`;

  function inputsHTML() {
    const fcOther = !FCS.includes(st.fc);
    return `
      <section class="rb-in">
        <div class="rb-row">
          <h3>鋼筋號數</h3>
          <div class="rb-chips rb-bars">${BARS.map(b => chip('bar', b[0], b[0], st.bar === b[0], b[1])).join('')}</div>
        </div>
        <div class="rb-row">
          <h3>混凝土強度 fc'<small>kgf/cm²，看結構圖一般說明</small></h3>
          <div class="rb-chips">${FCS.map(f => chip('fc', f, f, st.fc === f)).join('')}
            <label class="rb-other${fcOther ? ' on' : ''}">其他<input type="number" inputmode="numeric" min="175" max="1400" step="5" data-fc-other value="${fcOther ? st.fc : ''}" placeholder="例 315" /></label>
          </div>
        </div>
        <div class="rb-row">
          <h3>鋼筋強度 fy<small>${st.fyAuto ? 'D10 自動選 SD280，其他號數選 SD420W' : '看結構圖「鋼筋」說明'}</small></h3>
          <div class="rb-chips rb-fys">${FYS.map(f => chip('fy', f.fy, f.name, st.fy === f.fy, f.fy)).join('')}</div>
        </div>
        <details class="rb-adv"${st.tight || st.epoxy || st.light ? ' open' : ''}>
          <summary>⚙ 特殊條件（一般不用改）${st.tight || st.epoxy || st.light ? '<i>已設定</i>' : ''}</summary>
          <label class="rb-chk"><input type="checkbox" data-opt="tight" ${st.tight ? 'checked' : ''} />
            <span><b>鋼筋太密或保護層太薄</b>（長度約 ×1.5）<small>鋼筋淨間距小於 db、或保護層小於 db、或沒有箍筋且淨間距小於 2db</small></span></label>
          <label class="rb-chk"><span><b>環氧樹脂塗布鋼筋</b>（綠色、藍色塗層筋）</span>
            <select data-opt="epoxy">
              <option value="0"${!st.epoxy ? ' selected' : ''}>沒有（一般鋼筋、鍍鋅鋼筋）</option>
              <option value="1.2"${st.epoxy === 1.2 ? ' selected' : ''}>有，保護層 ≥ 3db 且淨間距 ≥ 6db（×1.2）</option>
              <option value="1.5"${st.epoxy === 1.5 ? ' selected' : ''}>有，其他情況（×1.5）</option>
            </select></label>
          <label class="rb-chk"><input type="checkbox" data-opt="light" ${st.light ? 'checked' : ''} />
            <span><b>輕質混凝土</b>（長度 ÷0.75）</span></label>
        </details>
      </section>`;
  }

  function resultHTML() {
    const r = calc(st.bar);
    const fyName = FYS.find(f => f.fy === r.fy).name;
    const cv = covers(r.id);
    const notes = [];
    if (r.fc > 700) notes.push('fc\' 超過 700 時，規範規定伸展長度以 700 計算。');
    if (r.fc < 210) notes.push('fc\' 小於 210：受壓搭接已依規範加長 1/3。結構用混凝土一般不低於 210，請再確認圖說。');
    if (r.fy >= 5600) notes.push('SD550W 鋼筋中心距小於 15 cm 時，規範要求要有足夠箍筋（Ktr ≥ 0.5db），請依圖說配置。');
    if (r.g > 1) notes.push(`高強度鋼筋 ${fyName}：搭接長度已乘上強度等級因數 ψg = ${r.g}（伸展長度不乘）。`);
    return `
      <section class="rb-res">
        <div class="rb-sum">${r.id}（${r.no}）・直徑 ${Math.round(r.db * 100) / 10} mm ・ fc' ${r.fc} ・ ${fyName}（fy ${r.fy}）</div>
        <div class="rb-cards">
          <article class="rb-card rb-c-ld">
            <h4>受拉伸展長度 ℓd<small>錨定進柱、梁、牆的長度（直線段）</small></h4>
            <div class="rb-two">
              <div><span class="rb-tag">一般</span>${cm(r.ldN, r.db)}</div>
              <div><span class="rb-tag rb-top">頂層筋</span>${cm(r.ldT, r.db)}</div>
            </div>
          </article>
          <article class="rb-card rb-c-lap">
            <h4>受拉搭接長度（乙級）<small>圖說沒特別註明時，受拉搭接都用乙級</small></h4>
            <div class="rb-two">
              <div><span class="rb-tag">一般</span>${cm(r.lapBN, r.db)}</div>
              <div><span class="rb-tag rb-top">頂層筋</span>${cm(r.lapBT, r.db)}</div>
            </div>
            <p class="rb-sub">甲級搭接：一般 ${r.lapAN} cm・頂層 ${r.lapAT} cm（需設計確認：配筋量 ≥ 需要量 2 倍，且同一處搭接 ≤ 50%）</p>
          </article>
          <article class="rb-card rb-c-col">
            <h4>受壓（柱主筋只受壓時）<small>柱筋一般仍依圖說用受拉乙級搭接</small></h4>
            <div class="rb-two">
              <div><span class="rb-tag">受壓搭接</span>${cm(r.lsc, r.db)}</div>
              <div><span class="rb-tag">受壓伸展</span>${cm(r.ldc, r.db)}</div>
            </div>
          </article>
        </div>
        <p class="rb-top-note">「頂層筋」＝鋼筋下方一次澆置的混凝土超過 30 cm 的水平筋，例如梁的上層筋、厚版（>30 cm）的上層筋，長度 ×1.3。</p>

        ${hookHTML(r)}

        <article class="rb-card rb-cover">
          <h4>保護層厚度（${r.id}）<small>量到最外側鋼筋表面；梁柱量到箍筋</small></h4>
          <table class="rb-cv">
            ${cv.map(c => `<tr><th>${c[0]}${c[1] ? `<small>${c[1]}</small>` : ''}</th><td><b>${c[2] / 10}</b> cm<small>${c[2]} mm</small></td></tr>`).join('')}
          </table>
          <p class="rb-sub">「格柵小梁」是間距很密、像肋條的小梁；一般樓層的小梁屬於梁，保護層 4 cm。墊塊高度要依此準備。</p>
        </article>
        ${notes.length ? `<ul class="rb-notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}

        <details class="rb-more">
          <summary>📋 全部號數對照表（fc' ${r.fc}・${fyName}）</summary>
          ${tableHTML()}
        </details>
        <details class="rb-more">
          <summary>🧮 計算過程與規範依據</summary>
          ${formulaHTML(r)}
        </details>
        <p class="rb-warn">⚠ 本表依規範標準情況計算，供工地快速核對。<b>結構圖或標準圖另有註明時，以圖說為準</b>；有疑問請洽設計單位。</p>
      </section>`;
  }

  function hookHTML(r) {
    const c1 = x => `${(Math.ceil(x * 10 - 1e-9) / 10).toFixed(1)} cm`; // 加工尺寸進位到 0.1 cm（與 S1-00D A1 表相同）
    const g = r.geo;
    return `
        <article class="rb-card rb-c-hook">
          <h4>彎鉤錨定長度 ℓdh<small>從柱面（臨界斷面）量到彎鉤外緣</small></h4>
          <div class="rb-two">
            <div><span class="rb-tag">一般</span>${cm(r.ldhAlt, r.db)}</div>
            <div><span class="rb-tag rb-seis">耐震接頭</span>${cm(r.ldhSeis, r.db)}</div>
          </div>
          <label class="rb-chk rb-chk-in"><input type="checkbox" data-opt="hkCover" ${r.cover ? 'checked' : ''} />
            <span><b>彎鉤在柱內，側面保護層 ≥ 6.5 cm、90° 彎鉤延伸段保護層 ≥ 5 cm</b><small>沒做到時取消勾選：一般值會 ÷0.7（約加長 43%）</small></span></label>
          <p class="rb-sub">「一般」依規範 25.4.3.5 簡便公式（結構標準圖 S1-00D 也是這樣算）。若用規範主要公式 25.4.3.1 會是 <b>${r.hMainLo}～${r.hMainHi} cm</b>（彎鉤處有／沒有足夠箍筋圍束），兩種設計者可擇一，<b>以圖說為準</b>。<br>「耐震接頭」＝耐震構架的梁柱接頭（規範 18.5.5.1），彎鉤要彎進柱子圍束核心內。</p>
          <table class="rb-hk">
            <tr><th>主筋 90° 彎鉤</th><td>直線延伸 12db ＝ <b>${c1(g.ext90)}</b><small>彎曲內徑 ${g.bend}db ＝ ${c1(g.bend * r.db)}・彎起總高 A1 ＝ ${c1(g.a1)}</small></td></tr>
            <tr><th>主筋 180° 彎鉤</th><td>直線延伸 4db 且 ≥ 6.5 cm ＝ <b>${c1(g.ext180)}</b><small>彎曲內徑 ${g.bend}db ＝ ${c1(g.bend * r.db)}</small></td></tr>
            ${r.tieOk ? `
            <tr><th>箍筋 135° 彎鉤<small>耐震彎鉤</small></th><td>直線延伸 6db 且 ≥ 7.5 cm ＝ <b>${c1(g.t135)}</b><small>彎曲內徑 ${g.tBend}db ＝ ${c1(g.tBend * r.db)}</small></td></tr>
            <tr><th>箍筋 90° 彎鉤</th><td>直線延伸 ${r.id === 'D10' || r.id === 'D13' || r.id === 'D16' ? '6db 且 ≥ 7.5 cm' : '12db'} ＝ <b>${c1(g.t90)}</b><small>耐震箍筋、繫筋一端可 90°，另一端要 135°</small></td></tr>` : `
            <tr><th>箍筋彎鉤</th><td><small>規範的箍筋標準彎鉤只適用 D25 以下</small></td></tr>`}
          </table>
        </article>`;
  }

  function tableHTML() {
    const rows = BARS.map(b => calc(b[0]));
    return `
      <div class="rb-tbl-wrap"><table class="rb-tbl">
        <thead><tr><th rowspan="2">號數</th><th colspan="2">伸展 ℓd</th><th colspan="2">搭接（乙級）</th><th colspan="2">受壓</th><th colspan="2">彎鉤 ℓdh</th></tr>
          <tr><th>一般</th><th>頂層</th><th>一般</th><th>頂層</th><th>搭接</th><th>伸展</th><th>一般</th><th>耐震</th></tr></thead>
        <tbody>${rows.map(r => `<tr${r.id === st.bar ? ' class="on"' : ''} data-bar="${r.id}">
          <th>${r.id}<small>${r.no}</small></th><td>${r.ldN}</td><td>${r.ldT}</td><td>${r.lapBN}</td><td>${r.lapBT}</td><td>${r.lsc}</td><td>${r.ldc}</td><td>${r.ldhAlt}</td><td>${r.ldhSeis}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="rb-sub">單位 cm，已無條件進位。點一列可切換號數。</p>`;
  }

  function formulaHTML(r) {
    const sq = r1(r.sq);
    const fcTxt = r.fc > 700 ? '700（上限）' : r.fc;
    const pe = r.pe !== 1 ? `×ψe ${r.pe}` : '';
    const lam = r.lam !== 1 ? `×λ ${r.lam}` : '';
    return `
      <div class="rb-f">
        <p><b>受拉伸展長度</b>（規範 25.4.2.3 簡化式${r.small ? '，D19 及較小' : '，D22 及較大'}）</p>
        <code>ℓd = fy·ψt·ψe ÷ (${r.k}·λ·√fc') × db ≥ 30 cm</code>
        <code>一般 = ${r.fy}${pe} ÷ (${r.k}${lam} × √${fcTxt}=${sq}) × ${r.db} = ${r1(r.ldRawN)} → <b>${r.ldN}</b> cm</code>
        <code>頂層（ψt 1.3） = ${r1(r.ldRawT)} → <b>${r.ldT}</b> cm</code>
        <p><b>受拉搭接長度</b>（規範表 25.5.2.1）甲級 1.0·ψg·ℓd、乙級 1.3·ψg·ℓd，≥ 30 cm；ψg = ${r.g}</p>
        <code>乙級一般 = 1.3 × ${r.g} × ${r1(r.ldRawN)} = ${r1(1.3 * r.g * r.ldRawN)} → <b>${r.lapBN}</b> cm</code>
        <p><b>受壓伸展長度</b>（規範 25.4.9）取 0.075·fy·db÷(λ·√fc') 與 0.0044·fy·db 的大值，≥ 20 cm</p>
        <code>= max(${r1(r.ldcA)}, ${r1(r.ldcB)}) → <b>${r.ldc}</b> cm</code>
        <p><b>受壓搭接長度</b>（規範 25.5.5.1）fy ≤ 4200：0.0073·fy·db；4200～5600：(0.013·fy − 24)·db；≥ 30 cm${r.fc < 210 ? '；fc\' < 210 再 ×4/3' : ''}</p>
        <code>= ${r1(r.lscRaw)} → <b>${r.lsc}</b> cm</code>
        <p><b>彎鉤錨定長度・一般</b>（規範 25.4.3.5～25.4.3.8 簡便公式）0.075·fy·ψe·db ÷ √fc'${r.cover ? ' × 0.7（保護層足夠）' : ''}${st.light ? ' × 1.3（輕質）' : ''}，≥ 8db 且 ≥ 15 cm；${r.id} 的 fc' 最多算到 ${r.capFc}</p>
        <code>= 0.075 × ${r.fy}${r.hpe !== 1 ? ' × 1.2' : ''} × ${r.db} ÷ √${Math.min(r.fc, r.capFc)}${r.cover ? ' × 0.7' : ''}${st.light ? ' × 1.3' : ''} = ${r1(r.hAltRaw)} → <b>${r.ldhAlt}</b> cm</code>
        <p><b>彎鉤錨定長度・主要公式</b>（規範 25.4.3.1，與 ACI 318-19 相同）fy·ψe·ψr·ψo·ψc ÷ (23·λ·√fc') × db<sup>1.5</sup>，≥ 8db 且 ≥ 15 cm</p>
        <code>ψc = ${Math.round(r.psiC * 1000) / 1000}、ψo = ${r.psiO}、ψr = 1.0（有箍筋圍束）～1.6 → <b>${r.hMainLo}～${r.hMainHi}</b> cm</code>
        <p><b>彎鉤錨定長度・耐震接頭</b>（規範 18.5.5.1）0.06·fy·db ÷ (λ·√fc')，≥ 8db 且 ≥ 15 cm（輕質 ≥ 10db 且 ≥ 19 cm）</p>
        <code>= ${r1(r.hSeisRaw)} → <b>${r.ldhSeis}</b> cm</code>
        <p class="rb-sub" style="margin-top:2px">S1-00D 標準圖的耐震表另外取「與一般值的較大值」，D36 高強度混凝土等少數格子會比本工具長，屬於保守做法，以圖為準。</p>
        <p><b>保護層</b>：規範表 20.5.1.3.1（場鑄、無預力混凝土）。</p>
        <h5>規範依據</h5>
        <ul>
          <li>建築物混凝土結構設計規範（內政部 112 年 8 月修正、113 年 1 月 1 日生效）第 20.5、25.4、25.5 節</li>
          <li>√fc' 最多算到 26.5（fc' 700）；ψt × ψe 最多 1.7；結果無條件進位到整數公分（與結構標準圖表格相同）</li>
        </ul>
        <h5>與國際規範（美國 ACI 318-19）對照</h5>
        <ul>
          <li>公式相同：6.6、5.3 是 ACI 的 25、20（英制 psi）換成 kgf/cm²；頂層 1.3、環氧樹脂 1.2／1.5、輕質 0.75 都一樣。</li>
          <li>不同：ACI 把高強度鋼筋放大係數 ψg 乘在伸展長度；台灣只乘在搭接長度，SD490W 另訂 1.08。</li>
          <li>彎鉤：ACI 318-19 只有「主要公式」（25.4.3.1）；台灣另保留舊版簡便公式（25.4.3.5），算出來較短，一般標準圖多採用。</li>
          <li>保護層：ACI 為 3/4"、1.5"、2"、3"（19、38、51、76 mm），台灣取整數 20、40、50、75 mm，另加海水環境 100 mm。</li>
        </ul>
      </div>`;
  }

  function draw(root) {
    root.querySelector('#rbIn').innerHTML = inputsHTML();
    root.querySelector('#rbRes').innerHTML = resultHTML();
  }
  function drawRes(root) {
    const open = [...root.querySelectorAll('#rbRes details')].map(d => d.open);
    root.querySelector('#rbRes').innerHTML = resultHTML();
    root.querySelectorAll('#rbRes details').forEach((d, i) => { d.open = !!open[i]; });
  }

  registerPage('rebar', {
    render: () => `
      <div class="rb">
        <div class="rb-head">
          <h2>📏 鋼筋快查</h2>
          <p>選號數和混凝土強度，馬上看到伸展長度、搭接長度、彎鉤和保護層</p>
        </div>
        <div class="rb-grid">
          <div id="rbIn"></div>
          <div id="rbRes"></div>
        </div>
      </div>`,
    mount(root) {
      draw(root);
      root.addEventListener('click', e => {
        const c = e.target.closest('.rb-chip');
        const tr = e.target.closest('tr[data-bar]');
        if (c) {
          const k = c.dataset.k, v = c.dataset.v;
          if (k === 'bar') {
            st.bar = v;
            if (st.fyAuto) st.fy = v === 'D10' ? 2800 : 4200;
          } else if (k === 'fc') st.fc = +v;
          else if (k === 'fy') { st.fy = +v; st.fyAuto = false; }
          save();
          const y = window.scrollY;
          draw(root);
          window.scrollTo(0, y);
        } else if (tr) {
          st.bar = tr.dataset.bar;
          if (st.fyAuto) st.fy = st.bar === 'D10' ? 2800 : 4200;
          save();
          const y = window.scrollY;
          root.querySelector('#rbIn').innerHTML = inputsHTML();
          drawRes(root);
          window.scrollTo(0, y);
        }
      });
      root.addEventListener('input', e => {
        if (e.target.matches('[data-fc-other]')) {
          const v = +e.target.value;
          if (v >= 175 && v <= 1400) {
            st.fc = v; save();
            root.querySelectorAll('.rb-chip[data-k="fc"]').forEach(b => b.classList.toggle('on', +b.dataset.v === v));
            e.target.closest('.rb-other').classList.toggle('on', !FCS.includes(v));
            drawRes(root);
          }
        }
      });
      root.addEventListener('change', e => {
        const o = e.target.dataset.opt;
        if (!o) return;
        if (o === 'epoxy') st.epoxy = +e.target.value || 0;
        else st[o] = e.target.checked;
        save();
        drawRes(root);
        const sum = root.querySelector('.rb-adv summary');
        if (sum) sum.innerHTML = `⚙ 特殊條件（一般不用改）${st.tight || st.epoxy || st.light ? '<i>已設定</i>' : ''}`;
      });
    },
  });

  // 給測試用：window.REBAR_CALC('D19', {fc:280, fy:4200})
  window.REBAR_CALC = (bar, s) => calc(bar, Object.assign({ tight: false, epoxy: 0, light: false, hkCover: true }, s));
})();
