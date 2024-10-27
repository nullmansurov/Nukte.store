let deferredPrompt;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Показ модального окна для установки PWA
function showModal() {
    document.getElementById('pwa-modal').style.display = 'flex';
}

// Событие beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showModal(); // Отображаем модальное окно при событии
});

// Отображение модального окна через 30 секунд
setTimeout(() => {
    if (!localStorage.getItem('installApp')) {
        showModal();
    }
}, 30000);

// Обработка нажатия кнопки установки PWA
document.getElementById('AppBtn').onclick = () => {
    console.log('Кнопка установки нажата');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('Пользователь сделал выбор: ', choiceResult.outcome);
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил PWA');
                localStorage.setItem('installApp', 'true'); // Сохраняем, что пользователь установил приложение
            } else {
                console.log('Пользователь отклонил установку PWA');
            }
            deferredPrompt = null;
        });
    }
};

// Обработка нажатия кнопки закрытия модального окна
document.getElementById('closeBtn').onclick = function () {
    document.getElementById('pwa-modal').style.display = 'none'; // Закрытие модального окна
};

// Проверка при загрузке страницы, установлено ли приложение
window.onload = () => {
    if (localStorage.getItem('installApp') === 'true') {
        document.getElementById('pwa-modal').style.display = 'none';
    }
};
