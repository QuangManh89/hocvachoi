# NHẬT KÝ QUYẾT ĐỊNH THIẾT KẾ — DỰ ÁN "HỌC VÀ CHƠI" (v3)

> Tài liệu ghi nhận các quyết định kiến trúc, công nghệ và nội dung cốt lõi đã được thống nhất qua phiên phỏng vấn sâu (/grill-me) ngày 29/09/2026.

---

## 1. Mục tiêu và Định hướng chung
- **Đối tượng trọng tâm:** Bé 3 tuổi (`ageBand: 3-4`).
- **Thiết bị đích:** iPad Gen 11 (chip A16), trình duyệt Safari (chạy chế độ PWA Standalone + iOS Guided Access).
- **Mục tiêu sản phẩm:** Ứng dụng web học sớm không kinh doanh, dùng cho gia đình, chạy 100% offline sau lần tải đầu, không tài khoản, không quảng cáo, không điểm phạt, không gây áp lực cho bé.

---

## 2. Nhật ký Quyết định Chi tiết

### ADR-01: Chiến lược Quản lý Mã nguồn và Triển khai (Hosting & Privacy)
- **Bối cảnh:** Plan ban đầu chọn GitHub Pages. Tuy nhiên tài khoản GitHub Free chỉ hỗ trợ Pages với Repository Public, dẫn đến rủi ro lộ mã nguồn, kịch bản, và cấu trúc asset của gia đình.
- **Quyết định đã chốt:** Sử dụng **Mô hình 2 Repository trên GitHub**:
  1. `hoc-va-choi-source` (Private): Chứa toàn bộ mã nguồn, dữ liệu JSON, scripts sinh asset và lịch sử commit bí mật.
  2. `hoc-va-choi` (Public): Chỉ chứa các file tĩnh sau khi `npm run build` đã được đóng gói, triển khai tự động qua GitHub Actions khi gắn tag phiên bản `v*`.
- **Hệ quả kỹ thuật:** 
  - Cấu hình `base: '/<repo-public>/'` trong `vite.config.ts`.
  - Service Worker và PWA Web Manifest được cấu hình khớp với subpath của public repo.
  - Bảo mật tuyệt đối mã nguồn gốc và quy trình phát triển.

### ADR-02: Quy trình Sản xuất Nhân vật Mèo Bông và Đồ họa
- **Bối cảnh:** Dùng ảnh AI nguyên khối cho nhân vật chính sẽ khiến nhân vật không đồng nhất giữa các màn hình, khó cắt lớp để làm chuyển động và dễ biến dạng nét vẽ.
- **Quyết định đã chốt:** 
  - Nhân vật Mèo Bông được **xây dựng trực tiếp bằng vector SVG nhiều lớp** (đầu, mắt, miệng, tai, má hồng, tay, chân, đuôi, nơ xanh) theo đúng thông số hình khối Chibi và bảng màu quy định trong Style Guide Mục 5 (`#FFF1D6`, `#F6B36B`, `#FF9FB2`, viền `#5A3E36`).
  - Điều khiển chuyển động bằng thư viện **Framer Motion (`motion`)** với 8 trạng thái cảm xúc: `idle`, `wave`, `talk`, `cheer`, `think`, `encourage`, `surprise`, `sleep`.
- **Hệ quả kỹ thuật:**
  - File siêu nhẹ (< 15 KB), sắc nét 100% trên màn hình Retina của iPad.
  - Phản hồi trạng thái ngay lập tức, không tốn tài nguyên tải ảnh hay giật lag.

