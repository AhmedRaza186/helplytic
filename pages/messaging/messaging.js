document.addEventListener('DOMContentLoaded', async () => {
    authGuard();
    document.getElementById('nav-placeholder').innerHTML = renderNavbar();

    const msgList = document.getElementById('messages-list');

    // Simulate fetching conversations
    // Since backend might just list raw messages, we'll format them beautifully
    let convos = [
        { parties: 'Ayesha Khan &rarr; Sara Noor', text: 'I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.', time: '09:45 AM' },
        { parties: 'Hassan Ali &mdash; Ayesha Khan', text: 'Your event poster concept is solid. I would tighten the CTA and reduce the background texture.', time: '11:10 AM' }
    ];

    msgList.innerHTML = convos.map(c => `
        <div class="message-thread">
            <div class="thread-header">
                <span class="participants">${c.parties}</span>
                <span class="msg-bubble">${c.time}</span>
            </div>
            <p class="text-secondary" style="font-size: 0.95rem; margin:0;">${c.text}</p>
        </div>
    `).join('');

    document.getElementById('msg-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const to = document.getElementById('msg-to').value;
        const text = document.getElementById('msg-content').value;
        
        const btn = document.getElementById('btn-send');
        setLoader(btn, true, 'Sending...');

        // In real system to backend: sendMessage(userId, text)
        // Simulate local optimistic UI
        setTimeout(() => {
             setLoader(btn, false, 'Send');
             
             // Append to top of list visually
             const newMsgHtml = `
                <div class="message-thread">
                    <div class="thread-header">
                        <span class="participants">You &rarr; ${to}</span>
                        <span class="msg-bubble">Just now</span>
                    </div>
                    <p class="text-secondary" style="font-size: 0.95rem; margin:0;">${text}</p>
                </div>
             `;
             
             msgList.insertAdjacentHTML('afterbegin', newMsgHtml);
             document.getElementById('msg-content').value = '';
             showToast('Message sent!');
        }, 800);
    });
});
