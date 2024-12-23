let selectedRegions = JSON.parse(localStorage.getItem('selectedRegions')) || []; // Загружаем регионы из localStorage
let selectedTags = JSON.parse(localStorage.getItem('selectedTags')) || []; // Загружаем теги из localStorage

let sortOrder = "newest"; // Значение сортировки по умолчанию

function filterContent(contentArray, sortOrder = "newest") {
    const filteredContent = contentArray.filter(item => {
        const tags = Array.isArray(item.tags) ? item.tags : item.tags.split(',');
        const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
        const matchesTag = selectedTag === 'all' || tags.some(tag => tag === selectedTag);
        return matchesRegion && matchesTag;
    });

    // Сортировка по новизне
    if (sortOrder === "newest") {
        return filteredContent.sort((a, b) => b.id - a.id);
    } else {
        return filteredContent.sort((a, b) => a.id - b.id);
    }
}

document.getElementById("newestBtn").addEventListener("click", () => {
    sortOrder = "newest";
    displayContent();
});

document.getElementById("oldestBtn").addEventListener("click", () => {
    sortOrder = "oldest";
    displayContent();
});

document.getElementById('search-button').onclick = function() {
    ws.close();
    searchQuery = document.getElementById('search-input').value;
    posts.length = 0;
    Object.keys(postImages).forEach(key => delete postImages[key]); // Очистка объекта postImages
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = ''; // Очищаем содержимое списка постов
    initializeWebSocket();
};

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

document.getElementById('show-filters').onclick = function() {
    showModal(); // Открываем модальное окно при нажатии на кнопку "Жазылымдар"
};

document.getElementById('show-filters-mobile').onclick = function() {
    showModal(); // Открываем модальное окно

};

    document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown-content');
    const button = document.querySelector('.dropdown-button');
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

document.querySelector('.dropdown-button').addEventListener('click', function() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

