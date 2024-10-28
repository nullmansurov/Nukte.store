let deferredPrompt;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('https://nullmansurov.github.io/nukte/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Показ модального окна для установки PWA
function showPwaModal() {
    document.getElementById('pwa-modal').style.display = 'flex';
}

// Событие beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!localStorage.getItem('installApp') || localStorage.getItem('installApp') === 'false') {
        showPwaModal();
    }
});

// Отображение модального окна через 30 секунд
setTimeout(() => {
    if (!localStorage.getItem('installApp')) {
        showPwaModal();
    }
}, 30000);

document.getElementById('AppBtn').onclick = () => {
    console.log('Кнопка установки нажата');
    document.getElementById('pwa-modal').style.display = 'none';
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('Пользователь сделал выбор: ', choiceResult.outcome);
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил PWA');
                localStorage.setItem('installApp', 'true'); // Устанавливаем в true при успешной установке
            } else {
                console.log('Пользователь отклонил установку PWA');
                localStorage.setItem('installApp', 'false'); // Ставим false, если отклонено
            }
            deferredPrompt = null;
        });
    }
};

document.getElementById('closeBtn').onclick = function () {
    document.getElementById('pwa-modal').style.display = 'none';
};

// Проверяем, установлено ли приложение
function checkInstallApp() {
    if (localStorage.getItem('installApp') === 'true') {
        console.log('Бағдарлама орнатылған');
    } else {
        showPwaModal();
    }
}

window.onload = () => {
    checkInstallApp();
};
