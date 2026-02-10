/**
 * Microsoft Rewards Helper Ultra Pro v4.1.0
 * Stealth Edition - Deep Anti-Detection
 * 
 * Features:
 * - PC/Mobile/Both mode selection
 * - Deep fingerprint protection (Canvas, WebGL, Touch, Battery, WebRTC)
 * - Human-like behavior simulation
 * - Multiple device profiles (15+)
 * - Smart timing & scheduling
 * - AI-powered keyword generation (Gemini)
 */

// ============================================================
// IMPORTS & GLOBALS
// ============================================================
importScripts('device-profiles.js');

let staticTopics = {};
let isRunning = false;
let stopRequested = false;
let openedTabs = 0;
let totalTabs = 0;
let searchTabId = null;
let currentPhase = ''; // 'PC' or 'Mobile'

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // Search counts with randomization
    PC_MIN: 28,
    PC_MAX: 34,
    MOBILE_MIN: 18,
    MOBILE_MAX: 24,

    // Timing
    SESSION_BREAK_MIN: 30000,   // 30s
    SESSION_BREAK_MAX: 90000,   // 90s
    SEARCH_DELAY_MIN: 8000,     // 8s
    SEARCH_DELAY_MAX: 18000,    // 18s
    LONG_BREAK_MIN: 45000,      // 45s
    LONG_BREAK_MAX: 120000,     // 2min

    // Behavioral
    RESULT_CLICK_CHANCE: 0.30,  // 30% click through
    EXTRA_SCROLL_CHANCE: 0.40,  // 40% extra scroll
    TYPO_CHANCE: 0.05,          // 5% typo in search

    // Anti-detection defaults
    ANTI_DETECTION: {
        canvasSpoof: true,
        webglSpoof: true,
        audioSpoof: true,
        navigatorSpoof: true,
        screenSpoof: true,
        timingSpoof: true
    }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const sleep = ms => new Promise(res => setTimeout(res, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.random() * (max - min) + min;
const randHex = (len = 8) => {
    let s = '';
    const hex = '0123456789abcdef';
    for (let i = 0; i < len; i++) s += hex[Math.floor(Math.random() * hex.length)];
    return s;
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// SMART TIMING
// ============================================================
function isReasonableHour() {
    const hour = new Date().getHours();
    // Avoid 1-6 AM (suspicious automated activity)
    return hour >= 7 || hour === 0;
}

function getSmartDelay() {
    // Variable delay with occasional longer pauses
    if (Math.random() < 0.15) {
        // 15% chance of "thinking" pause
        return randInt(20000, 40000);
    }
    return randInt(CONFIG.SEARCH_DELAY_MIN, CONFIG.SEARCH_DELAY_MAX);
}

// ============================================================
// USER AGENT MANAGEMENT
// ============================================================
async function setUserAgent(mode, deviceProfile = null) {
    const RULE_ID = 1;
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID] });

    let ua, clientHints;

    if (mode === 'mobile' && deviceProfile) {
        ua = deviceProfile.ua;
        clientHints = deviceProfile.clientHints;
    } else if (mode === 'mobile') {
        const profile = getRandomMobileProfile();
        ua = profile.ua;
        clientHints = profile.clientHints;
    } else if (mode === 'pc') {
        ua = getRandomPCUserAgent();
        clientHints = null;
    } else {
        // Clear mode
        console.log("🔄 User-Agent reset to default");
        return;
    }

    const requestHeaders = [
        { header: "User-Agent", operation: "set", value: ua }
    ];

    if (clientHints) {
        requestHeaders.push(
            { header: "Sec-CH-UA-Mobile", operation: "set", value: clientHints.mobile },
            { header: "Sec-CH-UA-Platform", operation: "set", value: clientHints.platform }
        );
        if (clientHints.model) {
            requestHeaders.push({ header: "Sec-CH-UA-Model", operation: "set", value: clientHints.model });
        }
        // Remove desktop-specific hints for mobile
        requestHeaders.push({ header: "Sec-CH-UA", operation: "remove" });
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            id: RULE_ID,
            priority: 1,
            action: { type: "modifyHeaders", requestHeaders },
            condition: {
                urlFilter: "bing.com",
                resourceTypes: ["main_frame", "xmlhttprequest", "sub_frame"]
            }
        }]
    });

    console.log(`${mode === 'mobile' ? '📱' : '💻'} Mode: ${mode.toUpperCase()} | UA: ${ua.substring(0, 50)}...`);
}

