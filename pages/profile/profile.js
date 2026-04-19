document.addEventListener('DOMContentLoaded', async () => {
    authGuard();
    document.getElementById('nav-placeholder').innerHTML = renderNavbar('profile');

    let user = getUser();
    if (!user) return;

    // We can fetch latest profile stats
    const res = await getProfile();
    if (res.success && res.data.user) {
        user = res.data.user;
        setUser(user);
    }

    // Populate UI
    document.getElementById('user-name').textContent = user.name || 'Community Member';
    document.getElementById('user-subtext').textContent = `Both • \${user.location || 'Remote'}`;
    
    document.getElementById('p-trust').textContent = (user.trustScore || '100') + '%';
    document.getElementById('p-contrib').textContent = user.contributions || '35';

    document.getElementById('edit-name').value = user.name || '';
    document.getElementById('edit-location').value = user.location || 'Karachi';
    document.getElementById('edit-skills').value = user.skills ? user.skills.join(', ') : 'Figma, UI/UX, HTML/CSS, Career Guidance';
    document.getElementById('edit-interests').value = user.interests ? user.interests.join(', ') : 'Hackathons, UI/UX, Community Building';

    // Handle Save
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-save');
        setLoader(btn, true, 'Saving...');

        const updateData = {
            name: document.getElementById('edit-name').value,
            location: document.getElementById('edit-location').value,
            skills: document.getElementById('edit-skills').value.split(',').map(s=>s.trim()),
            interests: document.getElementById('edit-interests').value.split(',').map(s=>s.trim()),
        };

        const updateRes = await updateProfile(updateData);
        setLoader(btn, false, 'Save profile');

        if(updateRes.success) {
            showToast('Profile saved!');
            document.getElementById('user-name').textContent = updateData.name;
            document.getElementById('user-subtext').textContent = `Both • ${updateData.location}`;
            
            // update tags visually
            document.getElementById('p-skills').innerHTML = updateData.skills.map(s => `<span class="pill-tag">${s}</span>`).join('');
            
            // Update local user
            const current = getUser();
            Object.assign(current, updateData);
            setUser(current);

        } else {
            showToast(updateRes.message, 'error');
        }
    });
});
