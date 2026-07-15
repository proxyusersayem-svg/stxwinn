document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.ledger-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            renderLedger(e.target.dataset.type);
        });
    });

    renderLedger('transactions');
});

function renderLedger(type) {
    const header = document.getElementById('history-header');
    const body = document.getElementById('history-body');
    body.innerHTML = '';

    if (type === 'transactions') {
        header.innerHTML = `
            <tr>
                <th>TxID</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Timestamp</th>
            </tr>
        `;
        const list = StorageManager.getItem(CONFIG.KEY_TRANSACTIONS) || [];
        list.reverse().forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.id}</td>
                <td><strong>${t.type}</strong></td>
                <td>${t.method}</td>
                <td>${Utils.formatCurrency(t.amount)}</td>
                <td>${t.dateTime}</td>
            `;
            body.appendChild(tr);
        });
    } else {
        header.innerHTML = `
            <tr>
                <th>BetID</th>
                <th>Period</th>
                <th>Target</th>
                <th>Wager</th>
                <th>Payout</th>
                <th>Timestamp</th>
            </tr>
        `;
        const list = StorageManager.getItem(CONFIG.KEY_BETS) || [];
        list.reverse().forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.id}</td>
                <td>${b.period}</td>
                <td>${b.target}</td>
                <td>${Utils.formatCurrency(b.amount)}</td>
                <td>${b.status === 'WON' ? Utils.formatCurrency(b.winAmount) : b.status}</td>
                <td>${b.dateTime}</td>
            `;
            body.appendChild(tr);
        });
    }
}
