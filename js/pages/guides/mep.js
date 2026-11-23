/**
 * 看圖說：機電、防水、景觀（28／29 電梯、30／31 防水、34 植栽、35 景觀照明、36 接地、37 RC 水電配管、43 給水試壓、44 排水試水、45 配線及絕緣電阻）
 * 畫圖工具來自 self-check-guides.js 的 window.SK_GD
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok } = window.SK_GD;
  const g = (s, zh, vi) => ({ svg: s, zh: [].concat(zh), vi: [].concat(vi) });

  const matPic = (label) => svg(rect(40, 40, 120, 150, 'gd-paper') + t(100, 32, '送審資料', 'gd-b') + [70, 95, 120, 145].map(y => line(55, y, 145, y, 'gd-axis')).join('') +
    t(200, 115, '⇄', 'gd-big') + rect(240, 70, 120, 90, 'gd-plank2') + t(300, 62, '現場材料', 'gd-b') + t(300, 120, label, 'gd-s') + t(200, 220, '材質、規格、廠牌和核定送審一致', 'gd-r'));
  const lookPic = (good, bad, marks = '') => svg(rect(30, 50, 150, 130, 'gd-tile') + rect(220, 50, 150, 130, 'gd-tile') + marks + t(105, 40, '✔ ' + good, 'gd-ok') + t(295, 40, '✘ ' + bad, 'gd-ngt'));
  const stain = [[250, 90], [300, 140], [330, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" class="gd-stain"/>`).join('');
  const crack = `<path d="M240 70 L270 110 L260 140 L300 170" class="gd-crack"/>`;
  const cleanPic = () => lookPic('清潔完成', '殘留垃圾、污漬', stain);
  const checklist = (title, rows) => svg(rect(60, 20, 280, 200, 'gd-paper') + t(200, 44, title, 'gd-b') + rows.map((r, i) => ok(80, 78 + i * 30, r)).join(''));
  const docPlan = (what) => svg(rect(40, 30, 150, 170, 'gd-paper') + t(115, 22, '施工圖', 'gd-b') + `<path d="M60 60 L170 60 L170 120 L100 120 L100 180" class="gd-pipe-route"/>` +
    t(200, 115, '⇄', 'gd-big') + rect(210, 30, 150, 170, 'gd-con') + t(285, 22, '現場', 'gd-b') + `<path d="M230 60 L340 60 L340 120 L270 120 L270 180" class="gd-pipe-route"/>` +
    t(200, 225, `${what}依核定施工圖`, 'gd-r'));
  const pipeCap = () => svg(line(60, 120, 300, 120, 'gd-pipe-w-l') + rect(300, 108, 20, 24, 'gd-cap') + t(200, 90, '管口封閉（管塞、膠帶）', 'gd-r') + t(200, 170, '防止砂漿、異物進入堵塞', 'gd-s'));

  /* ---------- 28 電梯（井道、外門） ---------- */
  const shaft = (extra = '') => svg(rect(120, 20, 160, 210, 'gd-shaft') + line(120, 20, 120, 230, 'gd-floor') + line(280, 20, 280, 230, 'gd-floor') + extra);
  const G28 = {
    0: g(shaft(dimV(300, 20, 60, 'OH') + dimV(300, 190, 230, 'PIT') + line(110, 60, 290, 60, 'gd-axis') + line(110, 190, 290, 190, 'gd-axis') + t(200, 120, '頂部 OH、底坑 PIT 依廠商圖', 'gd-r')),
      '電梯井頂部高度（OH）、底坑深度（PIT）依電梯廠商圖與設計圖，不足會無法安裝。', 'Chiều cao đỉnh giếng (OH), độ sâu hố pit (PIT) theo bản vẽ hãng thang máy và thiết kế, thiếu sẽ không lắp được.'),
    1: g(svg(rect(40, 80, 320, 30, 'gd-con') + [120, 200, 280].map(x => rect(x - 15, 80, 30, 30, 'gd-hole')).join('') + t(200, 60, '機房樓板開孔：位置、尺寸依廠商圖', 'gd-r')),
      '機房樓板的開孔（鋼索、控制線）位置、尺寸依廠商圖。', 'Vị trí, kích thước lỗ mở sàn phòng máy (cáp, dây điều khiển) theo bản vẽ hãng thang máy.'),
    2: g(shaft(rect(120, 200, 160, 30, 'gd-waterproof') + t(200, 190, '底坑防水，不可滲水、積水', 'gd-r')), '底坑要做防水，不可滲水、積水（積水會損壞設備）。', 'Hố pit phải chống thấm, không thấm, không đọng nước (đọng nước làm hỏng thiết bị).'),
    3: g(shaft(t(200, 120, '井道內清除垃圾、模板、鐵絲', 'gd-r')), '電梯井道內的垃圾、殘留模板、鐵絲清除乾淨。', 'Dọn sạch rác, ván khuôn sót, dây thép trong giếng thang.'),
    4: g(shaft(line(130, 80, 270, 80, 'gd-pipe-w-l') + t(200, 70, '✘ 無關管線外露穿越', 'gd-ngt') + t(200, 150, '井道內只能有電梯用管線', 'gd-s')), '井道內不可有和電梯無關的管線外露穿越。', 'Trong giếng thang không được có đường ống không liên quan đến thang máy đi lộ qua.'),
    5: g(svg(rect(60, 20, 280, 210, 'gd-wall') + rect(140, 60, 100, 170, 'gd-door-frame') + rect(260, 110, 24, 40, 'gd-steel') + line(40, 230, 360, 230, 'gd-floor') + dimV(320, 130, 230, '高度依圖')),
      '外門開關盒（呼叫按鈕）安裝高度依圖，無障礙電梯依無障礙規範。', 'Chiều cao hộp nút gọi ngoài cửa theo bản vẽ, thang máy không rào cản theo quy phạm không rào cản.'),
    6: g(checklist('開關及指示', ['按鈕反應正常', '樓層、方向指示正確', '到站燈、聲音正常']), '按鈕、樓層與方向指示功能正常。', 'Nút bấm, chỉ báo tầng và hướng hoạt động bình thường.'),
    7: g(checklist('開關門', ['開關平順、不卡', '沒有異常聲音', '門速一致']), '開關門平順，沒有卡住或異常聲音。', 'Đóng mở cửa êm, không kẹt hoặc tiếng lạ.'),
    8: g(svg(rect(140, 30, 120, 190, 'gd-door-frame') + line(120, 30, 120, 210, 'gd-laser') + dot(120, 214, 6, 'gd-tie') + t(200, 236, '門框垂直', 'gd-r')), '外門門框垂直（用吊線檢查）。', 'Khung cửa ngoài thẳng đứng (kiểm tra bằng dây dọi).'),
    9: g(svg(rect(100, 40, 98, 170, 'gd-door') + rect(202, 40, 98, 170, 'gd-door') + dimH(198, 202, 30, '間隙') + t(200, 236, '門板間隙均勻、依廠商規定', 'gd-r')), '門板之間、門板和門框間隙均勻，依廠商規定。', 'Khe hở giữa các cánh, giữa cánh và khung đều nhau, theo quy định hãng.'),
    10: g(checklist('組裝牢固', ['門框固定牢靠', '螺栓鎖緊', '用手推不晃動']), '外門各組件組裝牢固，螺栓鎖緊。', 'Các bộ phận cửa ngoài lắp chắc chắn, bu lông siết chặt.'),
  };

  /* ---------- 29 電梯（車廂、外觀） ---------- */
  const car = (extra = '') => svg(rect(120, 40, 160, 180, 'gd-shaft') + rect(135, 55, 130, 165, 'gd-car') + extra);
  const G29 = {
    0: g(svg(rect(60, 100, 280, 14, 'gd-con') + rect(160, 86, 120, 14, 'gd-car') + dimV(300, 100, 114, '平層差') + t(200, 60, '樓層準確度：車廂地板和樓板齊平', 'gd-r')),
      '電梯停靠時車廂地板和樓板要齊平，高差依廠商規定（避免絆倒）。', 'Khi thang dừng sàn cabin phải bằng sàn tầng, chênh lệch theo quy định hãng (tránh vấp ngã).'),
    1: g(car(line(200, 55, 200, 220, 'gd-red') + t(200, 30, '門防夾：光電、安全觸板', 'gd-r')), '關門時有物體擋住要能自動重開（光電感應或安全觸板）。', 'Khi đóng cửa có vật cản phải tự mở lại (cảm biến quang hoặc thanh an toàn).'),
    2: g(car(rect(180, 70, 40, 20, 'gd-steel') + t(200, 30, '樓層、方向顯示正確', 'gd-r')), '車廂內樓層、方向顯示正確。', 'Hiển thị tầng, hướng trong cabin chính xác.'),
    3: g(car(`<circle cx="200" cy="65" r="8" class="gd-lamp"/>` + t(200, 30, '照明、風扇正常', 'gd-r')), '車廂照明、通風扇運轉正常。', 'Đèn, quạt thông gió cabin hoạt động bình thường.'),
    4: g(car(rect(240, 120, 16, 16, 'gd-tie-box') + t(200, 30, '警報鈕、對講機能接通', 'gd-r')), '警報按鈕、對講機能接通管理室或維護單位。', 'Nút báo động, bộ đàm liên lạc được với phòng quản lý hoặc đơn vị bảo trì.'),
    5: g(checklist('停電應變', ['緊急照明會亮', '自動停靠最近樓層開門', '對講機可用']), '停電時緊急照明、對講機可用；有自動救援裝置的要能停靠最近樓層開門。', 'Khi mất điện đèn khẩn cấp, bộ đàm dùng được; có thiết bị cứu hộ tự động thì phải dừng tầng gần nhất và mở cửa.'),
    6: g(lookPic('外門完整無刮傷', '刮傷、凹陷', crack), '電梯外門表面沒有刮傷、凹陷、污漬。', 'Bề mặt cửa ngoài thang không trầy, móp, bẩn.'),
    7: g(lookPic('車廂完整', '刮傷、污損', crack + stain), '車廂內裝沒有刮傷、污損。', 'Nội thất cabin không trầy, bẩn hỏng.'),
    8: g(car(rect(135, 55, 130, 165, 'gd-protect-board') + t(200, 30, '施工期間加保護板', 'gd-r')), '施工期間車廂、外門加保護板（或保護膜），交屋前再拆除。', 'Trong thời gian thi công che tấm bảo vệ (hoặc màng bảo vệ) cho cabin, cửa ngoài, bàn giao mới tháo.'),
  };

  /* ---------- 30／31 防水 ---------- */
  const wp = (extra = '') => svg(rect(20, 140, 360, 50, 'gd-con') + rect(20, 128, 360, 12, 'gd-waterproof-l') + extra);
  const G30 = {
    0: g(matPic('防水材'), '防水材料種類（彈性水泥、PU、EP 防水膜）依設計，核對送審資料與包裝。', 'Loại vật liệu chống thấm (xi măng đàn hồi, màng PU, màng EP) theo thiết kế, đối chiếu hồ sơ duyệt và bao bì.'),
    1: g(svg(rect(20, 140, 360, 50, 'gd-con') + rect(150, 80, 100, 50, 'gd-paper') + t(200, 102, '含水率 ≦ 6%', 'gd-r') + t(200, 122, '濕度 ≦ 85%', 'gd-r') + t(200, 215, '施工面清潔無雜物', 'gd-s')),
      '施工面清潔無雜物，基層含水率 ≦ 6%、大氣相對濕度 ≦ 85% 才可施作。', 'Mặt thi công sạch, không tạp vật, độ ẩm lớp nền ≦ 6%, độ ẩm không khí ≦ 85% mới được thi công.'),
    2: g(wp(t(200, 100, '底層塗佈 ≧ 0.2 kg/m²', 'gd-r')), '底層（底漆）塗佈量 ≧ 0.2 kg/m²，用面積和用量核算。', 'Lớp lót quét ≧ 0,2 kg/m², tính theo diện tích và lượng dùng.'),
    3: g(wp(t(200, 100, '中層 ≧ 1.5～2.5 kg/m²（依材料）', 'gd-r')), '中層塗佈量依各類材料規定（≧ 1.5～2.5 kg/m²），可用空桶數量核算。', 'Lớp giữa quét theo quy định từng loại vật liệu (≧ 1,5–2,5 kg/m²), có thể tính bằng số thùng rỗng.'),
    4: g(wp(rect(20, 120, 360, 8, 'gd-paint2') + t(200, 100, '面層依設計詳圖', 'gd-r')), '面層塗佈依設計詳圖規定。', 'Lớp mặt quét theo quy định bản vẽ chi tiết thiết kế.'),
  };
  const bath = (extra = '') => svg(rect(40, 20, 20, 210, 'gd-con') + rect(340, 20, 20, 210, 'gd-con') + rect(40, 210, 320, 20, 'gd-con') +
    rect(60, 60, 6, 150, 'gd-waterproof-l') + rect(334, 60, 6, 150, 'gd-waterproof-l') + rect(60, 204, 280, 6, 'gd-waterproof-l') + extra);
  const G31 = {
    0: g(wp(dimV(390, 128, 140, '≧1mm', 'left') + t(200, 100, '完成厚度 ≧ 1mm ±0.2mm', 'gd-r')), '防水層完成厚度 ≧ 1mm（±0.2mm），可用測厚儀或割樣量測。', 'Chiều dày lớp chống thấm hoàn thiện ≧ 1mm (±0,2mm), đo bằng máy đo hoặc cắt mẫu.'),
    1: g(bath(dimV(80, 60, 210, '高度依圖') + t(200, 120, '乾區 120、濕區 180、陽台 30cm', 'gd-r')), '防水層立面高度依圖：乾區 120cm、濕區（淋浴）180cm、陽台 30cm。', 'Chiều cao lớp chống thấm mặt đứng theo bản vẽ: khu khô 120cm, khu ướt (tắm) 180cm, ban công 30cm.'),
    2: g(bath(rect(60, 190, 40, 20, 'gd-fabric') + rect(300, 190, 40, 20, 'gd-fabric') + t(200, 120, '陰角、管邊：聚脂纖維布補強 20cm 寬', 'gd-r')),
      '陰角、管邊、落水頭周邊用複合防水材＋聚脂纖維布補強，寬度 20cm。', 'Góc trong, quanh ống, quanh phễu thu gia cường bằng vật liệu chống thấm + vải polyester, rộng 20cm.'),
    3: g(svg(`<path d="M80 40 L80 200 L320 200" class="gd-floor"/>` + `<path d="M80 170 Q80 200 110 200" class="gd-cove"/>` + t(220, 120, '施工縫、陰角：滾圓角或加強', 'gd-r')),
      '混凝土施工縫和陰角先用砂漿做圓角，或加強處理，防水層才不會在轉角斷裂。', 'Mạch ngừng bê tông và góc trong làm bo tròn bằng vữa trước hoặc gia cường, lớp chống thấm mới không nứt ở góc.'),
    4: g(lookPic('完整無缺陷', '破損、針孔、裂縫', crack + [[300, 90], [320, 120]].map(([x, y]) => dot(x, y, 3, 'gd-bolt')).join('')), '完成面不可有破損、針孔、空隙、裂縫。', 'Mặt hoàn thiện không được rách, lỗ kim, rỗng, nứt.'),
    5: g(wp(t(200, 100, '全部覆蓋、黏結牢固、不起鼓', 'gd-r')), '防水層全部覆蓋施作範圍，黏結牢固、不起鼓。', 'Lớp chống thấm phủ kín toàn bộ phạm vi, bám chắc, không phồng.'),
    6: g(cleanPic(), '潑濺到牆面、管件的防水材要清除乾淨。', 'Vật liệu chống thấm bắn ra tường, ống phải làm sạch.'),
    7: g(wp(rect(20, 116, 360, 12, 'gd-mortar') + t(200, 100, '面層保護（砂漿、保護板）', 'gd-r')), '防水層完成後要做面層保護（砂漿或保護板），避免後續施工刺破。', 'Lớp chống thấm xong phải làm lớp bảo vệ (vữa hoặc tấm bảo vệ), tránh thi công sau làm thủng.'),
    8: g(bath(rect(66, 160, 268, 44, 'gd-water-fill') + t(200, 120, '放水 72 小時，樓下檢查有無漏水', 'gd-r')), '試水：放水（例 5cm 深）72 小時，到樓下檢查有沒有滲漏，有就修補後重試。', 'Thử nước: ngâm nước (ví dụ sâu 5cm) 72 giờ, xuống tầng dưới kiểm tra có thấm không, có thì sửa rồi thử lại.'),
  };

  /* ---------- 34 植栽 ---------- */
  const tree = (x = 200, extra = '') => `<rect x="20" y="170" width="360" height="60" class="gd-soil"/>` + `<path d="M${x - 40} 170 Q${x} 230 ${x + 40} 170" class="gd-topsoil"/>` +
    line(x, 170, x, 80, 'gd-trunk') + `<circle cx="${x}" cy="70" r="40" class="gd-leaf"/>` + extra;
  const G34 = {
    0: g(svg(tree() + t(320, 200, '客土＋肥料', 'gd-r')), '喬木植穴換客土並拌入肥料，植穴大小依規範（約根球 1.5～2 倍）。', 'Hố trồng cây thân gỗ thay đất mới trộn phân, kích thước hố theo quy phạm (khoảng 1,5–2 lần bầu rễ).'),
    1: g(svg(tree() + line(200, 230, 200, 240, 'gd-axis') + t(320, 120, '位置依圖', 'gd-r')), '種植位置依植栽配置圖放樣。', 'Vị trí trồng định vị theo bản vẽ bố trí cây.'),
    2: g(svg(tree(200, line(150, 170, 200, 110, 'gd-stake') + line(250, 170, 200, 110, 'gd-stake') + line(160, 170, 160, 110, 'gd-stake')) + t(320, 120, '支柱固定', 'gd-r')), '設支柱（三腳或四腳）固定樹幹，綁縛處加墊材避免磨傷樹皮。', 'Dựng cọc chống (ba hoặc bốn chân) cố định thân cây, chỗ buộc lót đệm tránh trầy vỏ.'),
    3: g(svg(tree(200, `<path d="M300 40 l0 30" class="gd-water-l"/>`) + t(320, 110, '定植後澆水養護', 'gd-r')), '定植後充分澆水，依養護計畫定期澆水、修剪、施肥。', 'Sau khi trồng tưới đẫm nước, định kỳ tưới, tỉa, bón phân theo kế hoạch chăm sóc.'),
    4: g(svg(`<rect x="20" y="150" width="360" height="80" class="gd-soil"/>` + line(20, 150, 380, 150, 'gd-floor') + t(200, 120, '整地：清除石塊、雜草，鬆土整平', 'gd-r')), '灌木種植前整地：清除石塊、雜草，鬆土整平。', 'Trước khi trồng cây bụi làm đất: dọn đá, cỏ dại, xới tơi san phẳng.'),
    5: g(svg(`<rect x="20" y="170" width="360" height="60" class="gd-soil"/>` + [80, 130, 180, 230, 280, 330].map(x => `<circle cx="${x}" cy="155" r="22" class="gd-leaf"/>`).join('') + t(200, 110, '位置、間距依圖', 'gd-r')), '灌木種植位置、株距依圖。', 'Vị trí, khoảng cách trồng cây bụi theo bản vẽ.'),
    6: g(svg(`<rect x="20" y="170" width="360" height="60" class="gd-soil"/>` + [100, 200, 300].map(x => `<circle cx="${x}" cy="155" r="22" class="gd-leaf"/>` + `<path d="M${x} 90 l0 30" class="gd-water-l"/>`).join('') + t(200, 70, '種植後充分澆水', 'gd-r')), '種植後充分澆水，之後依天氣定期澆水。', 'Sau khi trồng tưới đẫm, sau đó tưới định kỳ tùy thời tiết.'),
    7: g(svg(`<rect x="20" y="150" width="360" height="80" class="gd-soil"/>` + rect(20, 150, 360, 25, 'gd-topsoil-r') + t(200, 120, '客土＋肥料', 'gd-r')), '灌木區鋪客土並拌入肥料。', 'Khu cây bụi rải đất mới trộn phân.'),
    8: g(svg(`<rect x="20" y="150" width="360" height="80" class="gd-soil"/>` + t(200, 120, '草皮舖植前鬆土', 'gd-r')), '草皮舖植前先鬆土、整平。', 'Trước khi trải cỏ xới tơi, san phẳng đất.'),
    9: g(svg(`<rect x="20" y="160" width="360" height="70" class="gd-soil"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => rect(22 + i * 45, 148, 42, 12, 'gd-grass')).join('') + t(200, 120, '位置、範圍依圖，接縫密合', 'gd-r')), '草皮舖植位置、範圍依圖，塊與塊接縫密合。', 'Vị trí, phạm vi trải cỏ theo bản vẽ, mép các tấm khít nhau.'),
    10: g(svg(`<rect x="20" y="160" width="360" height="70" class="gd-soil"/>` + rect(20, 140, 360, 20, 'gd-topsoil-r') + t(200, 120, '客土＋肥料', 'gd-r')), '草皮下鋪客土並拌入肥料。', 'Dưới thảm cỏ rải đất mới trộn phân.'),
    11: g(cleanPic(), '完工後清除廢土、包材、垃圾，清潔乾淨。', 'Hoàn công dọn đất thừa, bao bì, rác, làm sạch.'),
  };

  /* ---------- 35 景觀照明 ---------- */
  const slabPipe = (extra = '') => svg(rect(20, 80, 360, 80, 'gd-con') + line(30, 100, 370, 100, 'gd-bar') + line(30, 140, 370, 140, 'gd-bar') + line(30, 120, 370, 120, 'gd-pipe-w-l') + extra);
  const G35 = {
    0: g(svg([['1/2"', 18], ['3/4"', 22], ['1"', 28], ['1¼"', 35], ['1½"', 41]].map(([n, d], i) => `<circle cx="${50 + i * 75}" cy="110" r="${d / 2}" class="gd-pipe-w"/>` + t(50 + i * 75, 160, n, 'gd-b') + t(50 + i * 75, 180, d + 'mm', 'gd-s')).join('') +
        t(200, 50, 'PVC 管規格（外徑）', 'gd-r')), '預埋 PVC 管規格依施工圖：1/2"=18mm、3/4"=22mm、1"=28mm、1¼"=35mm、1½"=41mm。', 'Quy cách ống PVC chôn sẵn theo bản vẽ: 1/2"=18mm, 3/4"=22mm, 1"=28mm, 1¼"=35mm, 1½"=41mm.'),
    1: g(docPlan('迴路、路徑'), '預埋暗管迴路與路徑依核定施工圖。', 'Mạch và tuyến ống âm theo bản vẽ thi công đã duyệt.'),
    2: g(slabPipe([80, 200, 320].map(x => dot(x, 120, 5, 'gd-tie')).join('') + dimH(80, 200, 60, '每 1.5～2m 固定')), '預埋管放在樓板兩層鋼筋中間，每 1.5～2m 綁紮固定一處。', 'Ống chôn đặt giữa hai lớp thép sàn, mỗi 1,5–2m buộc cố định một chỗ.'),
    3: g(svg(`<rect x="20" y="60" width="360" height="170" class="gd-soil"/>` + line(20, 60, 380, 60, 'gd-floor') + line(40, 140, 360, 140, 'gd-pipe-w-l') + dimV(200, 60, 140, '埋設深度依圖')), '預埋管施工深度依核定施工圖。', 'Độ sâu chôn ống theo bản vẽ thi công đã duyệt.'),
    4: g(pipeCap(), '配管和接線盒引出口要封閉。', 'Ống và miệng ra hộp nối phải bịt kín.'),
    5: g(svg(`<rect x="20" y="120" width="360" height="110" class="gd-soil"/>` + line(40, 170, 360, 170, 'gd-pipe-w-l') + ok(60, 80, '回填、澆置前清理配管零料') ), '回填土或澆灌混凝土前，現場配管和零料、材料要清理完成。', 'Trước khi lấp đất hoặc đổ bê tông, ống và vật tư lặt vặt tại hiện trường phải dọn xong.'),
    6: g(svg(rect(20, 120, 360, 60, 'gd-con') + rect(180, 100, 40, 20, 'gd-steel') + rect(188, 92, 24, 10, 'gd-cap') + t(200, 80, '用管塞、盒塞封口', 'gd-r') + t(200, 210, '防止異物、砂漿阻塞出口', 'gd-s')),
      '預埋管、接線盒出口用管塞、盒塞封口，防止異物和砂漿阻塞。', 'Miệng ống, hộp nối chôn sẵn bịt bằng nút ống, nút hộp, tránh tạp vật và vữa làm tắc.'),
    7: g(svg(`<rect x="20" y="150" width="360" height="80" class="gd-soil"/>` + rect(170, 120, 60, 30, 'gd-con') + line(200, 120, 200, 60, 'gd-pipe') + `<circle cx="200" cy="55" r="12" class="gd-lamp"/>` + t(300, 110, '燈座位置依圖', 'gd-r')),
      '燈具基礎座位置、高程依核定施工圖。', 'Vị trí, cao độ bệ móng đèn theo bản vẽ thi công đã duyệt.'),
    8: g(matPic('燈具樣品'), '燈具樣式、尺寸、色溫和選樣相符。', 'Kiểu dáng, kích thước, nhiệt độ màu đèn đúng mẫu đã chọn.'),
    9: g(checklist('運作測試', ['開關迴路對應正確', '定時、感應控制正常', '沒有閃爍、不亮']), '開燈測試：開關和燈具迴路連動正確，定時、感應控制正常。', 'Thử bật đèn: công tắc và mạch đèn liên động đúng, điều khiển hẹn giờ, cảm biến bình thường.'),
    10: g(cleanPic(), '完工後清潔乾淨。', 'Hoàn công làm sạch.'),
  };

  /* ---------- 36 接地系統 ---------- */
  const ground = (extra = '') => svg(`<rect x="20" y="60" width="360" height="170" class="gd-soil"/>` + rect(20, 60, 360, 30, 'gd-con') + t(40, 80, 'PC 層', 'gd-s', 'start') + extra);
  const G36 = {
    0: g(matPic('ψ3/4"、ψ5/8" 銅棒'), '接地銅棒規格（ψ3/4"、ψ5/8"）依合約，經進場材料查驗合格。', 'Quy cách cọc đồng tiếp địa (ψ3/4", ψ5/8") theo hợp đồng, đã nghiệm thu vật liệu đầu vào.'),
    1: g(ground([120, 280].map(x => line(x, 75, x, 220, 'gd-copper')).join('') + t(200, 40, '銅棒頂端在 PC 層內', 'gd-r')), '接地銅棒打入地下，頂端在 PC 層內。', 'Cọc đồng đóng xuống đất, đầu cọc nằm trong lớp PC.'),
    2: g(ground([120, 280].map(x => line(x, 75, x, 220, 'gd-copper')).join('') + line(120, 78, 280, 78, 'gd-copper-w') + t(200, 40, '連接銅線埋在 PC 層內', 'gd-r')), '連接各銅棒的銅線埋設在 PC 層內，不可碰觸建築物鋼筋、地下水電、瓦斯管。', 'Dây đồng nối các cọc chôn trong lớp PC, không được chạm thép công trình, ống điện nước, gas ngầm.'),
    3: g(ground(line(40, 70, 360, 70, 'gd-bar') + line(40, 82, 360, 82, 'gd-copper-w') + t(200, 40, '接地線不可直接接觸鋼筋', 'gd-ngt')), '接地線不可直接接觸鋼筋（避免雜散電流和量測失準）。', 'Dây tiếp địa không được chạm trực tiếp thép (tránh dòng rò và đo sai).'),
    4: g(ground(line(100, 75, 100, 220, 'gd-copper') + rect(280, 50, 30, 20, 'gd-steel') + dimH(100, 295, 120, '≧ 3m') + t(295, 40, '測試點', 'gd-s')), '接地極與測試點之間距 3m 以上。', 'Khoảng cách giữa cực tiếp địa và điểm đo từ 3m trở lên.'),
  };
  const ohm = (label, v) => g(svg(rect(130, 60, 140, 100, 'gd-steel') + t(200, 105, 'Ω', 'gd-big') + t(200, 140, '≦ ' + v + ' Ω', 'gd-r') + t(200, 200, label, 'gd-b')),
    `${label}接地電阻 ≦ ${v}Ω；用接地電阻計量測並記錄，不合格要增設接地極。`, `Điện trở tiếp địa ${label} ≦ ${v}Ω; đo bằng máy đo điện trở tiếp địa và ghi lại, không đạt phải thêm cực tiếp địa.`);
  Object.assign(G36, { 5: ohm('避雷系統', 10), 6: ohm('台電配電場所', 50), 7: ohm('系統與設備共同', 50), 8: ohm('發電機系統', 10), 9: ohm('電信室系統', 10) });

  /* ---------- 37 RC 水電配管 ---------- */
  const G37 = {
    0: g(svg(rect(40, 40, 320, 160, 'gd-paper') + [120, 280].map(x => rect(x - 12, 108, 24, 24, 'gd-steel')).join('') + dimH(120, 280, 90, '誤差 ≦ 10cm') + t(200, 225, 'BOX 依圖放樣', 'gd-r')),
      'BOX（接線盒）放樣位置和圖面誤差不大於 10cm。', 'Vị trí hộp nối (BOX) so với bản vẽ sai số không quá 10cm.'),
    1: g(svg(rect(60, 80, 60, 60, 'gd-steel') + t(90, 60, '✔ 端正牢固', 'gd-ok') + `<rect x="250" y="80" width="60" height="60" class="gd-steel" transform="rotate(15 280 110)"/>` + t(280, 60, '✘ 歪斜、鬆動', 'gd-ngt')),
      'BOX 要端正、綁紮牢固，不可歪斜或鬆動。', 'Hộp nối phải ngay ngắn, buộc chắc, không lệch hoặc lỏng.'),
    2: g(slabPipe(t(200, 60, '配管放在雙層筋中間', 'gd-r')), '樓板配管放在上下兩層鋼筋之間。', 'Ống trong sàn đặt giữa hai lớp thép trên dưới.'),
    3: g(svg(rect(20, 80, 360, 80, 'gd-con') + [105, 120, 135].map(y => line(150, y, 250, y, 'gd-pipe-w-l')).join('') + t(200, 60, '交叉：板厚 ≧15cm 最多 3 層、<15cm 最多 2 層', 'gd-r')),
      '樓板內配管交叉重疊：板厚 15cm 以上不超過 3 層、15cm 以下不超過 2 層。', 'Ống giao chồng trong sàn: sàn dày từ 15cm không quá 3 lớp, dưới 15cm không quá 2 lớp.'),
    4: g(svg([120, 200, 280].map(x => `<circle cx="${x}" cy="120" r="18" class="gd-pipe-w"/>`).join('') + dimH(138, 182, 90, '≧ 2 倍管徑')), '管與管之間的最小淨間隙為 2 倍管徑，混凝土才填得進去。', 'Khe hở thông thủy nhỏ nhất giữa các ống bằng 2 lần đường kính ống, bê tông mới lọt vào được.'),
    5: g(svg(rect(120, 30, 160, 200, 'gd-con') + `<circle cx="200" cy="130" r="16" class="gd-pipe-w"/>` + dimH(120, 184, 90, '≧ 3cm', -6) + t(200, 236, '牆內配管：保護層 3cm 以上', 'gd-r')),
      '牆配管外徑至少要有 3cm 以上的混凝土保護層。', 'Ống trong tường phải có lớp bê tông bảo vệ ít nhất 3cm tính từ mặt ngoài ống.'),
    6: g(pipeCap(), '管路出口都要封口，避免澆置時砂漿流入。', 'Miệng ống đều phải bịt, tránh vữa chảy vào khi đổ.'),
    7: g(svg(rect(20, 40, 50, 180, 'gd-con') + rect(70, 60, 310, 120, 'gd-con') + rect(70, 60, 120, 120, 'gd-zone') + t(130, 125, '離柱 2 倍梁深內不可穿', 'gd-r') +
        line(70, 100, 380, 100, 'gd-axis') + line(70, 140, 380, 140, 'gd-axis') + [250, 320].map(x => `<circle cx="${x}" cy="120" r="10" class="gd-pipe-w"/>`).join('') + t(290, 165, '梁中央 1/3 深度', 'gd-s') + dimH(250, 320, 50, '≧3 倍管徑')),
      ['穿梁位置：在梁深中央 1/3 範圍，各管相距 3 倍管徑以上。', '離柱 2 倍梁深範圍內不可穿管（受力最大的地方）；穿梁一律依結構圖或經結構技師同意。'],
      ['Vị trí xuyên dầm: trong khoảng 1/3 giữa chiều cao dầm, các ống cách nhau từ 3 lần đường kính.', 'Trong phạm vi 2 lần chiều cao dầm tính từ cột không được xuyên ống (chỗ chịu lực lớn nhất); xuyên dầm phải theo bản vẽ kết cấu hoặc được kỹ sư kết cấu đồng ý.']),
    8: g(svg(`<rect x="20" y="30" width="120" height="200" class="gd-soil"/>` + rect(140, 30, 60, 200, 'gd-con') + line(100, 120, 260, 120, 'gd-pipe-w-l') + rect(165, 105, 10, 30, 'gd-waterstop') + t(290, 225, '外牆穿管：止水環＋防水處理', 'gd-r')),
      '水電管穿越地下室外牆時，要用止水套管（止水環）並做防水處理。', 'Ống điện nước xuyên tường ngoài tầng hầm phải dùng ống lồng chống thấm (vành chặn nước) và xử lý chống thấm.'),
    9: g(svg(rect(120, 40, 160, 160, 'gd-con') + rect(134, 54, 132, 132, 'gd-hoop') + rect(140, 100, 24, 24, 'gd-steel') + line(152, 100, 152, 40, 'gd-pipe-w-l') + t(200, 225, '接線盒配管在箍筋內側', 'gd-r')),
      '柱邊接線盒的配管要位於柱箍筋內側，不可壓縮保護層。', 'Ống của hộp nối ở mép cột phải nằm phía trong đai cột, không được làm giảm lớp bảo vệ.'),
    10: g(svg(rect(160, 100, 60, 60, 'gd-steel') + line(60, 130, 150, 130, 'gd-pipe-w-l') + rect(146, 120, 14, 20, 'gd-cap') + t(150, 90, '盒接頭', 'gd-r')), 'PVC 管接到接線盒的管口要裝盒接頭，固定牢靠。', 'Miệng ống PVC nối vào hộp phải lắp đầu nối hộp, cố định chắc.'),
    11: g(svg(rect(120, 40, 160, 160, 'gd-con') + [180, 220].map(x => `<circle cx="${x}" cy="120" r="10" class="gd-pipe-w"/>`).join('') + t(200, 225, '管件面積 ≦ 柱斷面 4%，管徑 ≦ 5cm', 'gd-r')),
      '柱內埋管及配件所佔面積不超過柱設計斷面積的 4%，單管內徑不大於 5cm（2 吋）。', 'Diện tích ống và phụ kiện chôn trong cột không quá 4% tiết diện thiết kế cột, đường kính trong mỗi ống không quá 5cm (2 inch).'),
    12: g(matPic('鍍鋅 2.0mm／不銹鋼 1.2mm'), '出線盒材質與厚度：鍍鋅鐵製 2.0mm 以上、不銹鋼製 1.2mm 以上。', 'Chất liệu, chiều dày hộp ra dây: thép mạ kẽm từ 2,0mm, inox từ 1,2mm.'),
  };

  /* ---------- 43 給水管試壓 ---------- */
  const hanger = (extra = '') => svg(line(20, 30, 380, 30, 'gd-floor') + [90, 200, 310].map(x => line(x, 30, x, 110, 'gd-hanger') + `<path d="M${x - 14} 110 Q${x} 128 ${x + 14} 110" class="gd-clamp"/>`).join('') + line(30, 118, 370, 118, 'gd-pipe-w-l') + extra);
  const G43 = {
    0: g(matPic('給水管材'), '管材材質、管徑、廠牌依核定送審資料，看管身標示。', 'Chất liệu, đường kính, hãng ống theo hồ sơ đã duyệt, xem ký hiệu trên thân ống.'),
    1: g(docPlan('配管路徑'), '配管路徑依給水施工圖。', 'Tuyến ống theo bản vẽ thi công cấp nước.'),
    2: g(hanger(dimH(90, 200, 160, '間距依表')), '吊架、支架間距依表上填寫，固定牢靠。', 'Khoảng cách giá treo, giá đỡ theo phiếu, cố định chắc.'),
    3: g(svg(line(60, 120, 190, 120, 'gd-pipe-w-l') + line(210, 120, 340, 120, 'gd-pipe-w-l') + rect(180, 108, 40, 24, 'gd-steel') + t(200, 90, '接合確實、無鬆動、無滲漏', 'gd-r')), '接頭接合確實，沒有鬆動、滲漏。', 'Mối nối chắc chắn, không lỏng, không rò rỉ.'),
    4: g(svg(rect(150, 30, 100, 190, 'gd-con') + rect(150, 110, 100, 24, 'gd-hole') + line(100, 122, 300, 122, 'gd-pipe-w-l') + t(200, 236, '穿梁、穿牆預留套管', 'gd-r')), '穿梁、穿牆處預留套管，位置正確，不可事後打鑿。', 'Chỗ xuyên dầm, xuyên tường đặt sẵn ống lồng, đúng vị trí, không đục sau.'),
    5: g(svg(rect(170, 30, 60, 190, 'gd-con') + line(80, 125, 320, 125, 'gd-pipe-w-l') + rect(170, 112, 60, 26, 'gd-firestop') + t(200, 236, '穿越防火區劃：防火材料填塞', 'gd-r')), '管線穿越防火區劃處，周圍空隙以防火材料填塞。', 'Chỗ ống xuyên qua khu ngăn cháy, khe hở xung quanh chèn bằng vật liệu chống cháy.'),
    6: g(pipeCap(), '施工中管口封閉，防止異物進入。', 'Trong thi công bịt miệng ống, tránh tạp vật lọt vào.'),
    7: g(svg(rect(120, 60, 160, 100, 'gd-tile') + line(170, 160, 170, 220, 'gd-hot') + line(230, 160, 230, 220, 'gd-cold') + t(170, 236, '熱（左）', 'gd-r') + t(230, 236, '冷（右）', 'gd-w')),
      '冷熱水管位置依設計圖說，面對龍頭：左熱右冷。', 'Vị trí ống nóng lạnh theo bản vẽ, đứng đối diện vòi: trái nóng phải lạnh.'),
    8: g(svg(rect(40, 40, 320, 160, 'gd-paper') + t(200, 80, '① 混凝土澆置或封牆前：試壓', 'gd-r') + t(200, 130, '② 粉刷、貼磚前：再試壓一次', 'gd-r') + t(200, 180, '封起來前發現漏水才好修', 'gd-s')),
      '混凝土澆置或封牆前試壓；粉刷或貼磚前再試壓一次。', 'Thử áp trước khi đổ bê tông hoặc bít tường; trước khi trát hoặc ốp gạch thử lại một lần.'),
    9: g(svg(`<circle cx="200" cy="110" r="60" class="gd-gauge"/>` + line(200, 110, 240, 80, 'gd-red') + t(200, 200, '≧ 10 kg/cm²，保持 60 分鐘不降', 'gd-r') + t(200, 225, '記錄起始、終止壓力', 'gd-s')),
      '試壓壓力 ≧ 10 kg/cm²，保持 60 分鐘無滲漏、壓力不下降；記錄起始和終止壓力。', 'Áp lực thử ≧ 10 kg/cm², giữ 60 phút không rò, áp không giảm; ghi áp lực đầu và cuối.'),
    10: g(svg(`<circle cx="200" cy="100" r="50" class="gd-gauge"/>` + rect(260, 70, 90, 50, 'gd-sign') + t(305, 100, '校正標籤', 'gd-s') + t(200, 200, '壓力錶經校正且在有效期限內', 'gd-r')), '壓力錶要經校正，並在有效期限內（看校正標籤）。', 'Đồng hồ áp lực phải được hiệu chuẩn và còn hạn (xem nhãn hiệu chuẩn).'),
    11: g(svg(line(40, 120, 360, 120, 'gd-hot-w') + rect(40, 108, 320, 24, 'gd-insul') + rect(160, 90, 80, 18, 'gd-sign') + t(200, 104, '熱水 →', 'gd-r')), '熱水管保溫依設計圖說；管路標示用途和流向。', 'Ống nước nóng bọc cách nhiệt theo bản vẽ; đường ống ghi công dụng và hướng chảy.'),
  };

  /* ---------- 44 排水管試水 ---------- */
  const G44 = {
    0: g(matPic('排水管材'), '管材材質、管徑、廠牌依核定送審資料。', 'Chất liệu, đường kính, hãng ống theo hồ sơ đã duyệt.'),
    1: g(docPlan('配管路徑'), '配管路徑依排水施工圖。', 'Tuyến ống theo bản vẽ thi công thoát nước.'),
    2: g(svg(line(40, 80, 360, 140, 'gd-pipe-w-l') + line(40, 80, 360, 80, 'gd-axis') + dimV(370, 80, 140, '落差', 'left') + t(200, 190, '坡度 1/○ 依圖（例 1/50 = 每 1m 降 2cm）', 'gd-r')),
      '排水坡度依圖（例：1/50 就是每 1m 降 2cm），不可倒坡或水平。', 'Độ dốc thoát nước theo bản vẽ (ví dụ 1/50 là mỗi 1m hạ 2cm), không được dốc ngược hoặc nằm ngang.'),
    3: g(svg(`<path d="M120 40 L120 150 Q120 190 160 190 L200 190 Q240 190 240 150 L240 110 L320 110" class="gd-trap"/>` + rect(122, 150, 116, 38, 'gd-water-fill') + dimV(260, 110, 150, '5～10cm') + t(200, 225, '存水彎封水深度', 'gd-r')),
      '存水彎封水深度 5～10cm，可以擋住臭氣、蟲。', 'Độ sâu nước chặn của xi phông 5–10cm, ngăn được mùi hôi và côn trùng.'),
    4: g(svg(line(200, 230, 200, 20, 'gd-pipe-w-l') + line(120, 180, 200, 140, 'gd-pipe-w-l') + line(270, 20, 270, 120, 'gd-vent') + line(200, 120, 270, 120, 'gd-vent') + t(320, 70, '通氣管', 'gd-r')),
      '通氣管連接位置和管徑依設計圖說，讓排水順暢、不破封。', 'Vị trí nối và đường kính ống thông hơi theo bản vẽ, giúp thoát nước thông suốt, không phá nước chặn.'),
    5: g(svg(line(40, 120, 360, 120, 'gd-pipe-w-l') + rect(180, 96, 40, 24, 'gd-cap') + t(200, 80, '清潔口：位置依圖、方便清理', 'gd-r')), '清潔口位置依設計圖說，留在方便打開清理的地方，不可被封死。', 'Vị trí lỗ thông tắc theo bản vẽ, để chỗ dễ mở vệ sinh, không bị bít kín.'),
    6: g(hanger(dimH(90, 200, 160, '間距依表')), '吊架、支架間距依表上填寫，固定牢靠，維持坡度。', 'Khoảng cách giá treo, giá đỡ theo phiếu, cố định chắc, giữ độ dốc.'),
    7: g(svg(rect(20, 100, 360, 40, 'gd-con') + rect(185, 100, 30, 40, 'gd-hole') + line(200, 40, 200, 200, 'gd-pipe-w-l') + rect(170, 92, 60, 8, 'gd-waterproof') + t(300, 80, '套管＋周邊防水', 'gd-r')),
      '穿樓板處預留套管，周邊做防水處理（灌漿、防水收邊）。', 'Chỗ xuyên sàn đặt sẵn ống lồng, xung quanh xử lý chống thấm (đổ vữa, viền chống thấm).'),
    8: g(svg(rect(20, 120, 360, 40, 'gd-con') + rect(20, 112, 360, 8, 'gd-tile') + rect(180, 114, 40, 8, 'gd-steel') + t(200, 90, '落水頭略低於完成面', 'gd-r') + t(200, 200, '周邊防水收邊確實', 'gd-s')),
      '落水頭高程略低於完成面，地面坡度朝落水頭；周邊防水收邊確實。', 'Cao độ phễu thu thấp hơn mặt hoàn thiện một chút, sàn dốc về phễu; viền chống thấm xung quanh chắc chắn.'),
    9: g(svg(line(200, 220, 200, 40, 'gd-pipe-w-l') + rect(195, 60, 10, 160, 'gd-water-fill') + t(260, 60, '灌水至最高開口', 'gd-r', 'start') + t(260, 90, '保持 60 分鐘不下降', 'gd-r', 'start')),
      '滿水試驗：封住下端，灌水到最高開口，保持 60 分鐘水位不下降、無滲漏。', 'Thử đầy nước: bịt đầu dưới, đổ nước đến miệng cao nhất, giữ 60 phút mực nước không giảm, không rò.'),
    10: g(svg(line(40, 80, 360, 140, 'gd-pipe-w-l') + `<path d="M60 70 l40 8 M160 90 l40 8 M260 108 l40 8" class="gd-water-l"/>` + t(200, 190, '通水試驗：排水順暢、無阻塞、無倒灌', 'gd-r')),
      '通水試驗：從各器具放水，排水順暢，沒有阻塞或倒灌。', 'Thử thông nước: xả nước từ các thiết bị, thoát thông suốt, không tắc hoặc trào ngược.'),
    11: g(pipeCap(), '施工中管口封閉，防止異物、砂漿進入。', 'Trong thi công bịt miệng ống, tránh tạp vật, vữa lọt vào.'),
  };

  /* ---------- 45 配線及絕緣電阻 ---------- */
  const conduit = (extra = '') => svg(`<circle cx="200" cy="110" r="70" class="gd-pipe-w"/>` + extra);
  const G45 = {
    0: g(matPic('電線'), '電線線徑、材質、廠牌依核定送審資料，看線皮標示。', 'Tiết diện, chất liệu, hãng dây điện theo hồ sơ duyệt, xem ký hiệu trên vỏ dây.'),
    1: g(svg(line(40, 120, 360, 120, 'gd-pipe-w-l') + `<circle cx="120" cy="120" r="8" class="gd-sponge"/>` + t(200, 80, '穿線前：用通管器清管', 'gd-r') + t(200, 170, '管內無積水、雜物', 'gd-s')),
      '穿線前先用通管器（拉海綿）清管，管內沒有積水、雜物。', 'Trước khi kéo dây dùng dụng cụ thông ống (kéo bọt biển) làm sạch, trong ống không đọng nước, tạp vật.'),
    2: g(conduit([[180, 95], [220, 95], [200, 125], [170, 130], [230, 130]].map(([x, y]) => dot(x, y, 14, 'gd-wire')).join('') + t(200, 215, '導線總截面積 ≦ 管截面積 40%', 'gd-r')),
      '同一管內導線總截面積不超過管截面積的 40%（3 條以上），太滿會過熱、拉線刮傷。', 'Tổng tiết diện dây trong một ống không quá 40% tiết diện ống (từ 3 dây), quá đầy sẽ nóng, kéo dây bị trầy.'),
    3: g(svg(line(40, 120, 250, 120, 'gd-pipe-w-l') + rect(250, 90, 80, 60, 'gd-steel') + `<circle cx="290" cy="120" r="10" class="gd-wire"/>` + t(290, 80, '接頭在出線盒內', 'gd-ok') + t(140, 100, '✘ 管內接頭', 'gd-ngt')),
      '管內不可有接頭，接頭一律在出線盒（接線盒）內。', 'Trong ống không được có mối nối, mối nối phải ở trong hộp ra dây (hộp nối).'),
    4: g(svg([['接地線', 'gd-w-green', '綠'], ['中性線', 'gd-w-white', '白／灰'], ['火線', 'gd-w-black', '黑／紅']].map(([n, c, s], i) => line(60, 70 + i * 50, 240, 70 + i * 50, c) + t(260, 75 + i * 50, `${n}：${s}`, 'gd-b', 'start')).join('')),
      '線色區分：接地線綠色，中性線白色或灰色，火線用其他顏色。', 'Phân biệt màu dây: dây tiếp địa màu xanh lá, dây trung tính trắng hoặc xám, dây pha dùng màu khác.'),
    5: g(svg(rect(140, 60, 120, 120, 'gd-steel') + line(200, 180, 200, 230, 'gd-w-green') + t(200, 50, '接地線依圖連接確實', 'gd-r')), '接地線依設計圖連接到接地端子，鎖緊確實。', 'Dây tiếp địa nối vào đầu cực tiếp địa theo bản vẽ, siết chặt chắc chắn.'),
    6: g(svg(rect(100, 30, 200, 190, 'gd-steel') + [60, 100, 140, 180].map((y, i) => rect(130, y, 60, 24, 'gd-paper') + t(240, y + 17, `迴路 ${i + 1}`, 'gd-b')).join('') + t(200, 236, '迴路編號與單線圖一致', 'gd-r')),
      '配電盤迴路編號、標示和單線圖一致。', 'Số mạch, nhãn tủ điện khớp với sơ đồ một sợi.'),
    7: g(svg(rect(130, 50, 140, 120, 'gd-steel') + rect(170, 80, 60, 50, 'gd-paper') + t(200, 110, 'ELB', 'gd-b') + t(200, 200, '浴室、潮濕場所依規定裝漏電斷路器', 'gd-r')),
      '浴室、廚房、陽台等潮濕場所的插座迴路，依規定裝設漏電斷路器，按測試鈕確認會跳脫。', 'Mạch ổ cắm khu ẩm ướt như nhà tắm, bếp, ban công lắp aptomat chống rò theo quy định, bấm nút thử xác nhận nhảy.'),
    8: g(svg(rect(60, 20, 280, 200, 'gd-wall') + line(40, 220, 360, 220, 'gd-floor') + rect(120, 160, 30, 30, 'gd-steel') + rect(250, 90, 30, 40, 'gd-steel') + dimV(100, 175, 220, '插座高') + dimV(300, 110, 220, '開關高')),
      '開關、插座安裝高度與位置依設計圖說。', 'Chiều cao, vị trí lắp công tắc, ổ cắm theo bản vẽ thiết kế.'),
    9: g(svg(rect(130, 50, 140, 110, 'gd-steel') + t(200, 100, '500V', 'gd-b') + t(200, 130, 'MΩ', 'gd-r') + rect(280, 60, 80, 40, 'gd-sign') + t(320, 85, '校正標籤', 'gd-s') + t(200, 200, '500V 高阻計，經校正、在有效期限內', 'gd-r')),
      '絕緣電阻測試用 500V 高阻計，經校正並在有效期限內。', 'Đo điện trở cách điện bằng megomet 500V, đã hiệu chuẩn và còn hạn.'),
    10: g(svg(rect(40, 30, 320, 180, 'gd-paper') + t(200, 60, '絕緣電阻（依表上規定）', 'gd-b') + t(60, 100, '對地 150V 以下', 'gd-s', 'start') + t(340, 100, '≧ 0.1 MΩ', 'gd-r', 'end') +
        t(60, 135, '對地 151～300V', 'gd-s', 'start') + t(340, 135, '≧ 0.2 MΩ', 'gd-r', 'end') + t(60, 170, '300V 以上', 'gd-s', 'start') + t(340, 170, '≧ 0.4 MΩ', 'gd-r', 'end')),
      ['絕緣電阻值：對地 150V 以下 ≧ 0.1MΩ、151～300V ≧ 0.2MΩ、300V 以上 ≧ 0.4MΩ（依表上規定）。', '法規的電壓分級可能和表上不同，實際以現行《用戶用電設備裝置規則》條文為準。'],
      ['Điện trở cách điện: điện áp với đất dưới 150V ≧ 0,1MΩ, 151–300V ≧ 0,2MΩ, trên 300V ≧ 0,4MΩ (theo phiếu).', 'Cấp điện áp trong quy định có thể khác phiếu, thực tế theo điều văn hiện hành của Quy tắc lắp đặt thiết bị điện.']),
    11: g(svg(rect(60, 20, 280, 200, 'gd-paper') + t(200, 44, '測試紀錄', 'gd-b') + [80, 110, 140, 170].map((y, i) => t(80, y, `迴路 ${i + 1}`, 'gd-s', 'start') + t(320, y, '____ MΩ', 'gd-r', 'end')).join('')),
      '逐迴路量測並記錄實測值（MΩ），紀錄附在表上。', 'Đo và ghi giá trị thực đo (MΩ) từng mạch, biên bản đính kèm phiếu.'),
  };

  Object.assign(window.SK_GUIDES, { '28': G28, '29': G29, '30': G30, '31': G31, '34': G34, '35': G35, '36': G36, '37': G37, '43': G43, '44': G44, '45': G45 });
})();
