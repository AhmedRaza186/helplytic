// General wrapper for API calls
async function apiCall(endpoint, method = 'GET', body = null, isAuthRequired = true) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (isAuthRequired) {
            const token = getToken(); // from utils.js
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // Not authenticated but required
                clearSession();
                redirect('/pages/auth/auth.html');
                return { success: false, message: 'Authentication required' };
            }
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        // If standard unauthorized response from backend
        if (response.status === 401) {
            clearSession();
            redirect('/pages/auth/auth.html');
            return { success: false, message: data.message || 'Session expired' };
        }

        if (!response.ok) {
            return { success: false, message: data.message || 'Something went wrong', status: response.status, data: data };
        }

        return { success: true, data: data };

    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error or server is down' };
    }
}


// =============== AUTH ENDPOINTS ===============
async function loginUser(email, password) {
    return await apiCall('/auth/login', 'POST', { email, password }, false);
}

async function signupUser(name, email, password) {
    return await apiCall('/auth/signup', 'POST', { name, email, password }, false);
}

async function sendOtp(email) {
    return await apiCall('/auth/send-otp', 'POST', { email }, false);
}

async function verifyOtp(email, otp) {
    return await apiCall('/auth/verify-otp', 'POST', { email, otp }, false);
}

// =============== USER ENDPOINTS ===============
async function getProfile() {
    return await apiCall('/user/profile', 'GET', null, true);
}

async function updateProfile(data) {
    return await apiCall('/user/profile', 'PUT', data, true);
}

// =============== REQUEST ENDPOINTS ===============
async function getRequests(queryParams = '') {
    // queryParams like ?category=Technical&status=Open
    return await apiCall(`/requests${queryParams}`, 'GET', null, false);
}

async function getRequestById(id) {
    return await apiCall(`/requests/${id}`, 'GET', null, false);
}

async function createRequest(title, description, category, tags) {
    return await apiCall('/requests', 'POST', { title, description, category, tags }, true);
}

async function solveRequest(id, solution) {
    return await apiCall(`/requests/${id}/solve`, 'PATCH', { solution }, true);
}

async function offerHelp(id, message) {
    return await apiCall(`/requests/${id}/help`, 'POST', { message }, true);
}

// =============== ADDITIONAL ENDPOINTS ===============
async function getNotifications() {
    return await apiCall('/notifications', 'GET', null, true);
}

async function markNotificationRead(id) {
    // Assuming a patch exists, standard pattern
    return await apiCall(`/notifications/${id}/read`, 'PATCH', null, true);
}

async function getLeaderboard() {
    return await apiCall('/leaderboard', 'GET', null, false);
}

async function getMessages(receiverId) {
    return await apiCall(`/messages/${receiverId}`, 'GET', null, true);
}

async function sendMessage(receiverId, content) {
    return await apiCall('/messages', 'POST', { receiverId, content }, true);
}
