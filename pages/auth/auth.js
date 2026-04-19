document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    guestGuard();

    const mode = getQueryParam('mode'); // e.g. ?mode=signup

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');

    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');

    const toSignup = document.getElementById('to-signup');
    const toLogin = document.getElementById('to-login');
    const resendOtpBtn = document.getElementById('resend-otp');

    let currentEmail = '';

    // UI State Management
    function switchMode(newMode) {
        window.history.pushState({}, '', `?mode=${newMode}`);
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        otpForm.style.display = 'none';
        
        if (newMode === 'signup') {
            signupForm.style.display = 'block';
            title.textContent = 'Create an account';
            subtitle.textContent = 'Join the Helplytics community';
        } else if (newMode === 'otp') {
            otpForm.style.display = 'block';
            title.textContent = 'Verify your email';
            subtitle.textContent = '';
        } else {
            loginForm.style.display = 'block';
            title.textContent = 'Welcome back';
            subtitle.textContent = 'Enter your details to sign in';
        }
    }

    // Initialize state
    switchMode(mode === 'signup' ? 'signup' : 'login');

    toSignup.addEventListener('click', (e) => { e.preventDefault(); switchMode('signup'); });
    toLogin.addEventListener('click', (e) => { e.preventDefault(); switchMode('login'); });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const btn = document.getElementById('btn-login');
        
        setLoader(btn, true, 'Sign In');
        const res = await loginUser(email, pass);
        setLoader(btn, false, 'Sign In');
        
        if (res.success) {
            setToken(res.data.token);
            setUser(res.data.user);
            showToast('Logged in successfully!');
            setTimeout(() => redirect('../dashboard/dashboard.html'), 1000);
        } else {
            showToast(res.message, 'error');
        }
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        const btn = document.getElementById('btn-signup');
        
        setLoader(btn, true, 'Create Account');
        const res = await signupUser(name, email, pass);
        setLoader(btn, false, 'Create Account');
        
        if (res.success) {
            currentEmail = email; // store for OTP
            showToast('Account created! Please verify your email.');
            // Send OTP implicitly or explicitly based on backend design
            await await sendOtp(email);
            switchMode('otp');
        } else {
            showToast(res.message, 'error');
        }
    });

    // Handle Verify OTP
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = document.getElementById('otp-code').value;
        const btn = document.getElementById('btn-verify');
        
        setLoader(btn, true, 'Verify OTP');
        const res = await verifyOtp(currentEmail, otp);
        setLoader(btn, false, 'Verify OTP');
        
        if (res.success) {
            showToast('Email verified successfully!');
            // After verified, they need to log in or token is returned. 
            // Most OTP setups either return token or ask to login.
            // Based on ec0048e7 backend convo, checking if we get token.
            if(res.data && res.data.token) {
                setToken(res.data.token);
                setUser(res.data.user);
                setTimeout(() => redirect('../dashboard/dashboard.html'), 1000);
            } else {
                switchMode('login');
            }
        } else {
            showToast(res.message, 'error');
        }
    });

    // Handle Resend OTP
    resendOtpBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if(!currentEmail) return showToast('Email not found. Refresh page.', 'error');
        
        const res = await sendOtp(currentEmail);
        if (res.success) {
            showToast('OTP resent successfully!');
        } else {
            showToast(res.message, 'error');
        }
    });

});
