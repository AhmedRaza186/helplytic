document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('aicenter');

    const attentionList = document.getElementById('attention-list');

    // Normally this comes from an AI specific route or by manually filtering requests
    // Let's fetch all requests and find unresolved ones, or just mock based on design
    const res = await getRequests();

    let reqs = res.success && res.data.data ? res.data.data : [];

    if (reqs.length === 0) {
        reqs = [
            {
                title: 'Need help',
                aiSummary: 'Web Development request with high urgency. Best suited for members with relevant expertise.',
                tags: ['Web Development', 'High'] // using specific visual pills as tags
            },
            {
                title: 'Need help making my portfolio responsive before demo day',
                aiSummary: 'Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.',
                tags: ['Web Development', 'High']
            },
            {
                title: 'Looking for Figma feedback on a volunteer event poster',
                aiSummary: 'A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.',
                tags: ['Design', 'Medium']
            }
        ];
    } else {
        // Map to ai format
        reqs = reqs.slice(0, 3).map(r => ({
            title: r.title,
            aiSummary: 'Automatically summarized: ' + (r.description.substring(0, 80) + '...'),
            tags: [r.category || 'General', r.urgency || 'High']
        }));
    }

    attentionList.innerHTML = reqs.map(r => `
        <div class="req-detail-row">
            <strong style="display:block; font-size:1.1rem; margin-bottom:0.5rem;">\${r.title}</strong>
            <p class="text-secondary" style="font-size:0.95rem; margin-bottom:1rem;">AI summary: \${r.aiSummary}</p>
            <div class="flex gap-2">
                ${r.tags.map(t => `<span class="pill-tag" \${t==='High' ? 'style="background:rgba(220,38,38,0.1); color:#dc2626;"' : ''}>${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

});
