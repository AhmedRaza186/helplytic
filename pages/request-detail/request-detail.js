document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('explore');
    const user = getUser();
    const reqId = getQueryParam('id');

    if (!reqId) {
        document.getElementById('req-title').textContent = 'Request not found';
        return;
    }

    const res = await getRequestById(reqId);
    if (res.success && res.data) {
        // Assume res.data struct based on backend
        const req = res.data;

        document.getElementById('req-title').textContent = req.title || 'Untitled Request';
        document.getElementById('req-desc').textContent = req.description || 'No description provided.';

        const isHigh = req.urgency === 'High' || (req.tags && req.tags.includes('High'));
        const isSolved = req.status === 'Solved';

        document.getElementById('req-pills').innerHTML = \`
            <span class="req-pill">\${req.category || 'General'}</span>
            \${isHigh ? '<span class="req-pill high">High</span>' : '<span class="req-pill">Low</span>'}
            \${isSolved ? '<span class="req-pill solved">Solved</span>' : '<span class="req-pill">Open</span>'}
        \`;

        // Mock AI Summary based on description length
        document.getElementById('ai-summary').textContent = \`AI has summarized this as a \${req.category || 'general'} issue. The user needs clear step-by-step guidance. \`;
        
        // Tags
        let tagsArr = req.tags ? (typeof req.tags === 'string' ? req.tags.split(',') : req.tags) : ['Community'];
        document.getElementById('ai-tags').innerHTML = tagsArr.map(t => \`<span class="pill-tag">\${t.trim()}</span>\`).join('');

        // Author info
        document.getElementById('req-author').textContent = req.author?.name || 'Community Member';

        // Actions visibility
        const actionsCard = document.getElementById('actions-card');
        if(user) {
            actionsCard.style.display = 'block';
            if(req.author && req.author._id === user.id) {
                // User is owner
                document.getElementById('btn-offer-help').style.display = 'none';
                if(!isSolved) document.getElementById('btn-mark-solved').style.display = 'inline-flex';
            }
        }

        document.getElementById('btn-offer-help').addEventListener('click', async () => {
            const btn = document.getElementById('btn-offer-help');
            setLoader(btn, true, 'Offering');
            const offRes = await offerHelp(reqId, "I can assist with this!");
            setLoader(btn, false, 'I can help');
            if(offRes.success) showToast('Help offered successfully!');
            else showToast(offRes.message, 'error');
        });

        document.getElementById('btn-mark-solved').addEventListener('click', async () => {
             const solRes = await solveRequest(reqId, "Solved by community");
             if(solRes.success) {
                 showToast('Marked as solved!');
                 setTimeout(()=>window.location.reload(), 1000);
             }
        });

        // Mocking Helpers using the premium UI
        document.getElementById('helpers-list').innerHTML = \`
            <div class="helper-card">
                <div class="flex gap-2 items-center">
                    <div style="width:36px;height:36px;border-radius:50%;background:#f97316;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;">HA</div>
                    <div>
                        <strong style="display:block;font-size:0.9rem;">Hassan Ali</strong>
                        <span class="text-secondary" style="font-size:0.8rem;">JavaScript, React</span>
                    </div>
                </div>
                <span class="trust-badge">Trust 88%</span>
            </div>
        \`;

    } else {
        document.getElementById('req-title').textContent = 'Error Loading Request';
    }
});
