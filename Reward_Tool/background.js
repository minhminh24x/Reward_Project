let staticTopics = {}; 
let isRunning = false;
let stopRequested = false;
let openedTabs = 0;
let totalTabs = 0;
let searchTabId = null;

// --- CẤU HÌNH NGẪU NHIÊN (ANTI-BAN) ---
// Thay vì cố định, chúng ta dùng khoảng (min-max) để giả lập hành vi không hoàn hảo
const CONFIG = {
    // PC: Thường Microsoft cho 90 điểm (30 search), nhưng ta cài mức an toàn
    // Random từ 20 đến 25 search mỗi ngày
    PC_MIN: 20,
    PC_MAX: 25,
    
    // Mobile: Thường cho 60 điểm (20 search)
    // Random từ 20 đến 28 search mỗi ngày
    MOBILE_MIN: 20,
    MOBILE_MAX: 28,

    SESSION_BREAK: 20000 // Nghỉ 20 giây giữa 2 phiên
};

const sleep = ms => new Promise(res => setTimeout(res, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randHex = (len = 8) => {
    let s = '';
    const hex = '0123456789abcdef';
    for (let i = 0; i < len; i++) s += hex[Math.floor(Math.random() * hex.length)];
    return s;
};

// --- MOBILE FAKE DEEP (UA + CLIENT HINTS) ---
const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1";

async function setMobileUserAgent(enable) {
    const RULE_ID = 1;
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID] });

    if (enable) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                "id": RULE_ID,
                "priority": 1,
                "action": {
                    "type": "modifyHeaders",
                    "requestHeaders": [
                        { "header": "User-Agent", "operation": "set", "value": MOBILE_UA },
                        { "header": "Sec-CH-UA", "operation": "remove" },
                        { "header": "Sec-CH-UA-Mobile", "operation": "set", "value": "?1" },
                        { "header": "Sec-CH-UA-Platform", "operation": "set", "value": "\"iOS\"" },
                        { "header": "Sec-CH-UA-Model", "operation": "set", "value": "\"iPhone 14 Pro\"" }
                    ]
                },
                "condition": {
                    "urlFilter": "bing.com", 
                    "resourceTypes": ["main_frame", "xmlhttprequest", "sub_frame"]
                }
            }]
        });
        console.log("📱 Mobile Mode: ON (Deep Spoofing)");
    } else {
        console.log("💻 PC Mode: ON");
    }
}

// --- NÂNG CẤP: SPOOF SCREEN SIZE & INTERACTION ---
async function injectMobileEnvironment(tabId, isMobile) {
    if (!isMobile) {
        // Nếu là PC, chỉ cuộn trang nhẹ
        await simulateHumanScroll(tabId);
        return;
    }

    // Nếu là Mobile, ÉP trình duyệt báo cáo kích thước màn hình iPhone
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                // Ghi đè thông số màn hình (Window spoofing)
                // iPhone 14 Pro dimensions
                Object.defineProperty(window, 'innerWidth', { get: () => 393 });
                Object.defineProperty(window, 'innerHeight', { get: () => 852 });
                Object.defineProperty(window.screen, 'width', { get: () => 393 });
                Object.defineProperty(window.screen, 'height', { get: () => 852 });
                Object.defineProperty(window.screen, 'availWidth', { get: () => 393 });
                Object.defineProperty(window.screen, 'availHeight', { get: () => 852 });
            }
        });
        
        // Sau khi fake màn hình xong mới cuộn
        await simulateHumanScroll(tabId);
    } catch (e) { console.log("Inject env failed:", e); }
}

async function simulateHumanScroll(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: async () => {
                const smoothScroll = (to) => window.scrollTo({ top: to, behavior: 'smooth' });
                const pause = ms => new Promise(r => setTimeout(r, ms));
                const scrollHeight = document.body.scrollHeight;
                
                // Hành vi ngẫu nhiên hơn: Đôi khi cuộn sâu, đôi khi cuộn ít
                const depth = 0.2 + Math.random() * 0.5; // 20% - 70%
                const randomPos = Math.floor(scrollHeight * depth);
                
                smoothScroll(randomPos);
                await pause(1000 + Math.random() * 2000); 
                
                // 30% cơ hội cuộn thêm một chút nữa trước khi quay lên
                if (Math.random() < 0.3) {
                     smoothScroll(randomPos + 100);
                     await pause(500);
                }

                smoothScroll(Math.max(0, randomPos - 300));
            }
        });
    } catch (e) {}
}

// --- GEMINI AI ---
async function generateKeywordsWithGemini(apiKey, count, userTopic) {
    console.log(`Calling Gemini AI for ${count} keywords...`);
    const baseTopic = userTopic || "life hacks, weird facts, travel hidden gems, future tech";
    const prompt = `Generate ${count} short, distinct Bing search terms about '${baseTopic}'. 
    Return ONLY a raw JSON array of strings. No markdown.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error(`Gemini Error: ${response.status}`);
        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Generation Failed:", error);
        return null;
    }
}

function buildBingUrl(query) {
    const uniqueQuery = `${query} ${randHex(2)}`; 
    const q = encodeURIComponent(uniqueQuery);
    const formCodes = ['QBLH', 'QBRE', 'HPCN', '002']; 
    const randomForm = formCodes[Math.floor(Math.random() * formCodes.length)];
    return `https://www.bing.com/search?q=${q}&qs=HS&form=${randomForm}&sp=${randInt(1,9)}&cvid=${randHex(32)}`;
}

async function loadStaticTopics() {
    try {
        const response = await fetch(chrome.runtime.getURL('topics.json'));
        staticTopics = await response.json();
    } catch (e) { console.error(e); }
}

