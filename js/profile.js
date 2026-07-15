document.addEventListener('DOMContentLoaded', () => {
    const user = StorageManager.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('profile-username').innerText = user.username;
    document.getElementById('profile-email').value = user.email;

    const logout = document.getElementById('logout-btn');
    if (logout) {
        logout.addEventListener('click', () => {
            StorageManager.setItem(CONFIG.KEY_LOGGED_USER, null);
            Toast.show("Securely logged out.", "success");
            setTimeout(() => window.location.href = 'index.html', 1500);
        });
    }

    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('profile-new-pass').value;
            if (newPass) {
                const users = StorageManager.getItem(CONFIG.KEY_USERS);
                users[user.username].password = newPass;
                StorageManager.setItem(CONFIG.KEY_USERS, users);
                Toast.show("Security profile keys rewritten successfully.", "success");
            } else {
                Toast.show("Information synchronized.", "success");
            }
        });
    }
});
