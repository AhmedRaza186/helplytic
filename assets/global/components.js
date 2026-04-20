// Helplytics AI (HelpHub Look) Components

function renderNavbar(activeMenu = 'home') {
    const isLoggedIn = !!getToken();
    const user = getUser() || {};

    return `
        <header class="navbar container" style="margin-bottom: 2rem;">
            <a href="${isLoggedIn ? '/pages/dashboard/dashboard.html' : '/index.html'}" class="nav-logo">
                <div class="logo-icon">H</div>
                Helplytics AI
            </a>
            <div class="nav-links">
                ${isLoggedIn ? `
                    <a href="/pages/dashboard/dashboard.html" class="${activeMenu === 'dashboard' ? 'active' : ''}">Dashboard</a>
                    <a href="/pages/explore/explore.html" class="${activeMenu === 'explore' ? 'active' : ''}">Explore</a>
                    <a href="/pages/leaderboard/leaderboard.html" class="${activeMenu === 'leaderboard' ? 'active' : ''}">Leaderboard</a>
                    <a href="/pages/ai-center/ai-center.html" class="${activeMenu === 'aicenter' ? 'active' : ''}">AI Center</a>
                    <a href="/pages/notifications/notifications.html" class="${activeMenu === 'notifications' ? 'active' : ''}">Notifications</a>
                    <a href="/pages/profile/profile.html" class="${activeMenu === 'profile' ? 'active' : ''}">Profile</a>
                ` : `
                    <a href="/index.html" class="${activeMenu === 'home' ? 'active' : ''}">Home</a>
                    <a href="/pages/explore/explore.html" class="${activeMenu === 'explore' ? 'active' : ''}">Explore</a>
                    <a href="/pages/leaderboard/leaderboard.html" class="${activeMenu === 'leaderboard' ? 'active' : ''}">Leaderboard</a>
                `}
            </div>
            <div style="display:flex; gap:1rem; align-items:center;">
                ${isLoggedIn ? `
                    <a href="/pages/create-request/create-request.html" class="btn btn-secondary" style="border:none; background:#e0f2fe; color:#0284c7;">Create Request</a>
                    <button onclick="handleLogout()" class="btn btn-secondary text-secondary" style="border:none; box-shadow:none; padding:10px;">Logout</button>
                ` : `
                    <a href="/pages/auth/auth.html" class="btn btn-primary">Join the platform</a>
                `}
            </div>
        </header>
    `;
}

window.handleLogout = function () {
    clearSession();
    redirect('/pages/auth/auth.html');
};

function createRequestCard(request) {
    const isHigh = request.urgency === 'High';
    const isSolved = request.status === 'Solved';

    // Convert tags string to array
    let tags = [];
    if (typeof request.tags === 'string') {
        tags = request.tags.split(',').map(t => t.trim());
    } else if (Array.isArray(request.tags)) {
        tags = request.tags;
    }

    const tagsHTML = tags.slice(0, 3).map(t => `<span class="pill-tag">${t}</span>`).join('');

    return `
        <div class="card request-card" style="padding: 1.5rem; display:flex; flex-direction:column; gap:1rem;">
            <div class="flex" style="gap: 0.5rem; flex-wrap:wrap;">
                <span class="req-pill">${request.category || 'General'}</span>
                ${isHigh ? '<span class="req-pill high">High</span>' : '<span class="req-pill" style="background:#fef9c3; color:#ca8a04;">Medium</span>'}
                ${isSolved ? '<span class="req-pill solved">Solved</span>' : '<span class="req-pill" style="background:#f1f5f9; color:#475569;">Open</span>'}
            </div>
            
            <h3 style="font-size: 1.25rem; line-height: 1.3;">${request.title}</h3>
            <p class="text-secondary" style="font-size: 0.9rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin:0;">
                ${request.description}
            </p>
            
            <div class="flex" style="gap: 0.5rem; margin-top: 0.5rem;">
                ${tagsHTML}
            </div>
            
            <div class="flex justify-between items-center mt-4 pt-4" style="border-top:1px solid var(--border-light);">
                <div>
                    <strong style="display:block; font-size:0.9rem;">${request.author?.name || 'Community Member'}</strong>
                    <span class="text-secondary" style="font-size:0.8rem;">${request.author?.location || 'Remote'} • ${Math.floor(Math.random() * 3)} helpers interested</span>
                </div>
                <a href="/pages/request-detail/request-detail.html?id=${request._id}" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">Open details</a>
            </div>
        </div>
    `;
}

