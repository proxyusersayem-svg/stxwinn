const StorageManager = {
    getItem(key, fallback = null) {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        try { return JSON.parse(item); } catch (e) { return item; }
    },
    setItem(key, value) {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    },
    getUser() {
        return this.getItem(CONFIG.KEY_LOGGED_USER);
    },
    getBalance() {
        const user = this.getUser();
        if (!user) return 0;
        const users = this.getItem(CONFIG.KEY_USERS) || {};
        return users[user.username] ? users[user.username].balance : 0;
    },
    updateBalance(newBalance) {
        const user = this.getUser();
        if (!user) return;
        const users = this.getItem(CONFIG.KEY_USERS) || {};
        if (users[user.username]) {
            users[user.username].balance = Math.max(0, parseFloat(newBalance));
            this.setItem(CONFIG.KEY_USERS, users);
        }
    }
};
