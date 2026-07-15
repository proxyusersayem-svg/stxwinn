const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    generateID(prefix = 'STX') {
        return `${prefix}${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    },
    getDateTimeString() {
        const date = new Date();
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
};
