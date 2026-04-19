document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('explore');

    const container = document.getElementById('requests-container');
    const btnFilter = document.getElementById('btn-apply-filters');
    const catSelect = document.getElementById('filter-category');
    const urgSelect = document.getElementById('filter-urgency');

    async function loadRequests() {
        container.innerHTML = '<div class="spinner" style="border-top-color:var(--brand-primary); margin: 2rem auto;"></div>';

        let query = '?';
        if (catSelect.value) query += `category=${encodeURIComponent(catSelect.value)}&`;
        if (urgSelect.value) query += `urgency=${encodeURIComponent(urgSelect.value)}&`;

        const res = await getRequests(query);
        
        if (res.success && res.data && res.data.data) {
            const reqs = res.data.data;
            if (reqs.length === 0) {
                container.innerHTML = '<div class="card"><p class="text-secondary text-center">No requests found matching criteria.</p></div>';
            } else {
                container.innerHTML = reqs.map(createRequestCard).join('');
            }
        } else {
            container.innerHTML = `<div class="card"><p class="text-center text-danger">${res.message || 'Failed to load'}</p></div>`;
        }
    }

    btnFilter.addEventListener('click', loadRequests);

    // Initial load
    await loadRequests();
});
