document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('leaderboard');

    const rankingsList = document.getElementById('rankings-list');
    const trustList = document.getElementById('trust-list');

    const res = await getLeaderboard();

    if (res.success && res.data) {
        let users = res.data.users || res.data; // adjust based on array or object
        if (!Array.isArray(users)) users = [];

        // If empty, mock the data to match the UI precisely for demonstration
        if (users.length === 0) {
            users = [
                { name: 'Hassan Ali', score: 88, contributions: 24, badge: 'Code Rescuer • Bug Hunter', initials: 'HA', color: '#1e293b' },
                { name: 'Sara Noor', score: 74, contributions: 11, badge: 'Community Voice', initials: 'SN', color: '#f97316' }
            ];
        }

        rankingsList.innerHTML = users.map((u, i) => `
            <div class="ranking-card">
                <div class="flex items-center gap-4">
                    <div class="avatar-circle" style="background:\${u.color || '#18a08c'}">\${u.initials || u.name.substring(0,2).toUpperCase()}</div>
                    <div>
                        <strong style="font-size: 1.1rem; display:block;">#\${i+1} \${u.name}</strong>
                        <span class="text-secondary" style="font-size:0.9rem;">JavaScript, React</span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <strong style="font-size:1.1rem;">\${u.score || 0}%</strong>
                    <div class="text-secondary" style="font-size:0.85rem;">\${u.contributions || 0} contributions</div>
                </div>
            </div>
        `).join('');

        trustList.innerHTML = users.map(u => `
            <div class="ranking-card" style="flex-direction:column; align-items:stretch;">
                <strong style="font-size: 1.1rem;">\${u.name}</strong>
                <span class="text-secondary" style="font-size:0.9rem; margin-top:0.25rem;">\${u.badge || 'Community Member'}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: \${u.score || 0}%;"></div>
                </div>
            </div>
        `).join('');

    } else {
        rankingsList.innerHTML = '<p class="text-danger">Failed to load leaderboard</p>';
    }
});
