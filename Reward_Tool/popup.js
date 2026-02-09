/**
 * Popup Script - Rewards Ultra Pro v4.1
 * Premium UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // ELEMENTS
  // ============================================================
  const elements = {
    statusValue: document.getElementById('statusValue'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    phaseRow: document.getElementById('phaseRow'),
    phaseBadge: document.getElementById('phaseBadge'),
    phaseIcon: document.getElementById('phaseIcon'),
    phaseText: document.getElementById('phaseText'),
    progressWrap: document.getElementById('progressWrap'),
    progressLabel: document.getElementById('progressLabel'),
    progressCount: document.getElementById('progressCount'),
    progressFill: document.getElementById('progressFill'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    optionsBtn: document.getElementById('optionsBtn'),
    todayCount: document.getElementById('todayCount'),
    pointsCount: document.getElementById('pointsCount'),
    streakCount: document.getElementById('streakCount')
  };

  let currentMode = 'both';
  let animationFrame = null;

  // ============================================================
  // UI UPDATE
  // ============================================================
  function updateUI(status) {
    if (status.isRunning) {
      // Running state
      elements.statusValue.className = 'status-value running';
      elements.statusDot.className = 'status-dot running';
      elements.statusText.textContent = 'Đang chạy...';

      elements.startBtn.style.display = 'none';
      elements.stopBtn.style.display = 'flex';

      elements.progressWrap.classList.add('active');

      // Phase display
      if (status.phase) {
        elements.phaseRow.style.display = 'block';
        if (status.phase === 'PC') {
          elements.phaseIcon.textContent = '💻';
          elements.phaseText.textContent = 'PC Mode';
        } else {
          elements.phaseIcon.textContent = '📱';
          elements.phaseText.textContent = 'Mobile Mode';
        }
      }

      // Progress with animation
      const pct = status.totalTabs > 0
        ? Math.round((status.openedTabs / status.totalTabs) * 100)
        : 0;
      animateProgressBar(pct);
      elements.progressCount.textContent = `${status.openedTabs}/${status.totalTabs}`;

      // Disable mode buttons
      elements.modeBtns.forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.5';
      });

    } else {
      // Ready state
      elements.statusValue.className = 'status-value ready';
      elements.statusDot.className = 'status-dot ready';
      elements.statusText.textContent = 'Sẵn sàng';

      elements.startBtn.style.display = 'flex';
      elements.stopBtn.style.display = 'none';

      elements.progressWrap.classList.remove('active');
      elements.phaseRow.style.display = 'none';

      // Enable mode buttons
      elements.modeBtns.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
      });
    }
  }

  function animateProgressBar(targetPct) {
    const current = parseFloat(elements.progressFill.style.width) || 0;
    const diff = targetPct - current;

    if (Math.abs(diff) < 0.5) {
      elements.progressFill.style.width = targetPct + '%';
      return;
    }

    const step = diff * 0.15;
    elements.progressFill.style.width = (current + step) + '%';

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => animateProgressBar(targetPct));
  }

  // ============================================================
  // STATUS POLLING
  // ============================================================
  function requestStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      if (!chrome.runtime.lastError && response) {
        updateUI(response);
      }
    });
  }

  requestStatus();
  setInterval(requestStatus, 800);

  // ============================================================
  // MODE SELECTION
  // ============================================================
  async function loadSavedMode() {
    const data = await chrome.storage.local.get(['searchMode']);
    currentMode = data.searchMode || 'both';
    updateModeButtons();
  }

  function updateModeButtons() {
    elements.modeBtns.forEach(btn => {
      const isActive = btn.dataset.mode === currentMode;
      btn.classList.toggle('active', isActive);
    });
  }

  elements.modeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Add click animation
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => btn.style.transform = '', 150);

      currentMode = btn.dataset.mode;
      await chrome.storage.local.set({ searchMode: currentMode });
      updateModeButtons();
    });
  });

  loadSavedMode();

  // ============================================================
  // ACTIONS
  // ============================================================
  elements.startBtn.addEventListener('click', () => {
    // Button animation
    elements.startBtn.style.transform = 'scale(0.95)';
    setTimeout(() => elements.startBtn.style.transform = '', 150);

    chrome.runtime.sendMessage({ action: 'startWithMode', mode: currentMode }, () => {
      requestStatus();
    });
  });

  elements.stopBtn.addEventListener('click', () => {
    elements.stopBtn.style.transform = 'scale(0.95)';
    setTimeout(() => elements.stopBtn.style.transform = '', 150);

    chrome.runtime.sendMessage({ action: 'stopOpeningTabs' }, () => {
      elements.statusText.textContent = 'Đang dừng...';
    });
  });

  elements.optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // ============================================================
  // STATS
  // ============================================================
  async function loadStats() {
    const data = await chrome.storage.local.get(['runLogs']);
    const logs = data.runLogs || [];

    // Today's searches
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = logs.filter(log => log.time >= today.getTime());
    const todayTotal = todayLogs.reduce((sum, log) => sum + (log.count || 0), 0);

    // Animate counter
    animateValue(elements.todayCount, 0, todayTotal, 500);

    // Points estimation
    const pcSearches = todayLogs.filter(l => l.mode === 'PC').reduce((s, l) => s + (l.count || 0), 0);
    const mobileSearches = todayLogs.filter(l => l.mode === 'Mobile').reduce((s, l) => s + (l.count || 0), 0);
    const points = Math.min(90, pcSearches * 3) + Math.min(60, mobileSearches * 3);
    animateValue(elements.pointsCount, 0, points, 500);

    // Streak (unique days)
    const uniqueDays = new Set(logs.map(log => {
      const d = new Date(log.time);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));
    animateValue(elements.streakCount, 0, uniqueDays.size, 500);
  }

  function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(start + range * eased);
      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  loadStats();
});