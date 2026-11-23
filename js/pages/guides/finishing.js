/**
 * 看圖說：裝修類（15 天花板、16／17 輕隔間、19 抿石子、20 磁磚、21 高壓磚、22 踢腳板、24 水泥粉刷、25 油漆）
 * 外觀、材料類項目多用共用小圖；畫圖工具來自 self-check-guides.js 的 window.SK_GD
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok, ng } = window.SK_GD;
  const g = (s, zh, vi) => ({ svg: s, zh: [].concat(zh), vi: [].concat(vi) });

  /* ---------- 共用小圖 ---------- */
  // 送審資料 ⇄ 現場材料
  const matPic = (label) => svg(rect(40, 40, 120, 150, 'gd-paper') + t(100, 32, '送審資料／型錄', 'gd-b') + [70, 95, 120, 145].map(y => line(55, y, 145, y, 'gd-axis')).join('') +
    t(200, 115, '⇄', 'gd-big') + rect(240, 70, 120, 90, 'gd-plank2') + t(300, 62, '現場材料', 'gd-b') + t(300, 120, label, 'gd-s') +
    t(200, 220, '規格、廠牌、標章要和送審一致', 'gd-r'));
  // 外觀好壞對照
  const lookPic = (good, bad, badMarks = '') => svg(rect(30, 50, 150, 130, 'gd-tile') + rect(220, 50, 150, 130, 'gd-tile') + badMarks +
    t(105, 40, '✔ ' + good, 'gd-ok') + t(295, 40, '✘ ' + bad, 'gd-ngt'));
  const stain = [[250, 90], [300, 140], [330, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" class="gd-stain"/>`).join('');
  const crack = `<path d="M240 70 L270 110 L260 140 L300 170" class="gd-crack"/>`;
  // 2m 直尺量平整度
  const flatPic = (len, gap) => svg(rect(20, 140, 360, 30, 'gd-tile') + `<path d="M20 140 Q200 128 380 140" class="gd-tile-top"/>` + rect(40, 118, 320, 8, 'gd-steel') +
    dimV(200, 126, 134, gap) + t(200, 100, `${len} 直尺貼在面上，量最大縫隙`, 'gd-r'));
  // 清潔
  const cleanPic = () => lookPic('完工清潔', '殘留污漬、材料', stain);
  // 文件
  const docPic = (title, rows) => svg(rect(60, 20, 280, 200, 'gd-paper') + t(200, 44, title, 'gd-b') + rows.map((r, i) => ok(80, 80 + i * 30, r)).join(''));
  const clean = (zh, vi) => g(cleanPic(), zh, vi);

  /* ---------- 15 暗架矽酸鈣天花板 ---------- */
  const ceiling = (extra = '') => svg(line(20, 30, 380, 30, 'gd-floor') + [80, 200, 320].map(x => line(x, 30, x, 120, 'gd-hanger')).join('') +
    line(40, 120, 360, 120, 'gd-pipe') + rect(40, 128, 320, 10, 'gd-board') + extra);
  const G15 = {
    0: g(flatPic('1m', '≦5mm'), '板面平整，水平誤差每 1m 不超過 ±5mm（用直尺或雷射檢查）。', 'Mặt tấm phẳng, sai số ngang mỗi 1m không vượt ±5mm (kiểm tra bằng thước hoặc laser).'),
    1: g(lookPic('色澤一致', '色差', `<rect x="290" y="60" width="70" height="110" class="gd-tile-dark"/>`), '同一區天花板色澤一致，沒有明顯色差（同一批號材料一起用）。', 'Trần cùng khu vực màu sắc đồng đều, không chênh màu rõ (dùng vật liệu cùng số lô).'),
    2: g(lookPic('乾淨完整', '污穢、破損', stain + crack), '板面沒有污穢、破損、缺角；搬運安裝時要小心碰撞。', 'Mặt tấm không bẩn, vỡ, sứt góc; cẩn thận va chạm khi vận chuyển, lắp đặt.'),
    3: g(matPic('矽酸鈣板'), '板材規格（厚度、尺寸）依設計圖說與送審資料。', 'Quy cách tấm (chiều dày, kích thước) theo bản vẽ thiết kế và hồ sơ duyệt.'),
    4: g(matPic('耐燃一級'), '防火等級：依 CNS 14705 試驗屬耐燃一級材料，核對證明文件與板背標示。', 'Cấp chống cháy: theo thí nghiệm CNS 14705 thuộc vật liệu chống cháy cấp 1, đối chiếu giấy chứng nhận và ký hiệu mặt sau tấm.'),
    5: g(matPic('NRC 0.3'), '吸音（噪音遞減係數 NRC）依 CNS 9056 試驗達 0.3，核對試驗報告。', 'Hệ số giảm ồn NRC theo thí nghiệm CNS 9056 đạt 0,3, đối chiếu báo cáo thí nghiệm.'),
    6: g(ceiling(t(200, 180, '吊筋垂直、固定在結構體，不側移', 'gd-r')), '吊筋固定在結構體（不可吊在管線上），垂直不側移；大面積加斜撐。', 'Ty treo cố định vào kết cấu (không treo vào đường ống), thẳng đứng không xê dịch ngang; diện tích lớn thêm giằng chéo.'),
    7: g(ceiling(`<path d="M150 120 Q200 150 250 120" class="gd-heave"/>` + t(200, 180, '✘ 變形、陷落', 'gd-ngt')), '吊架、骨架沒有變形或陷落；重物（燈具、設備）要另外吊掛，不可壓在天花板上。', 'Khung treo, khung xương không biến dạng hoặc võng; vật nặng (đèn, thiết bị) phải treo riêng, không đè lên trần.'),
    8: g(ceiling(rect(140, 126, 40, 14, 'gd-steel') + rect(240, 126, 50, 14, 'gd-steel') + t(160, 165, '感應器', 'gd-s') + t(265, 165, '出風口', 'gd-s') + t(200, 200, '固定良好、無歪斜鬆動', 'gd-r')),
      '感應器、出風口等設備要固定在骨架上，位置正、不歪斜鬆動。', 'Đầu cảm biến, miệng gió phải cố định vào khung xương, đúng vị trí, không lệch lỏng.'),
    9: g(svg(rect(20, 30, 30, 200, 'gd-con') + rect(50, 128, 330, 10, 'gd-board') + rect(50, 118, 30, 10, 'gd-steel') + t(200, 100, '與牆、柱交接：收邊條、無明顯縫隙', 'gd-r')),
      '天花板與柱、牆交接處用收邊條處理，沒有明顯縫隙。', 'Chỗ tiếp giáp trần với cột, tường xử lý bằng nẹp viền, không có khe hở rõ.'),
    10: g(ceiling(t(200, 180, '板面與骨架緊貼，螺絲鎖到位', 'gd-r')), '板面和骨架緊貼，沒有明顯縫隙；螺絲鎖到位但不可鎖破板面。', 'Mặt tấm áp sát khung xương, không có khe hở rõ; vít bắt đủ sâu nhưng không làm vỡ mặt tấm.'),
    11: g(ceiling(rect(170, 124, 60, 18, 'gd-lamp-box') + t(200, 175, '燈具開孔周邊收邊整齊', 'gd-r')), '燈具開孔尺寸正確，周邊接縫收邊整齊。', 'Lỗ khoét đèn đúng kích thước, mép xung quanh xử lý gọn gàng.'),
    12: g(ceiling(dimH(80, 200, 165, '跨度 L') + t(200, 200, '撓度 ≦ L / 360', 'gd-r')), '懸吊系統任何構件的撓度（下垂量）不大於跨度的 1/360（例：跨度 1.2m，下垂 ≦ 3.3mm）。', 'Độ võng của bất kỳ cấu kiện nào trong hệ treo không lớn hơn 1/360 nhịp (ví dụ: nhịp 1,2m, võng ≦ 3,3mm).'),
  };

  /* ---------- 16 輕隔間（骨架、板材） ---------- */
  const studs = (extra = '') => svg(line(20, 30, 380, 30, 'gd-pipe') + line(20, 215, 380, 215, 'gd-pipe') +
    [40, 106, 172, 238, 304, 370].map(x => line(x, 30, x, 215, 'gd-stud')).join('') + extra);
  const G16 = {
    0: g(lookPic('完整', '破損、變形', crack), '板材、骨架進場檢查，沒有破損、受潮、變形。', 'Tấm, khung xương khi nhập kiểm tra không vỡ, ẩm, biến dạng.'),
    1: g(svg(rect(100, 90, 200, 30, 'gd-board') + dimV(310, 90, 120, '12.5mm ±5%') + t(200, 170, '用卡尺量板厚', 'gd-s')), '板厚 12.5mm，誤差 ±5% 以內，用卡尺抽量。', 'Chiều dày tấm 12,5mm, sai số trong ±5%, kiểm tra bằng thước kẹp.'),
    2: g(matPic('耐燃一級＋綠建材'), '板材符合耐燃一級並有綠建材標章，核對證明文件。', 'Tấm đạt chống cháy cấp 1 và có nhãn vật liệu xanh, đối chiếu giấy chứng nhận.'),
    3: g(matPic('防火時效 1 小時'), '隔間牆系統有防火時效 1 小時的證明，施工方式（板層數、骨架）要和證明一致。', 'Hệ vách có chứng nhận chịu lửa 1 giờ, cách thi công (số lớp tấm, khung xương) phải giống chứng nhận.'),
    4: g(studs(dimH(106, 172, 50, '@406mm')), 'C 型立柱間距 406mm，上下槽鐵固定牢靠。', 'Khoảng cách thanh đứng chữ C 406mm, thanh U trên dưới cố định chắc.'),
    5: g(studs(line(20, 120, 380, 120, 'gd-red') + dimV(395, 120, 215, '@1200', 'left') + t(200, 110, '加強橫撐', 'gd-r')), '加強橫撐間距 1200mm。', 'Khoảng cách thanh giằng ngang gia cường 1200mm.'),
    6: g(studs(rect(150, 140, 60, 40, 'gd-hole') + line(140, 140, 220, 140, 'gd-red') + line(140, 180, 220, 180, 'gd-red') + t(180, 200, '開孔四周補強', 'gd-r')),
      '管線開孔處要補強上槽鐵和立柱，不可只切斷立柱。', 'Chỗ khoét lỗ đường ống phải gia cường thanh U và thanh đứng, không được chỉ cắt thanh đứng.'),
    7: g(studs(rect(106, 90, 132, 14, 'gd-steel') + t(172, 80, '補強鐵片 10cm × 1.2mm', 'gd-r') + t(172, 130, '吊櫃、衛浴器具位置', 'gd-s')),
      '吊櫃、衛生器具位置先在骨架內鎖上補強鐵片（10cm × 1.2mm），器具才鎖得牢。', 'Vị trí tủ treo, thiết bị vệ sinh phải bắt trước bản thép gia cường (10cm × 1,2mm) trong khung, thiết bị mới bắt chắc được.'),
  };

  /* ---------- 17 輕隔間（批土、接縫） ---------- */
  const joint = (n, k) => svg(rect(40, 60, 155, 120, 'gd-board') + rect(205, 60, 155, 120, 'gd-board') +
    [rect(185, 60, 30, 120, 'gd-putty'), rect(192, 60, 16, 120, 'gd-tape'), rect(170, 60, 60, 120, 'gd-putty2')].slice(0, n).join('') +
    t(200, 210, ['① 彈性補土打底＋玻纖帶', '② 第二道彈性補土', '③ 第三道石膏土'][k], 'gd-r'));
  const G17 = {
    0: g(svg(rect(60, 30, 280, 190, 'gd-board') + [70, 130, 190].map(y => [100, 200, 300].map(x => dot(x, y, 4, 'gd-bolt')).join('')).join('') +
        dimV(320, 70, 130, '@30cm') + dimH(100, 200, 22, '@40.6cm')), '板面螺絲間距：垂直 30cm、水平 40.6cm（對準立柱）。', 'Khoảng cách vít trên tấm: đứng 30cm, ngang 40,6cm (đúng vị trí thanh đứng).'),
    1: g(joint(2, 0), '第一道：彈性補土打底，貼玻纖帶用刮刀刮平，上面再塗一層彈性補土。', 'Lớp 1: lót bột trét đàn hồi, dán băng lưới sợi thủy tinh, gạt phẳng, rồi trét thêm một lớp bột đàn hồi.'),
    2: g(joint(3, 1), '第一道完全乾燥後才批第二道彈性補土。', 'Lớp 1 khô hoàn toàn mới trét lớp bột đàn hồi thứ 2.'),
    3: g(joint(3, 2), '第二道完全乾燥後批第三道石膏土，範圍要比前一道寬、收邊磨平。', 'Lớp 2 khô hoàn toàn mới trét lớp bột thạch cao thứ 3, rộng hơn lớp trước, mài phẳng mép.'),
    4: g(svg(rect(60, 30, 280, 190, 'gd-board') + [100, 200, 300].map(x => dot(x, 120, 6, 'gd-putty')).join('') + t(200, 90, '螺絲孔、灌漿孔也要批土', 'gd-r')), '螺絲釘孔、灌漿孔也要同樣批土磨平。', 'Lỗ vít, lỗ bơm vữa cũng phải trét bột và mài phẳng.'),
    5: g(svg(rect(40, 60, 155, 120, 'gd-board') + rect(205, 60, 155, 120, 'gd-board') + dimH(195, 205, 50, '3～5mm')), '板與板之間留 3～5mm 縫隙，再做批土處理。', 'Giữa các tấm chừa khe 3–5mm rồi mới trét bột.'),
    6: g(svg(`<path d="M100 40 L200 40 L200 200" class="gd-floor"/>` + `<path d="M190 40 L200 40 L200 50" class="gd-cornerbead"/>` + t(260, 90, '陽角：金屬護角＋批土', 'gd-r', 'start')), '牆面陽角使用金屬護角保護，再批土修平。', 'Góc lồi tường dùng nẹp góc kim loại bảo vệ, rồi trét bột làm phẳng.'),
    7: g(cleanPic(), '完成面平整、沒有污染。', 'Mặt hoàn thiện phẳng, không bẩn.'),
    8: g(svg(rect(150, 30, 40, 190, 'gd-board') + line(240, 30, 240, 210, 'gd-laser') + dot(240, 214, 6, 'gd-tie') + t(300, 120, '垂直偏差 < 1cm', 'gd-r', 'start')), '牆面垂直度偏差小於 1cm（用吊線或雷射量）。', 'Độ lệch thẳng đứng của vách nhỏ hơn 1cm (đo bằng dây dọi hoặc laser).'),
    9: g(flatPic('60cm', '≦3mm'), '板面凹凸：60cm 範圍內不大於 3mm。', 'Độ lồi lõm mặt tấm: trong phạm vi 60cm không lớn hơn 3mm.'),
  };

  /* ---------- 19 抿石子 ---------- */
  const pebbles = (dense = 0) => { let s = ''; for (let i = 0; i < 60; i++) { const x = 40 + (i * 37) % 140, y = 60 + (i * 23) % 110; s += dot(x + (dense ? 190 : 0), y, 4 + (i % 3), 'gd-pebble'); } return s; };
  const G19 = {
    0: g(matPic('樣板'), '施工前完成選樣選色，依選定的顏色、粒徑施作，樣板保留現場比對。', 'Trước khi thi công chọn mẫu màu, thi công theo màu, cỡ hạt đã chọn, giữ mẫu tại hiện trường để so sánh.'),
    1: g(svg(rect(40, 40, 320, 160, 'gd-tile') + [120, 200, 280].map(x => line(x, 40, x, 200, 'gd-groove')).join('') + line(40, 120, 360, 120, 'gd-groove') + t(200, 225, '分割縫依核定施工圖放樣', 'gd-r')),
      '分割縫位置依核定的施工圖放樣，線條要直、間距一致。', 'Vị trí đường chia theo bản vẽ thi công đã duyệt, đường phải thẳng, khoảng cách đều.'),
    2: g(svg(rect(60, 60, 280, 120, 'gd-con') + [100, 200, 300].map(x => `<path d="M${x} 30 l0 25" class="gd-water-l"/>`).join('') + t(200, 210, '先清潔粉塵、雜物，再潤濕底層', 'gd-r')),
      '施工前清除底層粉塵、雜物，並灑水潤濕，避免底層吸水造成空鼓。', 'Trước khi thi công làm sạch bụi, tạp vật lớp nền và tưới ẩm, tránh lớp nền hút nước gây bộp.'),
    3: g(lookPic('色澤一致', '色差', `<rect x="290" y="60" width="70" height="110" class="gd-tile-dark"/>`), '色澤一致、沒有明顯色差；同一面盡量一次完成。', 'Màu sắc đồng đều, không chênh màu rõ; cùng một mặt cố gắng làm xong một lần.'),
    4: g(svg(rect(30, 50, 150, 130, 'gd-tile') + pebbles() + rect(220, 50, 150, 130, 'gd-tile') + [[250, 80], [330, 150], [300, 100]].map(([x, y]) => dot(x, y, 5, 'gd-pebble')).join('') +
        t(105, 40, '✔ 露石均勻', 'gd-ok') + t(295, 40, '✘ 過禿', 'gd-ngt')), '露石要均勻，不可有過禿（石子太少）或過密的區域。', 'Đá lộ phải đều, không có chỗ quá trọc (ít đá) hoặc quá dày.'),
    5: g(svg(rect(60, 60, 280, 120, 'gd-tile') + `<circle cx="200" cy="120" r="10" class="gd-hammer"/>` + line(200, 120, 260, 70, 'gd-pipe') + t(200, 210, '用敲擊棒輕敲，聲音空空的就是空鼓', 'gd-r')),
      '用敲擊棒輕敲檢查，聲音空洞的就是空鼓，要打除重做。', 'Gõ nhẹ bằng que gõ kiểm tra, tiếng rỗng là bị bộp, phải đục bỏ làm lại.'),
  };

  /* ---------- 20 磁磚 ---------- */
  const tiles = (x, y, n, m, s = 40, gap = 4) => { let o = ''; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) o += rect(x + i * (s + gap), y + j * (s + gap), s, s, 'gd-tile'); return o; };
  const G20 = {
    0: g(docPic('磁磚施工圖', ['分割、起始位置', '收邊、轉角做法', '伸縮縫位置', '已審核完成']), '磁磚施工圖（分割、收邊、伸縮縫）要先審核完成才施工。', 'Bản vẽ thi công gạch (chia ô, viền, khe co giãn) phải duyệt xong mới thi công.'),
    1: g(lookPic('同批號、無色差', '色差', `<rect x="290" y="60" width="70" height="110" class="gd-tile-dark"/>`), '同一面用同一批號磁磚，鋪貼前先排看有沒有色差。', 'Cùng một mặt dùng gạch cùng số lô, trước khi lát xếp thử xem có chênh màu không.'),
    2: g(svg(rect(130, 60, 140, 140, 'gd-tile') + dimH(130, 270, 50, '尺寸依設計') + t(200, 225, '抽量長、寬、厚度', 'gd-s')), '抽量磁磚長、寬、厚度，和設計相符。', 'Đo kiểm dài, rộng, dày viên gạch, phải đúng thiết kế.'),
    3: g(svg(rect(60, 40, 40, 180, 'gd-con') + rect(100, 40, 14, 180, 'gd-mortar') + rect(114, 40, 10, 180, 'gd-tile') + t(250, 110, '外牆：1:2 防水砂漿打底', 'gd-r') + t(250, 135, '填縫也建議加防水劑', 'gd-s')),
      '外牆打底水泥砂漿和填縫建議使用防水劑，或用 1:2 防水砂漿打底，避免滲水。', 'Vữa lót và vữa chít mạch tường ngoài nên dùng phụ gia chống thấm, hoặc lót bằng vữa chống thấm 1:2, tránh thấm nước.'),
    4: g(svg(tiles(60, 40, 6, 4) + line(50, 38, 330, 38, 'gd-laser') + t(200, 225, '拉線、水平尺檢查平整、正直', 'gd-r')), '鋪貼平整、正直，用拉線和水平尺檢查，縫要對齊。', 'Lát phẳng, thẳng, kiểm tra bằng dây căng và thước thủy, mạch phải thẳng hàng.'),
    5: g(svg(tiles(40, 60, 5, 2) + rect(260, 60, 30, 40, 'gd-tile') + rect(260, 104, 10, 40, 'gd-tile-bad') + t(275, 160, '✔ ≧半塊', 'gd-ok') + t(265, 180, '✘ 太窄', 'gd-ngt')),
      '裁切磚不足一塊時，建議不小於半塊；太窄的小條不好看也容易掉。', 'Gạch cắt không đủ một viên thì nên không nhỏ hơn nửa viên; dải quá hẹp xấu và dễ rơi.'),
    6: g(lookPic('切口平順', '缺口、毛邊', crack), '面磚裁切的切口要平順整齊，沒有崩邊。', 'Mép cắt gạch phải phẳng gọn, không mẻ cạnh.'),
    7: g(svg(tiles(100, 60, 4, 3, 44, 8) + dimH(144, 152, 50, '3～12mm')), '嵌縫寬度不小於 3mm、不大於 12mm，同一面寬度一致。', 'Độ rộng mạch chít không nhỏ hơn 3mm, không lớn hơn 12mm, cùng một mặt độ rộng đều nhau.'),
    8: g(cleanPic(), '嵌縫後把磁磚面的水泥殘漿清洗乾淨。', 'Sau khi chít mạch rửa sạch vữa xi măng còn dính trên mặt gạch.'),
    9: g(svg(tiles(60, 80, 6, 2) + t(200, 50, '填縫後 48 小時內禁止踩踏', 'gd-r') + line(60, 200, 340, 200, 'gd-red') + t(200, 225, '拉警示帶封閉', 'gd-s')), '填縫後 48 小時內禁止踩踏，拉警示帶或擺放告示。', 'Trong 48 giờ sau khi chít mạch cấm giẫm lên, căng dây cảnh báo hoặc đặt biển báo.'),
    10: g(lookPic('完整乾淨', '裂紋、缺口', crack + stain), '完成面保持乾淨，沒有裂紋、缺口、破損、空隙；完工後做保護。', 'Mặt hoàn thiện giữ sạch, không nứt, mẻ, vỡ, rỗng; xong phải che chắn bảo vệ.'),
  };

  /* ---------- 21 高壓磚 ---------- */
  const pave = (extra = '') => svg(`<rect x="20" y="170" width="360" height="60" class="gd-soil"/>` + rect(20, 150, 360, 20, 'gd-sand') +
    [0, 1, 2, 3, 4, 5, 6, 7].map(i => rect(22 + i * 45, 128, 42, 22, 'gd-paver')).join('') + extra);
  const G21 = {
    0: g(docPic('高壓磚施工圖', ['鋪設範圍、排列花樣', '收邊、排水坡度', '已審核完成']), '高壓磚施工圖（排列、收邊、坡度）要先審核完成。', 'Bản vẽ thi công gạch block (cách xếp, viền, độ dốc) phải duyệt xong trước.'),
    1: g(lookPic('完整', '破損、缺角', crack), '進場檢查磚塊沒有破損、缺角。', 'Khi nhập kiểm tra gạch không vỡ, sứt góc.'),
    2: g(matPic('高壓磚'), '磚塊尺寸、厚度、強度依設計圖說。', 'Kích thước, chiều dày, cường độ gạch theo bản vẽ thiết kế.'),
    3: g(pave(t(200, 210, '底層土壤夯實度 ≧ 85%', 'gd-r')), '底層土壤夯實度達 85% 以上，否則日後下陷。', 'Độ chặt đất nền đạt từ 85% trở lên, nếu không sau này bị lún.'),
    4: g(lookPic('切口整齊', '缺角破損', crack), '切割的磚不可缺角、破損，邊緣用切割機切齊。', 'Gạch cắt không được sứt góc, vỡ, mép cắt bằng máy cắt cho thẳng.'),
    5: g(pave(dimV(390, 150, 170, '約 3cm', 'left') + t(200, 110, '襯墊砂鋪平、刮平', 'gd-r')), '襯墊砂鋪設前厚度約 3cm，刮平後不可踩踏再鋪磚。', 'Lớp cát đệm trước khi lát dày khoảng 3cm, gạt phẳng rồi không giẫm lên mới lát gạch.'),
    6: g(pave(t(200, 100, '掃入填縫砂，多餘的清掉', 'gd-r')), '掃入填縫砂並夯壓，多餘的填縫砂要清除。', 'Quét cát chèn khe và đầm, cát thừa phải dọn sạch.'),
    7: g(flatPic('3m', '<5mm'), '平整度：3m 直尺量，縫隙小於 5mm。', 'Độ phẳng: đo bằng thước 3m, khe hở nhỏ hơn 5mm.'),
    8: g(cleanPic(), '鋪設完成後立即清理鋪面表面。', 'Lát xong làm sạch mặt lát ngay.'),
  };

  /* ---------- 22 PVC 踢腳板 ---------- */
  const skirt = (extra = '') => svg(rect(40, 30, 320, 160, 'gd-wall') + line(20, 190, 380, 190, 'gd-floor') + rect(40, 160, 320, 30, 'gd-skirt') + extra);
  const G22 = {
    0: g(lookPic('完整', '破損', crack), '進場檢查踢腳板沒有破損、變形。', 'Khi nhập kiểm tra len chân tường không vỡ, biến dạng.'),
    1: g(skirt(dimV(370, 160, 190, '10cm ±0.5')), '高度 10cm ±0.5cm（以選定材料為準）。', 'Chiều cao 10cm ±0,5cm (theo vật liệu đã chọn).'),
    2: g(svg(rect(180, 50, 16, 140, 'gd-skirt') + dimH(180, 196, 40, '4 ±1mm')), '厚度 4mm ±1mm（以選定材料為準）。', 'Chiều dày 4mm ±1mm (theo vật liệu đã chọn).'),
    3: g(matPic('不自燃、不助燃'), '防火性：不自燃、不助燃，核對證明文件。', 'Tính chống cháy: không tự cháy, không duy trì cháy, đối chiếu giấy chứng nhận.'),
    4: g(svg(`<path d="M60 60 L200 60 L200 200" class="gd-floor"/>` + `<path d="M70 70 L190 70 L190 200" class="gd-skirt-l"/>` + t(220, 225, '轉角一體成型，不可切斷', 'gd-r')), '內角、外角轉角要一體成型（彎折），不可切斷拼接。', 'Góc trong, góc ngoài phải liền một tấm (uốn), không được cắt rời ghép lại.'),
    5: g(skirt([80, 160, 240, 320].map(x => dot(x, 175, 4, 'gd-bolt')).join('') + dimH(80, 160, 150, '約 @20cm')), '每隔約 20cm 用無頭鋼釘固定。', 'Cứ khoảng 20cm đóng một đinh thép không đầu để cố định.'),
    6: g(skirt(t(200, 120, '貼牢、無鬆動、無凹洞', 'gd-r')), '安裝後貼牢，不可鬆動或有凹洞。', 'Sau khi lắp phải dán chắc, không lỏng hoặc có chỗ lõm.'),
    7: g(skirt(line(200, 160, 200, 190, 'gd-red') + t(200, 145, '接縫密合', 'gd-r')), '接縫處密合，沒有明顯縫隙。', 'Mối nối khít, không có khe hở rõ.'),
    8: g(skirt(t(200, 120, '接縫處不可鬆動', 'gd-r')), '接縫處固定牢靠，不可鬆動翹起。', 'Mối nối cố định chắc, không được lỏng vênh.'),
    9: g(cleanPic(), '完工後清潔乾淨，殘膠擦除。', 'Hoàn công làm sạch, lau hết keo thừa.'),
  };

  /* ---------- 24 水泥粉刷 ---------- */
  const plaster = (extra = '') => svg(rect(40, 20, 60, 210, 'gd-con') + rect(100, 20, 14, 210, 'gd-mortar') + extra);
  const G24 = {
    0: g(svg(line(80, 20, 80, 190, 'gd-laser') + dot(80, 198, 9, 'gd-tie') + t(110, 120, '重錘自然垂下、不被風吹動', 'gd-r', 'start') + t(110, 145, '有風時加擋板或放進水桶', 'gd-s', 'start')),
      '吊線時重錘要自然垂下，不被風吹動；風大時用擋板或把重錘放進水桶穩住。', 'Khi thả dọi quả dọi phải rủ tự nhiên, không bị gió thổi; gió lớn dùng tấm chắn hoặc đặt quả dọi vào xô nước.'),
    1: g(svg(rect(60, 20, 80, 210, 'gd-con') + line(160, 20, 160, 230, 'gd-laser') + t(180, 120, '線溝清乾淨、吊線路徑無阻礙', 'gd-r', 'start')), '線溝清除乾淨，吊線經過的地方不可有阻礙物（突出物先打除）。', 'Rãnh dây phải dọn sạch, chỗ dây dọi đi qua không có vật cản (chỗ nhô ra đục bỏ trước).'),
    2: g(svg(rect(60, 40, 280, 160, 'gd-con') + `<ellipse cx="200" cy="120" rx="40" ry="25" class="gd-spray"/>` + t(200, 225, '需打石處用噴漆標示（任一顏色）', 'gd-r')), '牆面需要打石（打除突出）的地方先用噴漆標示，任一顏色皆可。', 'Chỗ tường cần đục (đục chỗ nhô) đánh dấu trước bằng sơn xịt, màu nào cũng được.'),
    3: g(svg(rect(40, 20, 320, 210, 'gd-con') + [[90, 60], [240, 60], [90, 180], [240, 180]].map(([x, y]) => rect(x - 8, y - 8, 16, 16, 'gd-dot-mark')).join('') + dimH(90, 240, 40, '@150cm')),
      '牆面每隔 150cm 做一個灰誌（粉刷厚度基準點），再依灰誌做沖筋。', 'Mặt tường cứ 150cm làm một mốc vữa (điểm chuẩn chiều dày trát), rồi làm dải mốc theo đó.'),
    4: g(svg(rect(60, 60, 120, 120, 'gd-paper') + t(120, 50, '一般粉刷', 'gd-b') + t(120, 130, '水泥 1 : 砂 3', 'gd-r') + rect(220, 60, 120, 120, 'gd-paper') + t(280, 50, '防水粉刷', 'gd-b') + t(280, 130, '水泥 1 : 砂 2', 'gd-r')),
      '砂漿配比：一般粉刷 1:3、防水粉刷 1:2（水泥：砂），用固定容器計量。', 'Cấp phối vữa: trát thường 1:3, trát chống thấm 1:2 (xi măng : cát), đong bằng thùng cố định.'),
    5: g(plaster(t(250, 120, '打底前先塗黏著劑', 'gd-r')), '粉刷底層打底前使用黏著劑，增加和混凝土面的附著力。', 'Trước khi trát lớp lót dùng chất kết dính để tăng độ bám với mặt bê tông.'),
    6: g(flatPic('150cm', '≦3mm'), '粉刷面平整、沒有裂縫：150cm 直尺貼牆量，縫隙不大於 3mm。', 'Mặt trát phẳng, không nứt: đặt thước 150cm sát tường đo, khe hở không lớn hơn 3mm.'),
    7: g(lookPic('底層平實', '鼓脹、龜裂', crack), '面層粉光前，底層不可有鼓脹、龜裂；有就打除重做。', 'Trước khi trát mặt láng, lớp lót không được phồng, nứt chân chim; có thì đục bỏ làm lại.'),
    8: g(svg(rect(60, 40, 280, 170, 'gd-con') + rect(150, 80, 100, 90, 'gd-hole') + line(150, 80, 250, 80, 'gd-red') + line(150, 80, 150, 170, 'gd-red') + line(250, 80, 250, 170, 'gd-red') +
        t(200, 225, '門窗邊角、牆內外角線平直', 'gd-r')), '門窗邊角線、牆的內外角線要平直方正。', 'Đường cạnh cửa đi, cửa sổ, góc trong góc ngoài tường phải thẳng vuông.'),
  };

  /* ---------- 25 油漆 ---------- */
  const wallPaint = (extra = '') => svg(rect(60, 30, 280, 180, 'gd-paint') + extra);
  const G25 = {
    0: g(wallPaint(crack + `<path d="M150 120 l10 0" class="gd-crack"/>` + t(200, 225, '裂縫、釘孔用彈性批土補平磨平', 'gd-r')), '裂縫、釘孔等缺口用彈性批土填補、磨平。', 'Vết nứt, lỗ đinh trám bằng bột trét đàn hồi rồi mài phẳng.'),
    1: g(wallPaint(stain + t(200, 225, '泥渣、灰塵用鐵片輕刮去除', 'gd-r')), '表面殘餘泥渣、灰塵、污物用鐵片輕刮去除。', 'Bùn vữa, bụi, vết bẩn còn trên mặt cạo nhẹ bằng lưỡi sắt.'),
    2: g(wallPaint(rect(170, 100, 60, 40, 'gd-protect-tape') + t(200, 160, '插座、五金先貼保護', 'gd-r')), '五金、電器、開關插座等先用膠帶、塑膠布保護，避免污染。', 'Phụ kiện, thiết bị điện, công tắc ổ cắm che bằng băng keo, nilon trước, tránh dính sơn.'),
    3: g(matPic('原裝固封'), '油漆要用選定廠商的原裝、固封貨品，現場確認封口沒有被打開過。', 'Sơn phải là hàng nguyên đai nguyên kiện của nhà cung cấp đã chọn, kiểm tra niêm phong chưa bị mở.'),
    4: g(matPic('色號'), '油漆廠牌與合約相符，顏色和選色會議決定的色樣相符。', 'Hãng sơn đúng hợp đồng, màu đúng mẫu đã chốt trong cuộc họp chọn màu.'),
    5: g(wallPaint(rect(170, 90, 60, 60, 'gd-steel') + t(200, 175, '含水率計 ≦ 10%', 'gd-r')), '牆面含水率不得高於 10%（用含水率計量）；新粉刷牆要等夠乾。', 'Độ ẩm mặt tường không cao hơn 10% (đo bằng máy đo độ ẩm); tường mới trát phải chờ đủ khô.'),
    6: g(svg(rect(150, 60, 100, 120, 'gd-paper') + t(200, 110, '濕度', 'gd-b') + t(200, 145, '≦ 80%', 'gd-r') + t(200, 210, '下雨、潮濕天不要施工', 'gd-s')), '空氣相對濕度不得高於 80%；下雨或潮濕天不施工。', 'Độ ẩm không khí không cao hơn 80%; trời mưa hoặc ẩm không thi công.'),
    7: g(svg(rect(150, 60, 100, 120, 'gd-paper') + t(200, 110, '表面溫度', 'gd-b') + t(200, 145, '≦ 40℃', 'gd-r') + t(200, 210, '烈日直曬的牆面避開中午', 'gd-s')), '塗刷面表面溫度不得高於 40℃，烈日直曬的牆避開中午施工。', 'Nhiệt độ bề mặt sơn không cao hơn 40℃, tường bị nắng chiếu trực tiếp tránh làm buổi trưa.'),
    8: g(svg(rect(100, 120, 200, 20, 'gd-con') + rect(100, 112, 200, 8, 'gd-paint') + rect(100, 104, 200, 8, 'gd-paint2') + dimV(310, 104, 120, '≧100μm') + t(200, 190, '用膜厚計量總乾膜厚度', 'gd-s')),
      '油漆總乾膜厚度 ≧ 100μm（用膜厚計量），塗刷遍數依規範。', 'Tổng chiều dày màng sơn khô ≧ 100μm (đo bằng máy đo chiều dày), số lớp sơn theo quy phạm.'),
    9: g(lookPic('均勻平滑', '刷痕、不均', `<path d="M230 80 L360 90 M230 120 L360 110 M230 150 L360 160" class="gd-brush"/>`), '塗刷均勻平滑，沒有刷痕或深淺不一。', 'Sơn đều, mịn, không vết chổi hoặc chỗ đậm nhạt.'),
    10: g(lookPic('無氣泡', '氣泡', [[260, 90], [300, 130], [330, 100], [280, 150]].map(([x, y]) => dot(x, y, 6, 'gd-bubble-d')).join('')), '塗膜沒有氣泡；有氣泡要磨除重塗。', 'Màng sơn không có bọt khí; có bọt phải mài bỏ sơn lại.'),
    11: g(lookPic('無流痕', '流墜', `<path d="M260 70 L260 130 M300 70 L300 150 M330 70 L330 120" class="gd-drip"/>`), '塗膜沒有流痕（流墜）；一次不要塗太厚。', 'Màng sơn không có vết chảy; mỗi lần không sơn quá dày.'),
    12: g(lookPic('平整', '高低不平', `<path d="M230 110 Q260 90 290 110 T350 110" class="gd-brush"/>`), '塗刷面沒有高低不平；底層不平要先批土磨平。', 'Mặt sơn không lồi lõm; lớp nền không phẳng phải trét bột mài phẳng trước.'),
  };

  Object.assign(window.SK_GUIDES, { '15': G15, '16': G16, '17': G17, '19': G19, '20': G20, '21': G21, '22': G22, '24': G24, '25': G25 });
})();
