document.addEventListener('DOMContentLoaded', () => {
    const user = StorageManager.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const CONVERSION_RATE = 120;
    updateInterfaceBalance();

    // Gateway Selection Interactions
    const gatewayOptions = document.querySelectorAll('.gateway-option');
    const selectedGatewayInput = document.getElementById('withdraw-method-selected');
    const destinationLabel = document.getElementById('destination-field-label');
    const destinationInput = document.getElementById('withdraw-destination');

    gatewayOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            gatewayOptions.forEach(o => o.classList.remove('active'));
            const currentOption = e.currentTarget;
            currentOption.classList.add('active');
            
            const selectedVal = currentOption.dataset.gateway;
            selectedGatewayInput.value = selectedVal;

            if (selectedVal === 'bKash' || selectedVal === 'Nagad') {
                destinationLabel.innerText = `${selectedVal} Personal Mobile Number`;
                destinationInput.placeholder = "e.g. 01XXXXXXXXX";
            } else {
                destinationLabel.innerText = "USDT (TRC20) Wallet Address";
                destinationInput.placeholder = "e.g. Txxxxxxxxxxxxxxxxxxxxxx";
            }
        });
    });

    // Realtime conversion check
    const withdrawAmtInput = document.getElementById('withdraw-amount-bdt');
    const usdCostDisp = document.getElementById('usd-cost-equivalent');
    if (withdrawAmtInput && usdCostDisp) {
        withdrawAmtInput.addEventListener('input', (e) => {
            const bdtAmt = parseFloat(e.target.value) || 0;
            const usdNeeded = bdtAmt / CONVERSION_RATE;
            usdCostDisp.innerText = usdNeeded.toFixed(2);
        });
    }

    const withdrawForm = document.getElementById('withdraw-form');
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bdtAmt = parseFloat(document.getElementById('withdraw-amount-bdt').value);
            const destination = destinationInput.value.trim();
            const gateway = selectedGatewayInput.value;
            const currentBal = StorageManager.getBalance();

            if (isNaN(bdtAmt) || bdtAmt < 1000) {
                Toast.show("Minimum VIP withdrawal limit is 1000 BDT.", "error");
                return;
            }

            const usdDebitValue = bdtAmt / CONVERSION_RATE;
            if (usdDebitValue > currentBal) {
                Toast.show("Insufficient balance reserves in your wallet.", "error");
                return;
            }

            if (gateway === 'bKash' || gateway === 'Nagad') {
                if (!/^01[3-9]\d{8}$/.test(destination)) {
                    Toast.show(`Enter a valid 11-digit ${gateway} phone number.`, "error");
                    return;
                }
            } else {
                if (destination.length < 24) {
                    Toast.show("Please enter a valid crypto TRC20 wallet address.", "error");
                    return;
                }
            }

            const transactions = StorageManager.getItem(CONFIG.KEY_TRANSACTIONS) || [];
            const newTx = {
                id: Utils.generateID('WD'),
                type: 'WITHDRAWAL',
                method: `${gateway} (${destination.slice(0, 4)}...${destination.slice(-4)})`,
                amount: usdDebitValue,
                dateTime: Utils.getDateTimeString(),
                status: 'PENDING'
            };

            transactions.push(newTx);
            StorageManager.setItem(CONFIG.KEY_TRANSACTIONS, transactions);
            StorageManager.updateBalance(currentBal - usdDebitValue);

            Toast.show(`Withdrawal request of ${bdtAmt} BDT (${Utils.formatCurrency(usdDebitValue)}) registered.`, "success");
            
            setTimeout(() => {
                window.location.href = 'wallet.html';
            }, 1800);
        });
    }
});
