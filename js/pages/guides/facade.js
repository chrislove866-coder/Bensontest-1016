/*! © 2026 周柏駪 版權所有 All rights reserved. 未經書面同意，不得重製、改作或散布。 */
/**
 * 看圖說：門窗、外牆與金屬（13 鋁格柵、18 清玻璃、26 門扇門樘、27 帷幕牆、32 不銹鋼扶手欄杆、33 不銹鋼爬梯）
 * 畫圖工具來自 self-check-guides.js 的 window.SK_GD
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok } = window.SK_GD;
  const g = (s, zh, vi) => ({ svg: s, zh: [].concat(zh), vi: [].concat(vi) });

  const matPic = (label) => svg(rect(40, 40, 120, 150, 'gd-paper') + t(100, 32, '送審資料／圖說', 'gd-b') + [70, 95, 120, 145].map(y => line(55, y, 145, y, 'gd-axis')).join('') +
    t(200, 115, '⇄', 'gd-big') + rect(240, 70, 120, 90, 'gd-plank2') + t(300, 62, '現場材料', 'gd-b') + t(300, 120, label, 'gd-s') + t(200, 220, '規格、尺寸、廠牌和送審一致', 'gd-r'));
  const lookPic = (good, bad, marks = '') => svg(rect(30, 50, 150, 130, 'gd-glass') + rect(220, 50, 150, 130, 'gd-glass') + marks + t(105, 40, '✔ ' + good, 'gd-ok') + t(295, 40, '✘ ' + bad, 'gd-ngt'));
  const stain = [[250, 90], [300, 140], [330, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" class="gd-stain"/>`).join('');
  const crack = `<path d="M240 70 L270 110 L260 140 L300 170" class="gd-crack"/>`;
  const cleanPic = () => lookPic('清潔完成', '污漬、殘膠', stain);
  const plumb = (x, label) => line(x, 20, x, 210, 'gd-laser') + dot(x, 214, 6, 'gd-tie') + t(x, 232, label, 'gd-s');
  const sealant = (x, y, h) => rect(x, y, 8, h, 'gd-sealant');

  /* ---------- 13 造型鋁格柵 ---------- */
  const louver = (extra = '') => svg(line(20, 30, 380, 30, 'gd-floor') + line(20, 215, 380, 215, 'gd-floor') +
    [60, 120, 180, 240, 300, 360].map(x => rect(x - 6, 30, 12, 185, 'gd-alu')).join('') + extra);
  const G13 = {
    0: g(svg(rect(40, 150, 320, 70, 'gd-paper') + rect(80, 120, 60, 30, 'gd-plank') + rect(240, 120, 60, 30, 'gd-plank') + t(200, 100, '清除地面雜物、準備支撐架', 'gd-r') + t(200, 195, '材料放在墊木上，不可損傷', 'gd-s')),
      '安裝前整理地面雜物、準備支撐架，材料放在墊木上，避免刮傷、壓傷。', 'Trước khi lắp dọn tạp vật mặt bằng, chuẩn bị giá đỡ, vật liệu đặt trên gỗ kê, tránh trầy xước, móp.'),
    1: g(svg(rect(40, 150, 320, 70, 'gd-con') + [100, 200, 300].map(x => rect(x - 20, 134, 40, 16, 'gd-steel') + line(x - 10, 134, x - 10, 175, 'gd-bolt-l') + line(x + 10, 134, x + 10, 175, 'gd-bolt-l')).join('') +
        line(60, 128, 340, 128, 'gd-mark') + t(200, 110, '相鄰基礎面高程差 ≦ 3mm', 'gd-r') + t(200, 40, '依施工圖座標放樣、定位基礎螺栓', 'gd-b')),
      '依施工圖座標放樣，定位基礎螺栓；相鄰兩個基礎面的高程差在 3mm 以下。', 'Định vị theo tọa độ bản vẽ thi công, cố định bu lông móng; chênh cao độ hai mặt móng liền kề từ 3mm trở xuống.'),
    2: g(svg(rect(60, 140, 280, 20, 'gd-steel') + [100, 160, 220, 280].map(x => line(x, 140, x, 100, 'gd-stud-pin') + rect(x - 6, 96, 12, 6, 'gd-steel')).join('') +
        dimH(100, 160, 80, '@300mm') + t(200, 200, '剪力釘 3-19ψ×100、1 排（依表）', 'gd-r')),
      '剪力釘規格、數量、間距依表（例：3-19ψ×100、1 排 @300mm），銲接牢固。', 'Quy cách, số lượng, khoảng cách đinh chống cắt theo phiếu (ví dụ: 3-19ψ×100, 1 hàng @300mm), hàn chắc chắn.'),
    3: g(louver(dimH(120, 180, 22, '@1500mm（依表）')), '豎向格柵間距依表（例：@1500mm），用捲尺量並對齊。', 'Khoảng cách lam đứng theo phiếu (ví dụ @1500mm), đo bằng thước và căn thẳng hàng.'),
    4: g(svg(rect(100, 100, 200, 30, 'gd-alu') + rect(100, 94, 200, 6, 'gd-coat') + dimV(310, 94, 100, '30μ ±3μ') + t(200, 170, '用膜厚計量塗裝膜厚', 'gd-s')),
      '鋁料塗裝膜厚依表（例：30μ ±3μ），用膜厚計抽量。', 'Chiều dày lớp phủ nhôm theo phiếu (ví dụ 30μ ±3μ), đo kiểm bằng máy đo chiều dày.'),
    5: g(louver(t(200, 120, '固定牢固、搖動不晃', 'gd-r')), '製品安裝牢固安全，用手推拉不可晃動；螺栓全部鎖緊。', 'Sản phẩm lắp chắc chắn an toàn, đẩy kéo bằng tay không lung lay; siết chặt tất cả bu lông.'),
    6: g(cleanPic(), '完成後立即清理表面，刮傷處補漆。', 'Xong phải làm sạch bề mặt ngay, chỗ trầy xước sơn dặm lại.'),
  };

  /* ---------- 18 清玻璃 ---------- */
  const frame = (extra = '') => svg(rect(80, 30, 240, 190, 'gd-alu') + rect(92, 42, 216, 166, 'gd-glass') + extra);
  const G18 = {
    0: g(frame(dimH(92, 308, 22, '寬') + dimV(330, 42, 208, '高')), '玻璃尺寸依設計圖說，量框內尺寸並扣除間隙。', 'Kích thước kính theo bản vẽ thiết kế, đo kích thước trong khung và trừ khe hở.'),
    1: g(lookPic('無氣泡', '明顯氣泡', [[260, 90], [300, 130], [330, 100]].map(([x, y]) => dot(x, y, 5, 'gd-bubble-d')).join('')), '玻璃不可有明顯氣泡、雜質。', 'Kính không được có bọt khí, tạp chất rõ.'),
    2: g(svg(rect(180, 60, 20, 120, 'gd-glass') + dimH(180, 200, 50, '厚度') + t(200, 210, '用卡尺量，依設計圖說', 'gd-s')), '玻璃厚度依設計圖說，用卡尺抽量。', 'Chiều dày kính theo bản vẽ thiết kế, đo kiểm bằng thước kẹp.'),
    3: g(matPic('顏色樣品'), '玻璃顏色依設計圖說與核定樣品。', 'Màu kính theo bản vẽ thiết kế và mẫu đã duyệt.'),
    4: g(svg(rect(120, 60, 16, 120, 'gd-glass') + t(128, 200, '單片', 'gd-s') + rect(240, 60, 10, 120, 'gd-glass') + rect(250, 60, 3, 120, 'gd-pvb') + rect(253, 60, 10, 120, 'gd-glass') + t(252, 200, '膠合', 'gd-s')),
      '玻璃組合（單片或膠合）依設計圖說；膠合玻璃看邊緣有沒有中間膜。', 'Tổ hợp kính (đơn hay dán) theo bản vẽ; kính dán xem mép có lớp phim giữa không.'),
    5: g(matPic('透光率 89～91%'), '可視光透光率 89％～91％，核對產品試驗報告。', 'Độ truyền sáng khả kiến 89%–91%, đối chiếu báo cáo thí nghiệm sản phẩm.'),
    6: g(frame(rect(140, 200, 30, 8, 'gd-setting') + rect(230, 200, 30, 8, 'gd-setting') + dimH(92, 155, 228, '1/4 長', -6) + t(200, 120, '墊塊放在底部 1/4 長度位置', 'gd-r')),
      '氯丁橡膠墊塊放在玻璃底部、距兩端各約 1/4 長度的位置。', 'Đệm cao su chloroprene đặt ở đáy kính, cách hai đầu khoảng 1/4 chiều dài.'),
    7: g(svg(rect(80, 80, 240, 100, 'gd-alu') + rect(100, 90, 200, 70, 'gd-glass') + rect(130, 160, 30, 12, 'gd-setting') + dimV(330, 160, 172, '≧1.5mm', 'left') + t(200, 210, '玻璃不可直接碰到框', 'gd-r')),
      '墊塊讓玻璃和框架之間保持至少 1.5mm 間隙，玻璃不可直接碰到金屬框。', 'Đệm giữ khe hở giữa kính và khung ít nhất 1,5mm, kính không được chạm trực tiếp khung kim loại.'),
    8: g(svg(rect(100, 60, 200, 120, 'gd-paper') + t(200, 100, '氣溫 > 5℃', 'gd-r') + t(200, 135, '安裝後 24 小時不下雨', 'gd-r') + t(200, 210, '打膠前看天氣預報', 'gd-s')),
      '施工時氣溫要高於 5℃，且預測安裝前 24 小時內不下雨（打膠才會固化良好）。', 'Khi thi công nhiệt độ phải trên 5℃, và dự báo 24 giờ trước khi lắp không mưa (keo mới đóng rắn tốt).'),
    9: g(lookPic('平整透明', '斑點、扭曲、波紋', `<path d="M230 90 Q260 80 290 90 T350 90 M230 130 Q260 120 290 130 T350 130" class="gd-brush"/>` + stain), '玻璃有明顯損耗斑點、扭曲、波紋時要換新。', 'Kính có đốm hư hại, méo, gợn sóng rõ thì phải thay mới.'),
    10: g(cleanPic(), '驗收前徹底清除污漬、油漆、粉刷殘渣，擦拭乾淨。', 'Trước nghiệm thu làm sạch hoàn toàn vết bẩn, sơn, vữa bám, lau sạch.'),
  };

  /* ---------- 26 門扇及門樘 ---------- */
  const door = (extra = '') => svg(rect(60, 20, 280, 200, 'gd-wall') + rect(140, 50, 120, 170, 'gd-door-frame') + rect(150, 60, 100, 160, 'gd-door') + line(40, 220, 360, 220, 'gd-floor') + extra);
  const G26 = {
    0: g(door(dimH(140, 260, 40, '開口寬') + dimV(280, 50, 220, '開口高')), '核對建築與結構圖，確認開口尺寸和門窗表相符。', 'Đối chiếu bản vẽ kiến trúc và kết cấu, xác nhận kích thước lỗ cửa đúng bảng cửa.'),
    1: g(door(t(200, 140, '門框、門扇尺寸和門窗表相符', 'gd-r')), '門框、門扇尺寸、開啟方向、五金和門窗表相符。', 'Kích thước khung cửa, cánh cửa, hướng mở, phụ kiện đúng bảng cửa.'),
    2: g(door(`<ellipse cx="180" cy="160" rx="16" ry="8" class="gd-stain"/>` + t(200, 110, '沾到灰漿趁未乾擦掉', 'gd-r')), '門框若沾上灰漿，要在未乾前擦掉，乾了會傷到表面。', 'Khung cửa dính vữa phải lau khi chưa khô, khô rồi sẽ làm hỏng bề mặt.'),
    3: g(door(plumb(120, '吊線') + t(200, 140, '垂直方整、排列整齊', 'gd-r')), '門樘安裝垂直、方正（量對角線），整排門要對齊。', 'Khung cửa lắp thẳng đứng, vuông (đo đường chéo), cả dãy cửa phải thẳng hàng.'),
    4: g(door(rect(132, 50, 8, 170, 'gd-mortar') + rect(260, 50, 8, 170, 'gd-mortar') + t(200, 140, '填塞砂漿：不可過度擠壓', 'gd-r')),
      '鋼門框四周填塞水泥砂漿要飽滿，但不可過度用力擠壓，避免門框變形。', 'Nhét vữa xi măng xung quanh khung cửa thép phải đầy, nhưng không ép quá mạnh, tránh khung biến dạng.'),
    5: g(door(sealant(132, 50, 170) + sealant(260, 50, 170) + t(200, 140, '淺溝打矽利康：平整無破損', 'gd-r')), '門框四周淺溝打矽利康，表面平整、連續、沒有破損。', 'Rãnh nông xung quanh khung bơm silicone, bề mặt phẳng, liên tục, không rách.'),
  };

  /* ---------- 27 帷幕牆 ---------- */
  const cw = (extra = '') => svg([60, 160, 260, 360].map(x => rect(x - 5, 20, 10, 200, 'gd-alu')).join('') + [20, 120, 220].map(y => rect(55, y - 4, 310, 8, 'gd-alu')).join('') +
    [[65, 24], [165, 24], [265, 24], [65, 124], [165, 124], [265, 124]].map(([x, y]) => rect(x, y, 90, 92, 'gd-glass')).join('') + extra);
  const G27 = {
    0: g(matPic('鋁骨料'), '鋁骨料的材質、型號依送審資料，進場核對標示和證明。', 'Chất liệu, mã nhôm khung theo hồ sơ duyệt, khi nhập đối chiếu ký hiệu và chứng chỉ.'),
    1: g(svg(`<path d="M150 60 h100 v20 h-40 v80 h40 v20 h-100 v-20 h40 v-80 h-40 Z" class="gd-alu"/>` + dimH(150, 250, 50, '寬') + dimV(265, 60, 180, '深') + t(200, 215, '用卡尺量斷面與壁厚', 'gd-s')),
      '鋁料斷面尺寸、壁厚依圖，用卡尺抽量。', 'Kích thước tiết diện, chiều dày thành nhôm theo bản vẽ, đo kiểm bằng thước kẹp.'),
    2: g(svg(rect(40, 120, 320, 100, 'gd-con') + rect(150, 104, 100, 16, 'gd-steel') + line(170, 120, 170, 180, 'gd-bolt-l') + line(230, 120, 230, 180, 'gd-bolt-l') + t(200, 80, '預埋鐵件型式依圖', 'gd-r')),
      '預埋鐵件（或後置固定件）的型式、尺寸、錨栓依施工圖。', 'Loại, kích thước, bu lông neo của bản mã chôn sẵn (hoặc chi tiết cố định sau) theo bản vẽ thi công.'),
    3: g(svg(line(40, 120, 360, 120, 'gd-axis') + [100, 200, 300].map(x => rect(x - 20, 110, 40, 20, 'gd-steel')).join('') + t(200, 80, '位置依施工圖放樣，誤差在容許範圍', 'gd-r')),
      '預埋件施作位置依施工圖放樣，澆置前確認，誤差過大會影響帷幕安裝。', 'Vị trí chi tiết chôn sẵn định vị theo bản vẽ, xác nhận trước khi đổ, sai số lớn ảnh hưởng lắp vách kính.'),
    4: g(cw(plumb(160, '吊線')), '鋁直料垂直度用吊線或雷射檢查，誤差依規範。', 'Độ thẳng đứng thanh nhôm đứng kiểm tra bằng dây dọi hoặc laser, sai số theo quy phạm.'),
    5: g(cw(line(40, 120, 380, 120, 'gd-laser') + t(200, 112, '橫料水平', 'gd-r')), '橫料水平度用水準儀或雷射檢查，整排對齊。', 'Độ ngang thanh nhôm ngang kiểm tra bằng máy thủy bình hoặc laser, cả dãy thẳng hàng.'),
    6: g(svg(rect(150, 40, 20, 180, 'gd-alu') + rect(170, 100, 60, 40, 'gd-steel') + dot(200, 110, 5, 'gd-bolt') + dot(200, 130, 5, 'gd-bolt') + t(240, 160, '螺絲規格、數量、鎖緊', 'gd-r', 'start')),
      '固定螺絲規格、數量依圖，全部鎖緊；不同金屬接觸處加絕緣墊片防止電蝕。', 'Quy cách, số lượng vít cố định theo bản vẽ, siết chặt hết; chỗ kim loại khác nhau tiếp xúc thêm đệm cách điện chống ăn mòn điện hóa.'),
    7: g(lookPic('完整', '破裂、缺角', crack), '安裝前後檢查玻璃完整，沒有破裂、缺角、刮傷。', 'Trước và sau khi lắp kiểm tra kính nguyên vẹn, không nứt, mẻ, trầy.'),
    8: g(cw(sealant(155, 24, 92) + t(200, 230, '矽利康連續、飽滿、無氣泡', 'gd-r')), '玻璃周邊矽利康要連續、飽滿、沒有氣泡和斷點，寬度一致。', 'Silicone xung quanh kính phải liên tục, đầy, không bọt khí và chỗ đứt, độ rộng đều.'),
    9: g(cw(t(200, 230, '保護膜在完工清洗時剔除', 'gd-r')), '完工清洗時把鋁料、玻璃上的保護膜剔除乾淨，不可留殘膠。', 'Khi vệ sinh hoàn công bóc sạch màng bảo vệ trên nhôm, kính, không để sót keo.'),
    10: g(cleanPic(), '完工清洗帷幕牆表面，不可用刮傷表面的工具或強酸鹼清潔劑。', 'Vệ sinh mặt vách kính khi hoàn công, không dùng dụng cụ làm trầy hoặc chất tẩy axit, kiềm mạnh.'),
  };

  /* ---------- 32 不銹鋼扶手欄杆 ---------- */
  const rail = (extra = '') => svg(line(20, 215, 380, 215, 'gd-floor') + [70, 190, 310].map(x => rect(x - 4, 60, 8, 155, 'gd-sus')).join('') + line(50, 60, 330, 60, 'gd-sus-l') +
    [90, 110, 130, 150, 170].map(x => line(x, 64, x, 212, 'gd-sus-thin')).join('') + extra);
  const G32 = {
    0: g(rail(dimH(70, 190, 40, '@120cm')), '支柱規格（例：50mm × 6mm）、間距（例：@120cm）依表與圖。', 'Quy cách cột (ví dụ 50mm × 6mm), khoảng cách (ví dụ @120cm) theo phiếu và bản vẽ.'),
    1: g(rail(dimH(110, 130, 230, '@18cm', -6)), '扶手管徑、方管規格依表；欄杆間距依表（例：@18cm）。', 'Đường kính tay vịn, quy cách ống hộp theo phiếu; khoảng cách song chắn theo phiếu (ví dụ @18cm).'),
    2: g(svg(rect(40, 140, 320, 80, 'gd-con') + rect(160, 130, 80, 10, 'gd-steel') + rect(196, 40, 8, 90, 'gd-sus') + t(200, 120, '預埋 T 型鋼板', 'gd-r') + t(200, 235, '支柱銲在預埋鋼板上', 'gd-s')),
      '支柱固定在預埋 T 型鋼板上（依表：5cm × 0.5cm），銲接牢固。', 'Cột cố định trên bản thép chữ T chôn sẵn (theo phiếu: 5cm × 0,5cm), hàn chắc chắn.'),
    3: g(rail(dimV(350, 60, 215, '扶手高 H')), ['扶手離地高度依圖（80、90、120cm）。', '陽臺、室外走廊、屋頂等臨空處的欄杆，依建築技術規則不得低於 1.10m（10 層以上 1.20m），欄杆空隙不可讓直徑 10cm 的物體穿過。'],
      ['Chiều cao tay vịn so với sàn theo bản vẽ (80, 90, 120cm).', 'Lan can chỗ hở như ban công, hành lang ngoài, mái, theo quy chuẩn xây dựng không thấp hơn 1,10m (từ tầng 10 trở lên 1,20m), khe song chắn không cho vật đường kính 10cm lọt qua.']),
    4: g(svg(line(20, 215, 380, 215, 'gd-floor') + rect(60, 40, 280, 10, 'gd-wall') + line(60, 90, 340, 90, 'gd-sus-l') + line(60, 130, 340, 130, 'gd-sus-l') +
        dimV(355, 90, 215, '85cm') + dimV(320, 130, 215, '65cm') + t(200, 80, '無障礙：上下兩道扶手', 'gd-r')),
      '無障礙扶手高度依表（65cm、85cm 上下兩道），依建築物無障礙設施設計規範。', 'Chiều cao tay vịn không rào cản theo phiếu (65cm, 85cm hai tầng), theo quy phạm thiết kế không rào cản.'),
    5: g(rail(t(200, 40, '用力推拉不可晃動', 'gd-r')), '欄杆扶手安裝穩固，用力推拉不可晃動。', 'Lan can tay vịn lắp chắc chắn, đẩy kéo mạnh không lung lay.'),
    6: g(svg(rect(100, 100, 80, 20, 'gd-sus') + rect(220, 100, 80, 20, 'gd-sus') + `<path d="M180 100 L220 100 L220 120 L180 120 Z" class="gd-weld-smooth"/>` + t(200, 80, '焊接處磨平、拋光', 'gd-r')),
      '焊接處要磨平、拋光，不可有焊渣、毛邊刮手。', 'Mối hàn phải mài phẳng, đánh bóng, không có xỉ hàn, bavia cứa tay.'),
  };

  /* ---------- 33 不銹鋼爬梯 ---------- */
  const ladder = (extra = '') => svg(rect(20, 20, 60, 210, 'gd-wall') + line(140, 20, 140, 220, 'gd-sus-l') + line(260, 20, 260, 220, 'gd-sus-l') +
    [40, 80, 120, 160, 200].map(y => line(140, y, 260, y, 'gd-sus-l')).join('') + [60, 180].map(y => line(80, y, 140, y, 'gd-sus')).join('') + extra);
  const G33 = {
    0: g(ladder(t(200, 236, '垂直管 2"ψ × 3mm（依圖）', 'gd-r')), '垂直鋼管直徑、壁厚依圖（表上例：2"ψ × 3mm）。', 'Đường kính, chiều dày ống đứng theo bản vẽ (ví dụ trên phiếu: 2"ψ × 3mm).'),
    1: g(ladder(t(200, 236, '踏棍 1½"ψ × 3mm（依圖）', 'gd-r')), '水平踏棍直徑、壁厚依圖（表上例：1½"ψ × 3mm）。', 'Đường kính, chiều dày thanh bậc ngang theo bản vẽ (ví dụ trên phiếu: 1½"ψ × 3mm).'),
    2: g(ladder(dimV(290, 80, 120, '@30cm')), '踏棍間距依表（例：@30cm），每一階要一樣。', 'Khoảng cách thanh bậc theo phiếu (ví dụ @30cm), các bậc phải bằng nhau.'),
    3: g(ladder(t(200, 236, '與牆固定牢靠', 'gd-r')), '爬梯和牆的固定件牢靠，用力搖不可晃動。', 'Chi tiết cố định thang vào tường chắc chắn, lắc mạnh không lung lay.'),
    4: g(svg(rect(100, 100, 80, 20, 'gd-sus') + rect(220, 100, 80, 20, 'gd-sus') + `<path d="M180 100 L220 100 L220 120 L180 120 Z" class="gd-weld-smooth"/>` + t(200, 80, '焊接處磨平', 'gd-r')),
      '焊接處磨平，不可有焊渣、毛邊。', 'Mối hàn mài phẳng, không có xỉ hàn, bavia.'),
  };

  Object.assign(window.SK_GUIDES, { '13': G13, '18': G18, '26': G26, '27': G27, '32': G32, '33': G33 });
})();
