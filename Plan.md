# PLAN DỰ ÁN "HỌC VÀ CHƠI" — v3 (Web / PWA)

> Ứng dụng học sớm bằng tiếng Việt cho bé 2–5 tuổi · **Web app (PWA) chạy trên iPad/iPhone Safari · dùng cá nhân, không kinh doanh**
> Công nghệ: TypeScript + React + Vite · Phát triển trên Windows · **VS Code + opencode** (vibe coding)
> Thiết bị: **iPad gen 11 (A16)** · Hosting: **GitHub Pages** · Giọng: **miền Nam** · Bé: **3 tuổi** · Chữ cái: **đủ 29 ở MVP** (xem mục 0.5)

---

## 0. Từ v2 sang v3

### 0.1 Quyết định mới

| # | Quyết định | Hệ quả |
|---|-----------|--------|
| 1 | **Chuyển từ Flutter/iOS native sang Web app (PWA)** | Không cần Mac, Xcode, chứng chỉ 7 ngày hay TestFlight. Cài ra màn hình chính iPad bằng "Thêm vào MH chính". Cập nhật bằng cách deploy lại. |
| 2 | **TypeScript + React + Vite** (SPA tĩnh, không server) | AI (opencode) viết rất tốt bộ này; không cần backend; build ra file tĩnh. |
| 3 | **Thiết bị đích chính: iPad Safari**; iPhone và desktop chỉ cần responsive | Test thật trên iPad thường xuyên; dev bằng Chrome trên Windows. |
| 4 | **Dev bằng VS Code + opencode** | `AGENTS.md` ở **gốc repo**, skill để trong `.opencode/skills/` (mục 14). |
| 5 | **Giữ nguyên** từ v2: 29 chữ cái tiếng Việt, dùng cá nhân, Mèo Bông, nội dung điều khiển bằng JSON, không tài khoản, không quảng cáo, không "thua" | Xem các mục 1, 4, 5, 7, 8. |

**Đánh đổi của web so với app native (cần biết trước):**

| Được | Mất / phải xử lý thêm |
|------|------------------------|
| Không cần Mac/Apple Developer, không hết hạn chứng chỉ | Không có chế độ "khóa app" thật → dùng **Truy cập được hướng dẫn (Guided Access)** của iPad (mục 11) |
| Một bản build chạy mọi thiết bị, test nhanh trên LAN | Safari có thể **xóa dữ liệu** nếu lâu không dùng → backup + `storage.persist()` (mục 10.5) |
| Cập nhật tức thì | **Âm thanh** trên iOS Safari có luật riêng (phải mở khóa bằng chạm; công tắc im lặng) → spike ở Phase 0 |
| Mở web = xem/sửa được ngay trong DevTools | Micro cần **HTTPS** (kể cả khi test trên LAN) |
| Có `window.print()` để in tranh tô/bảng chữ | Không có rung (haptics) trên iOS Safari |

### 0.2 Kết quả đánh giá v2

**Điểm mạnh (giữ lại toàn bộ):** phạm vi được khóa rõ; nguyên tắc "không thua, không áp lực"; engine + JSON (thêm bài không sửa code); nhìn thẳng vào việc **asset là khối lượng lớn nhất**; có Definition of Done cho từng hoạt động; xuất/nhập tiến trình; bảng rủi ro thực tế; style guide Mèo Bông đủ chi tiết để AI bám theo.

### 0.3 Vấn đề tìm thấy trong v2 và cách xử lý ở v3

| # | Vấn đề | Mức | Xử lý ở v3 |
|---|--------|:---:|-----------|
| 1 | **Cổng phụ huynh "nhập dãy số theo lời đọc"** dễ bị vượt qua, vì chính app dạy bé đọc số 1–10 | Cao | Bỏ; dùng giữ 2 góc + PIN tùy chọn (mục 9) |
| 2 | Cổng "giữ 2 góc" **mâu thuẫn** với quy tắc "bỏ qua chạm nhiều ngón" | Trung bình | Quy tắc chống chạm nhầm chỉ áp dụng ở màn chơi, không áp dụng ở màn cổng (mục 7, 9) |
| 3 | **Nhóm chữ cái 3 (11 chữ)** gộp b, d, đ, p, q: các cặp gương/lật này bé rất hay nhầm; 11 chữ/nhóm quá nhiều cho bé 3 tuổi | Cao | Chia **5 nhóm 5–6 chữ**, tách b/d và p/q sang nhóm khác nhau; MVP làm đủ 5 nhóm nhưng **mở khóa dần** theo tiến độ của bé (mục 4.2, 7) |
| 4 | Chỉ ghi kết quả theo **hoạt động**, không theo **từng chữ/số**; không thể biết bé hay nhầm chữ nào | Cao | Thêm `itemMastery` + ôn tập nhẹ (mục 7, 10.4) |
| 5 | Độ khó thích ứng "đúng 3 lần tăng, sai giảm" dễ **dao động qua lại** | Trung bình | Thêm ngưỡng, khoảng nghỉ, sàn theo tuổi (mục 7) |
| 6 | Hồ sơ bé có ở MVP nhưng **nhiều hồ sơ để Phase 3** → phải đổi schema | Trung bình | Schema có `profileId` ngay từ đầu; UI chỉ hiện 1 hồ sơ (mục 10.4) |
| 7 | Lưu **tên + năm sinh** của bé | Thấp | Chỉ lưu biệt danh + nhóm tuổi |
| 8 | Lộ trình: MVP 6–8 tuần với 24 hoạt động **và** ~230 asset là lạc quan; chưa có "lát cắt dọc" để phát hiện sớm lỗi kiến trúc | Cao | Phase 1a: làm **1 hoạt động mỗi mẫu** chạy trọn vòng với asset tạm, rồi mới nhân rộng (mục 16) |
| 9 | Thứ tự MVP bắt đầu bằng Chữ cái (nhiều asset nhất) | Trung bình | Bắt đầu bằng **Màu & hình** (ít asset, hợp 2–3 tuổi), rồi Số, rồi Chữ cái |
| 10 | Chưa có **giọng tạm** để test khi chưa thu âm | Trung bình | Placeholder bằng Web Speech (`vi-VN`) chỉ ở môi trường dev; tự thu bằng Studio thu âm (mục 9) |
| 11 | Chưa có quy tắc **Unicode NFC** cho tiếng Việt (cùng 1 chữ có thể có 2 dạng mã hóa → so khớp/đặt tên sai) | Trung bình | Quy tắc bắt buộc trong `AGENTS.md` + test (mục 4.5, 13) |
| 12 | Chỉ giới hạn **mỗi phiên**, chưa có giới hạn **mỗi ngày** hay giờ ngủ | Thấp | Thêm giới hạn ngày + giờ yên lặng (mục 9) |
| 13 | Chưa có xử lý **lỗi không được làm bé thấy** (crash, thiếu asset) | Trung bình | Error boundary "Mèo Bông thử lại nhé" + kiểm tra asset khi build (mục 7, 10.6) |
| 14 | Chưa có chiến lược **kiểm thử** cụ thể và kiểm tra "không gọi mạng" | Trung bình | Mục 15: Vitest + Playwright (WebKit) + CSP |
| 15 | Từ minh họa **yến** (chữ Y) ít quen với bé; vài từ có dấu thanh (ỉn, ủng) trước khi bé học dấu | Thấp | Đổi Y → "y tá"; hiển thị cả từ, chỉ nhấn chữ cái (mục 4.3) |

### 0.4 Tính năng cải tiến được thêm

| Tính năng | Phase |
|-----------|:-----:|
| **Studio thu âm** cho phụ huynh: danh sách ~115 câu cần thu, tiến độ "đã thu 45/115", nghe lại, thu lại, cắt khoảng lặng, chuẩn hóa âm lượng, nhập file có sẵn | 1b → 2 |
| **Ôn tập nhẹ theo từng chữ/số** (`itemMastery`): Mèo Bông chọn lại chữ bé hay nhầm, không tính điểm | 1b |
| **Chế độ 2–3 tuổi "không sai"** (errorless): chọn sai thì đáp án đúng tự sáng lên, không có "sai" | 1a |
| **Chế độ Tự do khám phá** (sandbox): chạm là nghe, không mục tiêu, không sao | 1b |
| **Chế độ quan sát** cho Phase 1.5: tự ghi lại chỗ bé chần chừ >6 giây, sai liên tiếp; xuất thành báo cáo "hoạt động nào khó" | 1b |
| **Giới hạn ngày + giờ yên lặng + nhắc vận động** ("Mèo Bông vươn vai") | 1b |
| **Nhắc sao lưu** (mỗi 7 ngày) + chia sẻ file backup qua Share Sheet của iOS | 1b |
| **Thẻ "chơi cùng con"** in được (`window.print()`): hoạt động ngoài đời gắn với chữ/số vừa học | 2 |
| **Tô chữ** bằng đường nét SVG có thứ tự nét, kiểm tra độ lệch, hỗ trợ dấu và mũ tiếng Việt | 2 |
| **Route `/dev`** (chỉ môi trường dev): xem trước mọi hoạt động theo ID, liệt kê asset thiếu, bật giọng tạm | 1a |
| **Sinh bảng asset tự động** từ JSON và script kiểm tra file thiếu/thừa/sai tên (thay bảng gõ tay) | 1a |
| Hỗ trợ **giảm chuyển động** (`prefers-reduced-motion`), tương phản cao, không chỉ dựa vào màu | 1a |

### 0.5 Quyết định đã chốt ở Phase 0

| Câu hỏi | Quyết định | Ảnh hưởng chính |
|---------|-----------|----------------|
| Thiết bị | **iPad gen 11 (chip A16)** | Đủ mạnh cho SVG + motion + âm thanh. Dùng iPadOS 26 trở lên thì thêm vào Màn hình chính mặc định mở dạng web app, nhưng có công tắc tắt được (mục 11.3) |
| Hosting | **GitHub Pages** | Gói Free cần **repo public** và site luôn công khai; không đặt được HTTP header; URL có đường dẫn con `/<repo>/` (mục 11.1, 12) |
| Giọng | **Miền Nam** | Từ vựng (heo, banh…), cách thu âm, dấu hỏi/ngã (mục 4.6, 6.6) |
| Tuổi bé | **3 tuổi** | Hồ sơ `3-4`; học 29 chữ là mục tiêu nhiều tháng, nên mở khóa dần (mục 2, 4.2) |
| Asset | **AI tạo rồi chỉnh** | Quy trình riêng để giữ đồng nhất (mục 6.5) |
| Từ minh họa chữ ⚠ | I: ỉn (heo) · U: ủng · Y: y tá · Ư: sư tử · P: pin · Q: quạt | Mục 4.3 |
| MVP chữ cái | **Đủ 29 chữ** | 15 hoạt động chữ cái, tổng MVP **30 hoạt động**; MVP dài hơn (mục 16) |
| Mèo Bông | **SVG nhiều lớp + motion** | Mục 5.6, 6.5 |

