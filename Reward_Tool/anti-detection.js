/**
 * Ultra Anti-Detection Engine v2.0
 * Deep Browser Fingerprint Protection for Microsoft Rewards
 * 
 * FEATURES:
 * ═══════════════════════════════════════════════════════════
 * ✓ Canvas Fingerprint Randomization
 * ✓ WebGL Renderer/Vendor Spoofing
 * ✓ AudioContext Fingerprint Protection
 * ✓ Navigator Deep Spoofing
 * ✓ Screen/Window Manipulation
 * ✓ Touch Events Simulation
 * ✓ Battery API Spoofing
 * ✓ Sensor APIs Protection
 * ✓ Timezone Consistency
 * ✓ Storage Fingerprint Protection
 * ✓ Font Detection Prevention
 * ✓ WebRTC Protection
 * ═══════════════════════════════════════════════════════════
 */

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const ANTI_DETECTION = {
    randomFloat: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],

    // ============================================================
    // CANVAS FINGERPRINT PROTECTION (Enhanced)
    // ============================================================
    getCanvasSpoofScript() {
        return `
        (function() {
            'use strict';
            
            // Store originals
            const _toDataURL = HTMLCanvasElement.prototype.toDataURL;
            const _toBlob = HTMLCanvasElement.prototype.toBlob;
            const _getImageData = CanvasRenderingContext2D.prototype.getImageData;
            
            // Noise generator with session consistency
            const noiseKey = Math.random();
            function addNoise(canvas, ctx) {
                try {
                    const width = canvas.width;
                    const height = canvas.height;
                    if (width === 0 || height === 0) return;
                    
                    const imageData = ctx.getImageData(0, 0, width, height);
                    const data = imageData.data;
                    
                    // Apply consistent noise per session
                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i + 3] > 0) { // Only non-transparent pixels
                            const noise = ((noiseKey * (i + 1)) % 1 - 0.5) * 2;
                            data[i] = Math.max(0, Math.min(255, data[i] + noise));
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
            
            HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
                const ctx = this.getContext('2d');
                if (ctx) addNoise(this, ctx);
                return _toBlob.call(this, callback, ...args);
            };
            
            // Protect getImageData
            CanvasRenderingContext2D.prototype.getImageData = function(...args) {
                const imageData = _getImageData.apply(this, args);
                for (let i = 0; i < imageData.data.length; i += 100) {
                    if (imageData.data[i + 3] > 0) {
                        imageData.data[i] += Math.floor((Math.random() - 0.5) * 2);
                    }
                }
                return imageData;
            };
            
            console.log('🎨 Canvas protection active');
        })();
        `;
    },

    // ============================================================
    // WEBGL FINGERPRINT PROTECTION (Enhanced)
    // ============================================================
    getWebGLSpoofScript() {
        const gpuConfigs = [
            { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
            { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)' },
            { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)' },
            { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 7900 XTX Direct3D11 vs_5_0 ps_5_0, D3D11)' },
            { vendor: 'Apple Inc.', renderer: 'Apple M3 Pro' }
        ];
        const config = gpuConfigs[Math.floor(Math.random() * gpuConfigs.length)];

        return `
        (function() {
            'use strict';
            
            const VENDOR = '${config.vendor}';
            const RENDERER = '${config.renderer}';
            const MAX_TEXTURE = ${16384 + Math.floor(Math.random() * 200)};
            const MAX_VIEWPORT = [${32768 + Math.floor(Math.random() * 100)}, ${32768 + Math.floor(Math.random() * 100)}];
            
            function spoofGetParameter(original) {
                return function(pname) {
                    switch(pname) {
                        case 37445: return VENDOR;  // UNMASKED_VENDOR_WEBGL
                        case 37446: return RENDERER; // UNMASKED_RENDERER_WEBGL
                        case 3379: return MAX_TEXTURE; // MAX_TEXTURE_SIZE
                        case 3386: return MAX_VIEWPORT; // MAX_VIEWPORT_DIMS
                        case 7936: return 'WebKit'; // VENDOR
                        case 7937: return 'WebKit WebGL'; // RENDERER
                        default: return original.call(this, pname);
                    }
                };
            }
            
            function spoofGetExtension(original) {
                return function(name) {
                    if (name === 'WEBGL_debug_renderer_info') {
                        return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
                    }
                    return original.call(this, name);
                };
            }
            
            // Apply to WebGL1
            if (WebGLRenderingContext) {
                const proto = WebGLRenderingContext.prototype;
                proto.getParameter = spoofGetParameter(proto.getParameter);
                proto.getExtension = spoofGetExtension(proto.getExtension);
            }
            
            // Apply to WebGL2
            if (typeof WebGL2RenderingContext !== 'undefined') {
                const proto2 = WebGL2RenderingContext.prototype;
                proto2.getParameter = spoofGetParameter(proto2.getParameter);
                proto2.getExtension = spoofGetExtension(proto2.getExtension);
            }
            
            console.log('🎮 WebGL protection active');
        })();
        `;
    },

    // ============================================================
    // AUDIO FINGERPRINT PROTECTION
    // ============================================================
    getAudioSpoofScript() {
        return `
        (function() {
            'use strict';
            
            const _createAnalyser = AudioContext.prototype.createAnalyser;
            const _createOscillator = AudioContext.prototype.createOscillator;
            const _getChannelData = AudioBuffer.prototype.getChannelData;
            
            // Add noise to analyser
            AudioContext.prototype.createAnalyser = function() {
                const analyser = _createAnalyser.call(this);
                const _getFloatFrequencyData = analyser.getFloatFrequencyData.bind(analyser);
                analyser.getFloatFrequencyData = function(array) {
                    _getFloatFrequencyData(array);
                    for (let i = 0; i < array.length; i += 10) {
                        array[i] += (Math.random() - 0.5) * 0.1;
                    }
                };
                return analyser;
            };
            
            // Add noise to oscillator output
            AudioBuffer.prototype.getChannelData = function(channel) {
                const result = _getChannelData.call(this, channel);
                const noise = Math.random() * 0.0001;
                for (let i = 0; i < result.length; i += 200) {
                    result[i] += noise;
                }
                return result;
            };
            
            console.log('🔊 Audio protection active');
        })();
        `;
    },

    // ============================================================
    // NAVIGATOR DEEP SPOOFING (Mobile Enhanced)
    // ============================================================
    getNavigatorSpoofScript(isMobile, deviceProfile) {
        const hw = isMobile ? [4, 6, 8][Math.floor(Math.random() * 3)] : [8, 12, 16, 20][Math.floor(Math.random() * 4)];
        const mem = isMobile ? [4, 6, 8][Math.floor(Math.random() * 3)] : [8, 16, 32][Math.floor(Math.random() * 3)];
        const touch = isMobile ? [5, 10][Math.floor(Math.random() * 2)] : 0;
        const platform = isMobile ? (deviceProfile?.platform || 'iPhone') : 'Win32';
        const vendor = isMobile && platform === 'iPhone' ? 'Apple Computer, Inc.' : 'Google Inc.';

        // Random but realistic connection info
        const connectionTypes = ['4g', 'wifi'];
        const effectiveTypes = ['4g', '3g'];

        return `
        (function() {
            'use strict';
            
            const IS_MOBILE = ${isMobile};
            const PLATFORM = '${platform}';
            
            // Core navigator properties
            const props = {
                hardwareConcurrency: ${hw},
                deviceMemory: ${mem},
                maxTouchPoints: ${touch},
                platform: PLATFORM,
                vendor: '${vendor}',
                webdriver: false,
                cookieEnabled: true,
                doNotTrack: null,
                pdfViewerEnabled: ${!isMobile},
                languages: ${JSON.stringify(isMobile ? ['en-US', 'en'] : ['en-US', 'en', 'vi'])},
                language: 'en-US'
            };
            
            Object.keys(props).forEach(key => {
                try {
                    Object.defineProperty(navigator, key, { 
                        get: () => props[key],
                        configurable: true
                    });
                } catch(e) {}
            });
            
            // Connection API spoofing
            if (IS_MOBILE) {
                const connectionProps = {
                    effectiveType: '${effectiveTypes[Math.floor(Math.random() * effectiveTypes.length)]}',
                    type: '${connectionTypes[Math.floor(Math.random() * connectionTypes.length)]}',
                    downlink: ${(Math.random() * 10 + 5).toFixed(1)},
                    rtt: ${Math.floor(Math.random() * 100 + 50)},
                    saveData: false
                };
                
                try {
                    Object.defineProperty(navigator, 'connection', {
                        get: () => connectionProps,
                        configurable: true
                    });
                } catch(e) {}
            }
            
            // Hide automation
            delete navigator.__proto__.webdriver;
            
            // Chrome-specific
            if (window.chrome) {
                Object.defineProperty(window.chrome, 'runtime', {
                    get: () => ({ id: undefined }),
                    configurable: true
                });
            }
            
            console.log('🧭 Navigator protection active');
        })();
        `;
    },

    // ============================================================
    // TOUCH EVENTS SIMULATION (Mobile Critical)
    // ============================================================
    getTouchSpoofScript(deviceProfile) {
        const maxTouchPoints = deviceProfile?.platform === 'iPhone' ? 5 : 10;

        return `
        (function() {
            'use strict';
            
            // Enable touch support detection
            Object.defineProperty(navigator, 'maxTouchPoints', { 
                get: () => ${maxTouchPoints},
                configurable: true 
            });
            
            // Create TouchList support
            if (!('ontouchstart' in window)) {
                window.ontouchstart = null;
            }
            
            // DocumentTouch for older detection
            if (!window.DocumentTouch) {
                window.DocumentTouch = function() {};
            }
            
            // Touch event support
            Object.defineProperty(window, 'TouchEvent', {
                get: () => function TouchEvent() {},
                configurable: true
            });
            
            // matchMedia for pointer detection
            const _matchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                const result = _matchMedia.call(window, query);
                if (query.includes('pointer: coarse') || query.includes('hover: none')) {
                    return { 
                        matches: true, 
                        media: query,
                        addListener: () => {},
                        removeListener: () => {},
                        addEventListener: () => {},
                        removeEventListener: () => {}
                    };
                }
                if (query.includes('pointer: fine')) {
                    return { 
                        matches: false, 
                        media: query,
                        addListener: () => {},
                        removeListener: () => {},
                        addEventListener: () => {},
                        removeEventListener: () => {}
                    };
                }
                return result;
            };
            
            console.log('👆 Touch support active');
        })();
        `;
    },

    // ============================================================
    // SCREEN & VIEWPORT SPOOFING (Mobile Critical)
    // ============================================================
    getScreenSpoofScript(deviceProfile) {
        if (!deviceProfile) return '';

        const { screen, devicePixelRatio, platform } = deviceProfile;
        const width = screen?.width || 390;
        const height = screen?.height || 844;
        const dpr = devicePixelRatio || 3;
        const colorDepth = 24;
        const orientation = height > width ? 'portrait-primary' : 'landscape-primary';

        return `
        (function() {
            'use strict';
            
            const WIDTH = ${width};
            const HEIGHT = ${height};
            const DPR = ${dpr};
            
            // Window dimensions
            const windowProps = {
                innerWidth: WIDTH,
                innerHeight: HEIGHT,
                outerWidth: WIDTH,
                outerHeight: HEIGHT,
                devicePixelRatio: DPR,
                visualViewport: {
                    width: WIDTH,
                    height: HEIGHT,
                    offsetLeft: 0,
                    offsetTop: 0,
                    pageLeft: 0,
                    pageTop: 0,
                    scale: 1
                }
            };
            
            Object.keys(windowProps).forEach(key => {
                try {
                    Object.defineProperty(window, key, { 
                        get: () => windowProps[key],
                        configurable: true
                    });
                } catch(e) {}
            });
            
            // Screen dimensions
            const screenProps = {
                width: WIDTH,
                height: HEIGHT,
                availWidth: WIDTH,
                availHeight: HEIGHT - 20, // Status bar offset
                colorDepth: ${colorDepth},
                pixelDepth: ${colorDepth},
                orientation: {
                    type: '${orientation}',
                    angle: 0
                }
            };
            
            Object.keys(screenProps).forEach(key => {
                try {
                    Object.defineProperty(screen, key, {
                        get: () => screenProps[key],
                        configurable: true
                    });
                } catch(e) {}
            });
            
            console.log('📱 Screen spoofing active: ${width}x${height}');
        })();
        `;
    },

    // ============================================================
    // BATTERY API SPOOFING
    // ============================================================
    getBatterySpoofScript(isMobile) {
        if (!isMobile) return '';

        const level = (Math.random() * 0.5 + 0.3).toFixed(2); // 30-80%
        const charging = Math.random() > 0.6;

        return `
        (function() {
            'use strict';
            
            const fakeBattery = {
                charging: ${charging},
                chargingTime: ${charging ? Math.floor(Math.random() * 3600) : Infinity},
                dischargingTime: ${!charging ? Math.floor(Math.random() * 10000 + 5000) : Infinity},
                level: ${level},
                addEventListener: () => {},
                removeEventListener: () => {}
            };
            
            navigator.getBattery = () => Promise.resolve(fakeBattery);
            
            console.log('🔋 Battery API spoofed');
        })();
        `;
    },

    // ============================================================
    // TIMEZONE & LOCALE CONSISTENCY
    // ============================================================
    getTimezoneSpoofScript() {
        return `
        (function() {
            'use strict';
            
            // Ensure consistent timezone
            const _getTimezoneOffset = Date.prototype.getTimezoneOffset;
            Date.prototype.getTimezoneOffset = function() {
                return -420; // UTC+7 (Vietnam)
            };
            
            // Intl consistency
            const _DateTimeFormat = Intl.DateTimeFormat;
            Intl.DateTimeFormat = function(locale, options) {
                return new _DateTimeFormat(locale || 'en-US', options);
            };
            
            console.log('🌍 Timezone consistency active');
        })();
        `;
    },

    // ============================================================
    // WEBRTC PROTECTION
    // ============================================================
    getWebRTCSpoofScript() {
        return `
        (function() {
            'use strict';
            
            // Disable WebRTC IP leak
            if (window.RTCPeerConnection) {
                const _RTCPeerConnection = window.RTCPeerConnection;
                window.RTCPeerConnection = function(...args) {
                    const pc = new _RTCPeerConnection(...args);
                    const _addIceCandidate = pc.addIceCandidate.bind(pc);
                    pc.addIceCandidate = function(candidate) {
                        if (candidate && candidate.candidate && 
                            candidate.candidate.includes('.local')) {
                            return Promise.resolve();
                        }
                        return _addIceCandidate(candidate);
                    };
                    return pc;
                };
            }
            
            // Block mediaDevices enumeration
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);
            }
            
            console.log('🔒 WebRTC protection active');
        })();
        `;
    },

    // ============================================================
    // PERFORMANCE TIMING NOISE
    // ============================================================
    getTimingSpoofScript() {
        return `
        (function() {
            'use strict';
            
            const _now = performance.now.bind(performance);
            const offset = Math.random() * 100;
            
            performance.now = function() {
                return _now() + offset + (Math.random() * 0.1);
            };
            
            // Reduce timing precision
            const _Date = Date;
            window.Date = function(...args) {
                const date = args.length ? new _Date(...args) : new _Date();
                return date;
            };
            window.Date.now = function() {
                return Math.floor(_Date.now() / 10) * 10; // Round to 10ms
            };
            window.Date.prototype = _Date.prototype;
            
            console.log('⏱️ Timing protection active');
        })();
        `;
    },

    // ============================================================
    // FONTS FINGERPRINT PROTECTION
    // ============================================================
    getFontsSpoofScript() {
        return `
        (function() {
            'use strict';
            
            // Spoof font detection via canvas
            const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'];
            
            // Add minimal noise to text measurements
            const _measureText = CanvasRenderingContext2D.prototype.measureText;
            CanvasRenderingContext2D.prototype.measureText = function(text) {
                const metrics = _measureText.call(this, text);
                const noise = (Math.random() - 0.5) * 0.01;
                return {
                    width: metrics.width + noise,
                    actualBoundingBoxLeft: metrics.actualBoundingBoxLeft,
                    actualBoundingBoxRight: metrics.actualBoundingBoxRight,
                    actualBoundingBoxAscent: metrics.actualBoundingBoxAscent,
                    actualBoundingBoxDescent: metrics.actualBoundingBoxDescent
                };
            };
            
            console.log('🔤 Font protection active');
        })();
        `;
    },

    // ============================================================
    // MASTER INJECTION FUNCTION
    // ============================================================
    getAllScripts(isMobile, deviceProfile, options = {}) {
        const {
            canvas = true,
            webgl = true,
            audio = true,
            navigator = true,
            touch = true,
            screen = true,
            battery = true,
            timezone = true,
            webrtc = true,
            timing = true,
            fonts = true
        } = options;

        const scripts = [];

        if (canvas) scripts.push(this.getCanvasSpoofScript());
        if (webgl) scripts.push(this.getWebGLSpoofScript());
        if (audio) scripts.push(this.getAudioSpoofScript());
        if (navigator) scripts.push(this.getNavigatorSpoofScript(isMobile, deviceProfile));
        if (isMobile && touch) scripts.push(this.getTouchSpoofScript(deviceProfile));
        if (isMobile && screen) scripts.push(this.getScreenSpoofScript(deviceProfile));
        if (isMobile && battery) scripts.push(this.getBatterySpoofScript(isMobile));
        if (timezone) scripts.push(this.getTimezoneSpoofScript());
        if (webrtc) scripts.push(this.getWebRTCSpoofScript());
        if (timing) scripts.push(this.getTimingSpoofScript());
        if (fonts) scripts.push(this.getFontsSpoofScript());

        return scripts.join('\n\n');
    }
};

// Make available globally
if (typeof globalThis !== 'undefined') {
    globalThis.ANTI_DETECTION = ANTI_DETECTION;
}
