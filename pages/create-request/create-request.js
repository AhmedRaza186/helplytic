document.addEventListener('DOMContentLoaded', () => {
    authGuard();
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('create');

    const form = document.getElementById('create-request-form');
    const aiBtn = document.getElementById('btn-ai');

    // Fake AI enhancement locally (since it's a frontend demo task mostly)
    aiBtn.addEventListener('click', () => {
        const desc = document.getElementById('description');
        if (desc.value.trim().length > 10) {
            document.getElementById('ai-cat').textContent = 'Web Development';
            document.getElementById('ai-urgency').textContent = 'High';
            showToast('AI suggestions applied!');
            // Pre-fill some tags
            document.getElementById('tags').value = 'AI Enhanced, Feedback';
        } else {
            showToast('Please write a longer description for AI to analyze', 'warning');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const desc = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const urgency = document.getElementById('urgency').value; // if backed supports it, usually tags handle it or its part of category
        const tags = document.getElementById('tags').value;

        const btn = document.getElementById('btn-submit');
        setLoader(btn, true, 'Publishing...');

        let tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        tagsArray.push(`Urgency:${urgency}`);

        const res = await createRequest(title, desc, category, tagsArray);
        setLoader(btn, false, 'Publish request');

        if (res.success) {
            showToast('Request published successfully!');
            setTimeout(() => {
                redirect('../dashboard/dashboard.html');
            }, 1500);
        } else {
            showToast(res.message, 'error');
        }
    });
});
