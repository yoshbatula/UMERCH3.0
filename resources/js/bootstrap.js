import axios from 'axios';
window.axios = axios;

// Ensure AJAX requests are recognized
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Enable sending cookies with API requests (required for session-based auth)
window.axios.defaults.withCredentials = true;

// Set CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

