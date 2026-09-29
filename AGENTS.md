# Học Và Chơi — Quy tắc cho AI

## Dự án
Web app (PWA) học sớm tiếng Việt cho bé 2–5 tuổi (trọng tâm hiện tại: bé 3 tuổi). Dùng cá nhân trong gia đình, chạy trên iPad Safari (chế độ Standalone + Guided Access).
Công nghệ: TypeScript strict + React 19 + Vite + Tailwind CSS + Dexie (IndexedDB) + Howler.js + Framer Motion. Hoàn toàn không backend, chạy offline 100%.

## Nguyên tắc sản phẩm (BẮT BUỘC TUÂN THỦ)
- Bé không cần biết đọc vẫn tự chơi được. Giao diện trực quan, hướng dẫn hoàn toàn bằng giọng nói và cử chỉ.
- Không có "thua", không trừ điểm/sao, không đếm ngược áp lực, không bảng xếp hạng thi đua.
- Không gọi mạng ngoài origin: không analytics, không quảng cáo, không SDK bên thứ ba, không CDN, font tự host.
- Kiosk UI trẻ em: Vùng chạm bé thao tác ≥ 80px CSS; khoảng cách giữa các nút ≥ 16px. Chống chạm nhầm/chống cuộn vô tình (`overscroll-behavior: none`, `touch-action: none` tại khu vực chơi).
- Lời thoại Mèo Bông ngắn gọn (≤ 8 từ).
- Mèo Bông chỉ có 8 trạng thái cảm xúc: `idle`, `wave`, `talk`, `cheer`, `think`, `encourage`, `surprise`, `sleep`. TUYỆT ĐỐI không có biểu cảm giận dữ, buồn bã hay thất vọng. Khi bé chọn sai dùng `encourage`.

## Kiến trúc
- Cấu trúc thư mục chuẩn hóa theo `docs/decisions.md` và Mục 10.2 của `Plan.md`:
  - `src/app/`: Config app, router, tokens.css, ErrorBoundary.
  - `src/core/`: `audio/` (AudioService một điểm vào duy nhất), `storage/` (Dexie DB), `activity-engine/`, `mastery/`, `gate/`.
  - `src/features/`: Các module tính năng (home, alphabet, numbers, colors-shapes, parents...).
  - `src/components/`: UI components dùng chung (MeoBong, BigButton, Card...).
  - `src/content/`: Dữ liệu bài học JSON điều khiển giao diện (thêm bài mới = thêm JSON, KHÔNG code màn hình riêng lẻ).
  - `src/assets/`: Hình ảnh SVG, âm thanh .m4a/sprites đóng gói offline.
- Mọi âm thanh PHẢI đi qua `AudioService`. Mọi lưu trữ bền PHẢI đi qua `src/core/storage`.

## Xử lý Tiếng Việt
- ID và tên file: ASCII không dấu, snake_case (`letter_a`, `letter_dd` cho Đ...).
- Chuỗi tiếng Việt hiển thị: Bắt buộc chuẩn hóa Unicode NFC (`str.normalize('NFC')`).
- Thứ tự 29 chữ cái là mảng hằng số cố định trong dữ liệu.

## Quy trình làm việc
- Không tự ý cài thêm package ngoài bảng công nghệ nếu chưa có sự đồng ý của người dùng.
- Thường xuyên kiểm tra bằng `npm run build` và typecheck.