---

## 1. Tầm nhìn và phạm vi

"Học Và Chơi" là ứng dụng web riêng cho gia đình: bé học chữ cái tiếng Việt, số và màu sắc/hình dạng qua trò chơi chạm đơn giản, có nhân vật Mèo Bông đồng hành và **giọng đọc là người thân của bé**.

**Nguyên tắc cốt lõi**

- Bé không cần biết đọc vẫn tự chơi được.
- Không có "thua", không áp lực, không bảng xếp hạng.
- Không quảng cáo, không tài khoản, không theo dõi. **Sau lần tải đầu, app chạy hoàn toàn offline** và không gọi bất kỳ tên miền nào khác ngoài chính nó.
- Mỗi phiên ngắn (5–10 phút), kết thúc nhẹ nhàng.
- Thêm bài mới bằng cách thêm dữ liệu, không sửa lại code.
- Dữ liệu của bé (tiến trình, giọng thu) **chỉ nằm trong trình duyệt trên thiết bị của bé**, chỉ ra ngoài khi phụ huynh chủ động xuất file.

**Ngoài phạm vi:** app native, App Store, thu phí, tài khoản, backend/server, đồng bộ cloud, analytics.

---

## 2. Người dùng và mục tiêu học

| Nhóm | Mục tiêu | Chế độ mặc định |
|------|---------|-----------------|
| **2–3 tuổi** | Nghe, chạm, nhận biết màu, hình, đồ vật quen thuộc | Errorless, 2 lựa chọn, khám phá là chính |
| **3–4 tuổi** | Làm quen chữ cái (mặt chữ + âm), số 1–10, từ vựng | 2–3 lựa chọn, có gợi ý |
| **4–5 tuổi** | Đếm, ghép, phân loại, quy luật, làm quen tô chữ, dấu thanh, ghép vần | 3–4 lựa chọn, độ khó thích ứng |
| **Phụ huynh** | Cổng phụ huynh, xem tiến trình, thu âm giọng, chỉnh cài đặt, sao lưu | — |

**Hồ sơ bé:** biệt danh + nhóm tuổi (2–3 / 3–4 / 4–5). Nhóm tuổi quyết định số lựa chọn, độ khó khởi điểm và nội dung gợi ý.

**Hồ sơ hiện tại (bé 3 tuổi):** `ageBand = 3-4`. Mặc định 2–3 lựa chọn ở chữ cái, chạm–chạm thay vì kéo thả, mỗi phiên ≤ 10 phút. Có thể bật *errorless* trong 1–2 tuần đầu nếu bé dễ nản, tắt khi bé chọn đúng ổn định. Thứ tự gợi ý: Màu & hình → Số 1–5 → chữ cái nhóm 1. 29 chữ là mục tiêu **nhiều tháng**, không phải để học một lượt.

---

## 3. Nội dung theo module

| Module | Tuổi | Nội dung | Giai đoạn |
|--------|:----:|---------|:---------:|
| 🌈 Màu sắc & hình dạng | 2–5 | Màu cơ bản, hình cơ bản, phân loại | **MVP (làm đầu tiên)** |
| 🔢 Con số | 3–5 | Đếm 1–10, nhận số, nhiều/ít, lớn/nhỏ, ghép số–lượng | **MVP** |
| 🔤 Chữ cái tiếng Việt | 3–5 | Đủ 5 nhóm (29 chữ) ở MVP, **mở khóa dần** theo tiến độ của bé | **MVP** |
| 🖍️ Tô màu | 2–5 | Chọn màu, tô tranh, tô tự do; in tranh | Phase 2 |
| ✏️ Làm quen viết | 4–5 | Tô theo nét chữ cái, dấu thanh | Phase 2 |
| 🎵 Âm nhạc | 2–5 | Nhạc cụ tương tác, đồng dao (phạm vi công cộng hoặc tự thu) | Phase 2 |
| 🧩 Tư duy | 4–5 | Ghép hình, quy luật, hình còn thiếu, mê cung | Phase 3 |
| 📚 Truyện tương tác | 3–5 | Truyện ngắn 3–5 phút, vật thể chạm được | Phase 3 |
| 🏠 Nhà Mèo Bông | 2–5 | Sưu tầm sticker, trang trí nhà | Phase 3 |

### 3.1 Mẫu hoạt động (activity templates)

| Mã | Mẫu | Mô tả |
|----|-----|-------|
| `explore` | Khám phá | Chạm để nghe âm/tên, không đúng sai |
| `listen_pick` | Nghe–chọn | Mèo Bông nói, bé chọn đúng trong 2–4 lựa chọn |
| `match` | Ghép đôi | Ghép cặp (chữ–hình, số–lượng, hình–bóng) |
| `tap_count` | Đếm chạm | Chạm từng vật để đếm, Mèo Bông đếm theo |
| `sort` | Phân loại | Đưa vật vào đúng nhóm (theo màu, theo hình) |
| `trace` | Tô nét | (Phase 2) Tô theo đường nét chữ |

**Hai cách tương tác cho `match` và `sort` (bắt buộc có cả hai):**

- **Chạm–chạm** (chạm vật rồi chạm ô đích): mặc định cho 2–3 tuổi vì kéo thả còn khó.
- **Kéo thả**: cho 4–5 tuổi; vùng "hít" (snap) rộng, thả gần đúng vẫn nhận.

### 3.2 Danh sách hoạt động MVP (30)

| Module | Hoạt động | Mẫu |
|--------|-----------|-----|
| Màu & hình (7) | Khám phá màu; nghe–chọn màu; phân loại theo màu; khám phá hình; nghe–chọn hình; ghép hình–bóng; phân loại theo hình | explore, listen_pick, sort, match |
| Con số (8) | Khám phá 1–5; khám phá 6–10; đếm chạm 1–5; đếm chạm 6–10; nghe–chọn số; ghép số–lượng; nhiều/ít; lớn/nhỏ | explore, tap_count, listen_pick, match |
| Chữ cái (15) | Nhóm 1 đến 5: mỗi nhóm có *Khám phá*, *Nghe–chọn âm*, *Ghép chữ–hình* | explore, listen_pick, match |

**Tổng: 7 + 8 + 15 = 30 hoạt động.** Nhóm chữ 4–5 làm **cuối cùng** ở Phase 1b; bé 3 tuổi chưa cần đến ngay, nên đây là chỗ cắt an toàn nếu chậm (chỉ thêm dữ liệu, không đổi kiến trúc).

---

## 4. Chữ cái tiếng Việt: phạm vi chi tiết

### 4.1 Nguyên tắc

- **29 chữ cái:** A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y. Không đưa F, J, W, Z vào MVP.
- **Dạy ÂM trước, tên chữ sau** ("bờ, cờ, dờ…"). Tên chữ là tùy chọn ở Phase 2.
- Mỗi chữ có 1 **từ minh họa** gần gũi. Khi hiển thị từ, hiện **cả từ** và chỉ tô nổi chữ đang học (vì nhiều từ có dấu thanh mà bé chưa học dấu).
- Phần gợi ý nhóm và âm đọc bên dưới **nên đối chiếu với giáo viên mầm non / SGK Tiếng Việt lớp 1** trước khi thu âm.

### 4.2 Năm nhóm chữ cái (gợi ý, thay cho 3 nhóm của v2)

Nguyên tắc chia: nguyên âm trước (đơn giản, dùng nhiều); mỗi nhóm 5–6 chữ; **tách các cặp bé hay nhầm** (b/d, p/q: gương/lật; d/đ được dạy cùng nhóm có chủ đích để so sánh).

| Nhóm | Chữ cái | Số chữ | Giai đoạn |
|------|---------|:------:|:---------:|
| **1**: nguyên âm cơ bản | a, e, i, o, u, y | 6 | MVP |
| **2**: nguyên âm có dấu/mũ/móc | ă, â, ê, ô, ơ, ư | 6 | MVP |
| **3**: phụ âm quen thuộc | m, n, t, l, h, c | 6 | MVP |
| **4**: phụ âm tiếp | b, p, v, x, s, r | 6 | MVP (làm sau) |
| **5**: phụ âm dễ nhầm | d, đ, g, k, q | 5 | MVP (làm sau) |

**Mở khóa dần:** mặc định chỉ **nhóm 1** mở. Phụ huynh mở nhóm kế tiếp trong khu phụ huynh; app chỉ **gợi ý** khi ≥ 80% chữ của nhóm đạt mức nắm ≥ 3 (không tự mở). Chữ ở các nhóm đã mở được ôn xen kẽ. Với bé 3 tuổi, có thể mất nhiều tháng để đi hết 5 nhóm.

### 4.3 Bảng chữ cái, âm đọc và từ minh họa (gợi ý)

| Chữ | Nhóm | Âm đọc | Từ minh họa | Ghi chú |
|-----|:----:|--------|-------------|---------|
| A a | 1 | a | (cái) ao | |
| E e | 1 | e | em bé | |
| I i | 1 | i | ỉn (con heo) | **Chốt.** Có dấu hỏi; vẽ con heo (miền Nam gọi "heo"), chỉ tô nổi chữ i |
| O o | 1 | o | ong | |
| U u | 1 | u | ủng | **Chốt.** Đôi ủng đi mưa. Dự phòng: "uống (sữa)" |
| Y y | 1 | i | y tá | **Chốt** (thay "yến") |
| Ă ă | 2 | á | ăn (cơm) | Hình "bé đang ăn" rõ ràng |
| Â â | 2 | ớ | ấm (nước) | |
| Ê ê | 2 | ê | ếch | |
| Ô ô | 2 | ô | ô tô | |
| Ơ ơ | 2 | ơ | ớt | |
| Ư ư | 2 | ư | sư tử | **Chốt.** Hiện cả từ, tô nổi chữ ư trong "sư" (khó có từ mở đầu bằng ư) |
| M m | 3 | mờ | **mèo** | Liên kết Mèo Bông |
| N n | 3 | nờ | nón | |
| T t | 3 | tờ | tàu | |
| L l | 3 | lờ | lá | |
| H h | 3 | hờ | hoa | |
| C c | 3 | cờ | cá | |
| B b | 4 | bờ | bóng / banh | Chọn từ nhà bạn hay nói (miền Nam thường là "banh"); không dạy cùng nhóm với d |
| P p | 4 | pờ | pin | **Chốt.** Ít từ thuần Việt; pin là đồ vật dễ vẽ. Dự phòng: "pi-a-nô" |
| V v | 4 | vờ | vịt | |
| X x | 4 | xờ | xe | |
| S s | 4 | sờ | sao | |
| R r | 4 | rờ | rùa | |
| D d | 5 | dờ | dê | |
| Đ đ | 5 | đờ | đèn | Nhấn mạnh khác D |
| G g | 5 | gờ | gà | |
| K k | 5 | ca | kẹo | k đứng trước e, ê, i |
| Q q | 5 | cu | quạt | **Chốt.** q luôn đi với u: tô nổi cả "qu" |

