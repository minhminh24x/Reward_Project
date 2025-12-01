# 🤖 Rewards Helper Pro (AI Edition)

**Rewards Helper Pro** là một tiện ích mở rộng Chrome giúp tự động hóa quá trình tìm kiếm trên Bing để tích điểm Microsoft Rewards. Phiên bản này được tích hợp **Google Gemini AI** để tạo ra các từ khóa tìm kiếm tự nhiên, giúp tránh bị phát hiện là bot.

## 🔥 Tính năng nổi bật

* **🧠 Tích hợp Gemini AI:** Tạo từ khóa tìm kiếm thông minh, đa dạng chủ đề (Công nghệ, Du lịch, Lịch sử...) thay vì các chuỗi ký tự vô nghĩa.
* **📱 Chế độ Kép (Dual Mode):** Tự động chạy xong 20 lượt tìm kiếm PC, sau đó tự động chuyển sang giả lập Mobile để chạy tiếp 30 lượt (Full điểm hàng ngày).
* **🕵️ Giả lập hành vi người dùng:**
    * Tự động cuộn trang (Scroll) đọc nội dung.
    * Fake User-Agent chuyên sâu (Client Hints) giúp Bing nhận diện chính xác là thiết bị di động.
    * Thời gian nghỉ ngẫu nhiên (Random Delay) và nghỉ giữa hiệp.
* **⏰ Lên lịch tự động:** Tự động chạy vào khung giờ cài đặt hàng ngày (có độ trễ ngẫu nhiên +/- 30 phút).
* **📊 Nhật ký hoạt động:** Lưu lại lịch sử chạy để dễ dàng theo dõi.

## 🚀 Cài đặt

1.  Tải hoặc Clone repository này về máy.
2.  Mở trình duyệt Chrome (hoặc Edge/Brave), truy cập `chrome://extensions/`.
3.  Bật chế độ **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
4.  Nhấn vào **Load unpacked** (Tải tiện ích đã giải nén) và chọn thư mục `Reward_Tool`.

## ⚙️ Cấu hình

1.  Click vào icon tiện ích trên thanh công cụ -> Chọn **Cài đặt**.
2.  **Tab AI (Quan trọng):**
    * Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey) để lấy API Key miễn phí.
    * Dán Key vào ô "Gemini API Key" và lưu lại.
3.  **Tab Chung:**
    * Tùy chỉnh số lượng tìm kiếm (mặc định tool sẽ tự chạy 20 PC + 30 Mobile).
    * Bật/Tắt chế độ chạy ngầm.
4.  **Tab Lên lịch:** Cài đặt giờ chạy tự động nếu muốn.

## ⚠️ Lưu ý & Tuyên bố miễn trừ trách nhiệm

* Công cụ này chỉ dành cho mục đích **học tập và nghiên cứu** về lập trình Chrome Extension và AI.
* Việc sử dụng các công cụ tự động có thể vi phạm điều khoản dịch vụ của Microsoft Rewards. Tác giả không chịu trách nhiệm nếu tài khoản của bạn bị khóa hoặc mất điểm.
* Hãy sử dụng một cách chừng mực và có trách nhiệm.

## 📝 License

Dự án này được phân phối dưới giấy phép [MIT License](LICENSE).