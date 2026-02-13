// Admin Authentication and Management UI
class AdminManager {
  constructor() {
    this.isAuthenticated = false;
    this.adminPanel = null;
    this.loginForm = null;
  }

  // Initialize admin UI
  init() {
    // Check if user is authenticated
    if (window.API && window.API.auth && window.API.auth.isAuthenticated()) {
      this.checkAuth();
    }

    // Create admin panel HTML
    this.createAdminPanel();
    
    // Show/hide admin UI based on authentication
    this.updateUI();
  }

  // Check authentication status
  async checkAuth() {
    try {
      if (!window.API || !window.API.auth) return false;

      const response = await window.API.auth.validate();
      this.isAuthenticated = response.success;
      this.updateUI();
      return this.isAuthenticated;
    } catch (error) {
      this.isAuthenticated = false;
      window.API.auth.logout();
      this.updateUI();
      return false;
    }
  }

  // Create admin panel HTML
  createAdminPanel() {
    // Create admin login button (if not exists)
    let adminBtn = document.getElementById('admin-toggle-btn');
    if (!adminBtn) {
      adminBtn = document.createElement('button');
      adminBtn.id = 'admin-toggle-btn';
      adminBtn.className = 'admin-toggle-btn';
      adminBtn.innerHTML = '<i class="fa fa-cog"></i> Admin';
      adminBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 15px;
        background: rgb(160, 39, 156);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      `;
      adminBtn.onclick = () => this.toggleAdminPanel();
      document.body.appendChild(adminBtn);
    }

    // Create admin panel
    if (!document.getElementById('admin-panel')) {
      const panel = document.createElement('div');
      panel.id = 'admin-panel';
      panel.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        max-width: 400px;
        width: 90%;
      `;

      // Login form HTML
      panel.innerHTML = `
        <div id="admin-login-form">
          <h3 style="margin-bottom: 20px; color: rgb(160, 39, 156);">Admin Login</h3>
          <form id="adminLoginForm">
            <div style="margin-bottom: 15px;">
              <input type="email" id="admin-email" placeholder="Email" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
              <input type="password" id="admin-password" placeholder="Password" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <button type="submit" style="width: 100%; padding: 10px; background: rgb(160, 39, 156); color: white; border: none; border-radius: 5px; cursor: pointer;">
              Login
            </button>
          </form>
          <div id="admin-error" style="color: red; margin-top: 10px; display: none;"></div>
        </div>
        <div id="admin-dashboard" style="display: none;">
          <h3 style="margin-bottom: 20px; color: rgb(160, 39, 156);">Admin Dashboard</h3>
          <button id="admin-logout-btn" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">
            Logout
          </button>
          <div id="admin-upload-section" style="margin-top: 20px;">
            <h4>Upload Project Image</h4>
            <form id="projectUploadForm">
              <input type="file" id="project-image" accept="image/*" required style="margin-bottom: 10px;">
              <input type="text" id="project-title" placeholder="Project Title" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
              <select id="project-category" required
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
                <option value="Ongoing">Ongoing</option>
                <option value="Complete">Complete</option>
              </select>

              <button type="submit" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Upload Project
              </button>
            </form>
            <div id="admin-upload-status" style="margin-top: 10px;"></div>
          </div>
        </div>
        <button id="admin-close-btn" onclick="window.adminManager.closeAdminPanel()" 
                style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      `;

      document.body.appendChild(panel);

      // Attach event listeners
      const loginForm = document.getElementById('adminLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      }

      const logoutBtn = document.getElementById('admin-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.handleLogout());
      }

      const uploadForm = document.getElementById('projectUploadForm');
      if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => this.handleProjectUpload(e));
      }
    }
  }

  // Toggle admin panel
  toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Close admin panel
  closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  // Handle login
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('admin-error');

    try {
      if (!window.API || !window.API.auth) {
        throw new Error('API not loaded');
      }

      const response = await window.API.auth.login(email, password);
      
      if (response.success) {
        this.isAuthenticated = true;
        this.updateUI();
       
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
        errorDiv.style.display = 'block';
      }
    }
  }

  // Handle logout
  async handleLogout() {
    if (window.API && window.API.auth) {
      window.API.auth.logout();
    }
    this.isAuthenticated = false;
    this.updateUI();
    this.closeAdminPanel();
  }
// Handle project upload
async handleProjectUpload(e) {
  e.preventDefault();

  const fileInput = document.getElementById('project-image');
  const titleInput = document.getElementById('project-title');
  const categoryInput = document.getElementById('project-category');
  const statusDiv = document.getElementById('admin-upload-status');

  // Check if file is selected
  if (!fileInput.files || !fileInput.files[0]) {
    if (statusDiv) {
      statusDiv.innerHTML = '<span style="color: red;">Please select an image file</span>';
    }
    return;
  }

  const file = fileInput.files[0]; // ✅ Correctly get the selected file

  try {
    if (!window.API || !window.API.upload) {
      throw new Error('API not loaded');
    }

    // Show loading
    if (statusDiv) {
      statusDiv.innerHTML = '<span style="color: blue;">Uploading...</span>';
    }

    // Upload image
    const uploadResponse = await window.API.upload.uploadImage(file); // ✅ Use defined file

    if (!uploadResponse.success || !uploadResponse.data || !uploadResponse.data.imageUrl) {
      throw new Error('Image upload failed');
    }

    // Create project
    const projectResponse = await window.API.projects.create({
      title: titleInput.value.trim(),
      imageUrl: uploadResponse.data.imageUrl,
      category: categoryInput.value.trim() || 'Ongoing'
    });

    if (projectResponse.success) {
      if (statusDiv) {
        statusDiv.innerHTML = '<span style="color: green;">Project uploaded successfully!</span>';
      }
      // Reset form
      e.target.reset();
      
      // Reload page after 2 seconds to show new project
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      throw new Error(projectResponse.message || 'Failed to create project');
    }
  } catch (error) {
    if (statusDiv) {
      statusDiv.innerHTML = `<span style="color: red;">Error: ${error.message || 'Upload failed'}</span>`;
    }
  }
}

  // Update UI based on authentication
  updateUI() {
    const loginForm = document.getElementById('admin-login-form');
    const dashboard = document.getElementById('admin-dashboard');

    if (this.isAuthenticated) {
      if (loginForm) loginForm.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';
    } else {
      if (loginForm) loginForm.style.display = 'block';
      if (dashboard) dashboard.style.display = 'none';
    }
  }
}

// Initialize admin manager
const adminManager = new AdminManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (window.API) adminManager.init();
    }, 1000);
  });
} else {
  setTimeout(() => {
    if (window.API) adminManager.init();
  }, 1000);
}

// Export for global access
window.AdminManager = AdminManager;
window.adminManager = adminManager;
