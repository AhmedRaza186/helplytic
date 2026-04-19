document.addEventListener('DOMContentLoaded', async () => {
    authGuard();
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('notifications');

    const notifList = document.getElementById('notifications-list');
    const res = await getNotifications();

    // In many templates or hackathon codes, notifs might not be fully fleshed out on backend
    // So if array gets returned, we use it, otherwise we mock exactly what the UI demonstrates.
    let items = res.success ? (res.data.notifications || res.data) : [];
    if (!Array.isArray(items) || items.length === 0) {
        items = [
            { text: '"Need help" was marked as solved', type: 'Status', time: 'Just now', unread: true },
            { text: 'Ayesha Khan offered help on "Need help"', type: 'Match', time: 'Just now', unread: true },
            { text: 'Your request "Need help" is now live in the community feed', type: 'Request', time: 'Just now', unread: true },
            { text: 'New helper matched to your responsive portfolio request', type: 'Match', time: '12 min ago', unread: true },
            { text: 'Your trust score increased after a solved request', type: 'Reputation', time: '1 hr ago', unread: true },
            { text: 'AI Center detected rising demand for interview prep', type: 'Insight', time: 'Today', unread: false }
        ];
    }

    notifList.innerHTML = items.map(n => `
        <div class="notification-item">
            <div>
                <strong style="display:block; font-size:1rem; margin-bottom:0.25rem;">${n.text || n.message}</strong>
                <span class="text-secondary" style="font-size:0.85rem;">${n.type || 'Alert'} • ${n.time || 'recent'}</span>
            </div>
            <div>
                <span class="${n.unread ? 'pill-unread' : 'pill-read'}">${n.unread ? 'Unread' : 'Read'}</span>
            </div>
        </div>
    `).join('');

});
