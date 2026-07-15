let currentActiveBetTarget = null;
let currentTimerInstance = null;
let currentPeriodDuration = 30;

function switchPeriod(duration) {
    currentPeriodDuration = parseInt(duration);
    document.querySelectorAll('.time-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-period="${duration}"]`).classList.add('active');
    initWingoGame();
}

function initWingoGame() {
    if (currentTimerInstance) currentTimerInstance.stop();
    generateFakePeriodID();
    
    currentTimerInstance = new CountdownTimer(
        currentPeriodDuration,
        (timeStr, secondsLeft) => {
            document.getElementById('wingo-timer').innerText = timeStr;
            if (secondsLeft <= 3) {
                disableBettingBoard();
            }
        },
        () => {
            resolveWingoRound();
        }
    );
    currentTimerInstance.start();
    enableBettingBoard();
}

function generateFakePeriodID() {
    const d = new Date();
    const periodStr = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}${Math.floor(Math.random() * 10000).toString().padStart(4,'0')}`;
    document.getElementById('current-period-id').innerText = periodStr;
}

function openBettingModal(target) {
    currentActiveBetTarget = target;
    document.getElementById('modal-target-title').innerText = `Place Bet on: ${target}`;
    document.getElementById('betting-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('betting-modal').style.display = 'none';
}

function disableBettingBoard() {
    document.querySelector('.betting-board').style.opacity = '0.5';
    document.querySelector('.betting-board').style.pointerEvents = 'none';
}

function enableBettingBoard() {
    document.querySelector('.betting-board').style.opacity = '1';
    document.querySelector('.betting-board').style.pointerEvents = 'all';
}

function resolveWingoRound() {
    const outcome = GameLogic.generatePeriodResult();
    const resultsBody = document.getElementById('wingo-results-body');
    const periodID = document.getElementById('current-period-id').innerText;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${periodID}</td>
        <td><strong class="font-gold">${outcome.number}</strong></td>
        <td>${outcome.size}</td>
        <td><span class="outcome-dot color-${outcome.color.toLowerCase()}">${outcome.color}</span></td>
    `;
    resultsBody.insertBefore(row, resultsBody.firstChild);
    
    // Auto payout execution for demo user session
    processPayoutEvaluation(outcome);
    initWingoGame();
}

function processPayoutEvaluation(outcome) {
    const activeBets = StorageManager.getItem(CONFIG.KEY_BETS) || [];
    const userBalance = StorageManager.getBalance();
    const activePeriod = document.getElementById('current-period-id').innerText;

    activeBets.forEach(bet => {
        if(bet.period === activePeriod && bet.status === 'PENDING') {
            let won = false;
            let winAmt = 0;
            if(bet.target === outcome.color || bet.target === outcome.size || bet.target == outcome.number) {
                won = true;
                winAmt = bet.amount * 1.95; // Pay out 1.95x standard odds
            }
            bet.status = won ? 'WON' : 'LOST';
            bet.winAmount = won ? winAmt : 0;
            
            if(won) {
                StorageManager.updateBalance(userBalance + winAmt);
                Toast.show(`Congratulations! You won ${Utils.formatCurrency(winAmt)}!`, "success");
            } else {
                Toast.show(`Better luck next time! Bet on ${bet.target} lost.`, "error");
            }
        }
    });
    StorageManager.setItem(CONFIG.KEY_BETS, activeBets);
    updateInterfaceBalance();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.time-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchPeriod(e.target.dataset.period));
    });

    document.querySelectorAll('.amt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('bet-input').value = e.target.dataset.amt;
        });
    });

    document.getElementById('confirm-bet-btn').addEventListener('click', () => {
        const betAmt = parseFloat(document.getElementById('bet-input').value);
        const currentBalance = StorageManager.getBalance();
        
        if (betAmt > currentBalance) {
            Toast.show("Insufficient VIP balance reserves.", "error");
            return;
        }

        const activeBets = StorageManager.getItem(CONFIG.KEY_BETS) || [];
        activeBets.push({
            id: Utils.generateID('BET'),
            period: document.getElementById('current-period-id').innerText,
            target: currentActiveBetTarget,
            amount: betAmt,
            status: 'PENDING',
            dateTime: Utils.getDateTimeString()
        });

        StorageManager.updateBalance(currentBalance - betAmt);
        StorageManager.setItem(CONFIG.KEY_BETS, activeBets);
        updateInterfaceBalance();
        closeModal();
        Toast.show("Bet secured on premium pool!", "success");
    });

    initWingoGame();
});
