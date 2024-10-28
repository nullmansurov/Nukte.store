const ws = new WebSocket('wss://fexing.online:8715');

const posts = [];
const ivents = [];
let displayPostsFlag = true;
let selectedRegion = 'all';
let selectedTag = 'all';

const postImages = {}; // Глобальный объект для хранения изображений постов
const iventImages = {}; // Глобальный объект для хранения изображений ивентов

function displayContent() {
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = '';

    const contentArray = displayPostsFlag ? posts : ivents;
    const filteredArray = filterContent(contentArray);
    const className = displayPostsFlag ? 'post-container' : 'ivent-container';

    filteredArray.forEach(content => {
        const listItem = document.createElement('li');
        listItem.className = className;

        listItem.innerHTML = `
            <div class="content-title">${content.title}</div>
            <div class="content-description">${content.description}</div><br>
            <div class="content-location">
                <img src="icons/geo.png" alt="Location" class="icon" />
                ${content.where}
            </div>
            <div class="content-tags">${content.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join(', ')}</div>
            <div class="content-contact">
                <img src="icons/phone.png" alt="Contact" class="icon" />
                <a href="${content.url}" target="_blank">Хабарласу</a>
            </div><br>
        `;

        const imageContainer = document.createElement('div');
        imageContainer.className = 'content-image-container';
        imageContainer.id = `carousel-${content.id}`;

        const carousel = document.createElement('div');
        carousel.className = 'image-carousel';
        carousel.id = `carousel-images-${content.id}`;

        const images = displayPostsFlag ? postImages[content.id] || [] : iventImages[content.id] || [];

        if (images.length === 0) {
            const noImageMessage = document.createElement('p');
            imageContainer.appendChild(noImageMessage);
        } else {
            images.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = content.title;
                img.className = 'content-image';
                img.id = `p_image_${content.id}_${index}`;

                img.addEventListener('click', () => openModal(imgSrc));

                carousel.appendChild(img);
            });

            if (images.length === 1) {
                const singleImage = carousel.querySelector('img');
                singleImage.classList.add('single');
            }

            if (images.length > 1) {
                const leftButton = document.createElement('button');
                leftButton.className = 'carousel-button carousel-button-left';
                leftButton.innerHTML = '&#8249;';
                leftButton.addEventListener('click', () => scrollCarousel(carousel, 'left'));

                const rightButton = document.createElement('button');
                rightButton.className = 'carousel-button carousel-button-right';
                rightButton.innerHTML = '&#8250;';
                rightButton.addEventListener('click', () => scrollCarousel(carousel, 'right'));

                imageContainer.appendChild(leftButton);
                imageContainer.appendChild(carousel);
                imageContainer.appendChild(rightButton);
            } else {
                imageContainer.appendChild(carousel);
            }
        }

        contentList.appendChild(listItem);
        contentList.appendChild(imageContainer);
        contentList.appendChild(document.createElement('br'));

        let startX, startY;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchmove', (e) => {
            const moveX = e.touches[0].clientX - startX;
            const moveY = e.touches[0].clientY - startY;

            // Если перемещение по оси Y больше, чем по оси X, не блокируем прокрутку
            if (Math.abs(moveY) > Math.abs(moveX)) {
                return; // Позволяем прокрутку страницы
            }

            // В противном случае, прокручиваем карусель
            carousel.scrollLeft -= moveX;
            e.preventDefault(); // Предотвращаем стандартное поведение прокрутки
        });
    });
}




ws.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);

        if (data.type === "post_data") {
            posts.push(data.data);
            if (displayPostsFlag) displayContent();
            ws.send("post_received");
        } else if (data.type === "ivent_data") {
            ivents.push(data.data);
            if (!displayPostsFlag) displayContent();
            ws.send("ivent_received");
        } else if (data.type === "image_data") {
            const imgSrc = `data:image/jpeg;base64,${btoa(data.data)}`;
            const postId = data.postId;
            const iventId = data.iventId;

            // Сохраняем изображение в глобальный массив
            saveImageToGlobalArray(postId, imgSrc, 'post');
            saveImageToGlobalArray(iventId, imgSrc, 'ivent');

            // Отображаем изображение, если контейнер существует
            const postImageContainer = document.getElementById(`post-images-${postId}`);
            if (postImageContainer) {
                const img = document.createElement('img');
                img.src = imgSrc;
                postImageContainer.appendChild(img);
            }
            const iventImageContainer = document.getElementById(`ivent-images-${iventId}`);
            if (iventImageContainer) {
                const img = document.createElement('img');
                img.src = imgSrc;
                iventImageContainer.appendChild(img);
            }

            displayContent()
            ws.send("image_received");
        } else {
            console.log("Неизвестный тип данных:", data);
        }
    } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
    }
};

function saveImageToGlobalArray(id, imgSrc, type) {
    if (type === 'post') {
        if (!postImages[id]) {
            postImages[id] = []; // Инициализируем массив, если его нет
        }
        postImages[id].push(imgSrc); // Добавляем новое изображение
    } else if (type === 'ivent') {
        if (!iventImages[id]) {
            iventImages[id] = []; // Инициализируем массив, если его нет
        }
        iventImages[id].push(imgSrc); // Добавляем новое изображение
    }
}

ws.onopen = function() {
    console.log('Соединение установлено');
    
    const filterMessage = JSON.stringify({
        selectedRegions: selectedRegions,
        selectedTags: selectedTags
    });

    ws.send(filterMessage);
};

ws.onerror = function(error) {
    console.error("Ошибка WebSocket:", error);
};

ws.onclose = function() {
    console.log('Соединение закрыто');
};

displayContent();