// ============================================================
// ANTI-DETECTION INJECTION (v2.0 - Deep Spoofing)
// ============================================================
async function injectAntiDetection(tabId, isMobile, deviceProfile = null) {
    const settings = await chrome.storage.local.get(['antiDetection']);
    const userOptions = settings.antiDetection || {};

    // Merge with defaults
    const options = {
        canvas: userOptions.canvas !== false,
        webgl: userOptions.webgl !== false,
        audio: userOptions.audio !== false,
        navigator: userOptions.navigatorSpoof !== false,
        touch: userOptions.touch !== false,
        screen: userOptions.screenSpoof !== false,
        battery: userOptions.battery !== false,
        timezone: true,
        webrtc: userOptions.webrtc !== false,
        timing: true,
        fonts: true
    };

    // Use the ANTI_DETECTION module scripts
    const scripts = [];

    // Canvas Protection
    if (options.canvas) {
        scripts.push(`
            (function() {
                const _toDataURL = HTMLCanvasElement.prototype.toDataURL;
                const _toBlob = HTMLCanvasElement.prototype.toBlob;
                const noiseKey = Math.random();
                function addNoise(canvas, ctx) {
                    try {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            if (imageData.data[i + 3] > 0) {
                                imageData.data[i] += ((noiseKey * (i + 1)) % 1 - 0.5) * 2;
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);
                    } catch(e) {}
                }
                HTMLCanvasElement.prototype.toDataURL = function(...args) {
                    const ctx = this.getContext('2d');
                    if (ctx) addNoise(this, ctx);
                    return _toDataURL.apply(this, args);
                };
                console.log('🎨 Canvas protection active');
            })();
        `);
    }

    // WebGL Protection
    if (options.webgl) {
        const gpus = [
            ['Google Inc. (NVIDIA)', 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0, D3D11)'],
            ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)'],
            ['Apple Inc.', 'Apple M3 Pro']
        ];
        const gpu = pick(gpus);
        scripts.push(`
            (function() {
                const VENDOR = '${gpu[0]}';
                const RENDERER = '${gpu[1]}';
                function spoofGetParameter(original) {
                    return function(pname) {
                        if (pname === 37445) return VENDOR;
                        if (pname === 37446) return RENDERER;
                        return original.call(this, pname);
                    };
                }
                if (WebGLRenderingContext) {
                    WebGLRenderingContext.prototype.getParameter = spoofGetParameter(WebGLRenderingContext.prototype.getParameter);
                }
                if (typeof WebGL2RenderingContext !== 'undefined') {
                    WebGL2RenderingContext.prototype.getParameter = spoofGetParameter(WebGL2RenderingContext.prototype.getParameter);
                }
                console.log('🎮 WebGL protection active');
            })();
        `);
    }

    // Navigator Deep Spoofing
    if (options.navigator) {
        const hw = isMobile ? pick([4, 6, 8]) : pick([8, 12, 16, 20]);
        const mem = isMobile ? pick([4, 6, 8]) : pick([8, 16, 32]);
        const touch = isMobile ? pick([5, 10]) : 0;
        const platform = isMobile ? (deviceProfile?.platform || 'iPhone') : 'Win32';

        scripts.push(`
            (function() {
                const props = {
                    hardwareConcurrency: ${hw},
                    deviceMemory: ${mem},
                    maxTouchPoints: ${touch},
                    platform: '${platform}',
                    webdriver: false,
                    pdfViewerEnabled: ${!isMobile},
                    languages: ${JSON.stringify(isMobile ? ['en-US', 'en'] : ['en-US', 'en', 'vi'])},
                    language: 'en-US'
                };
                Object.keys(props).forEach(key => {
                    try { Object.defineProperty(navigator, key, { get: () => props[key], configurable: true }); } catch(e) {}
                });
                delete navigator.__proto__.webdriver;
                console.log('🧭 Navigator protection active');
            })();
        `);
    }

    // Touch Events (Mobile Critical)
    if (options.touch && isMobile) {
        const maxTouch = deviceProfile?.platform === 'iPhone' ? 5 : 10;
        scripts.push(`
            (function() {
                Object.defineProperty(navigator, 'maxTouchPoints', { get: () => ${maxTouch}, configurable: true });
                if (!('ontouchstart' in window)) window.ontouchstart = null;
                const _matchMedia = window.matchMedia;
                window.matchMedia = function(query) {
                    const result = _matchMedia.call(window, query);
                    if (query.includes('pointer: coarse') || query.includes('hover: none')) {
                        return { matches: true, media: query, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} };
                    }
                    if (query.includes('pointer: fine')) {
                        return { matches: false, media: query, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} };
                    }
                    return result;
                };
                console.log('👆 Touch support active');
            })();
        `);
    }

    // Screen Spoofing (Mobile)
    if (options.screen && isMobile && deviceProfile) {
        const w = deviceProfile.screen?.width || 390;
        const h = deviceProfile.screen?.height || 844;
        const dpr = deviceProfile.devicePixelRatio || 3;

        scripts.push(`
            (function() {
                Object.defineProperty(window, 'innerWidth', { get: () => ${w}, configurable: true });
                Object.defineProperty(window, 'innerHeight', { get: () => ${h}, configurable: true });
                Object.defineProperty(window, 'devicePixelRatio', { get: () => ${dpr}, configurable: true });
                Object.defineProperty(screen, 'width', { get: () => ${w}, configurable: true });
                Object.defineProperty(screen, 'height', { get: () => ${h}, configurable: true });
                Object.defineProperty(screen, 'availWidth', { get: () => ${w}, configurable: true });
                Object.defineProperty(screen, 'availHeight', { get: () => ${h - 20}, configurable: true });
                console.log('📱 Screen spoofing active: ${w}x${h}');
            })();
        `);
    }

    // Battery API (Mobile)
    if (options.battery && isMobile) {
        const level = (Math.random() * 0.5 + 0.3).toFixed(2);
        const charging = Math.random() > 0.6;
        scripts.push(`
            (function() {
                navigator.getBattery = () => Promise.resolve({
                    charging: ${charging},
                    chargingTime: ${charging ? randInt(1000, 3600) : Infinity},
                    dischargingTime: ${!charging ? randInt(5000, 15000) : Infinity},
                    level: ${level},
                    addEventListener: () => {},
                    removeEventListener: () => {}
                });
                console.log('🔋 Battery API spoofed');
            })();
        `);
    }

    // WebRTC Protection
    if (options.webrtc) {
        scripts.push(`
            (function() {
                if (window.RTCPeerConnection) {
                    const _RTC = window.RTCPeerConnection;
                    window.RTCPeerConnection = function(...args) {
                        const pc = new _RTC(...args);
                        const _addIceCandidate = pc.addIceCandidate.bind(pc);
                        pc.addIceCandidate = function(candidate) {
                            if (candidate && candidate.candidate && candidate.candidate.includes('.local')) {
                                return Promise.resolve();
                            }
                            return _addIceCandidate(candidate);
                        };
                        return pc;
                    };
                }
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);
                }
                console.log('🔒 WebRTC protection active');
            })();
        `);
    }

    // Timing Noise
    if (options.timing) {
        scripts.push(`
            (function() {
                const _now = performance.now.bind(performance);
                const offset = Math.random() * 100;
                performance.now = function() { return _now() + offset + (Math.random() * 0.1); };
                console.log('⏱️ Timing protection active');
            })();
        `);
    }

    // Inject all scripts
    for (const script of scripts) {
        await injectScript(tabId, script);
    }

    const protections = scripts.length;
    console.log(`✅ Anti-detection v2.0 injected (${protections} protections)`);
}

