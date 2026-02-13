// API Configuration - Reads from window.API_BASE_URL set by config.js
const API_BASE_URL = (() => {
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname === '0.0.0.0'
  );
  if (!isLocalhost) {
    const error = 'API_BASE_URL not configured. Set API_BASE_URL environment variable in Vercel dashboard.';
    console.error('API Configuration Error:', error);
    return null;
  }
  return 'http://localhost:3000';
})();

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  if (!API_BASE_URL && endpoint.startsWith('/api/')) {
    throw new Error('API_BASE_URL not configured.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const token = localStorage.getItem('adminToken');
  if (token && !config.headers['Authorization'] && !endpoint.startsWith('/api/auth/login')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Expected JSON but received ${contentType}. Response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      let errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      if (response.status === 401) throw new Error('Authentication required. Please log in.');
      if (response.status === 403) throw new Error('Access denied. You do not have permission.');
      if (response.status === 404) throw new Error(`API endpoint not found: ${endpoint}`);
      if (response.status >= 500) throw new Error('Server error. Please try again later.');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Failed to connect to API at ${API_BASE_URL}. Check CORS settings and ensure backend is running.`);
    }
    console.error('API Request Error:', { endpoint, url, error: error.message, API_BASE_URL });
    throw error;
  }
}

// Reviews API
const reviewsAPI = {
  async getAll() { return apiRequest('/api/reviews'); },
  async create(reviewData) { return apiRequest('/api/reviews', { method: 'POST', body: JSON.stringify(reviewData) }); },
  async getStats() { return apiRequest('/api/reviews/stats'); }
};

// Projects API
const projectsAPI = {
  async getAll() { return apiRequest('/api/projects'); },
  async create(projectData) { return apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(projectData) }); }
};

// Auth API
const authAPI = {
  async login(email, password) {
    const response = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (response.token) localStorage.setItem('adminToken', response.token);
    return response;
  },
  async getCurrentUser() { return apiRequest('/api/auth/me'); },
  async validate() { 
    try { return apiRequest('/api/auth/validate', { method: 'POST' }); }
    catch (err) { localStorage.removeItem('adminToken'); throw err; }
  },
  logout() { localStorage.removeItem('adminToken'); return { success: true, message: 'Logged out successfully' }; },
  isAuthenticated() { return !!localStorage.getItem('adminToken'); }
};

// Upload API (fixed)
const uploadAPI = {
  async uploadImage(file) {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();
      formData.append('image', file); // ✅ use the passed file

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData // ✅ only once
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

// Export APIs
window.API = {
  baseURL: API_BASE_URL,
  reviews: reviewsAPI,
  projects: projectsAPI,
  auth: authAPI,
  upload: uploadAPI
};
