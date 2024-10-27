let deferredPrompt;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('https://nullmansurov.github.io/nukte.github.io/service-worker.js')
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
    showPwaModal(); // Отображаем модальное окно при событии
});

// Отображение модального окна через 30 секунд
setTimeout(() => {
    if (!localStorage.getItem('installApp')) {
        showPwaModal();
    }
}, 30000);

document.getElementById('AppBtn').onclick = () => {
    console.log('Кнопка установки нажата');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('Пользователь сделал выбор: ', choiceResult.outcome);
            if (choiceResult.outcome === 'accepted') {
                localStorage.setItem('installApp', 'false');
                document.getElementById('pwa-modal').style.display = 'none';
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

function checkInstallApp() {
    // Проверяем, существует ли ключ installApp в localStorage
    if (localStorage.getItem('installApp') === null) {
        // Если не существует, создаем его и устанавливаем значение true
        localStorage.setItem('installApp', 'true');
        // Показываем модальное окно, так как приложение только что было установлено
        document.getElementById('pwa-modal').style.display = 'flex';
    } else if (localStorage.getItem('installApp') === 'true') {
        // Если значение true, показываем модальное окно
        document.getElementById('pwa-modal').style.display = 'flex';
    }
    // Если значение false, ничего не делаем
}

window.onload = () => {
    checkInstallApp();
};