### ADR-03: Giải pháp Âm thanh — Sinh tự động bằng Dịch vụ TTS (Build-time TTS Pipeline)
- **Bối cảnh:** Kế hoạch v2/v3 ban đầu yêu cầu phụ huynh tự thu âm thủ công ~115 câu thoại bằng micro iPad, điều này đòi hỏi rất nhiều thời gian, công sức và khó kiểm soát tạp âm/âm lượng đồng đều.
- **Quyết định đã chốt (Thay đổi quan trọng):**
  - Sử dụng **dịch vụ Chuyển văn bản thành giọng đọc (Text-to-Speech)** qua script tự động lúc build để tạo sẵn toàn bộ ~115 file âm thanh giọng miền Nam chuẩn (`vi-VN-HoaiMyNeural` / `vi-VN-NamMinhNeural` từ Edge-TTS với tốc độ đọc chậm rãi -10% đến -15% cho trẻ 3 tuổi).
  - Đóng gói sẵn các file `.m4a` / audio sprite vào ứng dụng để **đảm bảo chạy OFFLINE 100%**, không cần kết nối mạng.
  - **Vẫn giữ kiến trúc 3 tầng (Fallback)**: Giọng phụ huynh thu trong app (Studio) > Giọng mặc định TTS tạo sẵn > Giọng Web Speech dev. Phụ huynh hoàn toàn có thể thu đè bất kỳ câu nào nếu muốn.
- **Hệ quả kỹ thuật:**
  - Tiết kiệm 100% thời gian thu âm ban đầu.
  - Âm thanh đồng đều, chuẩn phát âm, không rè, không tạp âm.
  - File âm thanh mono 64kbps siêu nhẹ, tổng dung lượng audio toàn bộ app < 15MB.

### ADR-04: Phạm vi Nội dung Chữ cái Tiếng Việt cho MVP
- **Bối cảnh:** Bé hiện 3 tuổi, việc học 29 chữ cái cần lộ trình nhiều tháng. Cần quyết định đưa bao nhiêu chữ cái vào bản MVP đầu tiên.
- **Quyết định đã chốt:**
  - Đưa **đầy đủ 29 chữ cái (5 nhóm)** vào dữ liệu của ứng dụng ngay từ MVP:
    - Nhóm 1 (6 chữ): `a, e, i, o, u, y` (nguyên âm cơ bản)
    - Nhóm 2 (6 chữ): `ă, â, ê, ô, ơ, ư` (nguyên âm có mũ, móc)
    - Nhóm 3 (6 chữ): `m, n, t, l, h, c` (phụ âm quen thuộc)
    - Nhóm 4 (6 chữ): `b, p, v, x, s, r` (phụ âm tiếp theo)
    - Nhóm 5 (5 chữ): `d, đ, g, k, q` (phụ âm dễ nhầm)
  - **Cơ chế mở khóa tuần tự:** Mặc định chỉ mở **Nhóm 1**. Phụ huynh có thể mở các nhóm tiếp theo khi bé đạt độ thành thạo hoặc chủ động bật trong Cổng phụ huynh.
- **Từ vựng miền Nam đã chốt:**
  - B: trái bóng (hoặc "trái banh" nếu ba mẹ thu âm thủ công; lưu ý dịch vụ TTS tự động lọc từ "banh" nên TTS dùng "trái bóng")
  - I: ỉn (con heo)
  - U: ủng
  - Y: y tá
  - Ư: sư tử
  - P: pin
  - Q: quạt (phát âm: "cu")

### ADR-05: Môi trường Kiểm thử trên iPad thật
- **Bối cảnh:** iOS Safari bắt buộc HTTPS để cấp quyền Micro và kích hoạt Service Worker PWA.
- **Quyết định đã chốt:**
  - Sử dụng **Cloudflare Tunnel (`cloudflared`)** khi dev: Chạy 1 câu lệnh trên PC tạo ngay đường hầm HTTPS an toàn mở trực tiếp trên Safari iPad mà không cần cài đặt chứng chỉ SSL tự ký phức tạp.

---

## 3. Lộ trình Thực hiện Tiếp theo
1. **Kiểm tra Giọng đọc TTS Mẫu:** Chạy script tạo các file audio mẫu (lời chào Mèo Bông, lời khen, phát âm chữ cái) để nghe và thẩm định chất lượng.
2. **Khởi tạo Khung Dự án (Phase 0 Scaffold):**
   - Setup React 19/18 + TypeScript strict + Vite + Tailwind CSS.
   - Tạo file `AGENTS.md` tại gốc repo quy định nghiêm ngặt nguyên tắc sản phẩm.
   - Tạo `src/app/tokens.css` và cấu trúc thư mục module hóa.
   - Xây dựng component SVG `MeoBong` với Framer Motion.
