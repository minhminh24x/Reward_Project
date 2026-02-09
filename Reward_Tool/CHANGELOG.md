# 📋 CHANGELOG

Tất cả thay đổi đáng chú ý của dự án sẽ được ghi lại trong file này.

## Quy tắc đánh phiên bản

| Loại thay đổi | Ví dụ | Cách tăng version |
|---------------|-------|-------------------|
| 🐛 Bug fixes / Sửa lỗi nhỏ | Fix typo, sửa css | `4.1.0` → `4.1.1` |
| ✨ Features / Nâng cấp | Thêm tính năng mới | `4.1.0` → `4.2.0` |
| 🔥 Breaking / Lột xác | Viết lại hoàn toàn | `4.1.0` → `5.0.0` |

---

## [4.1.0] - 2026-02-09

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

## [4.0.0] - 2026-02-09

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

## [3.0.0] - 2026-02-08

### ✨ Phiên bản gốc
- Basic PC/Mobile search
- Static keywords từ topics.json
- Gemini AI keyword generation
- Simple scheduling
- Basic User-Agent switching

---

## 📁 Files được thay đổi

### v4.1.0
| File | Lines | Description |
|------|-------|-------------|
| `anti-detection.js` | 450+ | Complete rewrite v2.0 |
| `popup.html` | 290 | Glassmorphism redesign |
| `popup.js` | 170 | Animated counters |
| `options.html` | 350 | Dashboard + settings |
| `options.js` | 300 | Chart rendering |
| `styles.css` | 750 | Premium CSS |
| `CHANGELOG.md` | NEW | Version tracking |

### v4.0.0
| File | Lines | Description |
|------|-------|-------------|
| `anti-detection.js` | NEW | Anti-detection engine |
| `device-profiles.js` | NEW | Device configurations |
| `background.js` | 600+ | Core logic rewrite |
| `manifest.json` | 35 | Updated permissions |
| `topics.json` | 175+ | Expanded keywords |