Các từ minh họa của I, U, Y, Ư, P, Q đã chốt ở Phase 0 (mục 0.5). Từ minh họa có thể đổi theo vùng miền hoặc thói quen gia đình. Cách đọc "ca" (k) và "cu" (q) theo cách gọi thường dùng ở lớp 1; đối chiếu SGK bạn chọn.

### 4.4 Lộ trình học vần (sau MVP)

1. **Phase 2:** 6 dấu thanh (dạy bằng hình dấu + cặp từ mẫu, không chỉ bằng nghe, vì nhiều người miền Nam đọc dấu hỏi và ngã gần giống nhau), tô nét chữ cái.
2. **Phase 2–3:** ghép vần đơn giản (ba, bà, bá…), từ 1–2 tiếng.
3. **Phase 3+:** chính tả c/k/q, g/gh, ng/ngh (chỉ khi bé sẵn sàng).

### 4.5 Quy tắc kỹ thuật cho tiếng Việt (bắt buộc)

- **ID và tên file: ASCII không dấu** (`letter_dd_img.svg` cho Đ, `letter_a_breve_img.svg` cho Ă…). Chữ có dấu chỉ nằm ở trường hiển thị trong JSON.
- **Mọi chuỗi tiếng Việt chuẩn hóa NFC** (`str.normalize('NFC')`) khi đọc JSON, khi nhập/xuất, khi so sánh. Có test cho việc này.
- Thứ tự bảng chữ cái là **mảng cố định** trong dữ liệu, không dùng sắp xếp mặc định.
- Chuyển hoa/thường bằng `toLocaleUpperCase('vi')`.
- Font phải có **subset tiếng Việt** và được **tự host** (không tải từ Google Fonts); kiểm tra hiển thị đủ Ă Â Đ Ê Ô Ơ Ư và cả 6 dấu thanh.

### 4.6 Từ vựng miền Nam

- Dùng từ **nhà bạn hay nói**, không cần chuẩn hóa sang giọng Bắc: "heo" thay "lợn", "banh" thay "bóng"…
- Rà lại toàn bộ bảng 4.3 một lượt với gia đình (ví dụ "ô tô" hay "xe hơi", "ấm" hay "bình") rồi cập nhật `assets.json` trước khi thu âm.
- Nếu muốn bám chương trình ở trường, đối chiếu cách đọc âm với giáo viên mầm non.

---

## 5. STYLE GUIDE — MÈO BÔNG 🐱

### 5.1 Tính cách

Người bạn nhỏ của bé: dịu dàng, tò mò, luôn cổ vũ, **không bao giờ chê**. Nói chậm, câu ngắn, hay dùng "mình" và "bạn". Từ khóa: ấm áp · tròn trịa · vui vẻ · kiên nhẫn · không sợ hãi.

### 5.2 Hình dáng

| Thành phần | Quy định |
|-----------|----------|
| Phong cách | Vẽ phẳng có viền, hình khối tròn, không góc nhọn |
| Tỉ lệ | Đầu : thân ≈ 1 : 1 (chibi), thân tròn như quả trứng |
| Mắt | To, tròn, đen bóng, 1–2 đốm sáng trắng, cách xa nhau |
| Mũi, miệng | Mũi tam giác bo tròn (hồng); miệng "ω" đơn giản |
| Tai, má, râu | Tai tròn góc, lòng tai hồng; 2 chấm má hồng nhạt; 3 sợi râu mỗi bên, ngắn, cong nhẹ |
| Đuôi | Cong hình chữ S, đầu tròn |
| Phụ kiện | 1 chiếc **khăn/nơ xanh trời** (nhận diện cố định) |
| Viền | Nâu đậm `#5A3E36`, độ dày đồng nhất, nét bo tròn |

### 5.3 Bảng màu nhân vật

| Tên | Hex | Dùng cho |
|-----|-----|---------|
| Kem lông | `#FFF1D6` | Thân, mặt |
| Cam đốm | `#F6B36B` | Đốm lông trên đầu, đuôi |
| Hồng | `#FF9FB2` | Tai trong, mũi, má |
| Nâu viền | `#5A3E36` | Viền, râu, miệng |
| Đen mắt | `#2B2B2B` | Mắt (kèm đốm sáng `#FFFFFF`) |
| Xanh khăn | `#4FB3D9` | Khăn/nơ |

### 5.4 Biểu cảm (tối thiểu 8 trạng thái)

| Mã | Biểu cảm | Khi nào dùng |
|----|----------|--------------|
| `idle` | Chớp mắt, đung đưa nhẹ | Chờ, trang chủ |
| `wave` | Vẫy tay, cười | Chào, tạm biệt |
| `talk` | Miệng mở/đóng khớp giọng | Đang nói hướng dẫn |
| `cheer` | Nhảy, giơ tay | Đúng, hoàn thành |
| `think` | Nghiêng đầu, chạm cằm | Gợi ý, chờ bé |
| `encourage` | Gật đầu, mắt sáng | Khi bé chọn sai (**không buồn**) |
| `surprise` | Mắt tròn, "ồ" | Mở khóa sticker |
| `sleep` | Nhắm mắt, "zzz" | Kết thúc phiên chơi |

Quy tắc: Mèo Bông **không** khóc, giận, sợ, thất vọng. Bé sai → `encourage`.

### 5.5 Giọng nói và câu mẫu

Giọng ấm, chậm, rõ (ưu tiên **giọng phụ huynh** thu âm). Mỗi lời thoại ≤ 8 từ.

| Tình huống | Câu mẫu |
|-----------|---------|
| Chào | "Chào bạn! Mình cùng chơi nào!" |
| Hướng dẫn | "Bạn chạm vào chữ **b** nhé!" |
| Đúng | "Giỏi quá!", "Đúng rồi!", "Hoan hô!" |
| Sai | "Thử lại nhé!", "Mình cùng nghe lại nào." |
| Gợi ý | "Ở đây nè!" (kèm nhấp nháy) |
| Hết phiên | "Mình buồn ngủ rồi, hẹn gặp lại nhé!" |

Cần ít nhất **10 câu khen** và **6 câu động viên** để không lặp.

### 5.6 Hoạt ảnh trên web

- Chuyển động mềm, ease-out, 0,3–0,8 giây. Không nhấp nháy mạnh, không rung màn hình. `prefers-reduced-motion` → giảm về chuyển đổi mờ đơn giản.
- **Cách làm được khuyến nghị: Mèo Bông là SVG nhiều lớp (đầu, mắt, miệng, tay, đuôi) + thư viện `motion` (Framer Motion) điều khiển** theo 8 trạng thái. AI viết và sửa được dễ hơn Rive, không cần công cụ ngoài.
- Nâng cấp lên **Rive** (`@rive-app/react-canvas`, 1 file `.riv`, state machine) nếu sau này muốn hoạt ảnh mượt hơn. Giữ giao diện component `<MeoBong state="cheer" />` không đổi để thay ruột không ảnh hưởng nơi khác.
- Hình tĩnh: SVG.

### 5.7 Nên / Không nên

| ✅ Nên | ❌ Không nên |
|-------|-------------|
| Luôn hướng mặt về phía bé | Che khuất khu vực chơi |
| Ở góc, kích thước vừa | Chiếm quá nửa màn hình khi chơi |
| Khen cụ thể, ngắn | Nói dài, giảng giải |
| Dùng cùng 1 bộ nét viền | Trộn phong cách vẽ khác |

### 5.8 Phong cách giao diện (Design tokens)

| Thành phần | Quy định |
|-----------|----------|
| Nền | Kem `#FFF8EC` |
| Màu nhấn | Mint `#7ED6C1`, vàng nắng `#FFD25E`, cam san hô `#FF8A65`, xanh trời `#4FB3D9`, tím nhạt `#B69CF2` |
| Chữ | Nâu đậm `#5A3E36` (**cả trên nền màu nhấn cũng dùng chữ nâu, không dùng chữ trắng**: trắng trên mint/vàng không đủ tương phản) |
| Bo góc | ≥ 20 px cho nút và thẻ |
| Vùng chạm | **≥ 80 px CSS** cho phần tử bé chạm; ≥ 44 px cho khu vực phụ huynh |
| Font | Rounded, hỗ trợ tiếng Việt: Baloo 2 / Nunito / Quicksand (`@fontsource`, tự host, kiểm tra dấu) |
| Chữ mẫu, tô nét | Đường nét SVG tự vẽ, không dùng font (kiểm soát thứ tự nét) |
| Màu theo module | Mỗi module 1 màu + 1 icon riêng (không chỉ dựa vào màu) |

Tokens khai báo một lần trong `src/app/tokens.css` (CSS variables), Tailwind đọc từ đó:

```css
:root {
  --bg: #FFF8EC;        --ink: #5A3E36;
  --mint: #7ED6C1;      --sun: #FFD25E;     --coral: #FF8A65;
  --sky: #4FB3D9;       --lilac: #B69CF2;
  --radius-card: 24px;  --tap-min: 80px;
}
```

---

## 6. BẢNG ASSET

### 6.1 Quy ước chung

| Loại | Định dạng | Ghi chú |
|------|-----------|---------|
| Hình vector | `.svg` | Ưu tiên; tối ưu bằng SVGO; nhúng inline hoặc `<img>` |
| Hình raster | `.webp` | Nền trong suốt, ≥ 1024 px cạnh dài; chỉ khi không vẽ được SVG |
| Hoạt ảnh | SVG + `motion` (mặc định) / `.riv` (tùy chọn) | Xem 5.6 |
| Âm thanh | `.m4a` (AAC), mono, 64–96 kbps | Chạy được trên mọi trình duyệt; giữ `.wav` gốc **ngoài repo**. Gộp thành **audio sprite** theo nhóm (letters, numbers, colors, cat, sfx) để giảm số request và độ trễ |
| Dữ liệu | `.json` | Có JSON Schema + Zod để kiểm tra khi build |