async function injectScript(tabId, code) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: (script) => {
                const el = document.createElement('script');
                el.textContent = script;
                (document.head || document.documentElement).appendChild(el);
                el.remove();
            },
            args: [code],
            world: 'MAIN'
        });
    } catch (e) {
        console.log('Script injection error:', e.message);
    }
}

// ============================================================
// HUMAN BEHAVIOR SIMULATION
// ============================================================
async function simulateHumanBehavior(tabId) {
    // Random scroll
    await simulateScroll(tabId);

    // Chance to click a result
    if (Math.random() < CONFIG.RESULT_CLICK_CHANCE) {
        await simulateResultClick(tabId);
    }
}

async function simulateScroll(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: async () => {
                const pause = ms => new Promise(r => setTimeout(r, ms));
                const smoothScroll = (to) => window.scrollTo({ top: to, behavior: 'smooth' });

                const scrollHeight = document.body.scrollHeight;
                const viewportHeight = window.innerHeight;

                // Variable scroll depth (20-80%)
                const depth = 0.2 + Math.random() * 0.6;
                const targetPos = Math.floor(Math.min(scrollHeight - viewportHeight, scrollHeight * depth));

                // Scroll down in chunks (more human-like)
                const chunks = 2 + Math.floor(Math.random() * 3);
                for (let i = 1; i <= chunks; i++) {
                    smoothScroll(targetPos * (i / chunks));
                    await pause(400 + Math.random() * 600);
                }

                // Pause at bottom
                await pause(1000 + Math.random() * 2000);

                // Sometimes scroll back up partially
                if (Math.random() < 0.4) {
                    smoothScroll(targetPos * 0.3);
                    await pause(500 + Math.random() * 500);
                }
            }
        });
    } catch (e) { }
}

