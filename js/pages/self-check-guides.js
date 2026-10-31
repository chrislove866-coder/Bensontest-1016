/**
 * 自主檢查表「🖼 看圖說」：檢查項目的示意圖與說明（填表時參考用，列印／PDF 不會印出）
 *   window.SK_GUIDES[範本編號][項目序號] = { svg, zh: [說明…], vi: [giải thích…] }
 * 示意圖用簡單線條畫（檔案小、手機看得清楚）；數值以表格上的「規定標準」為準（工地可修改），
 * 圖上只標名稱與符號。越南文為 AI 翻譯，待人工核對。
 * 目前有：01 放樣、10 板鋼筋
 */
(function () {
  /* ---------- 畫圖小工具（座標以 400 × H 為準） ---------- */
  const svg = (body, h = 240) =>
    `<svg class="gd-svg" viewBox="0 0 400 ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  const t = (x, y, s, cls = '', anchor = 'middle') =>
    `<text x="${x}" y="${y}" class="gd-t ${cls}" text-anchor="${anchor}">${s}</text>`;
  const line = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  const rect = (x, y, w, h, cls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>`;
  const dot = (x, y, r = 4, cls = 'gd-bar-dot') => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
  // 尺寸線：兩端斜短線（工程圖常用的標註方式）
  const tick = (x, y) => line(x - 4, y + 4, x + 4, y - 4, 'gd-dim');
  const dimH = (x1, x2, y, label, dy = -6) =>
    line(x1, y, x2, y, 'gd-dim') + tick(x1, y) + tick(x2, y) + t((x1 + x2) / 2, y + dy, label, 'gd-dimt');
  const dimV = (x, y1, y2, label, side = 'right') =>
    line(x, y1, x, y2, 'gd-dim') + tick(x, y1) + tick(x, y2) +
    t(side === 'right' ? x + 6 : x - 6, (y1 + y2) / 2 + 4, label, 'gd-dimt', side === 'right' ? 'start' : 'end');
  // 軸線（灰色長短虛線）＋軸號圓圈
  const axisV = (x, y1, y2, no) => line(x, y1, x, y2, 'gd-axis') + `<circle cx="${x}" cy="${y1 - 11}" r="10" class="gd-bubble"/>` + t(x, y1 - 7, no, 'gd-bt');
  const axisH = (y, x1, x2, no) => line(x1, y, x2, y, 'gd-axis') + `<circle cx="${x1 - 11}" cy="${y}" r="10" class="gd-bubble"/>` + t(x1 - 11, y + 4, no, 'gd-bt');
  const ok = (x, y, s) => t(x, y, '✔ ' + s, 'gd-ok', 'start');

  /* ---------- 01 放樣 ---------- */
  const sheet = (x, title) =>
    rect(x, 30, 160, 130, 'gd-paper') + t(x + 80, 22, title, 'gd-b') +
    line(x + 45, 40, x + 45, 150, 'gd-axis') + line(x + 120, 40, x + 120, 150, 'gd-axis') +
    line(x + 10, 70, x + 150, 70, 'gd-axis') + line(x + 10, 130, x + 150, 130, 'gd-axis') +
    [[45, 70], [120, 70], [45, 130], [120, 130]].map(([a, b]) => rect(x + a - 7, b - 7, 14, 14, 'gd-col')).join('') +
    t(x + 45, 50, '①', 'gd-s') + t(x + 120, 50, '②', 'gd-s') + t(x + 22, 66, 'Ⓐ', 'gd-s') + t(x + 22, 126, 'Ⓑ', 'gd-s');

  const G01 = {
    0: {
      svg: svg(sheet(20, '結構圖／建築圖') + sheet(220, '放樣圖') +
        t(200, 100, '⇄', 'gd-big') + t(200, 120, '核對', 'gd-s') +
        ok(30, 190, '軸線編號、軸線間距') + ok(220, 190, '柱、梁、牆的尺寸') +
        ok(30, 215, '開口、降板位置') + ok(220, 215, '有出入先問清楚再放樣')),
      zh: ['放樣圖要和結構圖、建築圖逐項對過：軸線編號、間距、柱梁牆尺寸、開口與降板位置。',
        '圖面互相不一致時，先請設計單位確認，不要在現場自己決定。'],
      vi: ['Đối chiếu bản vẽ định vị với bản vẽ kết cấu, kiến trúc: số trục, khoảng cách trục, kích thước cột, dầm, vách, vị trí lỗ mở và sàn hạ cốt.',
        'Nếu các bản vẽ không khớp, hỏi đơn vị thiết kế trước, không tự quyết định tại hiện trường.'],
    },
    1: {
      svg: svg(axisV(100, 40, 200, '①') + axisV(300, 40, 200, '②') + axisH(140, 40, 370, 'Ⓐ') +
        line(130, 40, 130, 200, 'gd-ctrl') + line(330, 40, 330, 200, 'gd-ctrl') + line(40, 170, 370, 170, 'gd-ctrl') +
        t(134, 56, '控制線（逃線）', 'gd-g', 'start') +
        line(100, 140, 300, 170, 'gd-diag') + line(300, 140, 100, 170, 'gd-diag') +
        dimH(100, 300, 100, '軸線間距：實測 − 設計 ≦ 誤差') +
        t(200, 226, '交叉點對角線等長 → 角度是直角', 'gd-s')),
      zh: ['每條基準軸線另外彈一條平行的控制線（逃線），柱牆模板蓋住軸線後還能量測。',
        '用鋼捲尺拉直量兩條基準線的距離，和圖面相差不超過規定標準。',
        '量兩條對角線是否等長，確認十字線互相垂直。'],
      vi: ['Mỗi trục chuẩn bật thêm một đường kiểm tra song song (đường lui), để khi ván khuôn che trục vẫn đo được.',
        'Kéo thẳng thước thép đo khoảng cách giữa hai đường chuẩn, chênh lệch so với bản vẽ không vượt tiêu chuẩn.',
        'Đo hai đường chéo có bằng nhau không để xác nhận các đường chữ thập vuông góc.'],
    },
    2: {
      svg: svg(rect(30, 205, 340, 14, 'gd-con') + rect(30, 120, 340, 12, 'gd-con') + rect(30, 40, 340, 12, 'gd-con') +
        rect(250, 120, 30, 12, 'gd-hole') + rect(250, 40, 30, 12, 'gd-hole') +
        line(265, 205, 265, 30, 'gd-laser') + `<path d="M255 219 L265 205 L275 219 Z" class="gd-tri"/>` +
        t(290, 232, 'BM 高程基準點', 'gd-s', 'start') + t(290, 148, '← 樓板預留引點孔', 'gd-s', 'start') +
        rect(70, 132, 22, 73, 'gd-col') + rect(70, 52, 22, 68, 'gd-col') +
        line(60, 172, 130, 172, 'gd-mark') + line(60, 92, 130, 92, 'gd-mark') +
        t(136, 176, '1FL+100cm 水平線', 'gd-r', 'start') + t(136, 96, '2FL+100cm 水平線', 'gd-r', 'start') +
        t(200, 20, '每層從同一基準點引上來，不要一層一層往上累加', 'gd-s')),
      zh: ['高程從固定的 BM 基準點，經樓板預留的引點孔用雷射或水準儀垂直引上。',
        '每層引上來後在柱、牆彈「樓板面＋100cm」水平線，和設計高程相差不超過規定標準。',
        '每層都從同一個基準引，不要從下一層再往上量，誤差才不會累積。'],
      vi: ['Cao độ dẫn từ điểm chuẩn BM cố định, qua lỗ chờ trên sàn bằng máy laser hoặc máy thủy bình theo phương đứng.',
        'Mỗi tầng bật đường ngang "mặt sàn +100cm" trên cột, vách; chênh lệch với cao độ thiết kế không vượt tiêu chuẩn.',
        'Tầng nào cũng dẫn từ cùng một điểm chuẩn, không đo tiếp từ tầng dưới để sai số không cộng dồn.'],
    },
    3: {
      svg: svg(axisV(200, 40, 210, '①') + axisH(125, 60, 350, 'Ⓐ') +
        rect(165, 95, 70, 60, 'gd-col') + rect(130, 60, 140, 130, 'gd-check') +
        dimH(165, 235, 86, 'b') + dimV(246, 95, 155, 'h') +
        dimH(165, 200, 172, 'a', 14) +
        t(200, 210, '檢查線：柱邊外 30cm（模板封住後仍可量）', 'gd-g') +
        t(200, 232, 'a：柱邊到軸線　b × h：柱斷面', 'gd-s')),
      zh: ['柱子以軸線定位：量柱邊到軸線的距離（圖上 a），以及斷面尺寸 b × h。',
        '柱邊外另彈檢查線（例如 30cm），模板組立後量檢查線到模板的距離。',
        '位置與尺寸誤差都不超過規定標準。'],
      vi: ['Cột định vị theo trục: đo khoảng cách từ mép cột đến trục (a trên hình) và kích thước tiết diện b × h.',
        'Bật thêm đường kiểm tra ngoài mép cột (ví dụ 30cm), sau khi lắp ván khuôn thì đo từ đường kiểm tra đến ván khuôn.',
        'Sai số vị trí và kích thước đều không vượt tiêu chuẩn.'],
    },
    4: {
      svg: svg(axisH(110, 50, 370, 'Ⓐ') + axisV(80, 40, 210, '①') +
        rect(50, 98, 280, 26, 'gd-col') + line(50, 160, 330, 160, 'gd-ctrl') +
        dimV(340, 98, 124, '牆厚 t') + dimV(300, 124, 160, '30cm', 'left') +
        t(210, 180, '檢查線（牆邊外 30cm）', 'gd-g') +
        t(210, 80, '牆中心線或牆邊對軸線，依放樣圖', 'gd-s')),
      zh: ['依放樣圖確認牆是「中心對軸線」或「牆邊對軸線」，量牆邊到軸線的距離和牆厚。',
        '牆邊外彈檢查線，模板組立後用來確認位置。'],
      vi: ['Theo bản vẽ định vị xác nhận vách "tim trùng trục" hay "mép trùng trục", đo khoảng cách từ mép vách đến trục và chiều dày vách.',
        'Bật đường kiểm tra ngoài mép vách để kiểm tra vị trí sau khi lắp ván khuôn.'],
    },
    5: {
      svg: svg(axisH(125, 40, 370, 'Ⓐ') + axisV(80, 40, 210, '①') + axisV(320, 40, 210, '②') +
        rect(60, 100, 40, 50, 'gd-col') + rect(300, 100, 40, 50, 'gd-col') +
        line(100, 110, 300, 110, 'gd-beam') + line(100, 140, 300, 140, 'gd-beam') +
        dimV(200, 110, 140, '梁寬 b') + t(200, 175, '梁邊線畫在柱筋或底模上', 'gd-s') +
        t(200, 200, '梁深 d 以底模高程確認（樓板面往下量）', 'gd-s')),
      zh: ['梁的位置依軸線放出梁邊線，量梁寬 b、梁邊到軸線的距離。',
        '梁深在底模組立後，從樓板面高程往下量到底模確認。'],
      vi: ['Vị trí dầm bật đường mép dầm theo trục, đo bề rộng dầm b và khoảng cách từ mép dầm đến trục.',
        'Chiều cao dầm: sau khi lắp ván đáy, đo từ cao độ mặt sàn xuống đến ván đáy.'],
    },
    6: {
      svg: svg(rect(40, 90, 50, 110, 'gd-con') + rect(310, 90, 50, 110, 'gd-con') + rect(40, 90, 320, 30, 'gd-con') +
        line(30, 90, 370, 90, 'gd-mark') + t(200, 80, '板面高程線（彈在柱筋或模板上）', 'gd-r') +
        dimV(200, 90, 120, '板厚 t') + t(65, 165, '梁', 'gd-s') + t(335, 165, '梁', 'gd-s') +
        t(200, 225, '澆置時用標尺、插竿檢查厚度', 'gd-s')),
      zh: ['依圖確認板厚 t（填在表上），並在柱筋或模板上標出板面高程。',
        '澆置混凝土時用標尺或插竿抽查厚度，誤差不超過規定標準。'],
      vi: ['Xác nhận chiều dày sàn t theo bản vẽ (ghi vào phiếu), đánh dấu cao độ mặt sàn trên thép cột hoặc ván khuôn.',
        'Khi đổ bê tông dùng thước hoặc que cắm kiểm tra chiều dày, sai số không vượt tiêu chuẩn.'],
    },
    7: {
      svg: svg(rect(40, 30, 320, 170, 'gd-wall') + rect(150, 70, 120, 75, 'gd-hole') + line(30, 200, 370, 200, 'gd-floor') +
        dimH(150, 270, 60, '開口寬 W') + dimV(280, 70, 145, '開口高 H') + dimV(140, 145, 200, '台度', 'left') +
        t(380, 214, 'FL 樓板面', 'gd-s', 'end') +
        t(200, 230, '開口位置與台度用墨線畫在樓板上', 'gd-r')),
      zh: ['門窗開口的寬 W、高 H，以及台度（樓板面到窗台的高度）都要依圖標示在樓板上。',
        '組模前用來確認開口位置，誤差不超過規定標準。'],
      vi: ['Bề rộng W, chiều cao H của lỗ cửa và độ cao bệ cửa sổ (từ mặt sàn đến bệ) phải đánh dấu trên sàn theo bản vẽ.',
        'Dùng để xác nhận vị trí lỗ mở trước khi lắp ván khuôn, sai số không vượt tiêu chuẩn.'],
    },
    8: {
      svg: svg(`<path d="M50 200 L50 175 L95 175 L95 150 L140 150 L140 125 L185 125 L185 100 L230 100 L230 75 L340 75 L340 200 Z" class="gd-con"/>` +
        dimV(130, 150, 125, '級高 R', 'left') + dimH(140, 185, 115, '級深 T') +
        line(50, 200, 230, 75, 'gd-diag') + t(260, 150, '每一階 R、T 要一樣', 'gd-s', 'start') +
        t(260, 172, '梯寬 W 在平面上量', 'gd-s', 'start') + t(200, 226, '第一階與最後一階最容易做錯，要特別量', 'gd-r')),
      zh: ['依圖確認級高 R、級深 T、梯寬 W（填在表上），每一階都要一樣。',
        '第一階和最後一階要扣掉地坪、面材的厚度，最容易出錯，要特別量。'],
      vi: ['Xác nhận chiều cao bậc R, chiều sâu bậc T, chiều rộng thang W theo bản vẽ (ghi vào phiếu); các bậc phải đều nhau.',
        'Bậc đầu và bậc cuối phải trừ chiều dày lớp hoàn thiện, dễ sai nhất, cần đo kỹ.'],
    },
  };

  /* ---------- 10 板鋼筋 ---------- */
  const ribs = (x1, x2, y) => {
    let s = line(x1, y, x2, y, 'gd-bar');
    for (let x = x1 + 8; x < x2; x += 12) s += line(x, y - 5, x + 4, y + 5, 'gd-rib');
    return s;
  };
  const G10 = {
    0: {
      svg: svg(dot(80, 70, 13, 'gd-bar-cut') + dot(200, 70, 16, 'gd-bar-cut') + dot(320, 70, 19, 'gd-bar-cut') +
        t(80, 115, '#4（D13）', 'gd-b') + t(200, 115, '#5（D16）', 'gd-b') + t(320, 115, '#6（D19）', 'gd-b') +
        ribs(40, 360, 165) + t(200, 150, 'SD420  #5  廠牌記號', 'gd-r') +
        t(200, 195, '鋼筋上的軋印：強度、號數、廠牌', 'gd-s') + t(200, 220, '與進料單、試驗報告核對', 'gd-s')),
      zh: ['依圖確認板筋號數，現場看鋼筋上的軋印（強度、號數、廠牌）。',
        '軋印要和進料單、材料試驗報告一致；號數不同的鋼筋分開堆放，避免拿錯。'],
      vi: ['Xác nhận số hiệu thép sàn theo bản vẽ, kiểm tra ký hiệu cán trên thanh thép (cường độ, số hiệu, nhà sản xuất).',
        'Ký hiệu phải khớp với phiếu nhập hàng và báo cáo thí nghiệm; thép khác số hiệu để riêng tránh lấy nhầm.'],
    },
    1: {
      svg: svg(rect(250, 50, 90, 160, 'gd-con') + rect(20, 50, 230, 45, 'gd-con') +
        t(295, 190, '梁', 'gd-s') + t(120, 115, '板', 'gd-s') +
        line(20, 62, 325, 62, 'gd-bar') + line(325, 62, 325, 100, 'gd-bar') +
        line(20, 84, 310, 84, 'gd-bar') +
        dimH(250, 310, 135, '錨定長度', 14) + line(250, 95, 250, 140, 'gd-dimx') + line(310, 84, 310, 140, 'gd-dimx') +
        t(200, 30, '板筋伸入梁內，從梁邊起算', 'gd-r')),
      zh: ['板筋伸進支承的梁（或牆）裡，從梁邊量起的長度不少於規定的錨定長度。',
        '長度依號數不同（見規定標準），上層筋端部依圖彎鉤。'],
      vi: ['Thép sàn neo vào dầm (hoặc vách) đỡ, chiều dài tính từ mép dầm không nhỏ hơn chiều dài neo quy định.',
        'Chiều dài khác nhau theo số hiệu (xem tiêu chuẩn); đầu thép lớp trên bẻ móc theo bản vẽ.'],
    },
    2: {
      svg: svg(line(30, 70, 250, 70, 'gd-bar') + line(150, 80, 370, 80, 'gd-bar2') +
        dimH(150, 250, 52, '搭接長度') + line(150, 58, 150, 80, 'gd-dimx') + line(250, 58, 250, 70, 'gd-dimx') +
        line(30, 145, 170, 145, 'gd-bar') + line(120, 152, 370, 152, 'gd-bar2') +
        line(30, 175, 280, 175, 'gd-bar') + line(230, 182, 370, 182, 'gd-bar2') +
        line(30, 205, 170, 205, 'gd-bar') + line(120, 212, 370, 212, 'gd-bar2') +
        t(200, 130, '相鄰鋼筋的搭接位置要錯開', 'gd-r') + t(200, 235, '一般：上層筋在跨中搭接、下層筋在支承附近搭接（依圖）', 'gd-s')),
      zh: ['兩支鋼筋重疊的長度不少於規定的搭接長度（依號數）。',
        '相鄰鋼筋的搭接位置要錯開，不要全部集中在同一斷面；搭接位置依設計圖說。'],
      vi: ['Đoạn chồng lên nhau của hai thanh thép không nhỏ hơn chiều dài nối chồng quy định (theo số hiệu).',
        'Vị trí nối của các thanh liền kề phải so le, không dồn vào cùng một mặt cắt; vị trí nối theo bản vẽ thiết kế.'],
    },
    3: {
      svg: svg(rect(20, 30, 170, 170, 'gd-paper') +
        [50, 80, 110, 140, 170].map(x => line(x, 35, x, 195, 'gd-bar')).join('') +
        [55, 85, 115, 145, 175].map(y => line(25, y, 185, y, 'gd-bar2')).join('') +
        dimH(50, 80, 22, '間距 @') + t(105, 222, '平面：雙向排列', 'gd-s') +
        rect(220, 70, 160, 80, 'gd-con') +
        line(225, 88, 375, 88, 'gd-bar') + [245, 275, 305, 335, 365].map(x => dot(x, 95)).join('') +
        line(225, 132, 375, 132, 'gd-bar') + [245, 275, 305, 335, 365].map(x => dot(x, 125)).join('') +
        t(300, 62, '上層筋', 'gd-r') + t(300, 170, '下層筋', 'gd-r') + t(300, 222, '斷面：雙層雙向', 'gd-s')),
      zh: ['依圖確認「雙層雙向」：上層、下層各有兩個方向的鋼筋。',
        '用捲尺量間距（例如 @10、@20cm），連續量幾格取平均，不要只量一格。',
        '短向筋、長向筋誰在外側依設計圖說。'],
      vi: ['Xác nhận "2 lớp 2 phương" theo bản vẽ: lớp trên và lớp dưới đều có thép theo hai phương.',
        'Dùng thước đo khoảng cách (ví dụ @10, @20cm), đo liên tiếp vài ô lấy trung bình, không chỉ đo một ô.',
        'Thép phương ngắn hay phương dài nằm ngoài theo bản vẽ thiết kế.'],
    },
    4: {
      svg: svg(`<path d="M20 70 L200 70 L200 100 L380 100 L380 150 L230 150 L230 120 L20 120 Z" class="gd-con"/>` +
        line(25, 80, 185, 80, 'gd-bar') + line(185, 80, 215, 110, 'gd-bar') + line(215, 110, 375, 110, 'gd-bar') +
        line(25, 110, 245, 110, 'gd-bar2') + line(215, 140, 375, 140, 'gd-bar2') +
        dimV(390, 70, 100, '板差', 'left') +
        t(110, 50, '一般樓板', 'gd-s') + t(300, 85, '降板（浴廁、陽台）', 'gd-s') +
        t(200, 190, '鋼筋依設計圖彎折或分開錨定', 'gd-r') + t(200, 215, '降板位置與高差依圖確認', 'gd-s')),
      zh: ['浴廁、陽台等降板處，依設計圖確認位置與高差。',
        '高低板交接處的鋼筋依圖彎折或分開錨定，不可直接切斷。'],
      vi: ['Tại chỗ sàn hạ cốt (nhà vệ sinh, ban công), xác nhận vị trí và độ chênh cao theo bản vẽ.',
        'Thép tại chỗ giao sàn cao thấp phải bẻ hoặc neo riêng theo bản vẽ, không được cắt đứt.'],
    },
    5: {
      svg: svg(rect(20, 30, 170, 150, 'gd-paper') +
        [50, 105, 160].map(x => [60, 115, 170].map(y => rect(x - 6, y - 6, 12, 12, 'gd-spacer')).join('')).join('') +
        dimH(50, 105, 45, '@60cm') + t(105, 205, '平面：墊塊排列', 'gd-s') +
        line(215, 150, 385, 150, 'gd-floor') +
        rect(240, 136, 12, 14, 'gd-spacer') + rect(340, 136, 12, 14, 'gd-spacer') + line(220, 132, 380, 132, 'gd-bar') +
        `<path d="M270 132 L280 80 L330 80 L340 132" class="gd-chair"/>` + line(220, 76, 380, 76, 'gd-bar') +
        t(300, 60, '上層筋：鐵馬（馬椅）', 'gd-r') + t(300, 175, '下層筋：墊塊', 'gd-r') + t(300, 205, '斷面', 'gd-s')),
      zh: ['下層筋用墊塊墊高，上層筋用鐵馬（馬椅）撐住，上、下層間距都不超過規定（例如 @60cm）。',
        '人踩過後墊塊容易移位或壓壞，澆置前要再巡一次。'],
      vi: ['Thép lớp dưới kê bằng con kê, thép lớp trên đỡ bằng chân ngựa; khoảng cách lớp trên, lớp dưới đều không vượt quy định (ví dụ @60cm).',
        'Sau khi người đi lại con kê dễ xê dịch hoặc vỡ, trước khi đổ bê tông phải kiểm tra lại.'],
    },
    6: {
      svg: svg(rect(75, 50, 110, 100, 'gd-con') + line(80, 70, 180, 70, 'gd-bar') + line(80, 130, 180, 130, 'gd-bar') +
        dimV(65, 50, 70, '保護層', 'left') + dimV(65, 130, 150, '保護層', 'left') +
        t(130, 40, '一般樓板', 'gd-b') + t(130, 172, '上、下都要量', 'gd-s') +
        rect(270, 50, 115, 100, 'gd-con') + `<rect x="265" y="150" width="125" height="30" class="gd-soil"/>` +
        line(275, 70, 380, 70, 'gd-bar') + line(275, 110, 380, 110, 'gd-bar') + dimV(260, 110, 150, '7.5cm', 'left') +
        t(327, 40, '與土壤、水接觸', 'gd-b') + t(327, 170, '土壤', 'gd-s') +
        t(200, 220, '保護層＝鋼筋外緣到混凝土表面的距離', 'gd-r')),
      zh: ['保護層是鋼筋「外緣」到混凝土表面的距離，不是到鋼筋中心。',
        '一般樓板依規定（例如 2cm）；直接和土壤、水接觸的部位要加厚（例如 7.5cm）。'],
      vi: ['Lớp bảo vệ là khoảng cách từ "mép ngoài" thanh thép đến mặt bê tông, không phải đến tâm thanh thép.',
        'Sàn thông thường theo quy định (ví dụ 2cm); bộ phận tiếp xúc trực tiếp với đất, nước phải dày hơn (ví dụ 7,5cm).'],
    },
    7: {
      svg: svg(rect(20, 20, 360, 200, 'gd-paper') +
        [70, 110, 290, 330].map(x => line(x, 25, x, 215, 'gd-bar-thin')).join('') +
        [160, 200, 240].map(x => line(x, 25, x, 80, 'gd-bar-thin') + line(x, 160, x, 215, 'gd-bar-thin')).join('') +
        rect(150, 80, 100, 80, 'gd-hole') + t(200, 125, '開口', 'gd-s') +
        line(130, 30, 130, 210, 'gd-bar') + line(270, 30, 270, 210, 'gd-bar') +
        line(60, 65, 340, 65, 'gd-bar') + line(60, 175, 340, 175, 'gd-bar') +
        // 45° 斜筋：橫跨開口四個角（和角的分角線垂直）
        line(120, 98, 168, 50, 'gd-bar') + line(232, 50, 280, 98, 'gd-bar') + line(120, 142, 168, 190, 'gd-bar') + line(232, 190, 280, 142, 'gd-bar') +
        line(250, 160, 250, 240, 'gd-dimx') + line(340, 175, 340, 240, 'gd-dimx') + dimH(250, 340, 240, '伸出開口邊'), 260),
      zh: ['開口切斷了幾支鋼筋，就在開口兩側補幾支同號數的補強筋（圖中紅色粗線），伸出開口邊的長度依規定。',
        '開口較大（例如 30～80cm）時，四個角再加 45° 斜向補強筋。',
        '更大的開口依結構圖另行設計。'],
      vi: ['Lỗ mở cắt mất bao nhiêu thanh thì bổ sung bấy nhiêu thanh cùng số hiệu ở hai bên lỗ mở (đường đỏ đậm trên hình), chiều dài nhô ra khỏi mép lỗ theo quy định.',
        'Lỗ mở lớn hơn (ví dụ 30–80cm) thì thêm thép gia cường chéo 45° ở bốn góc.',
        'Lỗ mở lớn hơn nữa thì theo thiết kế riêng trên bản vẽ kết cấu.'],
    },
    8: {
      svg: svg(rect(30, 30, 340, 190, 'gd-paper') + line(30, 30, 370, 30, 'gd-floor') + line(30, 30, 30, 220, 'gd-floor') +
        t(200, 22, '外側梁', 'gd-s') +
        [60, 120, 180, 240, 300, 360].map(x => line(x, 35, x, 215, 'gd-bar-thin')).join('') +
        [90, 105].map(x => line(x, 35, x, 98, 'gd-bar')).join('') + [45, 75].map(x => line(x, 35, x, 98, 'gd-bar')).join('') +
        [45, 60, 75, 90].map(y => line(35, y, 110, y, 'gd-bar')).join('') +
        rect(32, 32, 80, 68, 'gd-zone') +
        dimH(30, 112, 118, 'L/5', 14) + dimV(125, 30, 100, 'L/5') +
        t(240, 140, 'L＝板短向跨度', 'gd-s') + t(240, 165, '角隅範圍內加筋，', 'gd-r') + t(240, 188, '間距為原本的一半', 'gd-r')),
      zh: ['樓板外角（兩邊都沒有連續樓板的角落）容易產生斜向裂縫，要加角隅補強筋。',
        '補強範圍與長度約為跨度的 1/5（L/5），間距為原本的一半；上層、下層依設計圖說。'],
      vi: ['Góc ngoài của sàn (góc mà hai cạnh không có sàn liên tục) dễ nứt chéo, phải thêm thép gia cường góc.',
        'Phạm vi và chiều dài gia cường khoảng 1/5 nhịp (L/5), khoảng cách bằng một nửa ban đầu; lớp trên, lớp dưới theo bản vẽ thiết kế.'],
    },
  };

  window.SK_GUIDES = { '01': G01, '10': G10 };
})();