**Tên file (snake_case, ASCII không dấu):** `[nhóm]_[đối tượng]_[loại].ext`

| Ví dụ | Ý nghĩa |
|-------|---------|
| `letter_a_img.svg` / `letter_a_snd.m4a` | Hình / âm "a" |
| `letter_a_word_snd.m4a` | Đọc từ "ao" |
| `letter_dd_snd.m4a` | Âm "đờ" (Đ) |
| `number_5_snd.m4a`, `color_red_snd.m4a` | "năm", "đỏ" |
| `sfx_correct.m4a`, `cat_voice_praise_01.m4a` | Hiệu ứng, lời khen |

**Trạng thái asset:** `TODO → DRAFT → REVIEW → DONE` (hoặc `DROP`).

### 6.2 Tổng hợp asset MVP (ước tính thô)

| Nhóm | Asset | Số lượng |
|------|-------|:--------:|
| Nhân vật | Mèo Bông SVG nhiều lớp + 8 trạng thái | 1 bộ |
| Chữ cái (29) | Chữ hoa+thường (font/SVG, tạo bằng code); hình minh họa từ (AI); âm đọc; đọc từ | 29 · 29 · 29 · 29 |
| Con số | Chữ số 1–10; giọng đọc; 6 bộ vật đếm; 4 cặp nhiều/ít, lớn/nhỏ | 10 · 10 · 6 · 4 |
| Màu & hình | 10 màu + 6 hình (kèm giọng, bóng hình); ~30 vật để phân loại | 16 · ~30 |
| Giọng Mèo Bông | Chào/tạm biệt 4; khen ≥ 10; động viên ≥ 6; hướng dẫn ~10 | ~30 |
| SFX | Chạm, đúng, thử lại, nhận sao, chuyển màn, meo… (êm, không chói) | 8 |
| Giao diện, thưởng | Icon module, nút, nền, sao, 20 sticker | ~40 |

**Ước tính (đã đếm lại, cao hơn bản trước):** ~175 mục hình, trong đó chữ, chữ số, màu, hình cơ bản tạo bằng code; phần cần AI vẽ khoảng 100–110 (minh họa từ 29, vật đếm 6, cặp lớn/nhỏ 8, vật phân loại ~30, Mèo Bông và bộ phận, sticker 20, icon). **~114 câu cần thu giọng** (58 chữ cái + 10 số + 16 màu/hình + ~30 lời Mèo Bông) cộng 8 SFX. Phần lớn công sức của dự án nằm ở đây, nhiều hơn code.

**Mục tiêu dung lượng** (để precache offline nhẹ): tổng < 30 MB.

### 6.3 Bảng asset tự động (thay bảng gõ tay)

- Nguồn sự thật duy nhất: `src/content/*.json` (hoạt động) + `src/content/assets.json` (ID → file, nguồn, trạng thái).
- Script `npm run assets:check` báo: file **thiếu** (JSON nhắc đến nhưng chưa có), file **thừa** (không ai dùng), **sai tên** (không đúng quy ước), **thiếu cột nguồn/giấy phép**.
- Script `npm run assets:report` sinh `docs/asset_register.md` để bạn xem tiến độ.
- Cột **Nguồn** bắt buộc (tự vẽ / AI + chỉnh / thu âm / thư viện mở kèm giấy phép).

### 6.4 Nguồn asset

- **Giọng đọc:** tự thu bằng **Studio thu âm** trong app (mục 9), chốt giọng vùng miền trước.
- **Hình ảnh:** tự vẽ (Figma/Inkscape) hoặc AI tạo rồi vẽ lại/chỉnh để **đồng nhất nét viền và màu**. Đây là rủi ro lớn nhất khi dùng AI.
- **Giai đoạn đầu:** dùng hình tạm (hình khối đơn giản hoặc bộ emoji/icon có giấy phép mở, ghi rõ nguồn) để test engine trước khi hoàn thiện nghệ thuật.
- **Âm nhạc:** bài dân gian (phạm vi công cộng) hoặc tự thu.
- **Font:** giấy phép mở (OFL): Baloo 2, Nunito, Quicksand.

### 6.5 Quy trình asset bằng AI ("AI tạo rồi chỉnh")

1. **Bảng mẫu phong cách trước:** tạo và duyệt 1 tờ tham chiếu (Mèo Bông 3 góc nhìn + 3 vật mẫu như quả táo, con cá, ngôi nhà) đúng style guide mục 5. Mọi lần tạo sau đính kèm tờ này làm ảnh tham chiếu (nếu công cụ hỗ trợ).
2. **Prompt mẫu cố định** (`docs/ai_prompt_template.md`): vẽ phẳng, viền nâu đậm `#5A3E36` đều nét, bảng màu cố định, nền sạch, không chữ trong hình, không góc nhọn, 1 vật/hình, chính diện. Chỉ đổi phần "vật thể".
3. **Tạo theo lô** (cả một nhóm chữ một lượt) để giữ đồng nhất.
4. **Chuyển sang SVG:** trace bằng Inkscape hoặc vẽ lại trên Figma; đơn giản hóa nét, ép về bảng màu, làm viền đều. Ảnh raster chỉ dùng khi không vector hóa được.
5. **Mèo Bông cần tách lớp** (đầu, mắt, miệng, tay, đuôi) để chuyển động: dùng AI để lấy ý tưởng và tham chiếu, rồi **dựng lại thành SVG nhiều lớp**. Không dùng ảnh AI nguyên khối cho nhân vật chính.
6. **Không để AI vẽ chữ hoặc số** (dấu tiếng Việt dễ bị méo): chữ cái, chữ số và nhãn luôn là font/SVG do code tạo.
7. **Vật đếm:** vẽ 1 hình, code nhân bản đúng N lần (AI hay đếm sai số lượng).
8. **Checklist duyệt hình:** viền đều nét; màu nằm trong bảng; không chữ lạ; không góc nhọn; đúng đối tượng (con heo phải nhận ra là heo); nền sạch; nhìn rõ ở cỡ ~120 px; không giống nhân vật có bản quyền.
9. Ghi vào `assets.json`: công cụ AI, ngày, prompt, người chỉnh, trạng thái.

### 6.6 Thu âm giọng miền Nam

- **Một giọng chính** (ví dụ mẹ) cho toàn bộ chữ/số/màu để bé quen; có thể thêm giọng thứ hai cho lời khen nếu muốn đa dạng.
- Thu theo kịch bản của Studio, cùng một phiên cho cùng một nhóm để âm sắc đồng đều. Phòng yên tĩnh, tắt quạt/máy lạnh, đọc chậm, rõ chữ.
- Khi đọc **âm chữ cái**, đọc tách rõ từng âm, nhất là các cặp có thể nghe gần nhau tùy người nói (d / r / v, s / x), và nghe lại từng câu trước khi lưu, để bé thấy chữ khác nhau ứng với âm khác nhau.
- Đọc từ minh họa bằng từ nhà bạn hay dùng (mục 4.6).
- Thu bằng micro của iPad là đủ cho MVP; muốn chất lượng cao hơn thì thu bằng máy khác rồi nhập file vào Studio.

---

## 7. Trải nghiệm cho trẻ nhỏ

**Luồng chơi**
- Hướng dẫn bằng giọng và cử chỉ, không cần đọc.
- Không chạm ~6 giây: Mèo Bông nhắc lại và chỉ vào đáp án. Sai 2 lần: nhấp nháy đáp án đúng. Chế độ 2–3 tuổi: chọn sai thì đáp án đúng tự sáng, không có trạng thái "sai".
- Không có màn "thua", không trừ sao, không đếm ngược.
- **Độ khó thích ứng (có ngưỡng):** đúng liên tiếp 3 lần → tăng 1 bậc; sai liên tiếp 3 lần (hoặc ≥ 2 lần gợi ý trong 1 lượt) → giảm 1 bậc; **sau mỗi lần đổi bậc, giữ ít nhất 4 lượt** rồi mới xét lại; có **sàn theo nhóm tuổi**.
- **Theo dõi từng mục học (`itemMastery`):** mỗi chữ/số/màu có mức 0–4, tăng khi đúng không cần gợi ý, giảm nhẹ khi sai. Mục ở mức thấp được xen lại vào hoạt động sau (tối đa 1/3 câu là ôn tập). Không hiển thị điểm cho bé.
- **Phiên chơi:** hết giờ (mặc định 10 phút) → Mèo Bông "buồn ngủ" và đưa bé về trang chủ nhẹ nhàng. Có giới hạn ngày (mục 9).
- Lỗi bất ngờ (thiếu asset, exception): **Error boundary** hiện Mèo Bông "Mình thử lại nhé!" rồi về trang chủ; không bao giờ hiện thông báo lỗi kỹ thuật cho bé.

**Làm cứng giao diện cho bé chạm (kiosk hardening trên web)**
- Màn chào **"Chạm để bắt đầu"** (Mèo Bông vẫy tay) để mở khóa âm thanh của iOS.
- Chỉ nhận chạm **một điểm có chủ đích** ở màn chơi (bỏ qua lòng bàn tay, nhiều ngón). **Ngoại lệ:** màn cổng phụ huynh cần 2 điểm chạm.
- CSS bắt buộc:
```css
html, body {
  overscroll-behavior: none;           /* chống kéo-để-tải-lại */
  touch-action: manipulation;          /* chống chạm đúp để phóng to */
  -webkit-user-select: none; user-select: none;
  -webkit-touch-callout: none;         /* chống menu giữ lâu */
  -webkit-tap-highlight-color: transparent;
}
.play-area { touch-action: none; }     /* khu vực chơi tự xử lý cử chỉ */
```
- Dùng `100dvh` và `env(safe-area-inset-*)`; thiết kế cho cả ngang và dọc (Safari không khóa được hướng màn hình).
- Điều hướng bằng router dạng bộ nhớ (không để vuốt cạnh làm bé thoát ra trang khác); chặn menu chuột phải/ chọn chữ.
- Bé không thoát app được nhờ **chạy dạng standalone + Guided Access** (mục 11). Nút cài đặt/thoát nằm sau cổng phụ huynh.
- Có thể xin **Screen Wake Lock** để màn hình không tự tắt khi bé đang chơi (nếu trình duyệt hỗ trợ).

