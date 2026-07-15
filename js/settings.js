document.addEventListener('DOMContentLoaded', () => {
    const sCheck = document.getElementById('settings-sound');
    const fCheck = document.getElementById('settings-fx');

    if (sCheck) {
        sCheck.checked = StorageManager.getItem('sett_audio', true);
        sCheck.addEventListener('change', (e) => {
            StorageManager.setItem('sett_audio', e.target.checked);
        });
    }

    if (fCheck) {
        fCheck.checked = StorageManager.getItem('sett_fx', true);
        fCheck.addEventListener('change', (e) => {
            StorageManager.setItem('sett_fx', e.target.checked);
        });
    }
});
