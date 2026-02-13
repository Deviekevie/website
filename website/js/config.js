// API Configuration - Centralized configuration
// This file provides the API base URL for all environments

(function() {
    'use strict';
    
    // Detect environment
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname === '0.0.0.0';
    
    // Determine API base URL
    let apiBaseUrl;
    
    // Priority 1: Explicitly set via window.API_BASE_URL (for Vercel env var injection)
    if (window.API_BASE_URL && window.API_BASE_URL !== 'undefined') {
        apiBaseUrl = window.API_BASE_URL;
    }
    // Priority 2: Check for environment-specific config
    else if (window.__ENV__ && window.__ENV__.API_BASE_URL) {
        apiBaseUrl = window.__ENV__.API_BASE_URL;
    }
    // Priority 3: Production - must be set
    else if (!isLocalhost) {
        // In production, API_BASE_URL must be configured
        // Will throw error in api.js if not set
        apiBaseUrl = null;
    }
    // Priority 4: Local development - use localhost
    else {
        apiBaseUrl = 'http://localhost:3000';
    }
    
    // Set global API_BASE_URL for use in api.js
    window.API_BASE_URL = apiBaseUrl;
    
    // Log for debugging (only in development)
    if (isLocalhost && apiBaseUrl) {
        console.log('[Config] API Base URL:', apiBaseUrl);
    } else if (!isLocalhost && !apiBaseUrl) {
        console.error('[Config] ERROR: API_BASE_URL not configured for production!');
        console.error('[Config] Set API_BASE_URL environment variable in Vercel dashboard.');
    }
})();
