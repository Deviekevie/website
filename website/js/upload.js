const API_BASE_URL = 'http://localhost:3000'; // <-- your backend URL

const uploadAPI = {
  async uploadImage(file) {
    if (!file) throw new Error('No file provided');

    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    return data;
  }
};

window.API = window.API || {};
window.API.upload = uploadAPI;
