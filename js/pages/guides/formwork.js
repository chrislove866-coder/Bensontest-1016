/**
 * 看圖說：模板類（02 柱模、03 牆模、04 梁模、05 樓板模、06 拆模、41 樓梯模）
 * 畫圖工具來自 self-check-guides.js 的 window.SK_GD；法規依「營造安全衛生設施標準」（115-06-30 修正）
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok, ng } = window.SK_GD;

  /* ---------- 共用小圖 ---------- */
  // 清潔前後對照
  const cleanPic = (what = '模板面') => svg(
    rect(30, 50, 150, 130, 'gd-plank') + rect(220, 50, 150, 130, 'gd-plank') +
    [[60, 80], [90, 130], [140, 100], [70, 160], [150, 150], [120, 70]].map(([x, y]) => dot(x, y, 5, 'gd-rust')).join('') +
    line(50, 120, 100, 110, 'gd-pipe') + t(105, 40, '✘ 木屑、鐵絲、垃圾', 'gd-ngt') + t(295, 40, '✔ 清潔無雜物', 'gd-ok') +
    t(200, 210, `${what}封模、澆置前要再清一次`, 'gd-s'));
  // 依圖核對（文件 ⇄ 現場）
  const docPic = (a, b, checks) => svg(
    rect(30, 30, 120, 150, 'gd-paper') + t(90, 22, a, 'gd-b') + [60, 85, 110, 135, 160].map(y => line(45, y, 135, y, 'gd-axis')).join('') +
    t(200, 110, '⇄', 'gd-big') + t(200, 130, '核對', 'gd-s') +
    rect(250, 30, 120, 150, 'gd-paper') + t(310, 22, b, 'gd-b') + rect(275, 60, 70, 90, 'gd-col') +
    checks.map((c, i) => ok(30 + (i % 2) * 190, 205 + Math.floor(i / 2) * 22, c)).join(''));
  // 模板立面＋繫結螺桿（第一支離地 30cm，其餘 @50cm）
  const tiePic = (label) => svg(
    rect(120, 20, 160, 200, 'gd-plank') + line(100, 220, 300, 220, 'gd-floor') +
    [190, 140, 90, 40].map(y => line(110, y, 290, y, 'gd-tie-rod') + dot(150, y, 5, 'gd-bolt') + dot(250, y, 5, 'gd-bolt')).join('') +
    dimV(310, 190, 220, '30cm') + dimV(310, 140, 190, '@50cm') + dimV(310, 90, 140, '@50cm') +
    t(60, 120, label, 'gd-s') + t(200, 236, '每面兩路、螺帽鎖緊', 'gd-r'));
  // 斷面：夾板＋角材＋背撐（3 層模）
  const layers = (title) => svg(
    rect(150, 60, 100, 120, 'gd-con') + t(200, 125, title, 'gd-s') +
    rect(138, 50, 12, 140, 'gd-plank2') + rect(250, 50, 12, 140, 'gd-plank2') +
    [70, 110, 150].map(y => rect(122, y, 16, 16, 'gd-plank') + rect(262, y, 16, 16, 'gd-plank')).join('') +
    rect(106, 40, 16, 160, 'gd-steel') + rect(278, 40, 16, 160, 'gd-steel') +
    t(70, 60, '① 夾板', 'gd-r', 'end') + line(72, 56, 138, 56, 'gd-dimx') +
    t(70, 120, '② 角材', 'gd-r', 'end') + line(72, 116, 122, 116, 'gd-dimx') +
    t(70, 180, '③ 背撐', 'gd-r', 'end') + line(72, 176, 106, 176, 'gd-dimx') + t(200, 225, '3 層以上（含背撐角材）', 'gd-b'));
  // 支撐地面
  const basePic = () => svg(
    `<rect x="20" y="190" width="170" height="40" class="gd-soil"/>` + rect(60, 178, 90, 12, 'gd-plank') + line(105, 178, 105, 60, 'gd-pipe-b') +
    t(105, 40, '✔ 夯實＋墊板', 'gd-ok') +
    `<path d="M210 190 Q300 215 390 190 L390 230 L210 230 Z" class="gd-soil"/>` + line(300, 200, 300, 60, 'gd-pipe-b') + `<path d="M285 200 L315 200" class="gd-red"/>` +
    t(300, 40, '✘ 軟土、積水會下陷', 'gd-ngt'));
  // 平直 vs 彎曲
  const straightPic = (what) => svg(
    line(40, 70, 360, 70, 'gd-floor') + rect(40, 58, 320, 24, 'gd-plank') + ok(40, 45, `${what}平直`) +
    `<path d="M40 165 Q120 145 200 165 T360 160" class="gd-strut-bad"/>` + ng(40, 135, '彎曲、凹凸') +
    t(200, 215, '拉線檢查，整條拉直量偏差', 'gd-s'));
  // 鋼管支撐插銷
  const pinPic = () => svg(
    line(110, 30, 110, 120, 'gd-pipe-b') + line(110, 120, 110, 220, 'gd-pipe-b') + rect(100, 105, 20, 30, 'gd-steel') +
    line(88, 118, 132, 118, 'gd-pin') + t(110, 236, '✔ 制式插銷', 'gd-ok') +
    line(290, 30, 290, 120, 'gd-pipe-b') + line(290, 120, 290, 220, 'gd-pipe-b') + rect(280, 105, 20, 30, 'gd-steel') +
    `<path d="M268 118 L312 118 L312 128" class="gd-hook"/>` + t(290, 236, '✘ 用鋼筋代替', 'gd-ngt') +
    t(200, 20, '可調鋼管支柱：插銷要用制式配件', 'gd-b'));
  // 水平繫條
  const bracePic = () => svg(
    line(20, 30, 380, 30, 'gd-floor') + line(20, 225, 380, 225, 'gd-floor') +
    [70, 160, 250, 340].map(x => line(x, 32, x, 223, 'gd-pipe-b')).join('') +
    line(60, 95, 350, 95, 'gd-red') + line(60, 160, 350, 160, 'gd-red') +
    dimV(375, 160, 225, '≦2m', 'left') + dimV(375, 95, 160, '≦2m', 'left') +
    t(200, 88, '縱、橫兩向水平繫條', 'gd-r') + t(200, 20, '樓高超過 3.5m', 'gd-b'));

  const notesBrace = {
    zh: ['可調鋼管支柱高度超過 3.5m 時，每 2m 內要設縱、橫兩向的水平繫條，並和構造物連結（營造安全衛生設施標準第 135 條）。',
      '表上寫「樓高超過 3.6m」，法規門檻是 3.5m，以較嚴的 3.5m 為準。可調鋼管支柱不可以接長使用。'],
    vi: ['Cây chống thép điều chỉnh cao trên 3,5m thì mỗi 2m phải lắp thanh giằng ngang theo hai phương dọc, ngang và liên kết với công trình (Điều 135).',
      'Phiếu ghi "tầng cao trên 3,6m", quy định là 3,5m, lấy mức nghiêm hơn 3,5m. Cây chống thép điều chỉnh không được nối dài.'],
  };
  const notesPin = {
    zh: ['可調鋼管支柱的插銷每支都要裝，調整高度要用制式金屬配件，不可用鋼筋代替（營造安全衛生設施標準第 135 條）。'],
    vi: ['Chốt của cây chống thép điều chỉnh phải lắp đủ từng cây, chỉnh chiều cao phải dùng phụ kiện kim loại tiêu chuẩn, không được dùng thép thanh thay thế (Điều 135).'],
  };
  const notesBase = {
    zh: ['支撐下方地面要穩固：軟弱土要挖除回填夯實、鋪墊板或混凝土，並注意排水（營造安全衛生設施標準第 131、132 條）。',
      '支柱腳部要固定，避免滑動或下陷。'],
    vi: ['Nền dưới cây chống phải chắc: đất yếu phải đào bỏ, lấp và đầm chặt, kê ván hoặc đổ bê tông, chú ý thoát nước (Điều 131, 132).',
      'Chân cây chống phải cố định, tránh trượt hoặc lún.'],
  };
  const notesClean = (w, wv) => ({
    zh: [`${w}上的木屑、鐵絲、垃圾、積水要清乾淨，最後從清潔口清出。`, '封模前、澆置前各檢查一次；脫模劑塗佈均勻。'],
    vi: [`Mùn gỗ, dây thép, rác, nước đọng trên ${wv} phải dọn sạch, cuối cùng lấy ra qua cửa vệ sinh.`, 'Kiểm tra trước khi đóng ván và trước khi đổ bê tông; chất chống dính quét đều.'],
  });
  const notesTie = {
    zh: ['每面兩路螺桿（2.5 分），第一支離地 30cm，其餘間距 50cm 以內，螺帽都要鎖緊。', '螺桿少裝或沒鎖緊，澆置時容易爆模。'],
    vi: ['Mỗi mặt hai hàng ty ren (2,5 phân), cây đầu cách sàn 30cm, các cây còn lại cách nhau trong 50cm, đai ốc phải siết chặt.', 'Thiếu ty ren hoặc siết không chặt, khi đổ bê tông dễ bung ván khuôn.'],
  };
  const notesLayers = {
    zh: ['模板至少 3 層：夾板、角材、背撐角材（或鋼管），層層釘牢、鎖緊。', '背撐不足時，澆置混凝土的側壓力會讓模板鼓出變形。'],
    vi: ['Ván khuôn ít nhất 3 lớp: ván ép, thanh gỗ, thanh gỗ chống lưng (hoặc ống thép), từng lớp đóng và siết chặt.', 'Thiếu chống lưng, áp lực bê tông khi đổ sẽ làm ván khuôn phình biến dạng.'],
  };

  /* ---------- 02 柱模板 ---------- */
  const G02 = {
    0: { svg: docPic('模板施工圖', '現場柱模', ['柱位、斷面尺寸', '開口、預埋件', '樓層高程', '和結構圖一致']),
      zh: ['模板施工圖要和結構圖、建築圖核對：柱位、斷面、高程、預埋件。', '圖面有疑問先問清楚再組模。'],
      vi: ['Bản vẽ ván khuôn phải đối chiếu với bản vẽ kết cấu, kiến trúc: vị trí cột, tiết diện, cao độ, chi tiết chôn sẵn.', 'Bản vẽ có thắc mắc phải hỏi rõ trước khi lắp ván.'] },
    1: { svg: cleanPic('柱模'), ...notesClean('柱模', 'ván khuôn cột') },
    2: { svg: svg(rect(130, 60, 140, 120, 'gd-plank2') + rect(142, 72, 116, 96, 'gd-con') +
        dimH(142, 258, 50, '寬 b ±15mm') + dimV(280, 72, 168, '深 h ±15mm') + t(200, 124, '柱斷面（內尺寸）', 'gd-s') +
        t(200, 210, '量模板內側淨尺寸，上、中、下各量一次', 'gd-r')),
      zh: ['量模板內側的淨尺寸，和圖面斷面相差不超過 ±15mm。', '上、中、下各量一次，確認沒有上大下小。'],
      vi: ['Đo kích thước thông thủy mặt trong ván khuôn, chênh lệch với tiết diện bản vẽ không vượt ±15mm.', 'Đo ở trên, giữa, dưới mỗi chỗ một lần, xác nhận không bị trên to dưới nhỏ.'] },
    3: { svg: layers('柱'), ...notesLayers },
    4: { svg: tiePic('柱模立面'), ...notesTie },
    5: { svg: basePic(), ...notesBase },
    6: { svg: svg(rect(130, 30, 140, 190, 'gd-plank') + line(100, 220, 300, 220, 'gd-floor') +
        rect(130, 190, 30, 30, 'gd-hole') + rect(240, 190, 30, 30, 'gd-hole') + dimV(110, 190, 220, '30cm', 'left') +
        t(200, 180, '兩側各留清潔口', 'gd-r') + t(200, 20, '柱模底部', 'gd-s')),
      zh: ['柱模底部兩側各留清潔口（約 30cm），把模內的木屑、垃圾清出來。', '清完、檢查後再封閉，澆置前確認已封好。'],
      vi: ['Chân ván khuôn cột chừa cửa vệ sinh ở hai bên (khoảng 30cm) để lấy mùn gỗ, rác bên trong ra.', 'Dọn và kiểm tra xong mới bịt lại, trước khi đổ xác nhận đã bịt kín.'] },
    7: { svg: svg(rect(150, 30, 100, 190, 'gd-plank') + line(100, 220, 380, 220, 'gd-floor') +
        `<circle cx="320" cy="120" r="14" class="gd-person"/>` + line(320, 134, 320, 200, 'gd-person-l') + line(320, 150, 265, 140, 'gd-person-l') +
        t(320, 95, '顧模人員', 'gd-r') + t(200, 20, '澆置全程在旁看模板', 'gd-b')),
      zh: ['澆置混凝土時，要有顧模人員全程在模板旁邊，帶槌子、角材隨時補強。', '發現爆模、漏漿、支撐鬆動，立即通知停止澆置。'],
      vi: ['Khi đổ bê tông phải có người canh ván khuôn suốt quá trình, mang búa, thanh gỗ để gia cố kịp thời.', 'Phát hiện bung ván, chảy vữa, cây chống lỏng phải báo ngay để dừng đổ.'] },
  };

  /* ---------- 03 牆模板 ---------- */
  const G03 = {
    0: { svg: cleanPic('牆模'), ...notesClean('牆模', 'ván khuôn vách') },
    1: { svg: svg(line(20, 120, 380, 120, 'gd-axis') + rect(40, 100, 320, 40, 'gd-con') + line(40, 100, 360, 100, 'gd-mark') + line(40, 140, 360, 140, 'gd-mark') +
        dimV(375, 100, 140, '牆厚', 'left') + t(200, 80, '彈出牆兩側墨線（牆厚 15、20cm 依圖）', 'gd-r') + t(200, 180, '另彈檢查線，模板封好後還能量', 'gd-s')),
      zh: ['依圖彈出牆兩側墨線，牆厚（例如 15、20cm）要正確。', '牆邊外另彈檢查線，組模後用來確認位置。'],
      vi: ['Bật đường mực hai bên vách theo bản vẽ, chiều dày vách (ví dụ 15, 20cm) phải đúng.', 'Bật thêm đường kiểm tra ngoài mép vách để xác nhận vị trí sau khi lắp ván.'] },
    2: { svg: straightPic('牆模'),
      zh: ['牆模線型要平直，曲線牆要順。', '從一端拉線到另一端量偏差，有凹凸要調整背撐。'],
      vi: ['Đường ván khuôn vách phải thẳng, vách cong phải đều.', 'Kéo dây từ đầu này sang đầu kia đo độ lệch, có lồi lõm thì chỉnh thanh chống lưng.'] },
    3: { svg: svg(rect(150, 30, 40, 190, 'gd-plank') + line(100, 220, 300, 220, 'gd-floor') +
        line(240, 30, 240, 210, 'gd-laser') + dot(240, 214, 6, 'gd-tie') + t(240, 22, '吊線錘', 'gd-s') +
        dimH(190, 240, 60, '上 a') + dimH(190, 240, 200, '下 b', 16) +
        t(300, 110, '|a − b| ÷ 高度 H', 'gd-r', 'start') + t(300, 135, '清水模 ≦ 1/450', 'gd-s', 'start') + t(300, 158, '普通模 ≦ 1/300', 'gd-s', 'start')),
      zh: ['用吊線錘或雷射量模板上、下離垂線的距離，差值除以高度就是垂直度。', '清水模板 1/450 以下、普通模板 1/300 以下（例如 3m 高，普通模差 1cm 以內）。'],
      vi: ['Dùng quả dọi hoặc laser đo khoảng cách từ ván khuôn đến dây dọi ở trên và dưới, hiệu số chia chiều cao là độ thẳng đứng.', 'Ván khuôn bê tông trần ≦ 1/450, ván khuôn thường ≦ 1/300 (ví dụ cao 3m, ván thường lệch trong 1cm).'] },
    4: { svg: layers('牆'), ...notesLayers },
    5: { svg: tiePic('牆模立面'), ...notesTie },
    6: { svg: svg(rect(60, 40, 80, 160, 'gd-con') + line(30, 120, 170, 120, 'gd-tie-rod') + rect(95, 104, 10, 32, 'gd-steel') +
        t(100, 30, '✔ 外牆：止水型螺桿', 'gd-ok') + t(100, 220, '中間有止水片，留在牆內', 'gd-s') +
        rect(260, 40, 80, 160, 'gd-con') + rect(260, 113, 80, 14, 'gd-hole') + `<path d="M250 120 l-20 0 M350 120 l20 0" class="gd-water-l"/>` +
        t(300, 30, '✘ 可回收式螺桿', 'gd-ngt') + t(300, 220, '拔掉留下貫穿孔，會漏水', 'gd-s')),
      zh: ['外牆不可使用可回收式螺桿（拔掉後會留下貫穿牆的孔，容易漏水）。', '外牆用止水型螺桿，中間有止水片；拆模後螺桿頭要切除並以防水砂漿修補。'],
      vi: ['Vách ngoài không được dùng ty ren thu hồi (rút ra để lại lỗ xuyên vách, dễ thấm nước).', 'Vách ngoài dùng ty ren chống thấm có bản chặn nước ở giữa; sau khi tháo ván cắt đầu ty và trám bằng vữa chống thấm.'] },
    7: { svg: basePic(), ...notesBase },
    8: { svg: svg(rect(40, 40, 320, 170, 'gd-plank') + line(20, 210, 380, 210, 'gd-floor') + rect(150, 204, 100, 6, 'gd-hole') +
        dimV(260, 204, 210, '高 6cm') + t(200, 190, '單側留清潔口', 'gd-r')),
      zh: ['牆模底部單側留清潔口（高約 6cm），把模內雜物清出。', '清完、檢查後封閉。'],
      vi: ['Chân ván khuôn vách chừa cửa vệ sinh một bên (cao khoảng 6cm) để lấy rác bên trong ra.', 'Dọn và kiểm tra xong thì bịt lại.'] },
  };

  /* ---------- 04 梁模板 ---------- */
  // 梁斷面：樓板底模＋梁側模、底模
  const beamForm = () => rect(30, 60, 340, 14, 'gd-plank2') + rect(130, 74, 140, 50, 'gd-con') +
    rect(124, 74, 6, 56, 'gd-plank2') + rect(270, 74, 6, 56, 'gd-plank2') + rect(124, 124, 152, 6, 'gd-plank2') + t(200, 104, '梁（斷面）', 'gd-s');
  const G04 = {
    0: { svg: docPic('模板施工圖', '梁底模', ['梁位、梁寬', '梁深、高程', '開口、套管', '和柱的接頭']),
      zh: ['依模板施工圖放出梁的位置、寬度，並核對梁深、開口、套管位置。'],
      vi: ['Theo bản vẽ ván khuôn định vị dầm, bề rộng, đồng thời đối chiếu chiều cao dầm, lỗ mở, vị trí ống lồng.'] },
    1: { svg: straightPic('梁模'),
      zh: ['梁模線型要平直，從一端拉線檢查。', '梁側模不直，拆模後梁面會歪扭。'],
      vi: ['Đường ván khuôn dầm phải thẳng, kéo dây từ một đầu để kiểm tra.', 'Ván thành dầm không thẳng, sau khi tháo ván mặt dầm sẽ cong vẹo.'] },
    2: { svg: svg(line(20, 40, 380, 40, 'gd-mark') + t(30, 32, '上層樓板面', 'gd-r', 'start') + line(20, 220, 380, 220, 'gd-floor') + t(30, 236, '本層樓板面', 'gd-s', 'start') +
        rect(140, 40, 120, 70, 'gd-con') + dimV(270, 40, 110, '梁深') + dimV(320, 40, 220, '樓層高') + dimV(120, 110, 220, '梁底模高', 'left') +
        t(200, 160, '梁底模高 ＝ 樓層高 − 梁深', 'gd-b')),
      zh: ['梁底模高度 ＝ 樓層高 − 梁深（梁深填在表上）。', '用水準儀從樓層基準線量，多量幾點。'],
      vi: ['Cao độ ván đáy dầm = chiều cao tầng − chiều cao dầm (ghi chiều cao dầm vào phiếu).', 'Dùng máy thủy bình đo từ đường chuẩn của tầng, đo nhiều điểm.'] },
    3: { svg: svg(beamForm() + dimH(130, 270, 150, '梁寬 +13／−6mm', 16) + dimV(290, 74, 124, '梁深') + t(200, 30, '量模板內淨尺寸', 'gd-s')),
      zh: ['梁寬、梁深量模板內淨尺寸，誤差在 +13mm／−6mm 之內。', '偏小（負值）會影響結構強度，容許範圍比較嚴。'],
      vi: ['Đo bề rộng, chiều cao dầm theo kích thước thông thủy trong ván, sai số trong +13mm/−6mm.', 'Nhỏ hơn (âm) ảnh hưởng cường độ kết cấu nên dung sai chặt hơn.'] },
    4: { svg: svg(line(30, 110, 370, 110, 'gd-mark') + line(30, 110, 370, 122, 'gd-red') + dimV(380, 110, 122, '誤差', 'left') +
        t(200, 60, '梁底高程誤差（依梁長）', 'gd-b') + t(200, 160, '3m 以內 ±0.6cm', 'gd-s') + t(200, 182, '3～12m ±1.2cm', 'gd-s') + t(200, 204, '12m 以上 ±2.5cm', 'gd-s')),
      zh: ['梁底高程誤差依梁長：3m 以內 ±0.6cm、3～12m ±1.2cm、12m 以上 ±2.5cm。'],
      vi: ['Sai số cao độ đáy dầm theo chiều dài dầm: trong 3m ±0,6cm, 3–12m ±1,2cm, trên 12m ±2,5cm.'] },
    5: { svg: svg(rect(60, 40, 280, 120, 'gd-plank') + [80, 125].map(y => line(50, y, 350, y, 'gd-tie-rod')).join('') +
        [100, 150, 200, 250, 300].map(x => dot(x, 80, 5, 'gd-bolt') + dot(x, 125, 5, 'gd-bolt')).join('') +
        dimH(100, 150, 190, '@50cm', 16) + t(200, 30, '梁側模立面：兩路螺桿', 'gd-b')),
      zh: ['梁側模每面兩路螺桿（2.5 分），間距 50cm 以內，螺帽鎖緊。'],
      vi: ['Ván thành dầm mỗi mặt hai hàng ty ren (2,5 phân), khoảng cách trong 50cm, đai ốc siết chặt.'] },
    6: { svg: pinPic(), ...notesPin },
    7: { svg: bracePic(), ...notesBrace },
    8: { svg: svg(rect(20, 40, 50, 188, 'gd-con') + rect(330, 40, 50, 188, 'gd-con') + rect(70, 40, 260, 60, 'gd-con') + rect(70, 100, 260, 8, 'gd-plank2') +
        [95, 155, 215, 275].map(x => line(x, 108, x, 225, 'gd-pipe-b')).join('') + t(200, 75, '梁（立面）', 'gd-s') +
        line(20, 228, 380, 228, 'gd-floor') + dimH(70, 95, 240, '≦30cm', -6) + dimH(155, 215, 240, '@60cm', -6) +
        t(200, 20, '梁寬 ≦30cm 單排；>30cm 雙排', 'gd-b')),
      zh: ['梁底鋼管支撐：第一支離柱邊不大於 30cm；間距 60cm。', '梁寬 30cm 以下單排、超過 30cm 雙排；每支都要穩固不可搖動。'],
      vi: ['Cây chống thép đáy dầm: cây đầu cách mép cột không quá 30cm; khoảng cách 60cm.', 'Dầm rộng ≦ 30cm một hàng, trên 30cm hai hàng; cây nào cũng phải chắc, không lung lay.'] },
    9: { svg: svg(rect(30, 80, 40, 140, 'gd-con') + rect(330, 80, 40, 140, 'gd-con') + line(70, 140, 330, 140, 'gd-axis') +
        `<path d="M70 140 Q200 118 330 140" class="gd-trend"/>` + dimV(200, 129, 140, '預拱') +
        t(200, 60, '跨中預先抬高：每公尺 0.4cm', 'gd-b') + t(200, 190, '例：跨度 8m，中央抬高約 1.6cm（依圖）', 'gd-s')),
      zh: ['梁跨中要預先抬高（預拱），抵消混凝土重量造成的下垂。', '依表上規定每公尺 0.4cm 計算（實際依設計圖）。'],
      vi: ['Giữa nhịp dầm phải nâng trước (độ vồng) để bù độ võng do trọng lượng bê tông.', 'Tính theo phiếu 0,4cm mỗi mét (thực tế theo bản vẽ thiết kế).'] },
    10: { svg: cleanPic('梁模'), ...notesClean('梁模', 'ván khuôn dầm') },
  };

  /* ---------- 05 樓板模板 ---------- */
  const G05 = {
    0: { svg: cleanPic('樓板模'), ...notesClean('樓板模', 'ván khuôn sàn') },
    1: { svg: svg(line(20, 40, 380, 40, 'gd-mark') + t(30, 32, '上層樓板面', 'gd-r', 'start') + line(20, 220, 380, 220, 'gd-floor') +
        rect(20, 40, 360, 25, 'gd-con') + dimV(300, 40, 65, '板厚') + dimV(120, 65, 220, '板底模高', 'left') +
        t(220, 150, '板底模高 ＝ 樓層高 − 板厚', 'gd-b')),
      zh: ['板底模高度 ＝ 樓層高 − 板厚（板厚填在表上）。', '用水準儀分區量，誤差在 ±0.6cm 以內。'],
      vi: ['Cao độ ván đáy sàn = chiều cao tầng − chiều dày sàn (ghi chiều dày sàn vào phiếu).', 'Dùng máy thủy bình đo từng khu, sai số trong ±0,6cm.'] },
    2: { svg: svg(line(30, 110, 370, 110, 'gd-mark') + [80, 160, 240, 320].map(x => dot(x, 110 + (x % 3), 5, 'gd-tie')).join('') +
        t(200, 80, '板底高程：分區多點量測 ±0.6cm', 'gd-b') + `<path d="M330 40 L350 40 L340 55 Z" class="gd-tri"/>` + line(340, 55, 340, 105, 'gd-laser')),
      zh: ['板底高程分區多點量測，誤差 ±0.6cm 以內。'],
      vi: ['Cao độ đáy sàn đo nhiều điểm theo khu, sai số trong ±0,6cm.'] },
    3: { svg: svg(rect(40, 60, 150, 100, 'gd-plank2') + rect(210, 60, 150, 100, 'gd-plank2') + line(195, 60, 195, 160, 'gd-red') +
        dimH(190, 210, 50, '縫隙') + t(200, 200, '板與板之間、板與梁側模之間不可有孔隙（會漏漿）', 'gd-s')),
      zh: ['板面接縫要密合，目視沒有孔隙；有孔隙用膠帶或補板封好，避免漏漿。'],
      vi: ['Mối nối mặt ván phải khít, nhìn không thấy khe; có khe thì dán băng keo hoặc vá ván, tránh chảy vữa.'] },
    4: { svg: svg(rect(30, 60, 40, 150, 'gd-con') + rect(70, 60, 300, 10, 'gd-plank2') +
        [100, 160, 220, 280, 340].map(x => rect(x - 6, 70, 12, 14, 'gd-plank')).join('') + rect(70, 84, 300, 12, 'gd-plank') +
        dimH(70, 100, 50, '≦30cm') + t(200, 130, '① 夾板 ② 加勁角材 ③ 底層角材（2 層）', 'gd-r')),
      zh: ['板底加勁角材 2 層；最靠近梁的那支角材，離梁側不大於 30cm。'],
      vi: ['Thanh gỗ gia cường đáy sàn 2 lớp; thanh gần dầm nhất cách thành dầm không quá 30cm.'] },
    5: { svg: svg(line(20, 40, 380, 40, 'gd-floor') + rect(20, 40, 40, 185, 'gd-con') + [90, 180, 270, 360].map(x => line(x, 42, x, 225, 'gd-pipe-b')).join('') +
        line(20, 228, 380, 228, 'gd-floor') + dimH(60, 90, 30, '≦30cm') + dimH(180, 270, 30, '@90cm') + t(220, 140, '支撐不可搖動', 'gd-r')),
      zh: ['樓板鋼管支撐：第一支離柱邊不大於 30cm，間距 90cm；每支都要穩固不可搖動。'],
      vi: ['Cây chống thép sàn: cây đầu cách mép cột không quá 30cm, khoảng cách 90cm; cây nào cũng phải chắc, không lung lay.'] },
    6: { svg: svg(rect(60, 40, 280, 140, 'gd-plank2') + [70, 120, 170].map(y => [80, 200, 320].map(x => dot(x, y, 4, 'gd-bolt')).join('')).join('') +
        dot(140, 120, 4, 'gd-bolt') + t(200, 25, '3 尺 × 6 尺夾板', 'gd-b') + t(200, 215, '每片至少 10 支釘', 'gd-r')),
      zh: ['3 尺 × 6 尺的夾板每片至少釘 10 支釘，四周和中間都要釘。'],
      vi: ['Ván ép 3 thước × 6 thước mỗi tấm ít nhất 10 cây đinh, đóng cả xung quanh và ở giữa.'] },
    7: { svg: docPic('設計圖', '板模開孔', ['開孔位置', '開孔尺寸', '套管、預留孔', '和水電圖核對']),
      zh: ['樓板開孔（管道間、套管、預留孔）位置和尺寸要和設計圖、水電圖核對。', '開孔周邊依圖補強鋼筋。'],
      vi: ['Vị trí và kích thước lỗ mở sàn (hộp kỹ thuật, ống lồng, lỗ chờ) phải đối chiếu bản vẽ thiết kế và bản vẽ điện nước.', 'Xung quanh lỗ mở gia cường thép theo bản vẽ.'] },
    8: { svg: basePic(), ...notesBase },
    9: { svg: svg(`<path d="M20 70 L200 70 L200 90 L380 90 L380 120 L200 120 L200 100 L20 100 Z" class="gd-con"/>` + dimV(390, 70, 90, '降板', 'left') +
        t(110, 55, '一般樓板', 'gd-s') + t(290, 80, '降 5、10、20cm', 'gd-r') + t(200, 170, '浴廁、陽台、機房等依圖降板，模板要做出高差', 'gd-s')),
      zh: ['確認這區是否降板（例如浴廁、陽台降 5、10、20cm），模板要依圖做出高差。'],
      vi: ['Xác nhận khu vực có hạ cốt sàn không (ví dụ nhà vệ sinh, ban công hạ 5, 10, 20cm), ván khuôn phải làm chênh cao theo bản vẽ.'] },
    10: { svg: pinPic(), ...notesPin },
    11: { svg: bracePic(), ...notesBrace },
  };

  /* ---------- 06 拆模 ---------- */
  const G06 = {
    0: { svg: svg(rect(20, 20, 360, 200, 'gd-paper') + line(20, 55, 380, 55, 'gd-axis') + t(200, 44, '拆模時間（依表上規定）', 'gd-b') +
        t(30, 80, '柱、牆、墩側模（不受外力）', 'gd-s', 'start') + t(370, 80, '12 小時', 'gd-r', 'end') +
        t(30, 115, '板底：淨跨 3m 以下', 'gd-s', 'start') + t(370, 115, '4 天', 'gd-r', 'end') +
        t(30, 140, '板底：淨跨 3m 以上', 'gd-s', 'start') + t(370, 140, '10 天', 'gd-r', 'end') +
        t(30, 170, '梁底：3m 以下／3～6m', 'gd-s', 'start') + t(370, 170, '7 天／14 天', 'gd-r', 'end') +
        t(30, 195, '梁底：6m 以上', 'gd-s', 'start') + t(370, 195, '21 天', 'gd-r', 'end')),
      zh: ['拆模時間依表上規定；天氣冷、強度不足時要延後。', '法規要求確認混凝土達安全強度才可拆模（營造安全衛生設施標準第 147 條），必要時看試體強度。',
        '拆模後若要承受上層施工荷重，須經設計確認（第 146 條）。'],
      vi: ['Thời gian tháo ván theo phiếu; trời lạnh, cường độ chưa đủ phải hoãn.', 'Quy định yêu cầu xác nhận bê tông đạt cường độ an toàn mới được tháo ván (Điều 147), khi cần xem cường độ mẫu thử.',
        'Sau khi tháo ván nếu phải chịu tải thi công tầng trên thì phải được thiết kế xác nhận (Điều 146).'] },
    1: { svg: cleanPic('拆模後表面'),
      zh: ['拆模後混凝土表面殘留的木屑、夾板碎片要確實清除。', '拆下的模板材料要整理堆放（第 145 條），拔掉或彎倒外露的鐵釘。'],
      vi: ['Sau khi tháo ván, mùn gỗ, mảnh ván ép còn dính trên mặt bê tông phải dọn sạch.', 'Vật liệu ván khuôn tháo ra phải sắp xếp gọn (Điều 145), nhổ hoặc bẻ cong đinh lòi ra.'] },
    2: { svg: svg(rect(60, 40, 280, 150, 'gd-con') + [100, 200, 300].map(x => dot(x, 80, 6, 'gd-rust') + dot(x, 150, 6, 'gd-rust')).join('') +
        t(200, 30, '螺桿頭、鐵絲、鐵釘全部清除', 'gd-r') + t(200, 215, '切除後用砂漿補平，避免生鏽', 'gd-s')),
      zh: ['拆模後外露的螺桿頭、鐵絲、鐵釘全部切除清除。', '切除處用砂漿補平，避免日後生鏽滲出鏽水。'],
      vi: ['Sau khi tháo ván cắt bỏ hết đầu ty ren, dây thép, đinh lòi ra.', 'Chỗ cắt trám phẳng bằng vữa, tránh gỉ sét chảy nước gỉ sau này.'] },
    3: { svg: svg(rect(60, 40, 280, 150, 'gd-con') + [[150, 110], [170, 125], [160, 95], [185, 105], [145, 130]].map(([x, y]) => dot(x, y, 6, 'gd-hole')).join('') +
        t(165, 160, '蜂巢', 'gd-r') + t(200, 215, '鑿除鬆動部分 → 清洗 → 無收縮水泥砂漿修補', 'gd-s')),
      zh: ['發現蜂巢（石子外露、有空洞）要拍照記錄，鑿除鬆動部分、清洗濕潤後用無收縮水泥砂漿修補。', '蜂巢範圍大或露出鋼筋，先回報工地主任評估。'],
      vi: ['Phát hiện rỗ tổ ong (đá lộ ra, có lỗ rỗng) phải chụp ảnh ghi lại, đục bỏ phần bở, rửa ướt rồi trám bằng vữa không co ngót.', 'Rỗ tổ ong lớn hoặc lộ thép thì báo chỉ huy trưởng đánh giá trước.'] },
  };

  /* ---------- 41 樓梯模板 ---------- */
  const stairForm = `<path d="M50 210 L50 185 L90 185 L90 160 L130 160 L130 135 L170 135 L170 110 L210 110 L210 85 L330 85 L330 105 L230 105 L70 225 L50 225 Z" class="gd-con"/>`;
  const G41 = {
    0: { svg: svg(stairForm + t(60, 240, '起點', 'gd-r') + t(280, 75, '平台', 'gd-r') + t(200, 30, '依樓梯施工圖放出起迄點、平台位置', 'gd-b')),
      zh: ['依樓梯施工圖在牆面、樓板放出起點、終點和平台位置。'],
      vi: ['Theo bản vẽ thi công cầu thang định vị điểm đầu, điểm cuối và chiếu nghỉ trên tường, sàn.'] },
    1: { svg: svg(stairForm + dimV(330, 85, 105, '平台厚') + line(140, 170, 160, 197, 'gd-dim') + t(170, 200, '梯板厚 t（垂直斜面量）', 'gd-dimt', 'start')),
      zh: ['梯板厚度依圖（填在表上），要垂直斜面量，不是量垂直高度。'],
      vi: ['Chiều dày bản thang theo bản vẽ (ghi vào phiếu), đo vuông góc với mặt nghiêng, không phải đo theo phương đứng.'] },
    2: { svg: svg(rect(60, 40, 280, 160, 'gd-paper') + [70, 100, 130, 160].map(y => line(100, y, 300, y, 'gd-plank-l')).join('') +
        line(100, 40, 100, 200, 'gd-floor') + line(300, 40, 300, 200, 'gd-floor') + dimH(100, 300, 215, '淨寬 W', -6) + t(200, 25, '平面', 'gd-s')),
      zh: ['樓梯淨寬依圖（填在表上），量兩側模板之間，扣掉之後粉刷、扶手的厚度仍要符合淨寬。'],
      vi: ['Chiều rộng thông thủy cầu thang theo bản vẽ (ghi vào phiếu), đo giữa hai ván thành; trừ lớp trát, tay vịn sau này vẫn phải đủ chiều rộng.'] },
    3: { svg: svg(stairForm + dimV(80, 185, 160, '級高 R', 'left') + t(260, 180, '同一梯段每級一致', 'gd-r')),
      zh: ['級高依圖（填在表上），同一梯段每一級都要一樣。', '第一級和最後一級要扣面材厚度，最容易做錯。'],
      vi: ['Chiều cao bậc theo bản vẽ (ghi vào phiếu), các bậc trong cùng một vế thang phải bằng nhau.', 'Bậc đầu và bậc cuối phải trừ chiều dày lớp hoàn thiện, dễ sai nhất.'] },
    4: { svg: svg(stairForm + dimH(90, 130, 150, '級深 T') + t(260, 180, '同一梯段每級一致', 'gd-r')),
      zh: ['級深依圖（填在表上），同一梯段每一級都要一樣。'],
      vi: ['Chiều sâu bậc theo bản vẽ (ghi vào phiếu), các bậc trong cùng một vế thang phải bằng nhau.'] },
    5: { svg: svg(stairForm + line(20, 85, 380, 85, 'gd-mark') + t(300, 75, '平台高程', 'gd-r') + line(20, 225, 380, 225, 'gd-floor') + dimV(360, 85, 225, '依樓層高程')),
      zh: ['平台高程依樓層高程和設計圖，從樓層基準線量。'],
      vi: ['Cao độ chiếu nghỉ theo cao độ tầng và bản vẽ thiết kế, đo từ đường chuẩn của tầng.'] },
    6: { svg: svg(stairForm + [100, 150, 200].map(x => line(x, 225 - (x - 70) * 0.75 + 0, x, 235, 'gd-pipe')).join('') +
        line(100, 235, 200, 140, 'gd-brace') + line(20, 236, 380, 236, 'gd-floor') + t(280, 160, '支撐間距依表、加斜撐', 'gd-r') + t(280, 182, '基腳穩固', 'gd-s')),
      zh: ['梯板底模的鋼管支撐間距依表上填寫，要加斜撐防止順著斜面滑動。', '支撐腳部穩固，不可放在鬆土上。'],
      vi: ['Khoảng cách cây chống thép ván đáy bản thang theo phiếu, phải thêm thanh giằng chéo chống trượt theo mặt nghiêng.', 'Chân cây chống phải chắc, không đặt trên đất tơi.'] },
    7: { svg: svg(stairForm + [90, 130, 170, 210].map(x => rect(x - 3, 225 - (x - 50) * 0.6 - 40, 6, 30, 'gd-plank2')).join('') +
        t(270, 180, '踏步側模（豎板）固定牢靠、垂直', 'gd-r')),
      zh: ['每一級的踏步側模（豎板）要垂直、固定牢靠，澆置時不可被混凝土推動。'],
      vi: ['Ván thành bậc (ván đứng) mỗi bậc phải thẳng đứng, cố định chắc, khi đổ không bị bê tông đẩy lệch.'] },
    8: { svg: svg(rect(40, 60, 150, 100, 'gd-plank2') + rect(210, 60, 150, 100, 'gd-plank2') + line(200, 60, 200, 160, 'gd-red') +
        t(200, 200, '接縫密合，有縫用膠帶或補板封好', 'gd-s')),
      zh: ['模板接縫密合，避免漏漿；斜面和轉角處最容易有縫。'],
      vi: ['Mối nối ván khuôn phải khít, tránh chảy vữa; mặt nghiêng và góc dễ có khe nhất.'] },
    9: { svg: svg(stairForm + [100, 140, 180].map(x => rect(x - 4, 225 - (x - 50) * 0.6 - 48, 8, 8, 'gd-steel')).join('') +
        t(270, 180, '扶手、欄杆預埋鐵件', 'gd-r')),
      zh: ['扶手、欄杆的預埋件位置和數量依圖，澆置前確認固定好。'],
      vi: ['Vị trí và số lượng chi tiết chôn sẵn cho tay vịn, lan can theo bản vẽ, xác nhận cố định chắc trước khi đổ.'] },
    10: { svg: svg(stairForm + line(205, 70, 225, 120, 'gd-red') + t(200, 200, '施工縫位置依圖或監造指示', 'gd-r')),
      zh: ['樓梯施工縫位置依設計圖或監造指示，不可自行決定。'],
      vi: ['Vị trí mạch ngừng thi công cầu thang theo bản vẽ thiết kế hoặc chỉ thị của giám sát, không tự quyết định.'] },
    11: { svg: cleanPic('樓梯模'), ...notesClean('樓梯模', 'ván khuôn cầu thang') },
  };

  Object.assign(window.SK_GUIDES, { '02': G02, '03': G03, '04': G04, '05': G05, '06': G06, '41': G41 });
})();
