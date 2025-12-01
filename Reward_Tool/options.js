const UI = {
  elements: {},
  init() {
    this.elements = {
      navLinks: document.querySelectorAll('#sidebar-nav a'),
      sections: document.querySelectorAll('.content-section'),
      status: document.getElementById('status'),
      // Inputs
      apiKey: document.getElementById('apiKey'),
      aiTopic: document.getElementById('aiTopic'),
      runInBackground: document.getElementById('runInBackground'),
      useMobileUserAgent: document.getElementById('useMobileUserAgent'), // MỚI
      tabsToOpen: document.getElementById('tabsToOpen'),
      delayModeRadios: document.querySelectorAll('input[name="delayMode"]'),
      fixedDelayDiv: document.getElementById('fixedDelaySetting'),
      fixedDelayInput: document.getElementById('fixedDelaySeconds'),
      enableSchedule: document.getElementById('enableSchedule'),
      scheduledTime: document.getElementById('scheduledTime'),
      // Buttons
      saveGeneral: document.getElementById('saveGeneral'),
      saveAI: document.getElementById('saveAI'),
      saveSchedule: document.getElementById('saveSchedule'),
      clearLogs: document.getElementById('clearLogs'),
      logsTable: document.querySelector('#runLogsTable tbody')
    };
    this.bindEvents();
    this.loadSettings();
  },

  bindEvents() {
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab(link.dataset.section);
      });
    });
    this.elements.delayModeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.elements.fixedDelayDiv.style.display = (e.target.value === 'fixed') ? 'block' : 'none';
      });
    });

    this.elements.saveGeneral.addEventListener('click', () => this.saveGeneral());
    this.elements.saveAI.addEventListener('click', () => this.saveAI());
    this.elements.saveSchedule.addEventListener('click', () => this.saveSchedule());
    this.elements.clearLogs.addEventListener('click', () => this.clearLogs());
  },

  async loadSettings() {
    const data = await chrome.storage.local.get(null); // Get all
    
    // AI
    this.elements.apiKey.value = data.apiKey || '';
    this.elements.aiTopic.value = data.aiTopic || '';

    // General
    this.elements.tabsToOpen.value = data.tabsToOpen || 30;
    this.elements.runInBackground.checked = data.runInBackground !== false;
    this.elements.useMobileUserAgent.checked = data.useMobileUserAgent || false; // MỚI: Load trạng thái Mobile

    const mode = data.delayMode || 'random';
    document.querySelector(`input[name="delayMode"][value="${mode}"]`).checked = true;
    this.elements.fixedDelayDiv.style.display = (mode === 'fixed') ? 'block' : 'none';
    this.elements.fixedDelayInput.value = data.fixedDelaySeconds || 5;

    // Schedule
    this.elements.enableSchedule.checked = data.enableSchedule || false;
    this.elements.scheduledTime.value = data.scheduledTime || '09:00';

    this.renderLogs(data.runLogs || []);
  },

  switchTab(sectionId) {
    this.elements.navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === sectionId));
    this.elements.sections.forEach(s => s.classList.toggle('active', s.id === sectionId));
  },

  showStatus(msg) {
    this.elements.status.textContent = msg;
    this.elements.status.style.display = 'block';
    setTimeout(() => { this.elements.status.style.display = 'none'; }, 3000);
  },

  async saveGeneral() {
    await chrome.storage.local.set({
      tabsToOpen: parseInt(this.elements.tabsToOpen.value),
      runInBackground: this.elements.runInBackground.checked,
      useMobileUserAgent: this.elements.useMobileUserAgent.checked, // MỚI: Lưu trạng thái Mobile
      delayMode: document.querySelector('input[name="delayMode"]:checked').value,
      fixedDelaySeconds: parseInt(this.elements.fixedDelayInput.value)
    });
    this.showStatus('Đã lưu cài đặt chung!');
  },

  async saveAI() {
    await chrome.storage.local.set({
      apiKey: this.elements.apiKey.value.trim(),
      aiTopic: this.elements.aiTopic.value.trim()
    });
    this.showStatus('Đã lưu cấu hình AI!');
  },

  async saveSchedule() {
    await chrome.storage.local.set({
      enableSchedule: this.elements.enableSchedule.checked,
      scheduledTime: this.elements.scheduledTime.value
    });
    chrome.runtime.sendMessage({ action: 'updateSchedule' });
    this.showStatus('Đã lưu lịch trình!');
  },

  async clearLogs() {
    await chrome.storage.local.set({ runLogs: [] });
    this.renderLogs([]);
    this.showStatus('Đã xóa nhật ký.');
  },

  renderLogs(logs) {
    this.elements.logsTable.innerHTML = '';
    if (!logs || !logs.length) {
      this.elements.logsTable.innerHTML = '<tr><td colspan="4">Chưa có dữ liệu</td></tr>';
      return;
    }
    [...logs].reverse().forEach(log => {
      const row = document.createElement('tr');
      const source = log.source === 'AI' ? '<span style="color:blue;font-weight:bold">AI</span>' : 'Thủ công';
      // MỚI: Hiển thị chế độ PC hay Mobile
      const mode = log.mode === 'Mobile' ? '<span style="color:#e67e22;font-weight:bold">📱 Mobile</span>' : '💻 PC'; 
      
      row.innerHTML = `
        <td>${new Date(log.time).toLocaleString()}</td>
        <td>${source}</td>
        <td>${mode}</td>
        <td>${log.count}</td>
      `;
      this.elements.logsTable.appendChild(row);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => UI.init());