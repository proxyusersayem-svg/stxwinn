function updateInterfaceBalance() {
    const headerBal = document.getElementById('header-balance');
    const balVal = StorageManager.getBalance();
    if (headerBal) {
        headerBal.innerText = Utils.formatCurrency(balVal);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = StorageManager.getUser();
    if (user) {
        const uDisp = document.getElementById('user-display-name');
        if (uDisp) uDisp.innerText = user.username;
    } else {
        // Enforce active login redirect
        window.location.href = 'login.html';
    }
    updateInterfaceBalance();
});
