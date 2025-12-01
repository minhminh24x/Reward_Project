document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const statusDisplay = document.getElementById('statusDisplay');
  const progressWrap = document.getElementById('progressWrap');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  const updateUI = (status) => {
    if (status.isRunning) {
      statusDisplay.textContent = `Đang chạy...`;
      statusDisplay.style.color = '#27ae60';
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      
      progressWrap.style.display = 'block';
      const pct = status.totalTabs > 0 ? Math.round((status.openedTabs / status.totalTabs) * 100) : 0;
      progressBar.style.width = pct + '%';
      progressText.textContent = `${status.openedTabs} / ${status.totalTabs}`;
    } else {
      statusDisplay.textContent = 'Sẵn sàng';
      statusDisplay.style.color = '#333';
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      progressWrap.style.display = 'none';
      progressText.textContent = '';
    }
  };

  function requestStatus() {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
      if (!chrome.runtime.lastError && response) {
        updateUI(response);
      }
    });
  }

  requestStatus();
  setInterval(requestStatus, 1000);

  optionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

  startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "startOpeningTabs" }, (response) => {
        if (!chrome.runtime.lastError) window.close();
    });
  });

  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stopOpeningTabs" }, (response) => {
        if (!chrome.runtime.lastError) statusDisplay.textContent = 'Đang dừng...';
    });
  });
});