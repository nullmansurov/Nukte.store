let ws;

function initializeWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Соединение уже установлено.');
        return;
    }

    ws = new WebSocket('wss://symposium-katrina-scratch-judy.trycloudflare.com');

    ws.onopen = function() {
        console.log('Соединение установлено');

        let isWebSocketOpen = true;
        const filterMessage = JSON.stringify({
            selectedRegions: selectedRegions,
            selectedTags: selectedTags,
            ...(searchQuery ? { searchQuery: searchQuery } : {})
        });

        ws.send(filterMessage);
    };

    ws.onerror = function(error) {
        console.error("Ошибка WebSocket:", error);
    };

    ws.onclose = function() {
        console.log('Соединение закрыто');
        isWebSocketOpen = false;
    };

        // Функция для добавления постов в массив, если их еще нет
    function addPostIfNotExists(newPost) {
        // Проверяем, существует ли пост уже в массиве
        const exists = posts.some(post => post.id === newPost.id);
        if (!exists) {
            posts.push(newPost);
        }
    }


    // Обработчик для сообщений WebSocket
    ws.onmessage = function(event) {
        try {
            const data = JSON.parse(event.data);

            // Проверяем тип данных для постов
            if (data.type === "post_data") {
                addPostIfNotExists(data.data);
                displayContent();
                ws.send("post_received");

            } else if (data.type === "image_data") {
                const imgSrc = `data:image/jpeg;base64,${btoa(data.data)}`;
                const postId = data.postId;

                // Сохраняем изображение в глобальный массив
                saveImageToGlobalArray(postId, imgSrc, 'post');

                // Отображаем изображение, если контейнер существует
                const postImageContainer = document.getElementById(`post-images-${postId}`);
                if (postImageContainer) {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    postImageContainer.appendChild(img);
                }

                displayContent(); // Обновляем отображение контента
                ws.send("image_received");
            } else {
                console.log("Неизвестный тип данных:", data);
            }
        } catch (error) {
            console.error("Ошибка при обработке сообщения:", error);
        }
    };
    }

// Запускаем первоначальное подключение
initializeWebSocket();

const posts = [];
const postImages = {};
let selectedRegion = 'all';
let selectedTag = 'all';
let searchQuery = '';


function displayContent() {
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = '';

    // Получаем массив постов и фильтруем его
    const filteredArray = filterContent(posts, sortOrder);
    const className = 'post-container';

    // Если нет постов, отображаем сообщение "Нет постов"
    if (filteredArray.length === 0) {
        const noPostsMessage = document.createElement('p');
        noPostsMessage.textContent = 'Ешқандай ұсыныстар табылмады';
        noPostsMessage.className = 'no-posts-message';
        contentList.appendChild(noPostsMessage);
        return;
    }

    // Проходим по отфильтрованным постам
    filteredArray.forEach((content, index) => {
        const listItem = document.createElement('li');
        listItem.className = className;

        // Добавляем содержимое поста
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
                <a href="https://${content.url}" target="_blank">Хабарласу</a>
            </div>
        `;

        const imageContainer = document.createElement('div');
        imageContainer.className = 'content-image-container';
        imageContainer.id = `carousel-${content.id}`;

        const carousel = document.createElement('div');
        carousel.className = 'image-carousel';
        carousel.id = `carousel-images-${content.id}`;

        // Получаем изображения для поста
        const images = postImages[content.id] || [];

        if (images.length === 0) {
            let nosuret = false
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

            // Добавляем навигационные кнопки для карусели, если больше одного изображения
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
                imageContainer.appendChild(rightButton);
            }

            imageContainer.appendChild(carousel);

            if (images.length === 1) {
                const singleImage = carousel.querySelector('img');
                singleImage.classList.add('single');
            }
        }

        // Добавляем посты и изображения в контейнер
        contentList.appendChild(listItem);
        if (images.length > 0 || index % 3 === 0) {
            contentList.appendChild(imageContainer);
        }
        contentList.appendChild(document.createElement('br'));

        // Обработка касаний для карусели
        let startX, startY;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchmove', (e) => {
            const moveX = e.touches[0].clientX - startX;
            const moveY = e.touches[0].clientY - startY;

            if (Math.abs(moveY) > Math.abs(moveX)) {
                return;
            }

            carousel.scrollLeft -= moveX;
            e.preventDefault();
        });
    });
}


function saveImageToGlobalArray(id, imgSrc, type) {
    if (type === 'post') {
        if (!postImages[id]) {
            postImages[id] = [];
        }
        // Проверяем, существует ли изображение уже в массиве
        const exists = postImages[id].some(existingImgSrc => existingImgSrc === imgSrc);
        if (!exists) {
            postImages[id].push(imgSrc); // Добавляем новое изображение, если его нет
        }
    }
}


// Вызов функции для отображения контента
displayContent();
