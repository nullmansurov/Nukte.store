let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('pwa-modal').style.display = 'flex'; // Изменено
});

document.getElementById('AppBtn').onclick = () => {
    console.log('Кнопка установки нажата');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('Пользователь сделал выбор: ', choiceResult.outcome);
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил PWA');
            } else {
                console.log('Пользователь отклонил установку PWA');
            }
            deferredPrompt = null;
        });
    }
};

document.getElementById('closeBtn').onclick = function () {
    document.getElementById('pwa-modal').style.display = 'none'; // Изменено
};

window.onload = checkInstallApp;

function checkInstallApp() {
    const installApp = localStorage.getItem('installApp') === 'true';
    if (!installApp) {
        document.getElementById('pwa-modal').style.display = 'flex'; // Изменено
    }
}
