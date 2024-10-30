// Массив баннеров с их изображениями и ссылками
const banners = [
    { image: '/banners/banner1.jpg', link: 'https://example.com/banner1' },
    { image: '/banners/banner2.png', link: 'https://example.com/banner2' },
];

// Функция для выбора случайного баннера
function displayRandomBanner() {
    const container = document.querySelector('.ivent_banner');
    
    // Выбираем случайный баннер
    const randomIndex = Math.floor(Math.random() * banners.length);
    const selectedBanner = banners[randomIndex];

    // Создаем элемент изображения
    const img = document.createElement('img');
    img.src = selectedBanner.image;
    img.alt = 'Баннер';

    // Создаем элемент ссылки
    const link = document.createElement('a');
    link.href = selectedBanner.link;
    link.target = '_blank'; // Открыть ссылку в новой вкладке
    link.appendChild(img);

    // Очищаем контейнер и добавляем новый баннер
    container.innerHTML = '';
    container.appendChild(link);
}

displayRandomBanner();
