document.addEventListener('DOMContentLoaded', async () => {
    authGuard();

    // Render Navbar
    const navContainer = document.getElementById('sidebar-container') || document.getElementById('nav-placeholder');
    if (navContainer) {
        navContainer.innerHTML = renderNavbar('dashboard');
    }

    const user = getUser();
    if (user) {
        document.getElementById('welcome-text').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }

    await loadDashboardData();
});

async function loadDashboardData() {
    // We would make standard API calls here. 
    // According to backend: GET /requests returns all requests.
    // GET /user/profile returns stats usually.

    // Load Stats
    try {
        const profileRes = await getProfile();
        // Backend usually returns user in data.user or directly in data
        const u = profileRes.success ? (profileRes.data.user || profileRes.data) : null;
        if (u) {
            document.getElementById('stat-my-requests').textContent = u.requestsCreated || 0;
            document.getElementById('stat-offered').textContent = u.helpOffered || 0;
            document.getElementById('stat-score').textContent = u.reputation || u.score || u.trustScore || 0;
        } else {
            document.getElementById('stat-my-requests').textContent = '0';
            document.getElementById('stat-offered').textContent = '0';
            document.getElementById('stat-score').textContent = '0';
        }
    } catch (err) {
        console.error('Failed to load profile stats:', err);
    }

    // Load recent requests
    const reqRes = await getRequests('?limit=4');
    const grid = document.getElementById('recent-requests-grid');
    grid.innerHTML = '';

    if (reqRes.success && reqRes.data) {
        const requests = Array.isArray(reqRes.data) ? reqRes.data : (reqRes.data.data || reqRes.data.requests || []);
        if (requests.length === 0) {
            grid.innerHTML = '<p class="text-muted">No recent requests found in the community.</p>';
            return;
        }

        requests.slice(0, 6).forEach(req => {
            // Using createRequestCard from components.js
            const cardHTML = createRequestCard(req);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = cardHTML;
            grid.appendChild(wrapper.firstElementChild);
        });
    } else {
        grid.innerHTML = '<p class="text-danger">Failed to load requests.</p>';
    }
}
