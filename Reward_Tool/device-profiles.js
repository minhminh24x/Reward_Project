/**
 * Device Profiles for Mobile Emulation
 * Contains detailed configurations for various mobile devices
 */

const DEVICE_PROFILES = {
    // ============================================================
    // iOS DEVICES
    // ============================================================
    iphone_15_pro_max: {
        name: "iPhone 15 Pro Max",
        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1",
        screen: { width: 430, height: 932 },
        devicePixelRatio: 3,
        platform: "iPhone",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"iOS"',
            model: '"iPhone 15 Pro Max"'
        }
    },

    iphone_15_pro: {
        name: "iPhone 15 Pro",
        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1",
        screen: { width: 393, height: 852 },
        devicePixelRatio: 3,
        platform: "iPhone",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"iOS"',
            model: '"iPhone 15 Pro"'
        }
    },

    iphone_14_pro: {
        name: "iPhone 14 Pro",
        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
        screen: { width: 393, height: 852 },
        devicePixelRatio: 3,
        platform: "iPhone",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"iOS"',
            model: '"iPhone 14 Pro"'
        }
    },

    iphone_13: {
        name: "iPhone 13",
        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
        screen: { width: 390, height: 844 },
        devicePixelRatio: 3,
        platform: "iPhone",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"iOS"',
            model: '"iPhone 13"'
        }
    },

    iphone_se: {
        name: "iPhone SE (3rd gen)",
        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
        screen: { width: 375, height: 667 },
        devicePixelRatio: 2,
        platform: "iPhone",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"iOS"',
            model: '"iPhone SE"'
        }
    },

    // ============================================================
    // ANDROID DEVICES - SAMSUNG
    // ============================================================
    samsung_s24_ultra: {
        name: "Samsung Galaxy S24 Ultra",
        ua: "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 3.5,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"SM-S928B"'
        }
    },

    samsung_s24: {
        name: "Samsung Galaxy S24",
        ua: "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 2.625,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"SM-S921B"'
        }
    },

    samsung_a54: {
        name: "Samsung Galaxy A54",
        ua: "Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 2.625,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"SM-A546B"'
        }
    },

    // ============================================================
    // ANDROID DEVICES - GOOGLE PIXEL
    // ============================================================
    pixel_8_pro: {
        name: "Google Pixel 8 Pro",
        ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 3,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"Pixel 8 Pro"'
        }
    },

    pixel_8: {
        name: "Google Pixel 8",
        ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 2.625,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"Pixel 8"'
        }
    },

    pixel_7a: {
        name: "Google Pixel 7a",
        ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 2.625,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"Pixel 7a"'
        }
    },

    // ============================================================
    // ANDROID DEVICES - XIAOMI
    // ============================================================
    xiaomi_14_ultra: {
        name: "Xiaomi 14 Ultra",
        ua: "Mozilla/5.0 (Linux; Android 14; 2405CPX33C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 3,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"Xiaomi 14 Ultra"'
        }
    },

    redmi_note_13_pro: {
        name: "Redmi Note 13 Pro",
        ua: "Mozilla/5.0 (Linux; Android 14; 2312DRA50G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36",
        screen: { width: 412, height: 915 },
        devicePixelRatio: 2.625,
        platform: "Android",
        touch: true,
        clientHints: {
            mobile: "?1",
            platform: '"Android"',
            model: '"Redmi Note 13 Pro"'
        }
    }
};

// ============================================================
// PC USER AGENT POOL
// ============================================================
const PC_USER_AGENTS = [
    // Windows + Chrome (various versions)
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",

    // Windows + Edge
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",

    // Windows 11
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",

    // macOS + Chrome
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

    // macOS + Safari
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15"
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get a random mobile device profile
 */
function getRandomMobileProfile() {
    const mobileKeys = Object.keys(DEVICE_PROFILES);
    const randomKey = mobileKeys[Math.floor(Math.random() * mobileKeys.length)];
    return { key: randomKey, ...DEVICE_PROFILES[randomKey] };
}

/**
 * Get a random PC user agent
 */
function getRandomPCUserAgent() {
    return PC_USER_AGENTS[Math.floor(Math.random() * PC_USER_AGENTS.length)];
}

/**
 * Get profile by key
 */
function getProfileByKey(key) {
    return DEVICE_PROFILES[key] || null;
}

/**
 * Get all available profile keys
 */
function getAvailableProfiles() {
    return Object.keys(DEVICE_PROFILES).map(key => ({
        key,
        name: DEVICE_PROFILES[key].name
    }));
}

// For Chrome extension environment
if (typeof globalThis !== 'undefined') {
    globalThis.DEVICE_PROFILES = DEVICE_PROFILES;
    globalThis.PC_USER_AGENTS = PC_USER_AGENTS;
    globalThis.getRandomMobileProfile = getRandomMobileProfile;
    globalThis.getRandomPCUserAgent = getRandomPCUserAgent;
    globalThis.getProfileByKey = getProfileByKey;
    globalThis.getAvailableProfiles = getAvailableProfiles;
}
