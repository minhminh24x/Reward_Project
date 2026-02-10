/**
 * Options Script - Rewards Ultra Pro v4.1
 * Premium Settings Controller
 */

const Options = {
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadSettings();
    this.loadStatistics();
    this.bindRangeInputs();
  },

  cacheElements() {
    this.elements = {
      // Navigation
      navLinks: document.querySelectorAll('#sidebar-nav a'),
      sections: document.querySelectorAll('.content-section'),
      toast: document.getElementById('toast'),

      // Mode Cards
      modeCards: document.querySelectorAll('.mode-card'),
      pcSearchCount: document.getElementById('pcSearchCount'),
      mobileSearchCount: document.getElementById('mobileSearchCount'),
      pcSearchRange: document.getElementById('pcSearchRange'),
      mobileSearchRange: document.getElementById('mobileSearchRange'),
      autoCloseTab: document.getElementById('autoCloseTab'),
      tabCloseDelay: document.getElementById('tabCloseDelay'),
      tabCloseDelayRange: document.getElementById('tabCloseDelayRange'),
      closeDelayGroup: document.getElementById('closeDelayGroup'),
      saveSearchMode: document.getElementById('saveSearchMode'),

      // Anti-Detection
      canvasSpoof: document.getElementById('canvasSpoof'),
      webglSpoof: document.getElementById('webglSpoof'),
      audioSpoof: document.getElementById('audioSpoof'),
      touchSpoof: document.getElementById('touchSpoof'),
      batterySpoof: document.getElementById('batterySpoof'),
      webrtcSpoof: document.getElementById('webrtcSpoof'),
      humanScroll: document.getElementById('humanScroll'),
      clickResults: document.getElementById('clickResults'),
      mouseMovement: document.getElementById('mouseMovement'),
      smartTiming: document.getElementById('smartTiming'),
      saveAntiDetection: document.getElementById('saveAntiDetection'),

      // AI
      apiKey: document.getElementById('apiKey'),
      aiTopic: document.getElementById('aiTopic'),
      toggleApiKey: document.getElementById('toggleApiKey'),
      aiStatusValue: document.getElementById('aiStatusValue'),
      saveAI: document.getElementById('saveAI'),

      // Schedule
      enableSchedule: document.getElementById('enableSchedule'),
      scheduledTime: document.getElementById('scheduledTime'),
      saveSchedule: document.getElementById('saveSchedule'),

      // Statistics
      statTotalSearches: document.getElementById('statTotalSearches'),
      statEstimatedPoints: document.getElementById('statEstimatedPoints'),
      statDaysActive: document.getElementById('statDaysActive'),
      statAIUsage: document.getElementById('statAIUsage'),
      weeklyChart: document.getElementById('weeklyChart'),

      // Quick Actions
      quickStartBoth: document.getElementById('quickStartBoth'),
      quickStartPC: document.getElementById('quickStartPC'),
      quickStartMobile: document.getElementById('quickStartMobile'),

      // Logs
      logsTable: document.querySelector('#runLogsTable tbody'),
      logsCount: document.getElementById('logsCount'),
      clearLogs: document.getElementById('clearLogs')
    };
  },

  bindEvents() {
    // Navigation with animation
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab(link.dataset.section);
      });
    });

    // Mode cards
    this.elements.modeCards.forEach(card => {
      card.addEventListener('click', () => {
        this.elements.modeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // API Key toggle
    this.elements.toggleApiKey?.addEventListener('click', () => {
      const input = this.elements.apiKey;
      input.type = input.type === 'password' ? 'text' : 'password';
      this.elements.toggleApiKey.textContent = input.type === 'password' ? '👁️' : '🙈';
    });

    // Save buttons
    this.elements.saveSearchMode?.addEventListener('click', () => this.saveSearchMode());
    this.elements.saveAntiDetection?.addEventListener('click', () => this.saveAntiDetection());
    this.elements.saveAI?.addEventListener('click', () => this.saveAI());
    this.elements.saveSchedule?.addEventListener('click', () => this.saveSchedule());
    this.elements.clearLogs?.addEventListener('click', () => this.clearLogs());

    // Quick actions
    this.elements.quickStartBoth?.addEventListener('click', () => this.quickStart('both'));
    this.elements.quickStartPC?.addEventListener('click', () => this.quickStart('pc_only'));
    this.elements.quickStartMobile?.addEventListener('click', () => this.quickStart('mobile_only'));
  },

  bindRangeInputs() {
    // Sync range and number inputs
    const syncInputs = (range, number) => {
      if (!range || !number) return;
      range.addEventListener('input', () => number.value = range.value);
      number.addEventListener('input', () => range.value = number.value);
    };

    syncInputs(this.elements.pcSearchRange, this.elements.pcSearchCount);
    syncInputs(this.elements.mobileSearchRange, this.elements.mobileSearchCount);
    syncInputs(this.elements.tabCloseDelayRange, this.elements.tabCloseDelay);

    // Auto-close toggle visibility
    this.elements.autoCloseTab?.addEventListener('change', (e) => {
      this.toggleCloseDelayVisibility(e.target.checked);
    });
  },

  async loadSettings() {
    const data = await chrome.storage.local.get(null);

    // Search Mode
    const mode = data.searchMode || 'both';
    this.elements.modeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.mode === mode);
    });

    if (this.elements.pcSearchCount) {
      this.elements.pcSearchCount.value = data.pcSearchCount || 30;
      this.elements.pcSearchRange.value = data.pcSearchCount || 30;
    }
    if (this.elements.mobileSearchCount) {
      this.elements.mobileSearchCount.value = data.mobileSearchCount || 20;
      this.elements.mobileSearchRange.value = data.mobileSearchCount || 20;
    }

    // Auto-close tab
    if (this.elements.autoCloseTab) {
      this.elements.autoCloseTab.checked = data.autoCloseTab !== false;
      this.toggleCloseDelayVisibility(data.autoCloseTab !== false);
    }
    if (this.elements.tabCloseDelay) {
      const delay = (data.tabCloseDelay || 2000) / 1000;
      this.elements.tabCloseDelay.value = delay;
      this.elements.tabCloseDelayRange.value = delay;
    }

    // Anti-Detection
    const ad = data.antiDetection || {};
    if (this.elements.canvasSpoof) this.elements.canvasSpoof.checked = ad.canvas !== false;
    if (this.elements.webglSpoof) this.elements.webglSpoof.checked = ad.webgl !== false;
    if (this.elements.audioSpoof) this.elements.audioSpoof.checked = ad.audio !== false;
    if (this.elements.touchSpoof) this.elements.touchSpoof.checked = ad.touch !== false;
    if (this.elements.batterySpoof) this.elements.batterySpoof.checked = ad.battery !== false;
    if (this.elements.webrtcSpoof) this.elements.webrtcSpoof.checked = ad.webrtc !== false;
    if (this.elements.humanScroll) this.elements.humanScroll.checked = ad.humanScroll !== false;
    if (this.elements.clickResults) this.elements.clickResults.checked = ad.clickResults !== false;
    if (this.elements.mouseMovement) this.elements.mouseMovement.checked = ad.mouseMovement !== false;
    if (this.elements.smartTiming) this.elements.smartTiming.checked = data.smartTiming !== false;

    // AI
    if (this.elements.apiKey) {
      this.elements.apiKey.value = data.apiKey || '';
      this.updateAIStatus(!!data.apiKey);
    }
    if (this.elements.aiTopic) this.elements.aiTopic.value = data.aiTopic || '';

    // Schedule
    if (this.elements.enableSchedule) this.elements.enableSchedule.checked = data.enableSchedule || false;
    if (this.elements.scheduledTime) this.elements.scheduledTime.value = data.scheduledTime || '09:00';

    // Logs
    this.renderLogs(data.runLogs || []);
  },

  switchTab(sectionId) {
    // Update nav
    this.elements.navLinks.forEach(l =>
      l.classList.toggle('active', l.dataset.section === sectionId)
    );

    // Animate section transition
    this.elements.sections.forEach(s => {
      if (s.id === sectionId) {
        s.classList.add('active');
        s.style.animation = 'fadeSlideIn 0.4s ease forwards';
      } else {
        s.classList.remove('active');
      }
    });
  },

  showToast(msg, type = 'success') {
    const toast = this.elements.toast;
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  updateAIStatus(hasKey) {
    if (this.elements.aiStatusValue) {
      this.elements.aiStatusValue.textContent = hasKey ? 'Đã kết nối' : 'Chưa cấu hình';
      this.elements.aiStatusValue.className = 'ai-status-value ' + (hasKey ? 'active' : '');
    }
  },

  // ============================================================
  // SAVE FUNCTIONS
  // ============================================================

  async saveSearchMode() {
    const activeCard = document.querySelector('.mode-card.active');
    await chrome.storage.local.set({
      searchMode: activeCard?.dataset.mode || 'both',
      pcSearchCount: parseInt(this.elements.pcSearchCount?.value || 30),
      mobileSearchCount: parseInt(this.elements.mobileSearchCount?.value || 20),
      autoCloseTab: this.elements.autoCloseTab?.checked ?? true,
      tabCloseDelay: parseInt(this.elements.tabCloseDelay?.value || 2) * 1000
    });
    this.showToast('✅ Đã lưu chế độ search!');
  },

  toggleCloseDelayVisibility(show) {
    if (this.elements.closeDelayGroup) {
      this.elements.closeDelayGroup.style.display = show ? 'block' : 'none';
    }
  },

  async saveAntiDetection() {
    await chrome.storage.local.set({
      antiDetection: {
        canvas: this.elements.canvasSpoof?.checked ?? true,
        webgl: this.elements.webglSpoof?.checked ?? true,
        audio: this.elements.audioSpoof?.checked ?? true,
        touch: this.elements.touchSpoof?.checked ?? true,
        battery: this.elements.batterySpoof?.checked ?? true,
        webrtc: this.elements.webrtcSpoof?.checked ?? true,
        humanScroll: this.elements.humanScroll?.checked ?? true,
        clickResults: this.elements.clickResults?.checked ?? true,
        mouseMovement: this.elements.mouseMovement?.checked ?? true
      },
      smartTiming: this.elements.smartTiming?.checked ?? true
    });
    this.showToast('✅ Đã lưu cài đặt bảo vệ!');
  },

  async saveAI() {
    const key = this.elements.apiKey?.value.trim() || '';
    await chrome.storage.local.set({
      apiKey: key,
      aiTopic: this.elements.aiTopic?.value.trim() || ''
    });
    this.updateAIStatus(!!key);
    this.showToast('✅ Đã lưu cấu hình AI!');
  },

  async saveSchedule() {
    await chrome.storage.local.set({
      enableSchedule: this.elements.enableSchedule?.checked || false,
      scheduledTime: this.elements.scheduledTime?.value || '09:00'
    });
    chrome.runtime.sendMessage({ action: 'updateSchedule' });
    this.showToast('✅ Đã lưu lịch trình!');
  },

  async clearLogs() {
    await chrome.storage.local.set({ runLogs: [] });
    this.renderLogs([]);
    this.loadStatistics();
    this.showToast('✅ Đã xóa nhật ký!');
  },

  quickStart(mode) {
    chrome.runtime.sendMessage({ action: 'startWithMode', mode });
    this.showToast(`🚀 Đang khởi động ${mode}...`);
  },

  // ============================================================
  // STATISTICS
  // ============================================================

  async loadStatistics() {
    const data = await chrome.storage.local.get(['runLogs']);
    const logs = data.runLogs || [];

    // Animate counters
    const total = logs.reduce((sum, log) => sum + (log.count || 0), 0);
    this.animateValue(this.elements.statTotalSearches, total);

    // Points
    const dailyStats = {};
    logs.forEach(log => {
      const date = new Date(log.time).toDateString();
      if (!dailyStats[date]) dailyStats[date] = { pc: 0, mobile: 0 };
      if (log.mode === 'PC') dailyStats[date].pc += log.count || 0;
      else dailyStats[date].mobile += log.count || 0;
    });

    let totalPoints = 0;
    Object.values(dailyStats).forEach(d => {
      totalPoints += Math.min(90, d.pc * 3) + Math.min(60, d.mobile * 3);
    });
    this.animateValue(this.elements.statEstimatedPoints, totalPoints);

    // Days active
    this.animateValue(this.elements.statDaysActive, Object.keys(dailyStats).length);

    // AI usage
    const aiCount = logs.filter(l => l.source === 'AI').length;
    const pct = logs.length > 0 ? Math.round((aiCount / logs.length) * 100) : 0;
    if (this.elements.statAIUsage) this.elements.statAIUsage.textContent = pct + '%';

    // Chart
    this.renderChart(logs);
  },

  animateValue(el, target) {
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const duration = 800;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  },

  renderChart(logs) {
    const container = this.elements.weeklyChart;
    if (!container) return;
    container.innerHTML = '';

    // Last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        day: date.getDate(),
        pc: 0,
        mobile: 0
      });
    }

    logs.forEach(log => {
      const logDate = new Date(log.time).toDateString();
      const day = days.find(d => d.date === logDate);
      if (day) {
        if (log.mode === 'PC') day.pc += log.count || 0;
        else day.mobile += log.count || 0;
      }
    });

    const max = Math.max(...days.map(d => d.pc + d.mobile), 1);

    days.forEach((day, i) => {
      const col = document.createElement('div');
      col.className = 'chart-col';
      col.style.animationDelay = `${i * 0.1}s`;

      const pcHeight = (day.pc / max) * 100;
      const mobileHeight = (day.mobile / max) * 100;
      const total = day.pc + day.mobile;

      col.innerHTML = `
                <div class="bar-stack">
                    <div class="bar bar-mobile" style="height: ${mobileHeight}%"></div>
                    <div class="bar bar-pc" style="height: ${pcHeight}%"></div>
                </div>
                <div class="bar-day">${day.label}</div>
                <div class="bar-num">${day.day}</div>
                <div class="bar-total">${total}</div>
            `;
      container.appendChild(col);
    });
  },

  // ============================================================
  // LOGS
  // ============================================================

  renderLogs(logs) {
    const tbody = this.elements.logsTable;
    if (!tbody) return;

    if (this.elements.logsCount) {
      this.elements.logsCount.textContent = logs.length;
    }

    tbody.innerHTML = '';

    if (!logs.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Chưa có dữ liệu</td></tr>';
      return;
    }

    [...logs].reverse().slice(0, 50).forEach((log, i) => {
      const row = document.createElement('tr');
      row.style.animationDelay = `${i * 0.03}s`;

      const source = log.source === 'AI'
        ? '<span class="badge ai">🤖 AI</span>'
        : '<span class="badge static">📝 Static</span>';

      const mode = log.mode === 'Mobile'
        ? '<span class="badge mobile">📱</span>'
        : '<span class="badge pc">💻</span>';

      row.innerHTML = `
                <td>${new Date(log.time).toLocaleString('vi-VN')}</td>
                <td>${source}</td>
                <td>${mode}</td>
                <td>${log.device || '-'}</td>
                <td><strong>${log.count}</strong></td>
            `;
      tbody.appendChild(row);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Options.init());