**Khả năng tiếp cận:** hỗ trợ `prefers-reduced-motion`; mọi trạng thái đúng/sai/chọn có thêm hình dạng hoặc chuyển động, không chỉ màu; tương phản chữ ≥ 4,5:1.

---

## 8. Hệ thống phần thưởng

- **Sao ⭐** cho mỗi hoạt động hoàn thành (không phụ thuộc số câu đúng).
- **Sticker Mèo Bông:** đủ số sao thì mở 1 sticker mới; **quy tắc mở cố định, không ngẫu nhiên** (không dùng cơ chế "hên xui").
- Mở khóa có hoạt ảnh nhỏ (`surprise`).
- **Tuyệt đối không:** bảng xếp hạng, mất điểm, chuỗi ngày liên tục, phần thưởng biến mất, đồng hồ đếm ngược.

---

## 9. Khu vực phụ huynh

### 9.1 Cổng phụ huynh

- **Mặc định:** nhấn giữ **2 nút ở hai góc đối diện cùng lúc trong 3 giây** (dùng 2 pointer; chỉ ở màn cổng).
- **Tùy chọn:** PIN 4 số do phụ huynh đặt lần đầu. **Không** dùng "nhập dãy số theo lời đọc" hay phép tính (bé học số trong chính app này).
- Sai 3 lần → khóa 1 phút.
- Lớp bảo vệ thứ hai (ngoài app) là **Guided Access** của iPad (mục 11).

### 9.2 Chức năng MVP

- Hồ sơ bé (biệt danh, nhóm tuổi).
- Cài đặt: **mở/khóa từng nhóm nội dung** (chữ cái nhóm 1–5, số 1–5 / 6–10…), âm lượng, giới hạn mỗi phiên, **giới hạn mỗi ngày**, **giờ yên lặng** (không cho chơi, ví dụ sau giờ ngủ), bật/tắt nhạc nền, chế độ giảm chuyển động.
- Tiến trình: số hoạt động hoàn thành theo module, tổng thời gian chơi, **chữ/số bé hay nhầm** (từ `itemMastery`).
- **Chế độ quan sát** (Phase 1.5): bật lên thì ghi lại chỗ bé chần chừ/sai liên tiếp, xuất báo cáo.
- **Sao lưu/khôi phục**: xuất file `.hvc` (JSON + giọng thu, dạng zip) qua **Share Sheet** của iOS (Lưu vào Tệp/AirDrop); nhập lại để khôi phục. **Nhắc sao lưu mỗi 7 ngày.**
- Nút "Yêu cầu lưu trữ bền vững" (`navigator.storage.persist()`) và hiển thị dung lượng đã dùng.

### 9.3 Studio thu âm (Phase 1b → 2)

- Danh sách **tất cả câu cần thu** (tạo từ JSON): chữ, từ, số, màu, hình, khen, động viên, hướng dẫn.
- Mỗi dòng hiện **câu cần đọc**, nút thu, nghe lại, thu lại; thanh tiến độ "đã thu 45/115"; lọc "chưa thu".
- Xử lý tự động: cắt khoảng lặng đầu/cuối, chuẩn hóa âm lượng, giới hạn độ dài.
- Nhập file âm thanh có sẵn (nếu thu bằng máy khác) → ghép đúng vào ID.
- Cơ chế phát: **giọng phụ huynh → giọng mặc định (file trong app) → (dev) giọng tổng hợp**. Thiếu clip nào tự rơi xuống mức kế tiếp.
- Lưu trong IndexedDB (kèm định dạng `mimeType`, vì Safari ghi ra MP4/AAC còn Chrome ghi ra WebM/Opus). Đưa vào file sao lưu.
- Cần **HTTPS** (mục 11) và cấp quyền micro một lần.

### 9.4 Sau MVP

- Báo cáo tuần: kỹ năng mạnh/yếu, gợi ý "chơi cùng con".
- **Thẻ "chơi cùng con"** và tranh in được (bảng chữ cái, tranh tô màu) bằng CSS in.
- Nhiều hồ sơ bé (anh chị em): schema đã sẵn, chỉ thêm UI.

---

## 10. Công nghệ và kiến trúc

### 10.1 Công nghệ

| Thành phần | Lựa chọn | Ghi chú |
|-----------|----------|---------|
| Ngôn ngữ | **TypeScript (strict)** | Kiểu chặt giúp bắt lỗi AI viết ra |
| UI + build | **React + Vite** (SPA tĩnh) | Không server; build ra file tĩnh |
| Style | **Tailwind CSS** + CSS variables (`tokens.css`) | Token màu/cỡ chạm khai báo 1 chỗ |
| Điều hướng | React Router (memory router) | Không để cử chỉ vuốt cạnh thoát app |
| State phiên chơi | Zustand | Nhẹ, ít nghi thức |
| Lưu dữ liệu bền | **Dexie** (IndexedDB) | Cả cấu hình cũng để trong Dexie, tránh rải `localStorage` |
| Âm thanh | **Howler.js** (audio sprite, mở khóa iOS) + `MediaRecorder` (thu) + Web Audio (cắt lặng, chuẩn hóa) | Xem 10.6 |
| Hoạt ảnh | `motion` (Framer Motion); Rive tùy chọn | Xem 5.6 |
| Kéo thả | Hook `usePointerDrag` tự viết (Pointer Events), hoặc `@dnd-kit` nếu cần | Phải có chế độ chạm–chạm |
| PWA | `vite-plugin-pwa` (Workbox) | Precache toàn bộ, chạy offline |
| Kiểm tra dữ liệu | **Zod** | Kiểm JSON nội dung, kiểm file nhập |
| Nén/xuất | `fflate` | Đóng gói `.hvc` (zip) |
| Font | `@fontsource` (tự host, subset tiếng Việt) | Không dùng CDN |
| Test | Vitest, Testing Library, **Playwright (Chromium + WebKit)**, `@axe-core/playwright` | Mục 15 |
| Chất lượng | ESLint (+ `jsx-a11y`), Prettier, `tsc --noEmit` | Gộp thành `npm run check` |
| Mã nguồn + hosting | Git + GitHub (repo public) + GitHub Pages | Xem mục 11.1 |

> **Quy tắc:** không thêm package ngoài bảng này nếu chưa được bạn đồng ý (đặc biệt package có mạng/analytics/quảng cáo). Ghim phiên bản trong `package-lock.json`. Phiên bản cụ thể để opencode tra tài liệu hiện hành khi cài.

### 10.2 Cấu trúc project

```
hoc-va-choi/
├── AGENTS.md                    # quy tắc cho AI, ở GỐC repo (mục 13)
├── opencode.json
├── .github/workflows/           # CI (check) + deploy GitHub Pages
├── .opencode/
│   ├── skills/                  # skill giao diện & quy trình (mục 14)
│   └── commands/                # /new-activity, /review-ui, /check-assets
├── docs/
│   ├── style_guide.md
│   ├── asset_register.md        # sinh tự động
│   └── decisions.md             # nhật ký quyết định
├── public/                      # icon PWA, apple-touch-icon
├── scripts/                     # assets-check, assets-report, content-validate
├── src/
│   ├── app/                     # main.tsx, router, tokens.css, ErrorBoundary
│   ├── core/
│   │   ├── activity-engine/     # explore, listen_pick, match, tap_count, sort
│   │   ├── audio/               # AudioService, voice fallback, sprites
│   │   ├── storage/             # Dexie, export/import, migrations
│   │   ├── mastery/             # itemMastery, độ khó thích ứng
│   │   └── gate/                # cổng phụ huynh
│   ├── features/
│   │   ├── home/  colors-shapes/  numbers/  alphabet/  rewards/
│   │   ├── parents/             # cài đặt, tiến trình, Studio thu âm, sao lưu
│   │   └── (phase 2–3) writing/ coloring/ music/ puzzle/ stories/
│   ├── components/              # BigButton, Card, MeoBong...
│   ├── content/                 # activities/*.json, phrases.json, assets.json
│   ├── assets/                  # images/, sounds/ (voice_default, sfx), animations/
│   └── dev/                     # route /dev (chỉ môi trường dev)
├── tests/                       # e2e (Playwright)
└── vite.config.ts
```

### 10.3 Nội dung điều khiển bằng dữ liệu

Mỗi hoạt động là một mục JSON, được kiểm bằng Zod khi build. Thêm bài = thêm dữ liệu.

```json
{
  "id": "alphabet_g1_listen_pick",
  "module": "alphabet",
  "template": "listen_pick",
  "ageMin": 3,
  "learningGoal": "Nghe âm và nhận ra chữ cái nhóm 1",
  "items": ["a", "e", "i", "o", "u", "y"],
  "choices": { "3-4": 3, "4-5": 4, "2-3": 2 },
  "interaction": "tap",
  "errorless": { "2-3": true },
  "reward": { "stars": 1 }
}
```

`items` tham chiếu ID trong `assets.json`, trong đó mỗi mục có: hình, âm, từ, giọng đọc từ, nguồn, trạng thái.

### 10.4 Lưu trữ tiến trình (Dexie / IndexedDB)

| Bảng | Nội dung |
|------|---------|
| `profiles` | `id`, `nickname`, `ageBand`, `createdAt` (schema đã hỗ trợ nhiều hồ sơ) |
| `activityRuns` | `profileId`, `activityId`, `startedAt`, `durationMs`, `attempts`, `hints`, `hesitations`, `completed` |
| `itemMastery` | `[profileId+itemId]`, `level` 0–4, `streak`, `lastSeenAt`, `nextReviewAt` |
| `rewards` | `[profileId+stickerId]`, `unlockedAt` (số sao tính từ `activityRuns`) |
| `settings` | `key`/`value`: âm lượng, giới hạn phiên/ngày, giờ yên lặng, giảm chuyển động, PIN (đã băm) |
| `voiceClips` | `clipId`, `blob`, `mimeType`, `durationMs`, `recordedAt` |
| `meta` | `schemaVersion`, `lastBackupAt` |

- Có **migration theo `schemaVersion`** ngay từ đầu.
- **File sao lưu `.hvc`** (zip): `data.json` (có `schemaVersion`, chuỗi NFC) + `voices/`. Khi nhập: kiểm bằng Zod, migrate nếu cũ, hỏi "gộp" hay "thay thế" trước khi ghi.

### 10.5 PWA, offline và lưu trữ bền

