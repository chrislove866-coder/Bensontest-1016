/**
 * 看圖說：基礎與假設工程（23 鋼軌樁、39 基礎、40 回填夯實、46 中間樁及構台樁、47 構台）
 * 畫圖工具來自 self-check-guides.js 的 window.SK_GD；法規依「營造安全衛生設施標準」（115-06-30 修正）
 */
(function () {
  const { svg, t, line, rect, dot, dimH, dimV, ok, hbeam, pit } = window.SK_GD;

  const soil = (y = 60) => `<rect x="20" y="${y}" width="360" height="${240 - y - 10}" class="gd-soil"/>` + line(20, y, 380, y, 'gd-floor');
  const rail = (x, y1, y2, cls = 'gd-pipe-b') => line(x, y1, x, y2, cls);
  const docList = (title, rows) => svg(rect(60, 20, 280, 200, 'gd-paper') + t(200, 44, title, 'gd-b') + rows.map((r, i) => ok(80, 80 + i * 30, r)).join(''));
  const plumbPic = (title, note) => svg(soil(80) + rail(110, 30, 220) + t(110, 22, '✔ 垂直', 'gd-ok') +
    line(290, 30, 250, 220, 'gd-pipe-bad') + t(290, 22, '✘ 傾斜', 'gd-ngt') + line(150, 30, 150, 220, 'gd-laser') + t(200, 236, note, 'gd-s') + t(200, 60, title, 'gd-r'));

  /* ---------- 23 鋼軌樁 ---------- */
  const G23 = {
    0: { svg: svg(soil(140) + `<path d="M190 140 L210 140 L200 125 Z" class="gd-tri"/>` + t(200, 115, 'BM 高程基準', 'gd-r') +
        line(40, 100, 360, 100, 'gd-ctrl') + t(200, 90, '基準線（引到工區外不會被破壞的地方）', 'gd-g')),
      zh: ['工區內要能找到高程基準點（BM）和基準線，並引到施工不會破壞的位置保護好。'],
      vi: ['Trong khu thi công phải tìm được điểm chuẩn cao độ (BM) và đường chuẩn, dẫn ra vị trí thi công không phá hỏng và bảo vệ.'] },
    1: { svg: svg(rect(20, 20, 360, 200, 'gd-paper') + rect(40, 40, 110, 70, 'gd-plank') + t(95, 80, '材料堆置區', 'gd-s') +
        `<path d="M40 170 L360 170" class="gd-route"/>` + t(200, 160, '重機械行進路線', 'gd-r') + rect(250, 40, 110, 70, 'gd-con') + t(305, 80, '其他工項', 'gd-s')),
      zh: ['事先規劃材料堆置區和重機械行進路線，不可擋到其他工項或壓到管線。'],
      vi: ['Lên kế hoạch trước bãi tập kết vật liệu và đường đi của máy móc nặng, không cản các hạng mục khác hoặc đè lên đường ống.'] },
    2: { svg: svg(`<path d="M150 60 L250 60 L240 75 L212 75 L212 170 L240 170 L250 185 L150 185 L160 170 L188 170 L188 75 L160 75 Z" class="gd-steel"/>` +
        dimH(150, 250, 50, '寬') + dimV(265, 60, 185, '高') + t(200, 220, '量高 × 寬，和施工圖規格比對（表上填寫）', 'gd-s')),
      zh: ['鋼軌樁進場量斷面高 × 寬，和施工圖規格比對（數值填在表上）；彎曲、損傷的不可使用。'],
      vi: ['Cọc ray nhập về đo chiều cao × chiều rộng tiết diện, đối chiếu quy cách bản vẽ (ghi số liệu vào phiếu); thanh cong, hư hỏng không được dùng.'] },
    3: { svg: svg(line(40, 120, 360, 120, 'gd-pipe-b') + dimH(40, 360, 100, 'L = 12m（依圖）') + t(200, 170, '進場時用捲尺量長度', 'gd-s')),
      zh: ['鋼軌樁長度依圖（表上例 L=12m），進場時抽量。'],
      vi: ['Chiều dài cọc ray theo bản vẽ (ví dụ trên phiếu L=12m), kiểm tra khi nhập về.'] },
    4: { svg: svg(line(40, 120, 360, 120, 'gd-axis') + [80, 140, 200, 260, 320].map(x => dot(x, 120, 6, 'gd-tie')).join('') + dot(212, 132, 6, 'gd-rust') +
        t(200, 90, '依施工圖 X、Y 座標放樣', 'gd-r') + t(200, 170, '點位誤差 ≦ 10cm', 'gd-b')),
      zh: ['依施工圖的 X、Y 座標放出每一支樁位，誤差 10cm 以內。'],
      vi: ['Định vị từng cọc theo tọa độ X, Y của bản vẽ, sai số trong 10cm.'] },
    5: { svg: svg(soil(140) + [80, 120, 160, 200, 240, 280, 320].map(x => rail(x, 40, 220)).join('') + dimH(120, 160, 30, '@40cm')),
      zh: ['鋼軌依圖豎立，間距（例 @40cm）誤差 10cm 以內。'],
      vi: ['Ray dựng đứng theo bản vẽ, khoảng cách (ví dụ @40cm) sai số trong 10cm.'] },
    6: { svg: svg(soil(90) + rect(220, 90, 160, 140, 'gd-con') + t(300, 160, '結構體', 'gd-s') + line(200, 30, 186, 225, 'gd-pipe-b') +
        t(110, 40, '可略向基地外傾', 'gd-ok') + t(110, 62, '不可傾入結構體內', 'gd-ngt')),
      zh: ['鋼軌樁的垂直度依地質而定，可以略向基地外傾斜，但絕對不可傾斜侵入結構體範圍。'],
      vi: ['Độ thẳng đứng của cọc ray tùy địa chất, có thể hơi nghiêng ra ngoài công trường nhưng tuyệt đối không được nghiêng lấn vào phạm vi kết cấu.'] },
    7: { svg: svg(soil(140) + [80, 130, 180, 230, 280, 330].map((x, i) => rail(x, 60 + (i % 3) * 8, 220)).join('') + line(60, 60, 350, 60, 'gd-mark') +
        dimV(355, 60, 76, '≦50mm', 'left') + t(200, 40, '樁頂齊平（方便日後拔樁）', 'gd-r')),
      zh: ['樁頂高程要齊平，誤差 50mm 以內，以方便日後拔樁為原則。'],
      vi: ['Cao độ đỉnh cọc phải bằng nhau, sai số trong 50mm, nguyên tắc là thuận tiện cho việc nhổ cọc sau này.'] },
    8: { svg: docList('打設完成檢查', ['支數、間距符合圖說', '長度、入土深度', '樁頂高程', '打設紀錄完整']),
      zh: ['打設完成後依圖核對支數、間距、長度和入土深度，並保留打設紀錄。'],
      vi: ['Sau khi đóng xong đối chiếu bản vẽ về số cọc, khoảng cách, chiều dài và độ sâu ngàm đất, lưu giữ nhật ký đóng cọc.'] },
    9: { svg: svg(soil(150) + [80, 140, 200, 260, 320].map(x => rail(x, 50, 220)).join('') + t(200, 35, '露出部分平整、無變形', 'gd-r')),
      zh: ['樁的露出部分要平整、沒有打壞變形；樁頭變形影響後續施工與拔樁。'],
      vi: ['Phần cọc lộ ra phải bằng phẳng, không bị đóng hỏng biến dạng; đầu cọc biến dạng ảnh hưởng thi công sau và nhổ cọc.'] },
  };

  /* ---------- 39 基礎 ---------- */
  const G39 = {
    0: { svg: svg(pit(60, 170) + line(100, 170, 300, 170, 'gd-mark') + dimV(320, 60, 170, 'GL − ○m') + t(200, 162, '設計底面', 'gd-r') +
        t(200, 215, '不得超挖；超挖不可用土回填', 'gd-b')),
      zh: ['開挖底面高程依圖（填在表上），不得超挖。', '超挖部分不可用土方回填，要依設計以混凝土（或監造同意的材料）補到高程。'],
      vi: ['Cao độ đáy hố đào theo bản vẽ (ghi vào phiếu), không được đào quá.', 'Phần đào quá không được lấp bằng đất, phải bù đến cao độ bằng bê tông (hoặc vật liệu được giám sát chấp thuận) theo thiết kế.'] },
    1: { svg: svg(pit(60, 170) + `<path d="M140 170 Q170 160 200 170" class="gd-water-l"/>` + t(170, 155, '積水', 'gd-w') + t(260, 155, '浮土', 'gd-r') +
        t(200, 215, '清除浮土、積水，確認無軟弱土層', 'gd-b')),
      zh: ['基底的浮土、積水要清除乾淨，確認沒有軟弱土層；有軟弱土層回報監造處理。'],
      vi: ['Đất tơi, nước đọng ở đáy móng phải dọn sạch, xác nhận không có lớp đất yếu; có đất yếu báo giám sát xử lý.'] },
    2: { svg: svg(pit(60, 170) + rect(270, 160, 25, 25, 'gd-sump') + t(282, 150, '集水坑＋抽水', 'gd-w') + t(200, 215, '抽排水運作正常，基底無積水', 'gd-b')),
      zh: ['抽排水設施要正常運作，基底保持沒有積水（營造安全衛生設施標準第 65 條：開挖應設排水設備）。'],
      vi: ['Thiết bị bơm thoát nước phải hoạt động bình thường, đáy móng giữ không đọng nước (Điều 65: hố đào phải có thiết bị thoát nước).'] },
    3: { svg: svg(line(40, 80, 360, 80, 'gd-axis') + line(40, 170, 360, 170, 'gd-axis') + line(120, 40, 120, 210, 'gd-axis') + line(280, 40, 280, 210, 'gd-axis') +
        [[120, 80], [280, 80], [120, 170], [280, 170]].map(([x, y]) => rect(x - 25, y - 25, 50, 50, 'gd-check')).join('') + t(200, 230, '依基礎平面圖放出軸線、基礎外框', 'gd-s')),
      zh: ['依基礎平面圖放出軸線和基礎外框，軸線位置正確。'],
      vi: ['Định vị trục và đường bao móng theo mặt bằng móng, vị trí trục phải chính xác.'] },
    4: { svg: svg(soil(150) + rect(60, 130, 280, 20, 'gd-con') + dimV(350, 130, 150, 'PC 厚') + t(200, 110, 'PC 層（打底混凝土）：表面平整、無積水', 'gd-r') +
        t(200, 210, '厚度、強度填在表上', 'gd-s')),
      zh: ['PC 層（打底混凝土）厚度與強度依圖（填在表上），表面平整、沒有積水。'],
      vi: ['Lớp bê tông lót (PC) chiều dày và cường độ theo bản vẽ (ghi vào phiếu), bề mặt phẳng, không đọng nước.'] },
    5: { svg: svg(rect(40, 30, 320, 180, 'gd-paper') + [80, 130, 180, 230, 280, 330].map(x => line(x, 35, x, 205, 'gd-bar')).join('') + [60, 110, 160].map(y => line(45, y, 355, y, 'gd-bar2')).join('') +
        dimH(80, 130, 228, '間距依圖', -6)),
      zh: ['基礎鋼筋號數、間距、上下層依結構設計圖。'],
      vi: ['Số hiệu, khoảng cách, lớp trên lớp dưới của thép móng theo bản vẽ kết cấu.'] },
    6: { svg: svg(soil(170) + rect(60, 60, 280, 110, 'gd-con') + line(70, 152, 330, 152, 'gd-bar') + line(70, 80, 330, 80, 'gd-bar') +
        dimV(350, 152, 170, '7.5cm') + rect(120, 156, 16, 14, 'gd-spacer') + `<path d="M200 152 L210 90 L250 90 L260 152" class="gd-chair"/>` + t(230, 120, '馬椅', 'gd-s')),
      zh: ['直接澆置在土壤上的基礎，保護層 7.5cm。', '底層用墊塊、上層用馬椅撐住，要穩固不會被踩倒。'],
      vi: ['Móng đổ trực tiếp trên đất, lớp bảo vệ 7,5cm.', 'Lớp dưới dùng con kê, lớp trên đỡ bằng chân ngựa, phải chắc không bị giẫm đổ.'] },
    7: { svg: svg(rect(40, 140, 320, 70, 'gd-con') + [150, 180, 220, 250].map(x => line(x, 195, x, 30, 'gd-bar') + line(x, 195, x + (x < 200 ? -20 : 20), 195, 'gd-bar')).join('') +
        t(200, 225, '柱插筋：位置、支數、錨定依圖', 'gd-r') + dimV(280, 140, 195, '錨定')),
      zh: ['柱、牆插筋的位置、支數、錨入基礎的長度與彎鉤依圖；用箍筋或定位架固定，澆置時不可位移。'],
      vi: ['Vị trí, số thanh, chiều dài neo vào móng và móc của thép chờ cột, vách theo bản vẽ; cố định bằng đai hoặc khung định vị, khi đổ không được xê dịch.'] },
    8: { svg: svg(rect(40, 80, 160, 120, 'gd-con') + rect(200, 80, 160, 120, 'gd-con-new') + rect(194, 110, 12, 60, 'gd-waterstop') +
        t(200, 70, '施工縫：止水帶連續、搭接確實', 'gd-r') + t(200, 225, '不可破損、斷裂', 'gd-s')),
      zh: ['施工縫處設止水帶，要連續沒有斷裂，接頭搭接或熔接確實。', '澆置時固定好，不可被壓倒或破損。'],
      vi: ['Tại mạch ngừng thi công đặt băng cản nước, phải liên tục không đứt, mối nối chồng hoặc hàn chắc chắn.', 'Khi đổ phải cố định tốt, không bị đè đổ hoặc rách.'] },
    9: { svg: svg(rect(40, 80, 320, 120, 'gd-con') + rect(160, 80, 80, 60, 'gd-hole') + dimH(160, 240, 70, '尺寸') + dimV(250, 80, 140, '深度') + t(200, 225, '集水坑、機坑依圖', 'gd-s')),
      zh: ['集水坑、機坑（電梯坑）的尺寸、深度、高程依圖。'],
      vi: ['Kích thước, độ sâu, cao độ hố thu nước, hố kỹ thuật (hố thang máy) theo bản vẽ.'] },
    10: { svg: svg(rect(40, 60, 320, 140, 'gd-paper') + dot(120, 110, 18, 'gd-hole') + t(120, 150, '人孔', 'gd-s') + dot(220, 110, 8, 'gd-hole') + t(220, 150, '通氣孔', 'gd-s') +
        line(270, 110, 340, 110, 'gd-pipe-b') + t(305, 150, '連通管', 'gd-s')),
      zh: ['人孔、通氣孔、連通管的位置、尺寸、數量依圖。'],
      vi: ['Vị trí, kích thước, số lượng lỗ thăm, lỗ thông hơi, ống thông nhau theo bản vẽ.'] },
    11: { svg: svg(rect(40, 60, 320, 140, 'gd-con') + [120, 200, 280].map(x => rect(x - 10, 50, 20, 160, 'gd-pipe-w')).join('') + t(200, 40, '預埋管、套管固定牢靠', 'gd-r')),
      zh: ['預埋管、套管位置與數量依水電圖，綁紮固定牢靠，管口封好。'],
      vi: ['Vị trí và số lượng ống chôn sẵn, ống lồng theo bản vẽ điện nước, buộc cố định chắc, miệng ống bịt kín.'] },
  };

  /* ---------- 40 回填夯實 ---------- */
  const backfill = (layers = true) => rect(40, 30, 60, 200, 'gd-con') + t(70, 20, '外牆', 'gd-s') + rect(100, 30, 8, 200, 'gd-waterproof') +
    (layers ? [0, 1, 2, 3].map(i => rect(108, 190 - i * 40, 272, 40, i % 2 ? 'gd-soil' : 'gd-soil-l')).join('') : '');
  const G40 = {
    0: { svg: svg(backfill(false) + t(240, 90, '結構體達設計強度', 'gd-ok', 'middle') + t(240, 120, '外牆防水層、保護層完成', 'gd-ok') + t(240, 160, '才可以回填', 'gd-r')),
      zh: ['結構體達設計強度、外牆防水層與保護層都完成後才可以回填。'],
      vi: ['Kết cấu đạt cường độ thiết kế, lớp chống thấm và lớp bảo vệ vách ngoài đều xong mới được lấp đất.'] },
    1: { svg: svg(backfill(false) + `<path d="M120 220 Q200 205 370 220" class="gd-water-l"/>` + [[160, 180], [250, 190], [320, 170]].map(([x, y]) => rect(x, y, 26, 8, 'gd-plank')).join('') +
        t(240, 120, '積水抽乾、木料垃圾清除', 'gd-r')),
      zh: ['回填前把積水抽乾，木料、垃圾等雜物清除，不可埋在土裡。'],
      vi: ['Trước khi lấp, bơm khô nước đọng, dọn gỗ, rác và tạp vật, không được chôn trong đất.'] },
    2: { svg: svg(backfill() + t(240, 18, '材料：不含有機物、垃圾、混凝土塊', 'gd-r') + t(240, 236, '最大粒徑依表', 'gd-s')),
      zh: ['回填材料依設計，不可含有機物、垃圾、混凝土塊，最大粒徑依表上填寫。'],
      vi: ['Vật liệu lấp theo thiết kế, không được lẫn chất hữu cơ, rác, khối bê tông, cỡ hạt lớn nhất theo phiếu.'] },
    3: { svg: svg(backfill() + dimV(390, 150, 190, '每層', 'left') + t(240, 18, '分層鋪平、分層夯實', 'gd-r')),
      zh: ['分層回填，每層鬆方厚度不超過表上規定，鋪平後夯實再填下一層。', '一次填太厚，下層會夯不實，日後沉陷。'],
      vi: ['Lấp theo lớp, chiều dày đất tơi mỗi lớp không vượt quy định trên phiếu, san phẳng đầm chặt rồi mới lấp lớp tiếp.', 'Lấp quá dày một lần, lớp dưới không đầm chặt được, sau này bị lún.'] },
    4: { svg: svg(rect(80, 60, 240, 130, 'gd-soil') + t(200, 40, '用手握一把土', 'gd-b') + t(200, 120, '能握成團、不滴水 ≒ 接近最佳含水量', 'gd-s') +
        t(200, 215, '太乾灑水、太濕翻曬', 'gd-r')),
      zh: ['回填土含水量要接近最佳含水量（試驗值填在表上）。', '太乾要灑水，太濕要翻曬，否則夯不實。'],
      vi: ['Độ ẩm đất lấp phải gần độ ẩm tối ưu (giá trị thí nghiệm ghi vào phiếu).', 'Quá khô thì tưới nước, quá ướt thì phơi xới, nếu không sẽ đầm không chặt.'] },
    5: { svg: svg(backfill() + rect(120, 130, 30, 30, 'gd-jack') + t(135, 120, '小型夯實機', 'gd-ok') + rect(280, 100, 80, 40, 'gd-truck') + t(320, 90, '✘ 重機具靠牆衝擊', 'gd-ngt')),
      zh: ['結構物旁邊用小型夯實機（跳跳夯、平板夯）。', '不可用重機具在牆邊衝擊或碾壓，會壓壞外牆和防水層。'],
      vi: ['Cạnh kết cấu dùng máy đầm nhỏ (đầm cóc, đầm bàn).', 'Không dùng máy nặng va đập hoặc lu sát vách, sẽ làm hỏng vách ngoài và lớp chống thấm.'] },
    6: { svg: svg(backfill() + dot(240, 170, 10, 'gd-tie') + t(240, 18, '夯實度 ≧ 表上規定（改良式普氏試驗）', 'gd-r')),
      zh: ['夯實度要達表上規定（以改良式普氏試驗的最大乾密度為準）。'],
      vi: ['Độ chặt phải đạt quy định trên phiếu (theo dung trọng khô lớn nhất của thí nghiệm Proctor cải tiến).'] },
    7: { svg: svg(backfill() + [[160, 170], [260, 130], [330, 90]].map(([x, y], i) => dot(x, y, 8, 'gd-tie') + t(x, y - 12, `#${i + 1}`, 'gd-r')).join('') + t(240, 236, '記錄試驗位置、深度、結果', 'gd-s')),
      zh: ['依規範頻率做工地密度試驗（例如砂錐法），記錄試驗位置、深度和結果。'],
      vi: ['Thí nghiệm dung trọng hiện trường theo tần suất quy phạm (ví dụ phương pháp rót cát), ghi lại vị trí, độ sâu và kết quả.'] },
    8: { svg: svg(backfill() + rect(108, 30, 10, 200, 'gd-protect') + t(240, 18, '防水層外加保護板，回填時不可刮破', 'gd-r')),
      zh: ['回填時不可損壞外牆防水層和保護板；靠牆的地方用人工或小機具小心回填。'],
      vi: ['Khi lấp không được làm hỏng lớp chống thấm và tấm bảo vệ vách ngoài; sát vách lấp cẩn thận bằng tay hoặc máy nhỏ.'] },
    9: { svg: svg(soil(80) + dot(200, 160, 18, 'gd-pipe-w') + `<circle cx="200" cy="160" r="40" class="gd-sand"/>` + dot(200, 160, 18, 'gd-pipe-w') + t(200, 225, '管線周圍用細砂或細料', 'gd-r')),
      zh: ['埋設管線周圍先用細砂或細料包覆回填，不可直接倒入石塊壓破管子。'],
      vi: ['Xung quanh đường ống chôn phải lấp bao bằng cát mịn hoặc vật liệu mịn trước, không đổ đá trực tiếp làm vỡ ống.'] },
    10: { svg: svg(`<path d="M20 120 L380 140 L380 230 L20 230 Z" class="gd-soil"/>` + line(20, 120, 380, 140, 'gd-floor') + t(200, 100, '完成面高程、排水坡度依圖', 'gd-r') + t(330, 160, '→ 排水方向', 'gd-w')),
      zh: ['完成面高程和排水坡度依圖，水要往設計的方向流，不可流向建築物。'],
      vi: ['Cao độ mặt hoàn thiện và độ dốc thoát nước theo bản vẽ, nước phải chảy theo hướng thiết kế, không chảy về phía công trình.'] },
    11: { svg: svg(soil(110) + t(110, 90, '✔ 平整', 'gd-ok') + `<path d="M230 110 Q290 135 350 110" class="gd-heave"/>` + t(290, 90, '✘ 沉陷、龜裂', 'gd-ngt')),
      zh: ['完成面要平整，沒有明顯沉陷或龜裂；有沉陷要挖開重新分層夯實。'],
      vi: ['Mặt hoàn thiện phải phẳng, không lún hoặc nứt rõ; có lún phải đào lên đầm lại theo lớp.'] },
  };

  /* ---------- 46 中間樁及構台樁 ---------- */
  const G46 = {
    0: { svg: svg(hbeam(140, 40, 120, 120, 14, 9) + t(200, 190, 'H350×350×12×19，L = 11.5m（依圖）', 'gd-r')),
      zh: ['中間樁材料規格、長度依圖（表上例 H350×350×12×19、L=11.5m），進場抽量並核對材料證明。'],
      vi: ['Quy cách, chiều dài vật liệu cọc trung gian theo bản vẽ (ví dụ H350×350×12×19, L=11,5m), kiểm tra khi nhập và đối chiếu chứng chỉ vật liệu.'] },
    1: { svg: svg(hbeam(140, 40, 120, 120, 14, 9) + t(200, 190, '構台樁：規格、長度依圖', 'gd-r')),
      zh: ['構台樁材料規格、長度依圖，進場抽量並核對材料證明。'],
      vi: ['Quy cách, chiều dài vật liệu cọc sàn thao tác theo bản vẽ, kiểm tra khi nhập và đối chiếu chứng chỉ vật liệu.'] },
    2: { svg: svg(line(40, 110, 360, 110, 'gd-axis') + line(200, 40, 200, 200, 'gd-axis') + rect(190, 100, 20, 20, 'gd-steel') + `<circle cx="200" cy="110" r="30" class="gd-check"/>` +
        t(250, 70, '誤差 ≦ 5cm', 'gd-r', 'start')),
      zh: ['中間樁點位依施工圖放樣，誤差 5cm 以內（中間樁要對準支撐交點）。'],
      vi: ['Vị trí cọc trung gian định vị theo bản vẽ, sai số trong 5cm (cọc trung gian phải đúng giao điểm thanh chống).'] },
    3: { svg: svg(soil(60) + line(200, 30, 200, 210, 'gd-pipe-b') + dimV(230, 60, 210, '打設深度依圖')),
      zh: ['中間樁打設深度依圖，記錄實際打設深度。'],
      vi: ['Độ sâu đóng cọc trung gian theo bản vẽ, ghi lại độ sâu đóng thực tế.'] },
    4: { svg: plumbPic('垂直度：依地質不同而異', '施打中隨時以吊線或經緯儀檢查'),
      zh: ['中間樁要盡量垂直，施打過程中用吊線或經緯儀兩個方向檢查。'],
      vi: ['Cọc trung gian phải thẳng đứng nhất có thể, trong khi đóng kiểm tra hai phương bằng dây dọi hoặc máy kinh vĩ.'] },
    5: { svg: svg(soil(60) + line(200, 30, 200, 210, 'gd-pipe-b') + dimV(230, 60, 210, '構台樁深度依圖')),
      zh: ['構台樁打設深度依圖，記錄實際深度。'],
      vi: ['Độ sâu đóng cọc sàn thao tác theo bản vẽ, ghi lại độ sâu thực tế.'] },
    6: { svg: svg(line(200, 30, 200, 115, 'gd-pipe-b') + line(200, 125, 200, 220, 'gd-pipe-b') + rect(188, 112, 24, 16, 'gd-weld-z') + t(240, 125, '續接處：對齊、滿銲', 'gd-r', 'start')),
      zh: ['構台樁續接處上下要對齊平整，全斷面滿銲（必要時加補強鈑），不可只點銲。'],
      vi: ['Mối nối cọc sàn thao tác phải thẳng hàng bằng phẳng, hàn đầy toàn tiết diện (khi cần thêm bản gia cường), không được chỉ hàn đính.'] },
    7: { svg: plumbPic('接樁後垂直度', '接樁後再檢查一次，不可折角'),
      zh: ['接樁後再檢查一次垂直度，上下兩節不可折角。'],
      vi: ['Sau khi nối cọc kiểm tra lại độ thẳng đứng, hai đoạn trên dưới không được gãy góc.'] },
    8: { svg: svg(soil(150) + [100, 200, 300].map(x => line(x, 60, x, 220, 'gd-pipe-b')).join('') + line(60, 60, 340, 60, 'gd-mark') + t(200, 45, '樁頂高程依圖', 'gd-r')),
      zh: ['完成後樁頂高程依圖，影響構台和支撐架設。'],
      vi: ['Cao độ đỉnh cọc sau khi hoàn thành theo bản vẽ, ảnh hưởng việc lắp sàn thao tác và thanh chống.'] },
  };

  /* ---------- 47 構台 ---------- */
  const deck = () => [100, 300].map(x => line(x, 120, x, 230, 'gd-pipe-b')).join('') + rect(60, 100, 280, 20, 'gd-steel') + rect(50, 86, 300, 14, 'gd-deck');
  const G47 = {
    0: { svg: svg(hbeam(60, 50, 110, 110, 14, 9) + t(115, 190, '主樑 H400×400', 'gd-r') + hbeam(240, 60, 100, 100, 12, 8) + t(290, 190, '副樑 H350×350', 'gd-r')),
      zh: ['構台主樑、副樑型鋼規格依圖（表上例：主樑 H400×400×13×21、副樑 H350×350×12×19），進場抽量並核對材料證明。'],
      vi: ['Quy cách thép hình dầm chính, dầm phụ sàn thao tác theo bản vẽ (ví dụ: dầm chính H400×400×13×21, dầm phụ H350×350×12×19), kiểm tra khi nhập và đối chiếu chứng chỉ.'] },
    1: { svg: svg(rect(60, 80, 280, 40, 'gd-deck') + [100, 160, 220, 280].map(x => line(x, 80, x, 120, 'gd-rib')).join('') + t(200, 60, '覆工板 MD-200×100×20（依圖）', 'gd-r') + t(200, 160, '無變形、無破損', 'gd-s')),
      zh: ['覆工板規格依圖（表上例 MD-200×100×20），變形、破損的不可使用。'],
      vi: ['Quy cách tấm phủ mặt sàn thao tác theo bản vẽ (ví dụ MD-200×100×20), tấm biến dạng, hư hỏng không được dùng.'] },
    2: { svg: svg(deck() + line(20, 180, 380, 180, 'gd-red') + t(200, 170, '第一層支撐位置', 'gd-r') + t(200, 60, '構台高程依圖，不影響第一層支撐架設', 'gd-b')),
      zh: ['構台高程依圖，並確認不會影響第一層支撐的架設空間。'],
      vi: ['Cao độ sàn thao tác theo bản vẽ, xác nhận không ảnh hưởng không gian lắp thanh chống tầng thứ nhất.'] },
    3: { svg: svg(deck() + t(200, 60, '主、副樑架設位置、接合依圖', 'gd-r')),
      zh: ['主樑、副樑架設位置、間距和接合方式（螺栓、銲接）依圖。', '遭遇強風、大雨或四級以上地震後，要確認主要構材沒有異常（營造安全衛生設施標準第 62-2 條）。'],
      vi: ['Vị trí, khoảng cách và cách liên kết (bu lông, hàn) dầm chính, dầm phụ theo bản vẽ.', 'Sau gió mạnh, mưa lớn hoặc động đất cấp 4 trở lên phải xác nhận cấu kiện chính không bất thường (Điều 62-2).'] },
    4: { svg: svg(rect(40, 100, 320, 30, 'gd-steel') + [60, 140, 220].map(x => rect(x, 86, 76, 14, 'gd-deck')).join('') + dimH(136, 140, 70, '≦3cm') + t(200, 170, '覆工板間隙 3cm 以下', 'gd-r')),
      zh: ['覆工板依圖舖設，板與板間隙 3cm 以下（營造安全衛生設施標準第 62-1 條）。'],
      vi: ['Tấm phủ lát theo bản vẽ, khe hở giữa các tấm từ 3cm trở xuống (Điều 62-1).'] },
    5: { svg: svg(rect(40, 110, 320, 30, 'gd-steel') + rect(80, 96, 240, 14, 'gd-deck') + rect(70, 86, 10, 24, 'gd-weld-z') + rect(320, 86, 10, 24, 'gd-weld-z') +
        t(200, 70, '角鐵擋、銲接固定，防止滑動', 'gd-r')),
      zh: ['覆工板用角鐵擋住並銲接固定，避免車輛通過時滑動、跳動。'],
      vi: ['Tấm phủ chặn bằng thép góc và hàn cố định, tránh trượt, nảy khi xe chạy qua.'] },
    6: { svg: svg(deck() + line(60, 30, 60, 86, 'gd-red') + line(340, 30, 340, 86, 'gd-red') + line(60, 40, 340, 40, 'gd-red') + line(60, 63, 340, 63, 'gd-red') +
        dimV(370, 40, 86, '≧90cm', 'left') + t(200, 25, '構台周邊護欄', 'gd-r')),
      zh: ['構台周邊設安全欄杆：上欄杆 90cm 以上、中欄杆、腳趾板 10cm 以上（營造安全衛生設施標準第 20 條）。'],
      vi: ['Xung quanh sàn thao tác lắp lan can an toàn: thanh trên cao từ 90cm, thanh giữa, tấm chắn chân cao từ 10cm (Điều 20).'] },
  };

  Object.assign(window.SK_GUIDES, { '23': G23, '39': G39, '40': G40, '46': G46, '47': G47 });
})();
