document.addEventListener('DOMContentLoaded', () => {
    // Make sure user is logged in
    const user = StorageManager.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Rate: 1 USD = 120 BDT
    const CONVERSION_RATE = 120;
    const RECEIVER_BKASH_NUMBER = '01860909272';

    updateInterfaceBalance();

    const copyBtn = document.getElementById('copy-bkash-num');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(RECEIVER_BKASH_NUMBER).then(() => {
                Toast.show("Admin bKash number copied to clipboard!", "success");
            }).catch(() => {
                Toast.show("Copy failed. Please manually note down the number.", "error");
            });
        });
    }

    // Realtime conversion display calculation
    const depositAmtInput = document.getElementById('deposit-amount-bdt');
    const usdEquivalentDisp = document.getElementById('usd-equivalent');
    if (depositAmtInput && usdEquivalentDisp) {
        depositAmtInput.addEventListener('input', (e) => {
            const bdtAmt = parseFloat(e.target.value) || 0;
            const usdEquivalent = bdtAmt / CONVERSION_RATE;
            usdEquivalentDisp.innerText = usdEquivalent.toFixed(2);
        });
    }

    const depositForm = document.getElementById('deposit-form');
    if (depositForm) {
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bdtAmt = parseFloat(document.getElementById('deposit-amount-bdt').value);
            const senderNumber = document.getElementById('sender-number').value.trim();
            const transactionId = document.getElementById('transaction-id').value.trim();

            if (isNaN(bdtAmt) || bdtAmt < 500) {
                Toast.show("Minimum deposit amount via bKash is 500 BDT.", "error");
                return;
            }

            // Check standard phone structure
            if (!/^01[3-9]\d{8}$/.test(senderNumber)) {
                Toast.show("Enter a valid 11-digit Bangladeshi mobile number.", "error");
                return;
            }

            // Verify basic TxID character length requirements (usually 8-10 alphanumeric characters)
            if (transactionId.length < 8) {
                Toast.show("Please enter a valid 10-character bKash Transaction ID (TrxID).", "error");
                return;
            }

            const currentBal = StorageManager.getBalance();
            const usdCredited = bdtAmt / CONVERSION_RATE;
            const transactions = StorageManager.getItem(CONFIG.KEY_TRANSACTIONS) || [];

            const newTx = {
                id: Utils.generateID('DEP'),
                type: 'DEPOSIT',
                method: `bKash (From: ${senderNumber})`,
                amount: usdCredited,
                dateTime: Utils.getDateTimeString(),
                status: 'COMPLETED'
            };

            transactions.push(newTx);
            StorageManager.setItem(CONFIG.KEY_TRANSACTIONS, transactions);
            StorageManager.updateBalance(currentBal + usdCredited);

            Toast.show(`Successfully deposited ${Utils.formatCurrency(usdCredited)} (${bdtAmt} BDT)!`, "success");
            
            setTimeout(() => {
                window.location.href = 'wallet.html';
            }, 1800);
        });
    }
});
