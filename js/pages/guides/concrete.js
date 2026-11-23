/**
 * 看圖說：牆鋼筋、混凝土、樓梯鋼筋（08、11、12、42）
 * 畫圖工具來自 self-check-guides.js 的 window.SK_GD；法規依「營造安全衛生設施標準」（115-06-30 修正）
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok, ng } = window.SK_GD;

  const wallSec = (x, y, w, h, two = true) => rect(x, y, w, h, 'gd-con') +
    line(x + 12, y + 5, x + 12, y + h - 5, 'gd-bar') + (two ? line(x + w - 12, y + 5, x + w - 12, y + h - 5, 'gd-bar') : '') +
    [0, 1, 2, 3, 4, 5].map(i => dot(x + 18, y + 15 + i * (h - 30) / 5, 3.5) + (two ? dot(x + w - 18, y + 15 + i * (h - 30) / 5, 3.5) : '')).join('');
  const docList = (title, rows) => svg(rect(60, 20, 280, 200, 'gd-paper') + t(200, 44, title, 'gd-b') +
    rows.map((r, i) => ok(80, 80 + i * 30, r)).join(''));

  /* ---------- 08 牆鋼筋 ---------- */
  const G08 = {
    0: { svg: svg(rect(40, 30, 180, 190, 'gd-paper') + [70, 110, 150, 190].map(x => line(x, 35, x, 215, 'gd-bar')).join('') +
        [60, 100, 140, 180].map(y => line(45, y, 215, y, 'gd-bar2')).join('') + dimH(70, 110, 24, '水平 @') + dimV(228, 60, 100, '垂直 @') +
        t(310, 90, '號數：#3（依圖）', 'gd-r') + t(310, 120, '間距 15、20cm', 'gd-s') + t(310, 145, '錨定長度依表', 'gd-s')),
      zh: ['牆筋號數、水平與垂直間距、錨定長度依圖（表上例：#3、@15 或 20cm）。', '用捲尺連續量幾格取平均。'],
      vi: ['Số hiệu thép vách, khoảng cách ngang và đứng, chiều dài neo theo bản vẽ (ví dụ trên phiếu: #3, @15 hoặc 20cm).', 'Dùng thước đo liên tiếp vài ô lấy trung bình.'] },
    1: { svg: svg(wallSec(60, 40, 40, 160, false) + t(80, 220, '單層：每目綁', 'gd-s') + wallSec(250, 40, 80, 160) + t(290, 220, '雙層：跳一目綁', 'gd-s') +
        t(200, 25, '#22 鐵絲綁紮', 'gd-b')),
      zh: ['單層單向：每個交叉點都用 #22 鐵絲綁紮。', '雙層雙向：可跳一目綁紮（梅花綁），但周邊、開口旁要每目綁；兩層之間用繫筋或間隔器固定。'],
      vi: ['Một lớp một phương: mọi điểm giao đều buộc bằng dây thép #22.', 'Hai lớp hai phương: có thể buộc cách một mắt (kiểu hoa mai), nhưng xung quanh và cạnh lỗ mở phải buộc từng mắt; giữa hai lớp cố định bằng thép giằng hoặc miếng kê.'] },
    2: { svg: svg(rect(40, 30, 80, 190, 'gd-con') + t(80, 236, '柱', 'gd-s') + rect(120, 60, 260, 130, 'gd-con') + t(250, 210, '牆', 'gd-s') +
        [90, 130, 170].map(y => line(70, y, 360, y, 'gd-bar')).join('') + dimH(70, 120, 50, '錨入柱內') + line(70, 85, 70, 175, 'gd-bar')),
      zh: ['牆的水平筋要錨入柱、梁內，深度依圖，端部彎鉤在柱筋內側。'],
      vi: ['Thép ngang của vách phải neo vào cột, dầm, chiều sâu theo bản vẽ, đầu móc nằm phía trong thép cột.'] },
    3: { svg: svg(wallSec(150, 30, 100, 180) + dimH(150, 162, 22, '2cm') + rect(126, 100, 24, 20, 'gd-spacer') + rect(250, 100, 24, 20, 'gd-spacer') +
        t(80, 112, '車輪墊塊', 'gd-r') + t(320, 112, '@150cm', 'gd-r') + t(200, 232, '與土壤、水接觸：7.5cm', 'gd-s')),
      zh: ['牆保護層依規定（例如 2cm），與土壤、水接觸的部位 7.5cm。', '用車輪型墊塊，雙層雙向約 @150cm 設置。'],
      vi: ['Lớp bảo vệ vách theo quy định (ví dụ 2cm), bộ phận tiếp xúc đất, nước 7,5cm.', 'Dùng con kê dạng bánh xe, hai lớp hai phương đặt khoảng @150cm.'] },
    4: { svg: svg(rect(40, 120, 320, 100, 'gd-con') + t(200, 210, '已澆置的混凝土', 'gd-s') + [100, 160, 220, 280].map(x => line(x, 190, x, 40, 'gd-bar')).join('') +
        dimV(320, 40, 120, '露出 1 倍') + dimV(320, 120, 190, '埋入 1 倍') + t(200, 30, '預埋筋：同號數、同間距', 'gd-r')),
      zh: ['預埋筋和原牆配筋同號數、同間距。', '總長留兩倍伸展長度：一半埋在混凝土內，一半露出來接續。'],
      vi: ['Thép chờ cùng số hiệu, cùng khoảng cách với thép vách ban đầu.', 'Tổng chiều dài bằng hai lần chiều dài phát triển: một nửa chôn trong bê tông, một nửa lộ ra để nối.'] },
    5: { svg: svg(rect(20, 20, 360, 200, 'gd-paper') + rect(150, 80, 100, 80, 'gd-hole') + t(200, 125, '開口', 'gd-s') +
        [128, 136, 264, 272].map(x => line(x, 30, x, 210, 'gd-bar')).join('') + [58, 66, 174, 182].map(y => line(60, y, 340, y, 'gd-bar')).join('') +
        line(110, 96, 160, 46, 'gd-bar') + line(118, 104, 168, 54, 'gd-bar') + line(240, 46, 290, 96, 'gd-bar') + line(232, 54, 282, 104, 'gd-bar') +
        line(110, 144, 160, 194, 'gd-bar') + line(118, 136, 168, 186, 'gd-bar') + line(240, 194, 290, 144, 'gd-bar') + line(232, 186, 282, 136, 'gd-bar')),
      zh: ['開口四邊垂直、水平各加 2 支同號數補強筋，伸出開口邊 ≧ 1 倍伸展長度。', '四個角各加 2 支 45° 斜筋，長度 ≧ 2 倍伸展長度。'],
      vi: ['Bốn cạnh lỗ mở, mỗi phương đứng và ngang thêm 2 thanh gia cường cùng số hiệu, nhô ra khỏi mép lỗ ≧ 1 lần chiều dài phát triển.', 'Mỗi góc thêm 2 thanh chéo 45°, dài ≧ 2 lần chiều dài phát triển.'] },
    6: { svg: svg(rect(20, 20, 360, 200, 'gd-paper') + [80, 140, 200, 260, 320].map(x => line(x, 30, x, 210, 'gd-bar-thin')).join('') +
        dot(110, 80, 10, 'gd-hole') + t(110, 110, '≦10cm 免補', 'gd-ok') +
        dot(250, 120, 22, 'gd-hole') + line(215, 105, 245, 75, 'gd-bar') + line(255, 165, 285, 135, 'gd-bar') + t(250, 180, '10～30cm：45° 斜筋 2 支', 'gd-r') +
        t(200, 210, '30cm 以上依開口補強施作', 'gd-s')),
      zh: ['水電套管穿牆：鋼筋沒有截斷、開口 10cm 以下免補強。', '10～30cm：加 2 支 45° 斜向同號數筋，長 ≧ 50cm；30cm 以上依開口補強施作。'],
      vi: ['Ống lồng điện nước xuyên vách: thép không bị cắt, lỗ ≦ 10cm thì không cần gia cường.', '10–30cm: thêm 2 thanh chéo 45° cùng số hiệu, dài ≧ 50cm; từ 30cm trở lên làm theo gia cường lỗ mở.'] },
  };

  /* ---------- 11 混凝土（澆置前） ---------- */
  const G11 = {
    0: { svg: docList('澆置前查驗', ['鋼筋查驗完成（含監造）', '模板查驗完成', '支撐、斜撐、繫條確認（第 142 條）', '保護層墊塊到位']),
      zh: ['鋼筋、模板查驗都完成並有紀錄，才可以叫混凝土。', '澆置前檢查模板支撐的連接和斜撐（營造安全衛生設施標準第 142 條）。'],
      vi: ['Nghiệm thu thép và ván khuôn đều xong và có biên bản mới được gọi bê tông.', 'Trước khi đổ kiểm tra liên kết cây chống ván khuôn và thanh giằng chéo (Điều 142).'] },
    1: { svg: docList('機電、水電查驗', ['套管、預留孔位置', '配管固定、管口封閉', '接線盒、預埋件', '接地線']),
      zh: ['機電、水電的配管、套管、預留孔、接線盒都查驗完成，管口封好。'],
      vi: ['Ống điện nước, ống lồng, lỗ chờ, hộp nối đều nghiệm thu xong, miệng ống đã bịt.'] },
    2: { svg: svg(rect(20, 150, 360, 70, 'gd-con') + [80, 200, 320].map(x => line(x, 220, x, 120, 'gd-bar') + rect(x - 8, 116, 16, 8, 'gd-cap')).join('') +
        line(20, 120, 380, 120, 'gd-mark') + t(200, 105, '標高器頂端 ＝ 完成面高程', 'gd-r') + t(200, 40, '分區設置標高器（或拉線）', 'gd-b')),
      zh: ['依完成面高程分區設置標高器（或拉水平線），澆置時刮平到標高器高度。'],
      vi: ['Đặt cọc mốc cao độ theo khu (hoặc căng dây ngang) theo cao độ mặt hoàn thiện, khi đổ gạt phẳng đến cao độ cọc mốc.'] },
    3: { svg: svg(`<path d="M20 90 L200 90 L200 120 L380 120 L380 160 L20 160 Z" class="gd-con"/>` + rect(196, 70, 8, 52, 'gd-plank') + t(240, 60, '高低差處用角材擋住', 'gd-r', 'start')),
      zh: ['樓板高低差（降板）處要用角材做好擋板，澆置時混凝土才不會流過去。'],
      vi: ['Chỗ chênh cao sàn (hạ cốt) phải dùng thanh gỗ làm ván chắn để bê tông không chảy tràn khi đổ.'] },
    4: { svg: svg(rect(130, 30, 140, 190, 'gd-plank') + rect(130, 190, 30, 30, 'gd-plank2') + rect(240, 190, 30, 30, 'gd-plank2') + line(100, 220, 300, 220, 'gd-floor') +
        t(200, 180, '清潔口清完後封閉', 'gd-r')),
      zh: ['柱、牆底部的清潔口清完雜物後要封閉牢固，避免澆置時漏漿、爆模。'],
      vi: ['Cửa vệ sinh ở chân cột, vách sau khi dọn rác phải bịt chắc, tránh chảy vữa, bung ván khi đổ.'] },
    5: { svg: svg(rect(30, 50, 150, 130, 'gd-plank') + [[60, 80], [90, 130], [140, 100]].map(([x, y]) => dot(x, y, 5, 'gd-rust')).join('') +
        rect(220, 50, 150, 130, 'gd-plank') + t(105, 40, '✘ 木屑、積水', 'gd-ngt') + t(295, 40, '✔ 清潔、濕潤', 'gd-ok') + t(200, 210, '用吹風機或水清乾淨，積水要排掉', 'gd-s')),
      zh: ['模板內的木屑、鐵絲、垃圾清除乾淨；積水要排掉。', '模板適度灑水濕潤，避免吸走混凝土水分。'],
      vi: ['Dọn sạch mùn gỗ, dây thép, rác trong ván khuôn; nước đọng phải xả hết.', 'Tưới ẩm ván khuôn vừa phải, tránh hút mất nước của bê tông.'] },
    6: { svg: svg(rect(140, 40, 120, 170, 'gd-plank') + line(270, 60, 270, 200, 'gd-pipe') + rect(260, 120, 20, 30, 'gd-jack') + t(320, 140, '模板振動器', 'gd-r') + t(200, 230, '準備 1～2 組（含備用）', 'gd-s')),
      zh: ['準備模板振動器（附著式）或振動棒 1～2 組，並確認電源、備用機。'],
      vi: ['Chuẩn bị 1–2 bộ máy đầm ván khuôn (gắn ngoài) hoặc đầm dùi, kiểm tra nguồn điện và máy dự phòng.'] },
    7: { svg: svg(`<circle cx="200" cy="60" r="18" class="gd-lamp"/>` + `<path d="M200 80 L120 200 L280 200 Z" class="gd-light"/>` + line(60, 200, 340, 200, 'gd-floor') + t(200, 226, '夜間或室內澆置要有足夠照明', 'gd-s')),
      zh: ['夜間、地下室或室內澆置要有足夠照明，看得到澆置面和模板狀況。'],
      vi: ['Đổ bê tông ban đêm, tầng hầm hoặc trong nhà phải đủ chiếu sáng, nhìn rõ mặt đổ và ván khuôn.'] },
    8: { svg: svg([90, 140, 190].map(x => rect(x, 120, 36, 72, 'gd-con')).join('') + t(158, 100, '試體（圓柱）', 'gd-r') + t(158, 220, '試體人員到場、模具準備', 'gd-s') +
        rect(260, 140, 80, 50, 'gd-paper') + t(300, 170, '坍度筒', 'gd-s')),
      zh: ['試體製作人員到場，準備試體模、坍度筒、氯離子試紙。'],
      vi: ['Nhân viên làm mẫu thử có mặt, chuẩn bị khuôn mẫu, côn đo độ sụt, giấy thử ion clo.'] },
    9: { svg: svg(line(20, 180, 380, 180, 'gd-floor') + rect(60, 130, 100, 50, 'gd-truck') + `<circle cx="280" cy="110" r="14" class="gd-person"/>` + line(280, 124, 280, 180, 'gd-person-l') +
        line(280, 140, 320, 110, 'gd-red') + t(280, 80, '交管人員', 'gd-r') + t(200, 215, '指揮車輛進出、維護行人安全', 'gd-s')),
      zh: ['安排 1 位交管人員在工地出入口，指揮混凝土車進出，維護行人與車輛安全。'],
      vi: ['Bố trí 1 người điều tiết giao thông ở cổng công trường, hướng dẫn xe bê tông ra vào, đảm bảo an toàn người đi đường và xe cộ.'] },
    10: { svg: svg(rect(150, 30, 100, 190, 'gd-plank') + `<circle cx="320" cy="120" r="14" class="gd-person"/>` + line(320, 134, 320, 200, 'gd-person-l') + t(320, 95, '顧模人員', 'gd-r') + line(100, 220, 380, 220, 'gd-floor')),
      zh: ['顧模人員到場，帶工具在模板旁全程看守，發現爆模、漏漿立即通報。'],
      vi: ['Người canh ván khuôn có mặt, mang dụng cụ canh suốt bên ván khuôn, thấy bung ván, chảy vữa báo ngay.'] },
  };

  /* ---------- 12 混凝土（澆置中） ---------- */
  const G12 = {
    0: { svg: svg([110, 160, 210].map(x => rect(x, 100, 36, 72, 'gd-con')).join('') + t(178, 80, '一組 3 顆', 'gd-r') + t(200, 210, '每 100m³ 取一組（依表／契約）', 'gd-b')),
      zh: ['依表上規定每 100m³ 取一組試體（3 顆），不足 100m³ 也要取一組；契約另有規定依契約。', '試體標示日期、位置、強度，依規定養護後送驗。'],
      vi: ['Theo phiếu mỗi 100m³ lấy một tổ mẫu (3 viên), dưới 100m³ cũng phải lấy một tổ; hợp đồng có quy định khác thì theo hợp đồng.', 'Mẫu ghi ngày, vị trí, cường độ, bảo dưỡng theo quy định rồi gửi thí nghiệm.'] },
    // 坍度分級（使用者提供，2026-11-23）：橫軸 0～26cm，x = 20 + cm × 13.5
    1: { svg: svg([[5, 12.5, '低：道路基礎、路面', 'gd-slump1'], [12, 18, '中：一般基礎、構件', 'gd-slump2'], [18, 22, '高：樓版、密筋、泵送', 'gd-slump3'], [22, 26, '350kgf/cm²（5000psi）以上', 'gd-slump4']]
          .map(([a, b, s, c], i) => t(20, 22 + i * 42, `${s}　${a}～${b}cm`, 'gd-b', 'start') + rect(20 + a * 13.5, 28 + i * 42, (b - a) * 13.5, 14, c)).join('') +
        line(20, 196, 380, 196, 'gd-floor') + [0, 5, 10, 15, 20, 25].map(v => line(20 + v * 13.5, 192, 20 + v * 13.5, 200, 'gd-floor') + t(20 + v * 13.5, 213, v, 'gd-s')).join('') +
        t(390, 213, 'cm', 'gd-s', 'end') + t(200, 235, '容許差：≦5cm ±1.5、5～10cm ±2.5、>10cm ±4cm', 'gd-r')),
      zh: ['設計坍度依澆置部位選定，填在表上：',
        '低坍度（約 5～12.5cm）：道路基礎、路面或較乾硬配比，流動性低、穩定性高。',
        '中坍度（約 12～18cm）：車道、景觀區或一般基礎與構件，兼顧流動性與抗離析。',
        '高坍度／流動性混凝土（約 18～22cm）：樓版、鋼筋較密或需泵送的結構部位，可提升搗實性、減少蜂窩，但要依規範控制上限與摻料使用。',
        '高強度混凝土 350kgf/cm²（約 5000psi）以上：約 22～26cm，否則太快硬化、不好澆置搗實。坍度要和預拌廠配比一致。',
        '每車（或依規定頻率）做坍度試驗，和設計坍度的差在容許範圍內：5cm 以下 ±1.5cm、5～10cm ±2.5cm、10cm 以上 ±4cm；超出就退貨，不可現場加水。'],
      vi: ['Độ sụt thiết kế chọn theo bộ phận đổ, ghi vào phiếu:',
        'Độ sụt thấp (khoảng 5–12,5cm): móng đường, mặt đường hoặc cấp phối khô cứng, độ chảy thấp, độ ổn định cao.',
        'Độ sụt trung bình (khoảng 12–18cm): đường xe chạy, khu cảnh quan hoặc móng và cấu kiện thông thường, cân bằng độ chảy và chống phân tầng.',
        'Độ sụt cao / bê tông tự chảy (khoảng 18–22cm): sàn, chỗ thép dày hoặc bộ phận kết cấu cần bơm, giúp đầm dễ, giảm rỗ tổ ong, nhưng phải khống chế giới hạn trên và phụ gia theo quy phạm.',
        'Bê tông cường độ cao từ 350kgf/cm² (khoảng 5000psi): khoảng 22–26cm, nếu không sẽ đông cứng quá nhanh, khó đổ và đầm. Độ sụt phải khớp với cấp phối của trạm trộn.',
        'Mỗi xe (hoặc theo tần suất quy định) thử độ sụt, chênh lệch với độ sụt thiết kế trong dung sai: dưới 5cm ±1,5cm, 5–10cm ±2,5cm, trên 10cm ±4cm; vượt thì trả hàng, không được thêm nước tại hiện trường.'] },
    2: { svg: svg(rect(150, 50, 100, 140, 'gd-paper') + rect(170, 70, 60, 90, 'gd-plank2') + t(200, 40, '氯離子檢測', 'gd-b') + t(200, 215, '< 0.15 kg/m³', 'gd-r')),
      zh: ['每車（或依規定）抽測水溶性氯離子含量，鋼筋混凝土要小於 0.15 kg/m³（每立方公尺混凝土的含量）。', '超過就退貨，並記錄車號與檢測值。'],
      vi: ['Mỗi xe (hoặc theo quy định) đo hàm lượng ion clo hòa tan, bê tông cốt thép phải dưới 0,15 kg/m³ (hàm lượng trên mỗi mét khối bê tông).', 'Vượt thì trả hàng, ghi lại số xe và giá trị đo.'] },
    3: { svg: svg(rect(20, 20, 360, 200, 'gd-paper') + t(200, 50, '出廠時間（送貨單）→ 澆置完成', 'gd-b') +
        t(200, 110, '氣溫 ≧ 25°C：90 分鐘內', 'gd-r') + t(200, 150, '氣溫 < 25°C：120 分鐘內', 'gd-r') + t(200, 195, '看送貨單上的出廠時間，超時退貨', 'gd-s')),
      zh: ['從拌合（送貨單出廠時間）到澆置完成：氣溫 25°C 以上 90 分鐘內、25°C 以下 120 分鐘內。', '超時的混凝土要退貨，不可加水使用。'],
      vi: ['Từ lúc trộn (giờ xuất xưởng trên phiếu giao hàng) đến khi đổ xong: nhiệt độ từ 25°C trở lên trong 90 phút, dưới 25°C trong 120 phút.', 'Bê tông quá giờ phải trả lại, không được thêm nước để dùng.'] },
    4: { svg: svg(rect(20, 160, 360, 40, 'gd-con') + [60, 120, 180, 240, 300, 360].map(x => line(x, 165, x, 195, 'gd-bar-thin')).join('') +
        line(30, 140, 370, 140, 'gd-pipe-b') + [100, 260].map(x => rect(x - 15, 145, 30, 15, 'gd-plank')).join('') +
        t(200, 120, '輸送管用隔墊物墊高，不壓在鋼筋、模板上', 'gd-r')),
      zh: ['輸送管要用隔墊物（馬椅、木塊）墊高，不可直接壓在鋼筋或模板上，避免鋼筋位移。', '可以的話用泵浦車輸送臂直接澆置。'],
      vi: ['Ống bơm phải kê cao bằng vật kê (chân ngựa, khối gỗ), không đè trực tiếp lên thép hoặc ván khuôn, tránh thép bị xê dịch.', 'Nếu được thì đổ trực tiếp bằng cần bơm của xe bơm.'] },
    5: { svg: svg(rect(20, 120, 180, 60, 'gd-con') + rect(200, 120, 180, 60, 'gd-con-new') + line(200, 110, 200, 190, 'gd-red') +
        t(200, 90, '中斷 ≦ 45 分鐘', 'gd-r') + t(200, 215, '超過會形成冷縫（新舊混凝土接不好）', 'gd-s')),
      zh: ['澆置中斷時間不可超過 45 分鐘，否則新舊混凝土之間會形成冷縫。', '預估會中斷時，先和監造討論施工縫位置。'],
      vi: ['Thời gian gián đoạn khi đổ không quá 45 phút, nếu không sẽ tạo mạch lạnh giữa bê tông cũ và mới.', 'Dự kiến bị gián đoạn thì bàn trước với giám sát về vị trí mạch ngừng.'] },
    6: { svg: svg(rect(140, 30, 120, 190, 'gd-plank') + `<path d="M260 120 Q300 130 310 170" class="gd-heave"/>` + t(320, 110, '爆模', 'gd-r') +
        `<path d="M140 200 l-15 10 M140 190 l-18 4" class="gd-water-l"/>` + t(90, 190, '漏漿', 'gd-w')),
      zh: ['澆置中隨時注意有沒有爆模、漏漿；發現時立即停止該處澆置、補強後再繼續。'],
      vi: ['Trong khi đổ luôn chú ý có bung ván, chảy vữa không; phát hiện thì dừng đổ chỗ đó ngay, gia cố xong mới tiếp tục.'] },
    7: { svg: svg(rect(20, 100, 360, 100, 'gd-con') + [80, 130, 180, 230, 280].map(x => line(x, 60, x, 180, 'gd-vib')).join('') +
        dimH(80, 130, 50, '≦50cm') + t(200, 225, '每點 5～10 秒，看到表面泛漿、不再冒泡', 'gd-s')),
      zh: ['振動棒插入間距不大於 50cm，每點約 5～10 秒，表面泛漿、不再冒氣泡就移動。', '不可用振動棒推動混凝土橫向流動，也不可碰觸鋼筋、模板太久。'],
      vi: ['Đầm dùi cắm cách nhau không quá 50cm, mỗi điểm khoảng 5–10 giây, mặt nổi vữa, hết bọt khí thì di chuyển.', 'Không dùng đầm dùi đẩy bê tông chảy ngang, không chạm thép, ván khuôn quá lâu.'] },
    8: { svg: svg(rect(150, 100, 100, 120, 'gd-plank') + line(200, 20, 200, 120, 'gd-pipe-b') + dimV(270, 120, 180, '≦60cm') + rect(152, 180, 96, 40, 'gd-con') +
        t(200, 236, '出料口離澆置面不超過 60cm，避免粒料分離', 'gd-s')),
      zh: ['輸送管出口離澆置面不可大於 60cm，太高混凝土會粒料分離（石子和砂漿分開）。', '柱、牆較高時用軟管伸入或分層澆置。'],
      vi: ['Miệng ống cách mặt đổ không quá 60cm, quá cao bê tông sẽ phân tầng (đá và vữa tách nhau).', 'Cột, vách cao thì dùng ống mềm thả xuống hoặc đổ theo lớp.'] },
    9: { svg: svg(rect(60, 80, 120, 80, 'gd-truck') + `<path d="M200 60 l60 0 l0 40" class="gd-water-l"/>` + t(230, 50, '✘ 加水', 'gd-ngt') + t(200, 200, '加水會降低強度，嚴禁', 'gd-r')),
      zh: ['澆置過程中嚴禁在車上或現場加水。坍度不足要退貨或依配比由廠商處理。'],
      vi: ['Trong quá trình đổ nghiêm cấm thêm nước trên xe hoặc tại hiện trường. Độ sụt không đủ thì trả hàng hoặc do nhà cung cấp xử lý theo cấp phối.'] },
    10: { svg: svg(rect(20, 120, 360, 60, 'gd-con') + rect(150, 100, 100, 10, 'gd-steel') + line(250, 105, 300, 60, 'gd-pipe') + t(200, 80, '刮平、鏝平', 'gd-r') + t(200, 210, '依標高器收平，排水坡度依圖', 'gd-s')),
      zh: ['依標高器刮平、鏝平，收尾表面平整；有排水坡度的地方依圖做出坡度。'],
      vi: ['Gạt phẳng, xoa phẳng theo cọc mốc cao độ, bề mặt hoàn thiện phẳng; chỗ có độ dốc thoát nước làm theo bản vẽ.'] },
    11: { svg: svg(rect(20, 130, 360, 50, 'gd-con') + rect(20, 120, 360, 10, 'gd-burlap') + [80, 200, 320].map(x => `<path d="M${x} 60 l0 40" class="gd-water-l"/>`).join('') +
        t(200, 50, '灑水＋蓋麻布，保持濕潤', 'gd-r') + t(200, 210, '依規範養護天數（一般 7 天以上）', 'gd-s')),
      zh: ['澆置後灑水並覆蓋麻布（或養護劑），保持表面濕潤。', '養護天數依規範或契約，一般至少 7 天；天氣炎熱、風大時更要注意。'],
      vi: ['Sau khi đổ tưới nước và phủ bao tải (hoặc chất bảo dưỡng), giữ mặt luôn ẩm.', 'Số ngày bảo dưỡng theo quy phạm hoặc hợp đồng, thường ít nhất 7 ngày; trời nóng, gió lớn càng phải chú ý.'] },
    12: { svg: svg(rect(60, 40, 280, 150, 'gd-con') + [[150, 110], [170, 125], [160, 95], [185, 105]].map(([x, y]) => dot(x, y, 6, 'gd-hole')).join('') + t(165, 160, '蜂窩', 'gd-r') +
        t(200, 215, '小：無收縮水泥修補　大：重新封模澆置', 'gd-s')),
      zh: ['小面積蜂窩：鑿除鬆動部分、清洗後以無收縮水泥修補。', '蜂窩過大或露筋：回報工地主任與監造，重新封模澆置混凝土。'],
      vi: ['Rỗ tổ ong diện tích nhỏ: đục bỏ phần bở, rửa sạch rồi trám bằng xi măng không co ngót.', 'Rỗ quá lớn hoặc lộ thép: báo chỉ huy trưởng và giám sát, đóng ván lại và đổ bê tông lại.'] },
  };

  /* ---------- 42 樓梯鋼筋 ---------- */
  const stair = `<path d="M40 215 L40 190 L80 190 L80 165 L120 165 L120 140 L160 140 L160 115 L200 115 L200 90 L340 90 L340 112 L220 112 L60 232 L40 232 Z" class="gd-con"/>`;
  const G42 = {
    0: { svg: svg(dot(100, 90, 13, 'gd-bar-cut') + dot(200, 90, 16, 'gd-bar-cut') + dot(300, 90, 19, 'gd-bar-cut') + t(200, 150, '號數、材質（SD280／SD420）依圖', 'gd-r') + t(200, 180, '看鋼筋軋印、核對進料單', 'gd-s')),
      zh: ['依圖確認樓梯鋼筋號數、材質，看鋼筋軋印並核對進料單。'],
      vi: ['Xác nhận số hiệu, mác thép cầu thang theo bản vẽ, xem ký hiệu cán trên thanh và đối chiếu phiếu nhập.'] },
    1: { svg: svg(stair + line(60, 222, 215, 106, 'gd-bar') + t(250, 170, '主筋：沿梯板斜向', 'gd-r', 'start') + t(250, 192, '直徑、間距、錨定依圖', 'gd-s', 'start')),
      zh: ['梯板主筋沿斜向配置，號數、間距、錨定長度依圖。'],
      vi: ['Thép chủ bản thang bố trí theo phương nghiêng, số hiệu, khoảng cách, chiều dài neo theo bản vẽ.'] },
    2: { svg: svg(stair + line(60, 222, 215, 106, 'gd-bar') + [90, 130, 170].map(x => dot(x, 222 - (x - 60) * 0.75 - 6, 3.5)).join('') + t(250, 170, '分佈筋：垂直主筋方向', 'gd-r', 'start')),
      zh: ['分佈筋和主筋垂直，號數、間距依圖。'],
      vi: ['Thép phân bố vuông góc với thép chủ, số hiệu, khoảng cách theo bản vẽ.'] },
    3: { svg: svg(stair + line(66, 216, 248, 92, 'gd-bar') + line(334, 106, 180, 106, 'gd-bar2') + dot(220, 112, 5, 'gd-tie') +
        t(200, 30, '✔ 兩支分開，各自伸過轉角錨定', 'gd-ok') + t(200, 52, '✘ 一支沿內角連續折過去', 'gd-ngt') + t(240, 135, '● 內角', 'gd-r', 'start')),
      zh: ['梯板和平台的轉折處（內角），鋼筋要分開彎折、各自錨定，不可以一支連續折過去。', '連續彎折的鋼筋受拉時會把內角混凝土拉裂（崩角）。'],
      vi: ['Tại chỗ gấp giữa bản thang và chiếu nghỉ (góc trong), thép phải bẻ riêng và neo riêng, không được một thanh gấp liền qua.', 'Thép gấp liền khi chịu kéo sẽ kéo bật bê tông góc trong (vỡ góc).'] },
    4: { svg: svg(rect(60, 90, 280, 30, 'gd-con') + line(70, 100, 330, 100, 'gd-bar') + line(70, 112, 330, 112, 'gd-bar') + t(200, 70, '平台鋼筋', 'gd-r') + t(200, 160, '直徑、間距依圖', 'gd-s')),
      zh: ['平台鋼筋的號數、間距依圖。'],
      vi: ['Số hiệu, khoảng cách thép chiếu nghỉ theo bản vẽ.'] },
    5: { svg: svg(line(40, 100, 250, 100, 'gd-bar') + line(160, 110, 360, 110, 'gd-bar2') + dimH(160, 250, 80, '搭接長度依圖')),
      zh: ['搭接長度依圖，相鄰鋼筋搭接位置錯開。'],
      vi: ['Chiều dài nối chồng theo bản vẽ, vị trí nối các thanh liền kề so le.'] },
    6: { svg: svg(rect(20, 140, 80, 80, 'gd-con') + t(60, 236, '梁', 'gd-s') + `<path d="M100 200 L300 60" class="gd-con-line"/>` +
        line(110, 195, 40, 195, 'gd-bar') + line(40, 195, 40, 160, 'gd-bar') + dimH(40, 100, 130, '錨入梁') ),
      zh: ['梯板鋼筋錨入支承的梁、板，錨定長度依圖。'],
      vi: ['Thép bản thang neo vào dầm, sàn đỡ, chiều dài neo theo bản vẽ.'] },
    7: { svg: svg(stair + line(66, 214, 215, 104, 'gd-bar') + rect(120, 180, 14, 10, 'gd-spacer') + t(250, 170, '樓梯板保護層 2cm', 'gd-r', 'start') + t(250, 192, '墊塊穩固', 'gd-s', 'start')),
      zh: ['樓梯板保護層 2cm，底部墊塊要放穩，斜面容易滑動。'],
      vi: ['Lớp bảo vệ bản thang 2cm, con kê đáy phải đặt chắc, mặt nghiêng dễ bị trượt.'] },
    8: { svg: svg(rect(80, 40, 240, 160, 'gd-paper') + [120, 160, 200, 240, 280].map(x => line(x, 45, x, 195, 'gd-bar')).join('') + [70, 110, 150, 190].map(y => line(85, y, 315, y, 'gd-bar2')).join('') +
        t(200, 225, '交點綁牢、不鬆脫位移', 'gd-r')),
      zh: ['鋼筋交點綁紮牢固，人踩過後也不會鬆脫位移。'],
      vi: ['Các điểm giao thép buộc chắc, người đi qua cũng không bị lỏng, xê dịch.'] },
    9: { svg: svg(stair + [90, 130, 170].map(x => rect(x - 4, 222 - (x - 40) * 0.75 - 44, 8, 8, 'gd-steel')).join('') + t(260, 170, '扶手預埋件不影響鋼筋', 'gd-r', 'start')),
      zh: ['扶手、欄杆預埋件位置正確並固定，不可切斷或移動主筋。'],
      vi: ['Chi tiết chôn sẵn tay vịn, lan can đặt đúng vị trí và cố định, không được cắt hoặc dời thép chủ.'] },
    10: { svg: svg(line(60, 80, 340, 80, 'gd-bar') + t(200, 60, '✔ 乾淨', 'gd-ok') + line(60, 160, 340, 160, 'gd-bar') + [100, 160, 250].map(x => dot(x, 160, 7, 'gd-rust')).join('') + t(200, 140, '✘ 油污、泥土、浮鏽', 'gd-ngt')),
      zh: ['鋼筋表面不可有油污、泥土、浮鏽，否則和混凝土握裹不好；澆置前清除。'],
      vi: ['Bề mặt thép không được dính dầu, bùn đất, gỉ bong, nếu không bám dính bê tông kém; làm sạch trước khi đổ.'] },
  };

  Object.assign(window.SK_GUIDES, { '08': G08, '11': G11, '12': G12, '42': G42 });
})();