async function simulateResultClick(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: async () => {
                const pause = ms => new Promise(r => setTimeout(r, ms));

                // Find organic search results
                const results = document.querySelectorAll('#b_results .b_algo h2 a');
                if (results.length === 0) return;

                // Pick a random result (prefer top 5)
                const maxIndex = Math.min(5, results.length);
                const index = Math.floor(Math.random() * maxIndex);
                const link = results[index];

                if (link) {
                    // Scroll to make it visible
                    link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await pause(500 + Math.random() * 500);

                    // Click it
                    link.click();
                }
            }
        });

        // Wait on the result page briefly (if clicked)
        await sleep(randInt(3000, 8000));

        // Go back
        try {
            await chrome.tabs.goBack(tabId);
            await sleep(2000);
        } catch (e) { }

    } catch (e) { }
}

async function simulateMouseMovement(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                // Create fake mouse movement events
                const events = [];
                let x = Math.random() * window.innerWidth;
                let y = Math.random() * window.innerHeight;

                for (let i = 0; i < 5; i++) {
                    x += (Math.random() - 0.5) * 100;
                    y += (Math.random() - 0.5) * 100;
                    x = Math.max(0, Math.min(x, window.innerWidth));
                    y = Math.max(0, Math.min(y, window.innerHeight));

                    document.dispatchEvent(new MouseEvent('mousemove', {
                        clientX: x,
                        clientY: y,
                        bubbles: true
                    }));
                }
            }
        });
    } catch (e) { }
}

