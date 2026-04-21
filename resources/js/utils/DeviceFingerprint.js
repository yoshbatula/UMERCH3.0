/**
 * Device Fingerprinting Utility
 * Generates a unique fingerprint for a device based on browser and system information
 */

export class DeviceFingerprint {
    /**
     * Generate a device fingerprint from browser capabilities
     * @returns {Promise<string>} - A unique fingerprint string
     */
    static async generateFingerprint() {
        const components = {
            // Browser information
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages?.join(',') || '',
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || 0,
            deviceMemory: navigator.deviceMemory || 0,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            
            // Screen information
            screenResolution: `${screen.width}x${screen.height}`,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth,
            
            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // WebGL information (if available)
            webglVendor: this.getWebGLVendor(),
            webglRenderer: this.getWebGLRenderer(),
            
            // Canvas fingerprint
            canvas: await this.getCanvasFingerprint(),
            
            // Local storage check
            localStorageEnabled: this.checkLocalStorageEnabled(),
            
            // IndexedDB check
            indexedDBEnabled: this.checkIndexedDBEnabled(),
        };

        return this.hashComponents(components);
    }

    /**
     * Get WebGL vendor information
     */
    static getWebGLVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
            }
        } catch (e) {
            return 'unknown';
        }
    }

    /**
     * Get WebGL renderer information
     */
    static getWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
            }
        } catch (e) {
            return 'unknown';
        }
    }

    /**
     * Generate canvas fingerprint
     */
    static async getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 280;
            canvas.height = 60;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return 'no-canvas';
            
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Device Fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Device Fingerprint', 4, 17);
            
            return canvas.toDataURL().slice(-30);
        } catch (e) {
            return 'canvas-error';
        }
    }

    /**
     * Check if local storage is enabled
     */
    static checkLocalStorageEnabled() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if IndexedDB is enabled
     */
    static checkIndexedDBEnabled() {
        try {
            return !!window.indexedDB;
        } catch (e) {
            return false;
        }
    }

    /**
     * Simple hash function for combining components
     * Note: This is not cryptographically secure, just for fingerprint generation
     */
    static hashComponents(components) {
        const str = JSON.stringify(components);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Convert to hex string
        return Math.abs(hash).toString(16).padStart(16, '0');
    }

    /**
     * Get stored fingerprint from localStorage (for persistence)
     */
    static getStoredFingerprint() {
        try {
            return localStorage.getItem('device_fingerprint');
        } catch (e) {
            return null;
        }
    }

    /**
     * Store fingerprint in localStorage
     */
    static storeFingerprint(fingerprint) {
        try {
            localStorage.setItem('device_fingerprint', fingerprint);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Clear stored fingerprint
     */
    static clearStoredFingerprint() {
        try {
            localStorage.removeItem('device_fingerprint');
            return true;
        } catch (e) {
            return false;
        }
    }
}