- `manifest`: tên "Học Và Chơi", `display: standalone`, `background_color` `#FFF8EC`, icon 192/512 (kèm maskable) + `apple-touch-icon` 180 px.
- Thẻ `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` và `apple-mobile-web-app-capable`.
- **Đường dẫn con của GitHub Pages:** cấu hình `base: '/<repo>/'` cho Vite; `start_url` và `scope` của manifest, đường dẫn asset và Service Worker đều tính theo `base` (dùng `import.meta.env.BASE_URL`). Dùng **router bộ nhớ** nên không cần trang `404.html` để chuyển hướng.
- **Đặt tên kho lưu trữ riêng** (ví dụ DB `hocvachoi_v1`): các project site cùng `<user>.github.io` dùng chung một origin.
- **Precache toàn bộ** asset để chơi được hoàn toàn offline.
- **Cập nhật:** app kiểm tra bản mới ở nền, **chỉ áp dụng khi mở app lần sau hoặc khi bé ở trang chủ**; không tự tải lại giữa lượt chơi. Nút "Cập nhật ngay" nằm trong khu phụ huynh.
- **Lưu trữ:** trong tab Safari thường, dữ liệu có thể bị xóa nếu lâu không tương tác; app cài ra màn hình chính tính bộ đếm riêng và ít bị hơn nhưng **vẫn không đảm bảo**. Vì vậy: (1) luôn dùng bản **đã cài**, không dùng tab Safari; (2) gọi `navigator.storage.persist()` khi phụ huynh lưu dữ liệu đầu tiên; (3) **nhắc sao lưu** mỗi 7 ngày; (4) hiển thị cảnh báo khi `lastBackupAt` quá cũ.
- Dữ liệu trong tab Safari và trong app đã cài là **hai kho riêng**; sau khi cài, khôi phục từ file sao lưu nếu cần chuyển.

### 10.6 Âm thanh và kiểm tra khi build

**`AudioService`** (một điểm vào duy nhất cho mọi âm thanh):
- `unlock()` gọi ở màn "Chạm để bắt đầu"; `play(clipId)`, `playSequence([...])`, `stopVoice()`.
- **Một giọng nói tại một thời điểm**; SFX phát riêng và nhỏ hơn giọng.
- Chuỗi rơi lùi: giọng phụ huynh → giọng mặc định → (chỉ dev) giọng tổng hợp `speechSynthesis` `vi-VN`. *Không dùng giọng tổng hợp ở bản chính thức* vì một số trình duyệt có thể lấy giọng qua mạng.
- Mèo Bông `talk` đồng bộ theo sự kiện bắt đầu/kết thúc phát.
- Preload theo module, không tải hết một lần.
- Điểm cần **kiểm chứng trên iPad thật ở Phase 0:** công tắc im lặng có tắt tiếng không; độ trễ chạm → âm; mở khóa sau khi ứng dụng bị đưa xuống nền; có cần đặt kiểu phiên âm thanh "playback" của trình duyệt hay không.

**Kiểm tra khi build:** `npm run build` chạy `content:validate` (Zod) + `assets:check`; lỗi thì không build. Mọi hoạt động tham chiếu asset thiếu bị chặn từ sớm, bé không bao giờ gặp.

---

## 11. Triển khai và cài đặt trên iPad/iPhone

### 11.1 Hosting đã chọn: GitHub Pages

| Điều cần biết | Hệ quả |
|---------------|--------|
| Gói GitHub Free chỉ cho Pages từ **repo public** | Mã nguồn và asset là công khai; không được để gì cá nhân trong repo |
| Site Pages **công khai với ai có URL**, kể cả khi repo private ở gói trả phí (Pages riêng tư chỉ có ở Enterprise Cloud) | Không có "khóa" ở lớp host; bảo vệ bằng cách không đưa dữ liệu cá nhân vào site |
| Không đặt được HTTP header tùy ý | CSP dùng thẻ meta (mục 12) |
| URL dạng `https://<user>.github.io/<repo>/` | Cấu hình `base` (mục 10.5) |
| Có HTTPS sẵn | Micro và Service Worker chạy được |
| Giới hạn mềm: site ≤ 1 GB, ~100 GB băng thông/tháng | Thừa cho app này (mục tiêu < 30 MB) |
| Nhiều project site cùng `<user>.github.io` chung origin | Đặt tên DB riêng; cân nhắc tên miền riêng nếu có nhiều site |

**Quy tắc cho repo public (bắt buộc):**

- **Không commit:** tên/ảnh/giọng của bé, file sao lưu `.hvc`, file `.wav` gốc, khóa hay token. `.gitignore` chặn `*.hvc`, `*.wav`, `private/`.
- **Giọng phụ huynh chỉ thu trong app và lưu trên iPad**, không đưa vào repo. Hệ quả: app mới cài chưa có giọng cho đến khi thu âm hoặc khôi phục từ file sao lưu.
- Đặt tên repo khó đoán; nhớ rằng tên repo và lịch sử commit là công khai.
- Ghi công cụ AI, ngày, prompt vào `assets.json`; **đọc điều khoản của công cụ AI** về việc đăng công khai hình do nó tạo.
- Muốn giữ mã nguồn kín: repo nguồn private + một repo phụ public chỉ chứa bản build, đẩy bằng GitHub Actions (kiểm tra hướng dẫn hiện hành của GitHub), hoặc dùng gói trả phí cho repo private (site vẫn công khai). Mặc định plan chọn repo public cho đơn giản.

**Triển khai:** GitHub Actions build rồi deploy lên Pages (Settings → Pages → Source: GitHub Actions). **Chỉ deploy khi gắn tag `v*` hoặc chạy tay**, không deploy mỗi lần push, để iPad của bé không nhận bản làm dở. Chạy `npm run check` trước khi deploy.

### 11.2 Thử trên iPad thật khi đang dev

- Micro (`getUserMedia`) và Service Worker **chỉ chạy trên HTTPS** (hoặc `localhost`). Với iPad trong LAN: dùng đường hầm HTTPS (Cloudflare Tunnel…) hoặc chứng chỉ cục bộ (mkcert) cài lên iPad. GitHub Pages không có bản xem trước theo nhánh nên không dùng để test hằng ngày.
- Quy tắc: **test trên iPad mỗi tuần**, không đợi đến cuối.

### 11.3 Cài cho bé

1. Mở địa chỉ app trên GitHub Pages bằng **Safari** trên iPad.
2. Chạm **Chia sẻ → Thêm vào Màn hình chính** và **để bật công tắc "Open as Web App"** (nhãn tiếng Việt có thể khác). iPadOS 26 bật sẵn; nếu tắt, biểu tượng chỉ là bookmark mở trong Safari.
3. Mở từ **biểu tượng trên màn hình chính** (dạng toàn màn hình, không thanh địa chỉ).
4. Vào khu phụ huynh: cấp quyền micro (nếu thu âm), bấm "Yêu cầu lưu trữ bền vững", làm bản sao lưu đầu tiên.
5. Bật **Truy cập được hướng dẫn (Guided Access)** để khóa bé trong app: Cài đặt → Trợ năng → Truy cập được hướng dẫn (đường dẫn có thể khác theo phiên bản iPadOS), đặt mật mã; khi đang ở trong app, kích hoạt bằng phím tắt trợ năng. Có thể vô hiệu vùng cảm ứng và đặt giới hạn thời gian.

### 11.4 Cập nhật

Gắn tag → GitHub Actions build và deploy → lần mở app sau, bản mới được áp dụng (mục 10.5). Không có chứng chỉ hết hạn, không cần cài lại.

---

## 12. Quyền riêng tư và bảo mật (bản cá nhân)

- Không tài khoản, không đăng nhập, không analytics, không quảng cáo, không SDK bên thứ ba, không CDN.
- **CSP chặt** đặt bằng thẻ `<meta http-equiv="Content-Security-Policy">` trong `index.html` (GitHub Pages không cho đặt header), chặn mọi kết nối ra ngoài:
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'`
  (chỉ áp dụng cho bản build; môi trường dev cần nới cho HMR; CSP dạng meta không hỗ trợ một số chỉ thị như `frame-ancestors`). Repo và site công khai: xem quy tắc ở mục 11.1.
- Font tự host; ít dependency; kiểm `npm audit`; xem lại package trước khi thêm.
- **Micro:** chỉ xin quyền trong Studio thu âm, đóng luồng ngay sau khi thu; không ghi âm ngầm.
- Ghi âm và tiến trình lưu cục bộ; chỉ ra ngoài khi phụ huynh xuất file. File sao lưu chứa giọng nói: cất ở nơi an toàn.
- Nếu sau này chia sẻ cho người khác, xem lại toàn bộ mục này.

---

## 13. Quy trình VS Code + opencode

### 13.1 Chuẩn bị

