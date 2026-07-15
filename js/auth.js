document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value;
            const users = StorageManager.getItem(CONFIG.KEY_USERS) || {};

            if (users[u] && users[u].password === p) {
                StorageManager.setItem(CONFIG.KEY_LOGGED_USER, { username: u, email: users[u].email });
                Toast.show("Welcome to STX WIN luxury lobby!", "success");
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                Toast.show("Access denied. Check inputs.", "error");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('reg-username').value.trim();
            const em = document.getElementById('reg-email').value.trim();
            const p = document.getElementById('reg-password').value;
            const users = StorageManager.getItem(CONFIG.KEY_USERS) || {};

            if (users[u]) {
                Toast.show("Username already registered.", "error");
                return;
            }

            users[u] = { email: em, password: p, balance: CONFIG.INIT_BALANCE };
            StorageManager.setItem(CONFIG.KEY_USERS, users);
            StorageManager.setItem(CONFIG.KEY_LOGGED_USER, { username: u, email: em });

            Toast.show("VIP Membership Activated successfully!", "success");
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        });
    }
});
