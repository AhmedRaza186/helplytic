// Global Utility Functions

// Show Toast Notification
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Time Ago formatting (e.g., "2 hours ago")
function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Get Query Parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Global Redirect Route
function redirect(path) {
    window.location.href = path;
}

// Debounce Function
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Loader UI Manager
function setLoader(buttonElement, isLoading, originalText = 'Submit') {
    if (!buttonElement) return;

    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<span class="spinner"></span>`;
    } else {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}

// Set Token
function setToken(token) {
    localStorage.setItem('heplytics_token', token);
}

// Get Token
function getToken() {
    return localStorage.getItem('heplytics_token');
}

// Clear Session
function clearSession() {
    localStorage.removeItem('heplytics_token');
    localStorage.removeItem('heplytics_user');
}

// Set User Context
function setUser(user) {
    localStorage.setItem('heplytics_user', JSON.stringify(user));
}

// Get User Context
function getUser() {
    const userStr = localStorage.getItem('heplytics_user');
    if (!userStr || userStr === 'undefined') return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

// Auth Guard - Redirects if not logged in
function authGuard() {
    const token = getToken();
    if (!token) {
        redirect('/pages/auth/auth.html');
    }
}

// Guest Guard - Redirects if logged in (for login page)
function guestGuard() {
    const token = getToken();
    if (token) {
        redirect('/pages/dashboard/dashboard.html');
    }
}
