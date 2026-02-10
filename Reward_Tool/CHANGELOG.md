# 📋 CHANGELOG

Tất cả thay đổi đáng chú ý của dự án sẽ được ghi lại trong file này.

## Quy tắc đánh phiên bản

| Loại thay đổi | Ví dụ | Cách tăng version |
|---------------|-------|-------------------|
| 🐛 Bug fixes / Sửa lỗi nhỏ | Fix typo, sửa css | `2.1.0` → `2.1.1` |
| ✨ Features / Nâng cấp | Thêm tính năng mới | `2.1.0` → `2.2.0` |
| 🔥 Breaking / Lột xác | Viết lại hoàn toàn | `2.1.0` → `3.0.0` |

---

## [2.3.1] - 2026-02-10

### 🐛 Critical Fix: Mobile Search Points
- **Mobile URL Parameters**: Sửa lỗi mobile search không lên điểm
  - ✅ Thêm `PC=SANSAAND` (key mobile identifier)
  - ✅ Dùng `form=BABTAA` thay vì PC form codes
  - ✅ Thêm `cc=vn`, `ssp=1`, `setlang=vi`
  - 📊 Based on real mobile device URL analysis
- **Trước**: `form=QBRE&qs=n&sp=9` (PC parameters)
- **Sau**: `PC=SANSAAND&form=BABTAA&cc=vn&ssp=1` (Mobile parameters)
- **Tab Error Fix**: Bỏ tab existence check để tránh crash

### ⚠️ QUAN TRỌNG
Giờ mobile search sẽ được Microsoft Rewards công nhận và lên điểm chính xác!

---

## [2.3.0] - 2026-02-10

### 🎨 UI Upgrade: Side Panel (Sidebar)
- **Side Panel**: Extension giờ mở ở sidebar bên cạnh
  - Không còn popup dropdown nhỏ
  - Full-height sidebar, resize được
  - Không tự đóng khi click ra ngoài
  - Theo dõi tiến độ dễ dàng hơn
- **Files mới**:
  - `sidepanel.html`: UI cho sidebar
  - `sidepanel-styles.css`: Styles tối ưu sidebar
  - `sidepanel.js`: Logic điều khiển
- **Manifest**: Thêm `side_panel` config và `sidePanel` permission

---

## [2.2.0] - 2026-02-10

### 🐛 Bug Fixes
- **Search Loop**: Không còn dừng sau 5 lần search
  - Error recovery nếu tab bị đóng ngoài ý muốn
  - Chi tiết logging: `🔍 Search X/Y: keyword...`
- **Auto-Close Tab**: Tab tự đóng đúng cách
  - Double-check tab tồn tại trước khi close
  - Delay 2s mặc định
- **Stop Button**: Dừng ngay lập tức
  - Check `stopRequested` sau mỗi iteration
  - Tab đóng ngay khi nhấn Stop
  - Reset state sau 1s

### 🎨 UI Redesign
- **Popup**: Slider-style design mới
  - Loại bỏ orb background
  - Button to, dễ nhấn hơn
  - Layout đơn giản, rõ ràng

---

## [2.1.1] - 2026-02-09

### ✨ Features mới
- **Auto-close Tab**: Tab search tự động đóng sau khi session kết thúc
  - Toggle bật/tắt trong Settings → Chế độ Search
  - Delay 1-10 giây có thể điều chỉnh
  - Console log chi tiết: `🗑️ Closing tab in Xs...`

---

## [2.1.0] - 2026-02-09

### 🔥 Lột xác Anti-Detection Engine v2.0
- Canvas fingerprint với session-consistent noise
- WebGL renderer/vendor spoofing (RTX 4090, M3 Pro, RX 7900 XTX)
- AudioContext fingerprint protection
- **NEW:** Touch events simulation cho mobile
- **NEW:** Battery API spoofing (30-80% charge)
- **NEW:** WebRTC IP leak protection
- **NEW:** Font fingerprint protection
- **NEW:** Timezone/Locale consistency
- **NEW:** Performance timing noise

### ✨ UI Premium Glassmorphism
**Popup:**
- Animated background với floating orbs
- Pulsing gradient logo
- Shimmer progress bar
- easeOutCubic animated counters
- Ripple effect buttons

**Options Page:**
- Dashboard với stats cards
- Interactive weekly activity chart  
- Protection grid với toggle switches
- Mode selector cards
- Sidebar navigation với indicators
- Toast notifications

### 📱 Mobile Spoofing nâng cao
- `maxTouchPoints` simulation
- `matchMedia` pointer detection bypass
- Screen orientation spoofing
- Connection API spoofing (4g/wifi)
- Device pixel ratio matching

---

## [2.0.0] - 2026-02-09

### ✨ Tính năng mới
- Anti-Detection Engine v1.0
  - Canvas fingerprint noise
  - WebGL spoofing
  - Navigator properties override
- Device Profiles (15+ devices)
  - iPhone 13-15 series
  - Samsung S24, Pixel 8, Xiaomi 14
- PC/Mobile mode selection
- Human behavior simulation
  - Random scroll (20-80%)
  - Click results (30%)
  - Mouse movement
- Smart timing (avoid 2-6 AM)

### 🎨 UI Modernization
- Dark theme
- Mode selector buttons
- Animated progress bar
- Statistics dashboard
- Log viewer với badges

---

## [1.0.0] - 2026-02-08

### ✨ Phiên bản gốc
- Basic PC/Mobile search
- Static keywords từ topics.json
- Gemini AI keyword generation
- Simple scheduling
- Basic User-Agent switching
