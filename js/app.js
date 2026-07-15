// Main Initialization and Marquee Engine for STX WIN Home
document.addEventListener('DOMContentLoaded', () => {
    // Hide Premium Loader after simulation loads
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }, 800);

    // Live Winner feed simulation
    const winnersMarquee = document.getElementById('winners-marquee');
    if (winnersMarquee) {
        const mockWinners = [
            { user: 'Vip_GamerX', win: 480, game: 'Wingo' },
            { user: 'Alex_Gold', win: 1250, game: 'Slots' },
            { user: 'CryptoKing', win: 880, game: 'Aviator' },
            { user: 'MasterTrader', win: 2400, game: 'Wingo' },
            { user: 'LadyLuck', win: 150, game: 'Slots' }
        ];

        winnersMarquee.innerHTML = mockWinners.map(item => `
            <span class="marquee-winner-pill">
                <i class="fas fa-trophy font-gold"></i> 
                <strong>${item.user}</strong> won 
                <span class="text-success">${Utils.formatCurrency(item.win)}</span> on ${item.game}!
            </span>
        `).join('&nbsp;&nbsp;|&nbsp;&nbsp;');
    }

    // Interactive progressive jackpot count generator
    const jackpotDisp = document.getElementById('jackpot-counter');
    if (jackpotDisp) {
        let countVal = 1482903.00;
        setInterval(() => {
            countVal += Math.random() * 25;
            jackpotDisp.innerText = Utils.formatCurrency(countVal);
        }, 3000);
    }

    // Dynamic Header auth conditional
    const navAuth = document.getElementById('nav-auth');
    const user = StorageManager.getUser();
    if (user && navAuth) {
        navAuth.innerHTML = `
            <a href="dashboard.html" class="btn btn-outline-gold"><i class="fas fa-gamepad"></i> Play Room</a>
            <a href="profile.html" class="btn btn-gold"><i class="fas fa-user-circle"></i> Profile</a>
        `;
    }

    const claimDaily = document.getElementById('claim-daily-btn');
    if (claimDaily) {
        claimDaily.addEventListener('click', () => {
            if(!user) {
                Toast.show("Please log in to claim daily benefits.", "error");
                return;
            }
            const currentBal = StorageManager.getBalance();
            StorageManager.updateBalance(currentBal + 5.00);
            Toast.show("Claimed daily premium award of $5.00!", "success");
            updateInterfaceBalance();
        });
    }
});
