document.addEventListener('DOMContentLoaded', () => {
    authGuard();

    const form = document.getElementById('onboarding-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pic = document.getElementById('profile-pic').value;
        const expertise = document.getElementById('expertise').value;
        const btn = document.getElementById('btn-finish');

        setLoader(btn, true, 'Saving...');

        // Backend user profile endpoint (assuming it takes profilePic or bio/expertise)
        const res = await updateProfile({ profilePic: pic, expertise: expertise });

        setLoader(btn, false, 'Go to Dashboard');

        if (res.success) {
            // Update local user ctx
            const user = getUser() || {};
            user.profilePic = pic;
            setUser(user);

            showToast('Profile updated!');
            setTimeout(() => redirect('../dashboard/dashboard.html'), 1000);
        } else {
            showToast(res.message, 'error');
        }
    });
});