// --- SCHEDULING ---
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyRun') openTabs();
});

async function scheduleNextRun() {
    const settings = await chrome.storage.local.get(['scheduledTime', 'enableSchedule']);
    if (!settings.enableSchedule || !settings.scheduledTime) {
        chrome.alarms.clear('dailyRun');
        return;
    }
    const [h, m] = settings.scheduledTime.split(':').map(Number);
    const now = new Date();
    let nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    // Tăng độ trễ ngẫu nhiên lên +/- 45 phút để khó đoán hơn
    nextRun.setMinutes(nextRun.getMinutes() + randInt(-45, 45)); 
    if (nextRun <= now) nextRun.setDate(nextRun.getDate() + 1);
    
    chrome.alarms.create('dailyRun', { when: nextRun.getTime(), periodInMinutes: 1440 });
    console.log("📅 Lịch chạy tiếp theo:", nextRun.toLocaleString());
}

// --- CORE SEARCH LOGIC ---
async function runSingleSession(count, isMobileMode, settings) {
    if (stopRequested) return;

    await setMobileUserAgent(isMobileMode);
    
    let keywords = [];
    if (settings.apiKey) {
        const topicModifier = isMobileMode ? "mobile questions" : "desktop research";
        const aiKeywords = await generateKeywordsWithGemini(settings.apiKey, count, `${settings.aiTopic || ''} ${topicModifier}`);
        if (aiKeywords && aiKeywords.length) keywords = aiKeywords;
    }

    if (!keywords.length) {
        const allStatic = Object.values(staticTopics).flat();
        keywords = allStatic.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    totalTabs = keywords.length;
    openedTabs = 0;
    sendStatus();

    const tab = await chrome.tabs.create({ url: buildBingUrl(keywords[0]), active: !settings.runInBackground, pinned: true });
    searchTabId = tab.id;
    openedTabs = 1;
    sendStatus();

    let searchesSinceBreak = 0;
    let nextBreak = randInt(4, 7);
    const { delayMode, fixedDelaySeconds } = settings;

    for (let i = 1; i < keywords.length; i++) {
        if (stopRequested) break;

        // Phase: Wait & Fake Environment (Quan trọng)
        await sleep(randInt(3000, 5000));
        if (searchTabId) await injectMobileEnvironment(searchTabId, isMobileMode);

        // Phase: Delay logic
        let delay = 0;
        if (searchesSinceBreak >= nextBreak) {
            delay = randInt(25000, 45000); 
            searchesSinceBreak = 0;
            nextBreak = randInt(4, 8);
        } else {
            delay = (delayMode === 'fixed') ? fixedDelaySeconds * 1000 : randInt(8000, 14000); // Delay chậm hơn chút
            searchesSinceBreak++;
        }
        
        await sleep(delay);
        if (stopRequested) break;

        try {
            await chrome.tabs.update(searchTabId, { url: buildBingUrl(keywords[i]) });
            openedTabs++;
            sendStatus();
        } catch (e) { break; }
    }

    try { await chrome.tabs.remove(searchTabId); } catch(e) {}
    
    const logEntry = { 
        time: Date.now(), source: settings.apiKey ? 'AI' : 'Static', count: openedTabs, mode: isMobileMode ? 'Mobile' : 'PC' 
    };
    const logs = settings.runLogs || [];
    logs.push(logEntry);
    await chrome.storage.local.set({ runLogs: logs.slice(-50) });
}

// --- MAIN CONTROLLER ---
const openTabs = async () => {
    if (isRunning) return;
    isRunning = true;
    stopRequested = false;
    chrome.action.setBadgeBackgroundColor({ color: '#f39c12' });
    chrome.action.setBadgeText({ text: 'Run' });

    try {
        const settings = await chrome.storage.local.get(null);
        
        // Tính toán số lượng ngẫu nhiên cho hôm nay (QUAN TRỌNG)
        // Nếu user cài đặt số 30 trong setting, ta coi đó là MAX, và random giảm xuống một chút
        const baseCount = settings.tabsToOpen || 30;
        
        // 1. Chạy PC
        const pcTarget = randInt(CONFIG.PC_MIN, CONFIG.PC_MAX);
        if (!stopRequested) {
            chrome.action.setBadgeText({ text: 'PC' });
            await runSingleSession(pcTarget, false, settings);
        }

        // 2. Nghỉ
        if (!stopRequested) {
            console.log("Nghỉ giải lao...");
            await sleep(CONFIG.SESSION_BREAK);
        }

        // 3. Chạy Mobile
        const mobileTarget = randInt(CONFIG.MOBILE_MIN, CONFIG.MOBILE_MAX);
        if (!stopRequested) {
            chrome.action.setBadgeText({ text: 'Mob' });
            await runSingleSession(mobileTarget, true, settings);
        }

    } catch (e) {
        console.error("Lỗi quy trình:", e);
    } finally {
        await setMobileUserAgent(false);
        resetState();
        scheduleNextRun();
    }
};

const resetState = () => {
    isRunning = false;
    stopRequested = false;
    openedTabs = 0;
    totalTabs = 0;
    chrome.action.setBadgeText({ text: '' });
    sendStatus();
};

function sendStatus() {
    chrome.runtime.sendMessage({ type: 'status', isRunning, openedTabs, totalTabs }).catch(() => {});
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "startOpeningTabs") { openTabs(); sendResponse({success:true}); }
    if (req.action === "stopOpeningTabs") { stopRequested = true; sendResponse({success:true}); }
    if (req.action === "getStatus") sendResponse({ isRunning, openedTabs, totalTabs });
    if (req.action === "updateSchedule") scheduleNextRun();
    return true;
});

loadStaticTopics();
scheduleNextRun();