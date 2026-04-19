document.addEventListener('DOMContentLoaded', async () => {
    // Usually admin has a strict guard. Fallback to auth for now.
    authGuard();
    document.getElementById('nav-placeholder').innerHTML = renderNavbar();

    const tbody = document.getElementById('admin-users-list');

    // Simulate admin user fetch
    // Real system: apiCall('/admin/users')

    setTimeout(() => {
        const users = [
            { name: 'Ayesha Khan', email: 'ayesha@helphub.ai', role: 'Both', trust: 100 },
            { name: 'Hassan Ali', email: 'hassan@helphub.ai', role: 'Can Help', trust: 88 },
            { name: 'Sara Noor', email: 'sara@helphub.ai', role: 'Need Help', trust: 74 },
            { name: 'Spammer Test', email: 'spam@test.com', role: 'Both', trust: 12 },
        ];

        tbody.innerHTML = users.map(u => `
            <tr>
                <td style="font-weight:600;">${u.name}</td>
                <td class="text-secondary">${u.email}</td>
                <td>${u.role}</td>
                <td ${u.trust < 50 ? 'style="color:red;"' : ''}>${u.trust}%</td>
                <td>
                    <button class="pill-tag" onclick="alert('Action restricted to admin endpoints')">Suspend</button>    
                </td>
            </tr>
        `).join('');
    }, 1000);
});