// ============================================================
// AI KEYWORD GENERATION (GEMINI)
// ============================================================
async function generateKeywordsWithGemini(apiKey, count, topic) {
    console.log(`🤖 Generating ${count} keywords with Gemini AI...`);

    const prompt = `Generate exactly ${count} unique, natural-sounding Bing search queries about "${topic || 'random interesting topics'}". 
    Make them diverse: questions, how-to queries, product searches, news queries, etc.
    Return ONLY a raw JSON array of strings. No markdown, no explanation.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const keywords = JSON.parse(cleanJson);
        console.log(`✅ Generated ${keywords.length} AI keywords`);
        return keywords;
    } catch (error) {
        console.error('❌ AI generation failed:', error.message);
        return null;
    }
}

// ============================================================
// URL BUILDING
// ============================================================
function buildBingUrl(query, isMobile = false) {
    // Occasionally add typo (human-like)
    if (Math.random() < CONFIG.TYPO_CHANCE) {
        const pos = Math.floor(Math.random() * query.length);
        const typoChars = 'abcdefghijklmnopqrstuvwxyz';
        query = query.substring(0, pos) + pick(typoChars.split('')) + query.substring(pos);
    }

    // Add unique identifier to avoid duplicate detection
    const uniqueQuery = `${query} ${randHex(2)}`;
    const q = encodeURIComponent(uniqueQuery);

    if (isMobile) {
        // 📱 MOBILE URL - Based on real mobile device analysis
        // Critical parameters for Microsoft Rewards mobile points:
        // - PC=SANSAAND (identifies mobile search)
        // - form=BABTAA (mobile form code)
        const params = new URLSearchParams({
            q: uniqueQuery,
            PC: 'SANSAAND',              // ⭐ KEY: Mobile identifier
            form: 'BABTAA',              // ⭐ KEY: Mobile form
            cc: 'vn',                    // Country code
            ssp: '1',                    // Search source parameter
            safesearch: 'moderate',
            setlang: 'vi'
        });

        return `https://www.bing.com/search?${params.toString()}`;
    } else {
        // 💻 PC URL - Original logic
        const formCodes = ['QBLH', 'QBRE', 'HPCN', 'CHRN', 'ANNR', 'PERE'];
        const form = pick(formCodes);

        const params = new URLSearchParams({
            q: uniqueQuery,
            form: form,
            qs: pick(['HS', 'n', 'AS']),
            sp: randInt(1, 9).toString(),
            cvid: randHex(32),
            pq: uniqueQuery.toLowerCase(),
            sc: pick(['8-0', '6-0', '10-0'])
        });

        return `https://www.bing.com/search?${params.toString()}`;
    }
}

// ============================================================
// STATIC TOPICS LOADER
// ============================================================
async function loadStaticTopics() {
    try {
        const response = await fetch(chrome.runtime.getURL('topics.json'));
        staticTopics = await response.json();
        console.log('📚 Loaded static topics');
    } catch (e) {
        console.error('Failed to load topics:', e);
    }
}

// ============================================================
// SCHEDULING
// ============================================================
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'dailyRun') {
        const settings = await chrome.storage.local.get(['smartTiming']);
        if (settings.smartTiming !== false && !isReasonableHour()) {
            console.log('⏰ Skipping run - unreasonable hour. Will retry later.');
            chrome.alarms.create('dailyRun', { delayInMinutes: 60 });
            return;
        }
        openTabs();
    }
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

    // Add random offset (-60 to +60 minutes) for unpredictability
    nextRun.setMinutes(nextRun.getMinutes() + randInt(-60, 60));

    if (nextRun <= now) nextRun.setDate(nextRun.getDate() + 1);

    chrome.alarms.create('dailyRun', { when: nextRun.getTime(), periodInMinutes: 1440 });
    console.log("📅 Next scheduled run:", nextRun.toLocaleString());
}

