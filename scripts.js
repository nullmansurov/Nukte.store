// Создаем модальное окно
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const titleRegions = document.createElement('h3');
    titleRegions.textContent = 'Қажетті аумақтарды таңдаңыз';
    
    const regions = document.createElement('div');
    regions.id = 'regions';
    regions.innerHTML = `
        <label><input type="checkbox" value="Шардара"> Шардара</label>
        <label><input type="checkbox" value="Ақалтын"> Ақалтын</label>
        <label><input type="checkbox" value="Достық"> Достық</label>
    `;

    const titleTags = document.createElement('h3');
    titleTags.textContent = 'Тақырыпты таңдаңыз';

    const tags = document.createElement('div');
    tags.id = 'tags';
    tags.innerHTML = `
        <label><input type="checkbox" value="Логистика"> Логистика</label>
        <label><input type="checkbox" value="Ауыл шаруашылығы"> Ауыл шаруашылығы</label>
        <label><input type="checkbox" value="Мал шаруашылығы"> Мал шаруашылығы</label>
    `;

    const applyButton = document.createElement('button');
    applyButton.id = 'modal-apply-filters';
    applyButton.textContent = 'Сақтау';

    const clearButton = document.createElement('button');
    clearButton.id = 'modal-clear-filters';
    clearButton.textContent = 'Бәрін өшіру';

    const closeButton = document.createElement('button');
    closeButton.id = 'modal-close';
    closeButton.textContent = 'Жабу';

    // Собираем все элементы
    modalContent.appendChild(titleRegions);
    modalContent.appendChild(regions);
    modalContent.appendChild(titleTags);
    modalContent.appendChild(tags);
    modalContent.appendChild(applyButton);
    modalContent.appendChild(clearButton);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    
    // Добавляем модальное окно в body
    document.body.appendChild(modal);
}

// Вызов функции для создания модального окна
createModal();

let selectedRegions = JSON.parse(localStorage.getItem('selectedRegions')) || []; // Загружаем регионы из localStorage
let selectedTags = JSON.parse(localStorage.getItem('selectedTags')) || []; // Загружаем теги из localStorage

function filterContent(contentArray) {
    return contentArray.filter(item => {
        // Преобразуем теги в массив, если они не являются массивом
        const tags = Array.isArray(item.tags) ? item.tags : item.tags.split(',');

        // Проверяем наличие совпадений по регионам и тегам
        const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
        const matchesTag = selectedTag === 'all' || tags.some(tag => tag === selectedTag);

        return matchesRegion && matchesTag;
    });
}

function showModal() {
    document.getElementById('modal').style.display = 'flex';
    setCheckboxStates(); // Устанавливаем состояния чекбоксов при открытии модального окна
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    location.reload();
}

// События для кнопок в модальном окне
document.getElementById('modal-apply-filters').onclick = function() {
    applyFiltersFromModal();
    closeModal();
};

document.getElementById('modal-clear-filters').onclick = function() {
    clearFiltersFromModal();
};

document.getElementById('modal-close').onclick = function() {
    closeModal();
};

// Функция для установки состояний чекбоксов
function setCheckboxStates() {
    const regionCheckboxes = document.querySelectorAll('#regions input[type="checkbox"]');
    const tagCheckboxes = document.querySelectorAll('#tags input[type="checkbox"]');

    regionCheckboxes.forEach(checkbox => {
        checkbox.checked = selectedRegions.includes(checkbox.value);
    });
    
    tagCheckboxes.forEach(checkbox => {
        checkbox.checked = selectedTags.includes(checkbox.value);
    });
}

// Функция для применения фильтров из модального окна
function applyFiltersFromModal() {
    selectedRegions = Array.from(document.querySelectorAll('#regions input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    selectedTags = Array.from(document.querySelectorAll('#tags input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    localStorage.setItem('selectedRegions', JSON.stringify(selectedRegions)); // Сохраняем регионы в localStorage
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags)); // Сохраняем теги в localStorage

    displayContent();
}

// Функция для сброса фильтров из модального окна
function clearFiltersFromModal() {
    document.querySelectorAll('#regions input[type="checkbox"], #tags input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    selectedRegions = [];
    selectedTags = [];
    localStorage.removeItem('selectedRegions'); // Удаляем регионы из localStorage
    localStorage.removeItem('selectedTags'); // Удаляем теги из localStorage
    displayContent();
}

// Проверяем наличие фильтров при загрузке страницы
setCheckboxStates(); // Устанавливаем состояния чекбоксов перед показом модального окна

// Показываем модальное окно только если нет сохранённых тегов и регионов
if (selectedRegions.length === 0) {
    showModal();
}

// Изменение обработчиков событий для кнопок
document.getElementById('show-posts').onclick = function() {
    displayPostsFlag = true;
    displayContent(); // Не открываем модальное окно, просто отображаем контент
};

document.getElementById('show-ivents').onclick = function() {
    displayPostsFlag = false;
    displayContent(); // Не открываем модальное окно, просто отображаем контент
};

document.getElementById('show-filters').onclick = function() {
    showModal(); // Открываем модальное окно при нажатии на кнопку "Жазылымдар"
};

// Изменение обработчиков событий для кнопок
document.getElementById('show-posts-mobile').onclick = function() {
    displayPostsFlag = true;
    displayContent(); // Не открываем модальное окно, просто отображаем контент
};

document.getElementById('show-ivents-mobile').onclick = function() {
    displayPostsFlag = false;
    displayContent(); // Не открываем модальное окно, просто отображаем контент
};

document.getElementById('show-filters-mobile').onclick = function() {
    showModal(); // Открываем модальное окно
};
