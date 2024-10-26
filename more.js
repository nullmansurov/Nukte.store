// Функция для прокрутки карусели с кнопками
function scrollCarousel(carousel, direction) {
    const scrollAmount = carousel.offsetWidth * 0.9; // Прокручиваем на 90% ширины карусели
    if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Функция для открытия изображения на весь экран
function openModal(imgSrc) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay active';
    
    const modalImage = document.createElement('img');
    modalImage.src = imgSrc;
    modalImage.className = 'modal-image';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.textContent = 'Жабу';
    closeButton.addEventListener('click', () => modalOverlay.remove());

    modalOverlay.appendChild(modalImage);
    modalOverlay.appendChild(closeButton);
    document.body.appendChild(modalOverlay);
}