// ============================================================
// CORE SEARCH SESSION
// ============================================================
async function runSearchSession(mode, count, settings) {
    if (stopRequested) return 0;

    const isMobile = mode === 'mobile';
    let deviceProfile = null;

    if (isMobile) {
        deviceProfile = getRandomMobileProfile();
        console.log(`📱 Selected device: ${deviceProfile.name}`);
    }

    await setUserAgent(mode, deviceProfile);
    currentPhase = isMobile ? 'Mobile' : 'PC';

    // Get keywords
    let keywords = [];
    if (settings.apiKey) {
        const topicModifier = isMobile ? "mobile phone questions" : "desktop research topics";
        const aiKeywords = await generateKeywordsWithGemini(
            settings.apiKey,
            count,
            `${settings.aiTopic || ''} ${topicModifier}`
        );
        if (aiKeywords?.length) keywords = aiKeywords;
    }

    // Fallback to static
    if (!keywords.length) {
        const allStatic = Object.values(staticTopics).flat();
        keywords = allStatic.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    totalTabs = keywords.length;
    openedTabs = 0;
    sendStatus();

    // Create search tab
    const tab = await chrome.tabs.create({
        url: buildBingUrl(keywords[0], isMobile),
        active: !settings.runInBackground,
        pinned: true
    });
    searchTabId = tab.id;
    openedTabs = 1;
    sendStatus();

    // Wait for page load
    await sleep(randInt(3000, 5000));

    // Inject anti-detection
    await injectAntiDetection(searchTabId, isMobile, deviceProfile);

    // Initial human behavior
    await simulateHumanBehavior(searchTabId);

    // Search loop with robust error handling
    let searchesSinceBreak = 0;
    let nextBreakAt = randInt(4, 8);

    for (let i = 1; i < keywords.length; i++) {
        // Check stop request
        if (stopRequested) {
            console.log(`⛔ Stop requested at search ${i}/${keywords.length}`);
            break;
        }

        // Determine delay
        let delay;
        if (searchesSinceBreak >= nextBreakAt) {
            delay = randInt(CONFIG.LONG_BREAK_MIN, CONFIG.LONG_BREAK_MAX);
            searchesSinceBreak = 0;
            nextBreakAt = randInt(4, 8);
            console.log(`☕ Taking a break (${Math.round(delay / 1000)}s)...`);
        } else {
            delay = getSmartDelay();
            searchesSinceBreak++;
        }

        await sleep(delay);

        // Check stop again after delay
        if (stopRequested) {
            console.log(`⛔ Stop requested during delay at ${i}/${keywords.length}`);
            break;
        }


        // Navigate to next search
        try {
            console.log(`🔍 Search ${i + 1}/${keywords.length}: ${keywords[i].substring(0, 30)}...`);

            await chrome.tabs.update(searchTabId, { url: buildBingUrl(keywords[i], isMobile) });
            openedTabs++;
            sendStatus();

            // Wait for load
            await sleep(randInt(2500, 4000));

            // Check stop again
            if (stopRequested) {
                console.log(`⛔ Stop requested after navigation at ${i}/${keywords.length}`);
                break;
            }

            // Re-inject and simulate behavior
            await injectAntiDetection(searchTabId, isMobile, deviceProfile);
            await simulateMouseMovement(searchTabId);
            await simulateHumanBehavior(searchTabId);

        } catch (e) {
            console.error(`❌ Search ${i} error:`, e.message);

            // Try to recover by checking if tab still exists
            try {
                await chrome.tabs.get(searchTabId);
                console.log('🔄 Tab still exists, continuing...');
                // Continue to next iteration
            } catch (tabError) {
                console.error('💀 Tab lost, cannot continue session');
                break;
            }
        }
    }

    console.log(`✅ Search session completed: ${openedTabs}/${keywords.length} searches`);

    // Auto-close tab with delay (configurable)
    const autoCloseEnabled = settings.autoCloseTab !== false;
    if (autoCloseEnabled && searchTabId) {
        const closeDelay = settings.tabCloseDelay || 2000;
        console.log(`🗑️ Closing tab in ${closeDelay / 1000}s...`);
        await sleep(closeDelay);

        try {
            // Double-check tab exists before closing
            await chrome.tabs.get(searchTabId);
            await chrome.tabs.remove(searchTabId);
            console.log('✅ Tab closed automatically');
        } catch (e) {
            console.log('ℹ️ Tab already closed or not found');
        }
    } else {
        console.log('📌 Tab kept open (auto-close disabled)');
    }

    // Log session
    const logEntry = {
        time: Date.now(),
        source: settings.apiKey ? 'AI' : 'Static',
        count: openedTabs,
        mode: currentPhase,
        device: deviceProfile?.name || 'PC'
    };
    const logs = settings.runLogs || [];
    logs.push(logEntry);
    await chrome.storage.local.set({ runLogs: logs.slice(-100) });

    return openedTabs;
}

// ============================================================
// MAIN CONTROLLER
// ============================================================
const openTabs = async () => {
    if (isRunning) return;
    isRunning = true;
    stopRequested = false;

    chrome.action.setBadgeBackgroundColor({ color: '#f39c12' });
    chrome.action.setBadgeText({ text: '...' });

    try {
        const settings = await chrome.storage.local.get(null);
        const searchMode = settings.searchMode || 'both';

        // Get custom counts or use defaults
        const pcCount = settings.pcSearchCount || randInt(CONFIG.PC_MIN, CONFIG.PC_MAX);
        const mobileCount = settings.mobileSearchCount || randInt(CONFIG.MOBILE_MIN, CONFIG.MOBILE_MAX);

        console.log(`🚀 Starting search session | Mode: ${searchMode}`);

        // Run based on mode
        if (searchMode === 'pc_only' || searchMode === 'both') {
            if (!stopRequested) {
                chrome.action.setBadgeText({ text: 'PC' });
                await runSearchSession('pc', pcCount, settings);
            }
        }

        // Break between sessions
        if (searchMode === 'both' && !stopRequested) {
            const breakTime = randInt(CONFIG.SESSION_BREAK_MIN, CONFIG.SESSION_BREAK_MAX);
            console.log(`⏸️ Session break (${Math.round(breakTime / 1000)}s)...`);
            await sleep(breakTime);
        }

        if (searchMode === 'mobile_only' || searchMode === 'both') {
            if (!stopRequested) {
                chrome.action.setBadgeText({ text: 'Mob' });
                await runSearchSession('mobile', mobileCount, settings);
            }
        }

        console.log('✅ All sessions completed!');

    } catch (e) {
        console.error('Session error:', e);
    } finally {
        await setUserAgent('clear');
        resetState();
        scheduleNextRun();
    }
};

// ============================================================
// STATE MANAGEMENT
// ============================================================
const resetState = () => {
    isRunning = false;
    stopRequested = false;
    openedTabs = 0;
    totalTabs = 0;
    currentPhase = '';
    chrome.action.setBadgeText({ text: '' });
    sendStatus();
};

function sendStatus() {
    chrome.runtime.sendMessage({
        type: 'status',
        isRunning,
        openedTabs,
        totalTabs,
        phase: currentPhase
    }).catch(() => { });
}

// ============================================================
// MESSAGE HANDLERS
// ============================================================
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    switch (req.action) {
        case 'startOpeningTabs':
            openTabs();
            sendResponse({ success: true });
            break;

        case 'startWithMode':
            chrome.storage.local.set({ searchMode: req.mode }).then(() => {
                openTabs();
                sendResponse({ success: true });
            });
            return true; // async response

        case 'stopOpeningTabs':
            stopRequested = true;
            console.log('🛑 Stop requested by user');

            // Immediately close the search tab if it exists
            if (searchTabId) {
                chrome.tabs.remove(searchTabId).catch(() => {
                    console.log('Tab already closed');
                });
                searchTabId = null;
            }

            // Reset state immediately
            setTimeout(() => {
                if (!isRunning) return; // Already reset
                resetState();
            }, 1000);

            sendResponse({ success: true });
            break;

        case 'getStatus':
            sendResponse({ isRunning, openedTabs, totalTabs, phase: currentPhase });
            break;

        case 'updateSchedule':
            scheduleNextRun();
            sendResponse({ success: true });
            break;

        case 'getStatistics':
            chrome.storage.local.get(['runLogs']).then(data => {
                sendResponse({ logs: data.runLogs || [] });
            });
            return true; // async
    }
    return true;
});

// ============================================================
// INITIALIZATION
// ============================================================
loadStaticTopics();
scheduleNextRun();
console.log('🎮 Rewards Ultra Pro v4.0 initialized');