1. Mở repo trong VS Code, chạy `opencode` ở terminal tích hợp (hoặc dùng tiện ích VS Code nếu có).
2. Đặt **`AGENTS.md` ở gốc repo** (opencode nạp file này làm quy tắc dự án; `docs/AGENTS.md` của v2 nên chuyển lên gốc). Có thể chạy `/init` để opencode sinh bản nháp rồi thay bằng nội dung bên dưới.
3. Tạo `opencode.json` (nạp thêm style guide, hỏi trước khi chạy lệnh nhạy cảm). Đối chiếu tên trường với tài liệu opencode hiện hành:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["docs/style_guide.md"],
  "permission": {
    "bash": { "npm install*": "ask", "git push*": "ask" }
  }
}
```
4. Skill đặt ở `.opencode/skills/<tên>/SKILL.md` (mục 14). opencode cũng đọc `.claude/skills/` và `.agents/skills/`.
5. Dùng agent **Plan** (chỉ đọc, đề xuất) để lên kế hoạch, duyệt xong chuyển sang **Build** để viết code (đổi bằng phím Tab).

### 13.2 `AGENTS.md` (giữ ngắn, khoảng 100–150 dòng; chi tiết để trong skill)

```markdown
# Học Và Chơi — quy tắc cho AI
## Dự án
Web app (PWA) học sớm tiếng Việt cho bé 2–5 tuổi. Dùng cá nhân, chạy trên iPad Safari.
TypeScript strict + React + Vite + Tailwind + Dexie. Không backend.
## Nguyên tắc sản phẩm (không được vi phạm)
- Bé không cần đọc. Không "thua", không trừ điểm, không đếm ngược, không bảng xếp hạng.
- Không gọi mạng ngoài origin. Không analytics, không CDN, không font ngoài.
- Vùng chạm của bé ≥ 80px. Lời thoại ≤ 8 từ. Mèo Bông không có biểu cảm tiêu cực.
## Kiến trúc
- Cấu trúc thư mục theo docs/decisions.md và mục 10.2 của plan; không tự đổi.
- Mọi hoạt động mới = JSON trong src/content + engine có sẵn. KHÔNG viết màn hình riêng lẻ.
- Mọi âm thanh đi qua AudioService. Mọi lưu trữ đi qua src/core/storage.
## Tiếng Việt
- ID/tên file: ASCII không dấu, snake_case. Chuỗi hiển thị: chuẩn hóa NFC.
- Thứ tự bảng chữ cái là mảng cố định trong dữ liệu.
## Quy trình
- Không thêm package mới khi chưa hỏi.
- Mỗi thay đổi kèm test cho logic (chấm đáp án, độ khó, mastery, lưu/xuất/nhập).
- Trước khi báo xong: chạy `npm run check` (lint + typecheck + test + assets:check).
- Việc UI: dùng skill hocvachoi-design-system và kid-touch-ui.
- Cập nhật CHANGELOG.md. Commit nhỏ, một tính năng một commit.
```

### 13.3 Lệnh tùy chỉnh (`.opencode/commands/*.md`)

| Lệnh | Việc làm |
|------|---------|
| `/new-activity <mô tả>` | Đọc skill `activity-template`; tạo JSON + asset còn thiếu (ghi TODO) + test; chạy `npm run check` |
| `/review-ui <đường dẫn>` | Chạy `web-design-guidelines` + kiểm tra riêng: cỡ chạm ≥ 80px, reduced-motion, tương phản, không phụ thuộc màu; báo file:dòng |
| `/check-assets` | Chạy `assets:check`, tóm tắt asset thiếu/thừa, cập nhật `docs/asset_register.md` |

### 13.4 Cách làm việc

- **Spec trước, code sau:** viết JSON + test + tiêu chí hoàn thành, rồi để AI làm.
- Việc lớn: Plan agent lập kế hoạch → bạn duyệt → Build làm từng bước nhỏ.
- **Tự đọc lại code AI viết**, đặc biệt phần lưu trữ, âm thanh, cổng phụ huynh. Chạy thử trên iPad sau mỗi cột mốc.
- Mỗi lần AI mắc lỗi lặp lại → thêm 1 dòng vào `AGENTS.md` hoặc viết thành skill.
- Git: nhánh theo tính năng, PR/commit nhỏ, `CHANGELOG.md` cập nhật mỗi phiên bản.

---

## 14. Skill giao diện website phù hợp với dự án

Skill là thư mục chứa `SKILL.md` (có `name`, `description`); opencode chỉ nạp nội dung khi cần, nên không làm phình ngữ cảnh. Với app trẻ em, cần **hai lớp**: skill bên ngoài (chất lượng chung, kiểm tra) và skill riêng (quy tắc riêng của "Học Và Chơi", **luôn được ưu tiên** khi xung đột).

### 14.1 Skill bên ngoài nên cân nhắc cài

| Skill | Nguồn | Dùng để | Lưu ý riêng cho dự án |
|-------|-------|---------|----------------------|
| `frontend-design` | Anthropic | Định hướng thẩm mỹ, chữ, bố cục, tránh giao diện "đại trà" | Skill này khuyến khích táo bạo; ở đây **style guide (mục 5) thắng**. Dùng cho trang chủ, màn thưởng, Nhà Mèo Bông |
| `web-design-guidelines` | Vercel Labs | Rà soát code UI theo 100+ quy tắc về truy cập, hiệu năng, trải nghiệm | Làm bước review cuối. Bỏ qua gợi ý xung đột (nút to hơn chuẩn, ít chữ). Khi chạy có thể cần mạng (chỉ lúc dev) |
| `react-best-practices` | Vercel Labs | Hiệu năng React: render lại, kích thước bundle | Thiên về Next.js; ở Vite SPA chỉ áp dụng phần render/bundle |
| `webapp-testing` | Anthropic | Điều khiển trình duyệt thật (Playwright), chụp màn hình, xem log | Vòng lặp "sửa → chụp → so" cho iPad ngang/dọc |
| `skill-creator` | Anthropic | Tạo và tối ưu skill riêng | Dùng để viết các skill ở 14.2 |

Cài (ví dụ), luôn xem danh sách trước, tên repo/skill có thể đổi:
```
npx skills add vercel-labs/agent-skills --list
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a opencode
```
> **An toàn:** skill có thể kèm script chạy trên máy bạn. **Đọc `SKILL.md` và mọi file script trước khi cài**, chỉ cài từ nguồn tin cậy, và giữ skill trong repo để theo dõi thay đổi bằng Git.

### 14.2 Skill tự viết (đặt ở `.opencode/skills/`)

| Skill (`name`) | Nội dung chính | Ưu tiên |
|----------------|---------------|:-------:|
| `hocvachoi-design-system` | Token màu/cỡ/bo góc, font, quy tắc Mèo Bông (8 trạng thái, không biểu cảm tiêu cực), motion, giọng điệu chữ trên UI, nên/không nên | P0 |
| `kid-touch-ui` | Pointer Events, cỡ chạm ≥ 80 px, chạm–chạm và kéo thả, vùng hít rộng, chống chạm nhầm, CSS kiosk, safe area, `100dvh`, reduced-motion, không phụ thuộc màu | P0 |
| `activity-template` | Quy trình thêm hoạt động: JSON schema, mẫu engine, test, `assets:check`, Definition of Done | P0 |
| `vietnamese-content` | NFC, ID ASCII, bảng chữ + âm đọc + từ minh họa, dấu thanh, kiểm tra chính tả nội dung | P1 |
| `audio-ios-safari` | Mở khóa, audio sprite, chuỗi rơi lùi giọng, công tắc im lặng, `MediaRecorder` và `mimeType` | P1 |
| `pwa-offline-ios` | Manifest, Service Worker và cập nhật an toàn, `persist()`, sao lưu/Share Sheet, CSP | P1 |
| `asset-pipeline` | Quy trình AI → SVG (mục 6.5), checklist duyệt hình, prompt mẫu, SVGO, đặt tên, ghi nguồn/công cụ AI, sinh bảng asset | P1 |

Nguyên tắc: mỗi skill ≤ ~100 dòng; `description` nói rõ **"dùng khi…"** để AI biết lúc nào nạp; **chỉ viết khi thấy AI lặp lại một lỗi**; `name` viết thường, nối bằng gạch ngang và trùng tên thư mục.

### 14.3 Ví dụ `SKILL.md`

```markdown
---
name: hocvachoi-design-system
description: Dùng khi tạo hoặc sửa bất kỳ giao diện nào của Học Và Chơi (màn hình, nút, thẻ, Mèo Bông, màu, chữ, chuyển động). Áp dụng token, cỡ chạm và quy tắc Mèo Bông của dự án.
---

# Học Và Chơi — hệ thiết kế

## Token (khai báo ở src/app/tokens.css, không hard-code màu)
- Nền `--bg` #FFF8EC · Chữ `--ink` #5A3E36
- Nhấn: mint #7ED6C1, sun #FFD25E, coral #FF8A65, sky #4FB3D9, lilac #B69CF2
- Chữ trên nền nhấn luôn là `--ink`, không dùng chữ trắng.

## Bắt buộc
- Phần tử bé chạm: ≥ 80px CSS; bo góc ≥ 24px; khoảng cách giữa hai nút ≥ 16px.
- Mỗi module có 1 màu + 1 icon riêng; đúng/sai/chọn phải có hình dạng hoặc chuyển động, không chỉ màu.
- Chữ trên màn bé chơi: tối đa 1 từ hoặc 1 ký tự lớn. Không câu dài.
- Chuyển động 0,3–0,8s, ease-out; không nhấp nháy, không rung màn hình; tôn trọng prefers-reduced-motion.
- Mèo Bông chỉ dùng 8 trạng thái: idle, wave, talk, cheer, think, encourage, surprise, sleep.
  Khi bé sai dùng `encourage`. Không bao giờ dùng biểu cảm buồn, giận, sợ.
- Không có màn hình "thua", điểm trừ, đếm ngược.

## Không được
- Thêm font/CDN ngoài; dùng màu ngoài token; đặt nút thoát hay cài đặt ngoài cổng phụ huynh.

## Trước khi xong
- Chụp màn hình iPad ngang và dọc; kiểm tra cỡ chạm bằng DevTools.
```

### 14.4 Cách dùng skill cho một màn hình UI

1. **Phác thảo** (Plan agent): `hocvachoi-design-system` + `frontend-design` → wireframe ASCII, chọn bố cục, duyệt trước khi code.
2. **Viết** (Build agent): `kid-touch-ui` + `activity-template` (nếu là hoạt động).
3. **Chụp và so sánh**: `webapp-testing`, iPad ngang/dọc, chế độ giảm chuyển động.
4. **Rà soát**: `web-design-guidelines` (`/review-ui`).
5. **Thử trên iPad thật**, và cuối cùng là bé.

---

## 15. Kiểm thử

| Lớp | Công cụ | Kiểm tra gì |
|-----|---------|-------------|
| Logic thuần | Vitest | Chấm đáp án; độ khó có ngưỡng (không dao động); `itemMastery`; chọn giọng rơi lùi; xuất/nhập + migration; chuẩn hóa NFC; giới hạn phiên/ngày |
| Component | Testing Library | Nút ≥ 80px; `MeoBong` đủ 8 trạng thái; cổng phụ huynh (2 điểm chạm, khóa sau 3 lần sai) |
| E2E | Playwright (Chromium + WebKit, khung iPad ngang/dọc) | Chơi 1 hoạt động mỗi mẫu; sao lưu → xóa → khôi phục; chạy **offline** |
| Không mạng | Playwright chặn mọi request khác origin | Có request lạ thì fail; kiểm CSP |
| Truy cập | `@axe-core/playwright`, reduced-motion | Không lỗi nghiêm trọng |
| Hiệu năng | Lighthouse (dev), kích thước build | Build < 30 MB; chạm → âm thanh cảm giác tức thì trên iPad |
| **iPad thật (hằng tuần)** | Thủ công | Âm thanh (kể cả công tắc im lặng), micro, cài PWA, chế độ máy bay, Guided Access, xoay màn hình, chạm nhầm, chạy 30 phút liên tục |

> Playwright WebKit gần với Safari nhưng **không thay được iPad thật**.

---

## 16. Lộ trình v3

> Ước lượng thô, giả định làm bán thời gian, đã tính cả thời gian làm asset.

### Phase 0: Kiểm chứng và chuẩn bị (1–2 tuần)

- Chốt câu hỏi mở (mục 18); hoàn thiện style guide và nhân vật Mèo Bông; chốt bảng chữ cái và từ minh họa (xử lý ô ⚠); prototype giấy 3–5 hoạt động cho bé thử.
- **5 spike kỹ thuật trên iPad thật:**
  1. Âm thanh: mở khóa, độ trễ, công tắc im lặng, phát chồng.
  2. PWA: cài, chạy offline ở chế độ máy bay, cập nhật.
  3. Thu âm: `MediaRecorder` → phát lại → lưu IndexedDB → xuất zip → Share Sheet.
  4. Chạm: 2 điểm chạm ở cổng, chặn cuộn/phóng to/menu giữ lâu.
  5. Hosting + HTTPS + Guided Access.
- Tạo repo, cài opencode, viết `AGENTS.md`, viết skill P0.

### Phase 1a: Lát cắt dọc (2–3 tuần)

- Khung app, tokens, router, `MeoBong` SVG (3 trạng thái: idle, talk, cheer), Error boundary.
- Engine + **5 mẫu**, mỗi mẫu 1 hoạt động ở module **Màu & hình** (asset tạm, giọng tạm).
- Dexie + hồ sơ bé + sao; khung cổng phụ huynh; route `/dev`; `assets:check`; CI (lint/test); deploy preview.
- **Kết quả:** bé thử chơi 5 phút, và bạn biết kiến trúc có đứng vững không trước khi làm 30 hoạt động.

### Phase 1b: MVP đầy đủ (6–8 tuần)

- Hoàn thiện 30 hoạt động (Màu & hình → Số → Chữ cái nhóm 1 → 5), asset thật. Nhóm chữ 4–5 làm **cuối cùng**; nếu chậm, tách sang bản 1.1 (chỉ thêm dữ liệu).
- Studio thu âm cơ bản, `itemMastery` + ôn tập, giới hạn ngày/giờ yên lặng, sao lưu/Share Sheet + nhắc, chế độ quan sát, sticker, Tự do khám phá.
- Test iPad thật.

### Phase 1.5: Thử với bé (1–2 tuần)

- Bé chơi 10 phút, bạn ngồi quan sát, không hướng dẫn; bật chế độ quan sát; ghi lại chỗ bé bối rối; sửa UX.

### Phase 2 (4–6 tuần)

- Dấu thanh (bằng hình dấu + cặp từ mẫu), tô nét (`trace`), tô màu, âm nhạc/đồng dao, thẻ "chơi cùng con" + in, nâng cấp Studio thu âm.

### Phase 3 (4–6 tuần)

- Tư duy, truyện tương tác, ghép vần, Nhà Mèo Bông, báo cáo tuần, nhiều hồ sơ bé.

### Phase 4: Mở rộng tùy ý

- Chủ đề mới (cảm xúc, thói quen, con vật, Tết/Trung thu); tiếng Anh nhập môn; nâng Mèo Bông lên Rive nếu muốn.

---

## 17. Tiêu chí hoàn thành (Definition of Done)

### MVP

- Bé 3–5 tuổi **tự chơi hết 1 phiên 5 phút** không cần người lớn chỉ dẫn.
- Chạy 30 phút liên tục trên iPad thật, không lỗi, không giật.
- 30 hoạt động đúng, có âm thanh đầy đủ (giọng phụ huynh đã thu).
- **Sao lưu → xóa dữ liệu → khôi phục thành công** (cả giọng thu).
- Chạy được ở chế độ máy bay sau lần tải đầu; test Playwright xác nhận **không có request ra ngoài origin**.
- Cài dạng toàn màn hình + Guided Access: bé không thoát app được bằng cử chỉ vô tình.
- `npm run check` xanh.

### Từng hoạt động

- [ ] Có `learningGoal`, `ageMin`, cấu hình theo nhóm tuổi (số lựa chọn, errorless).
- [ ] Đủ asset trạng thái `DONE`; `assets:check` xanh.
- [ ] Hướng dẫn bằng giọng, không phụ thuộc chữ.
- [ ] Sai không bị phạt; gợi ý sau 2 lần sai hoặc 6 giây im lặng.
- [ ] Nút ≥ 80 px; chạy tốt ngang/dọc; hỗ trợ reduced-motion; có chế độ chạm–chạm (nếu là match/sort).
- [ ] Có test logic; xem được trong `/dev`.
- [ ] Đã thử trên iPad thật.

---

## 18. Câu hỏi còn mở

Các câu hỏi Phase 0 đã chốt (mục 0.5). Còn lại:

1. **Ai thu âm?** Mẹ, bố hay cả hai? (khuyến nghị một giọng chính cho chữ/số/màu)
2. **Công cụ AI tạo hình** nào, và đã có bảng mẫu phong cách Mèo Bông được duyệt chưa? (mục 6.5)
3. **Repo:** public đơn giản (mặc định), hay repo nguồn private + repo phụ public chứa bản build? (mục 11.1)
4. **Từ vựng nhà bạn:** rà bảng 4.3 với gia đình (heo/banh/ô tô/ấm…) trước khi thu âm.
5. **Nhóm chữ 4–5:** giữ trong MVP (cuối Phase 1b) hay tách sang bản 1.1 nếu chậm?
6. **Đối chiếu** nhóm chữ và cách đọc âm với giáo viên mầm non/SGK bạn muốn theo.
7. **Tên miền riêng** cho app (không bắt buộc; giúp tách origin khỏi `<user>.github.io`).

---

## 19. Checklist quản lý dự án

**Phase 0**
- [ ] Chốt tên và nhận diện "Học Và Chơi"
- [ ] Chốt thiết bị và hosting
- [ ] Hoàn thiện style guide + vẽ Mèo Bông (bản nét + 8 biểu cảm)
- [ ] Chốt bảng chữ cái + từ minh họa
- [ ] 5 spike kỹ thuật trên iPad thật
- [ ] Tạo repo GitHub (public, tên khó đoán), bật Pages bằng GitHub Actions, cài opencode
- [ ] Rà từ vựng miền Nam (mục 4.6); duyệt bảng mẫu phong cách AI + prompt mẫu (mục 6.5)
- [ ] Viết `AGENTS.md`, `opencode.json`
- [ ] Viết skill P0 (`hocvachoi-design-system`, `kid-touch-ui`, `activity-template`)
- [ ] Cài/đọc kỹ skill ngoài (`frontend-design`, `web-design-guidelines`, `webapp-testing`)

**Phase 1a**
- [ ] Khung app + tokens + Error boundary
- [ ] Engine + 5 mẫu (mỗi mẫu 1 hoạt động)
- [ ] Dexie + hồ sơ + sao
- [ ] Route `/dev`, `assets:check`, CI, deploy preview
- [ ] Bé thử 5 phút

**Phase 1b**
- [ ] Màu & hình (7) · Con số (8) · Chữ cái 5 nhóm (15)
- [ ] Studio thu âm + fallback giọng
- [ ] `itemMastery` + ôn tập
- [ ] Cổng phụ huynh + cài đặt + tiến trình + giới hạn ngày
- [ ] Sao lưu/khôi phục + nhắc
- [ ] Chế độ quan sát, Tự do khám phá
- [ ] PWA offline + CSP
- [ ] Test iPad thật (30 phút), Guided Access

**Phase 1.5**
- [ ] Thử với bé, ghi lại, sửa UX

---

## 20. Rủi ro và cách giảm

| Rủi ro | Mức | Cách giảm |
|--------|:---:|-----------|
| Sản xuất asset (hình, giọng) quá tốn thời gian | Cao | Bảng asset tự động; chữ cái mở khóa dần, nhóm 4–5 làm cuối; hình tạm khi test; Studio thu âm theo danh sách |
| Hình AI không đồng nhất phong cách | Cao | Bám style guide; vẽ lại nét viền/màu; làm hàng loạt theo cùng mẫu |
| **Safari xóa dữ liệu** khi lâu không dùng | Cao | Dùng bản cài; `persist()`; nhắc sao lưu 7 ngày; xuất qua Share Sheet |
| **Âm thanh iOS** (mở khóa, công tắc im lặng, độ trễ) | Cao | Spike Phase 0; `AudioService` một điểm vào; audio sprite; màn "Chạm để bắt đầu" |
| Bé thoát khỏi app / kéo-phóng to / menu giữ lâu | Trung bình | Standalone + Guided Access; CSS kiosk; router bộ nhớ; cổng phụ huynh |
| Thu âm lỗi (định dạng Safari/Chrome khác nhau, cần HTTPS) | Trung bình | Lưu `mimeType`; spike thu âm; test trên iPad thật |
| Service Worker giữ bản cũ / cập nhật giữa lượt chơi | Trung bình | Chỉ áp dụng bản mới khi mở lại hoặc ở trang chủ; nút cập nhật cho phụ huynh |
| **Repo và site công khai** (GitHub Free) | Trung bình | Không commit dữ liệu cá nhân/giọng/backup; `.gitignore`; giọng chỉ thu trong app; kiểm điều khoản công cụ AI |
| Hình AI sai chi tiết (đếm sai số vật, chữ có dấu méo, phong cách lệch) | Cao | Vật đếm nhân bản bằng code; chữ/số luôn là font/SVG; checklist duyệt hình (mục 6.5) |
| Đường dẫn con `/<repo>/` làm hỏng Service Worker/manifest/asset | Trung bình | `base` cấu hình từ đầu; spike PWA Phase 0 chạy trên chính URL GitHub Pages |
| Cổng phụ huynh bị bé vượt qua | Trung bình | 2 điểm chạm giữ 3 giây + PIN tùy chọn + Guided Access |
| Code AI khó bảo trì | Trung bình | `AGENTS.md`, skill, commit nhỏ, test logic, tự review, `npm run check` |
| Bé mất hứng vì bài khó/dễ không hợp | Trung bình | Độ khó thích ứng có ngưỡng + chế độ quan sát ở Phase 1.5 |
| Phạm vi phình to | Trung bình | Khóa MVP theo mục 3.2; làm lát cắt dọc trước |

---

## 21. Quản lý phiên bản

`1.0 (MVP) → 1.1 (Phase 2) → 1.2 (Phase 3) → 2.0 (mở rộng)`

```markdown
## [1.0.0] - YYYY-MM-DD
### Thêm
- ...
### Sửa
- ...
### Trạng thái test
- iPad (đời, iPadOS): ...  ·  npm run check: ...  ·  Ghi chú: ...
```

---

*Tài liệu kế hoạch — HỌC VÀ CHƠI v3 (Web/PWA)*
