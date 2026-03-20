// ==================== AUTH LOGIC ====================
let users = JSON.parse(localStorage.getItem('eagle_users')) || [];

// Seed default admin
if (users.length === 0) {
    users = [{ username: 'admin', password: 'admin123', role: 'admin' }];
    localStorage.setItem('eagle_users', JSON.stringify(users));
}

// ==================== LOGIN ====================
function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('auth-error');
    const btn = e.target.querySelector('button[type="submit"]');

    errorEl.classList.add('hidden');

    if (!username || !password) {
        errorEl.innerText = '⚠ ALL FIELDS REQUIRED';
        errorEl.classList.remove('hidden');
        return;
    }

    // Simulate loading
    btn.innerText = 'AUTHENTICATING...';
    btn.disabled = true;

    setTimeout(() => {
        users = JSON.parse(localStorage.getItem('eagle_users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('eagle_active_user', JSON.stringify(user));
            window.location.replace(user.role === 'admin' ? 'admin.html' : 'shop.html');
        } else {
            btn.innerText = 'INITIALIZE UPLINK';
            btn.disabled = false;
            errorEl.innerText = '⚠ ACCESS DENIED: INVALID CREDENTIALS';
            errorEl.classList.remove('hidden');

            // Shake animation
            const card = document.querySelector('.auth-card');
            if (card) {
                card.style.animation = 'shake 0.4s ease';
                setTimeout(() => card.style.animation = '', 400);
            }
        }
    }, 600);
}

// ==================== REGISTER ====================
function handleRegister(e) {
    e.preventDefault();
    users = JSON.parse(localStorage.getItem('eagle_users')) || [];

    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirm = document.getElementById('reg-confirm')?.value.trim();
    const errorEl = document.getElementById('reg-error');
    const btn = e.target.querySelector('button[type="submit"]');

    errorEl.classList.add('hidden');
    errorEl.className = 'error-msg hidden';

    if (!username || !password) {
        errorEl.innerText = '⚠ ALL FIELDS REQUIRED';
        errorEl.classList.remove('hidden');
        return;
    }
    if (username.length < 3) {
        errorEl.innerText = '⚠ OPERATOR ID MUST BE AT LEAST 3 CHARACTERS';
        errorEl.classList.remove('hidden');
        return;
    }
    if (password.length < 4) {
        errorEl.innerText = '⚠ PASSCODE MUST BE AT LEAST 4 CHARACTERS';
        errorEl.classList.remove('hidden');
        return;
    }
    if (confirm !== undefined && password !== confirm) {
        errorEl.innerText = '⚠ PASSCODES DO NOT MATCH';
        errorEl.classList.remove('hidden');
        return;
    }
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        errorEl.innerText = '⚠ OPERATOR ID ALREADY TAKEN';
        errorEl.classList.remove('hidden');
        return;
    }

    btn.innerText = 'INITIALIZING...';
    btn.disabled = true;

    setTimeout(() => {
        users.push({ username, password, role: 'user' });
        localStorage.setItem('eagle_users', JSON.stringify(users));

        errorEl.innerText = '✓ REGISTRATION SUCCESSFUL — REDIRECTING';
        errorEl.className = 'success-msg';
        errorEl.classList.remove('hidden');

        setTimeout(() => window.location.replace('index.html'), 1500);
    }, 700);
}

// ==================== PASSWORD STRENGTH ====================
function checkPasswordStrength() {
    const pw = document.getElementById('reg-password')?.value || '';
    const bar = document.getElementById('strength-bar');
    if (!bar) return;

    if (pw.length === 0) { bar.className = 'strength-bar'; return; }
    if (pw.length < 5) { bar.className = 'strength-bar weak'; return; }
    if (pw.length < 8) { bar.className = 'strength-bar medium'; return; }
    bar.className = 'strength-bar strong';
}

// ==================== SHAKE KEYFRAME ====================
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
}`;
document.head.appendChild(style);
