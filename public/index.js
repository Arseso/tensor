document.addEventListener('DOMContentLoaded', function() {

    const API_KEY = 'c9cf057346427d330c85d164987c01e1';
    const API_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
    

    const ARTISTS_LIMIT = 14;
    const TRACKS_LIMIT = 21;

    initApp();

    function initApp() {
        Promise.all([
            fetchData('chart.gettopartists', ARTISTS_LIMIT),
            fetchData('chart.gettoptracks', TRACKS_LIMIT)
        ]).catch(handleGlobalError);
    }

    function fetchData(method, limit) {
        const url = `${API_BASE_URL}?method=${method}&api_key=${API_KEY}&format=json&limit=${limit}`;
        
        return fetch(url)
            .then(handleResponse)
            .then(data => {
                const items = data?.[method === 'chart.gettopartists' ? 'artists' : 'tracks']?.artist || 
                             data?.[method === 'chart.gettoptracks' ? 'tracks' : 'artists']?.track;
                
                if (!items || items.length === 0) {
                    throw new Error(`No ${method.includes('artists') ? 'artists' : 'tracks'} data received`);
                }

                return {
                    type: method.includes('artists') ? 'artists' : 'tracks',
                    data: items
                };
            })
            .then(renderItems)
            .catch(error => {
                console.error(`Error loading ${method.includes('artists') ? 'artists' : 'tracks'}:`, error);
                renderError(
                    `.${method.includes('artists') ? 'artists' : 'tracks'}-grid`, 
                    `Failed to load ${method.includes('artists') ? 'artists' : 'tracks'}. Please try again later.`
                );
                throw error;
            });
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function renderItems({type, data}) {
        const container = document.querySelector(`.${type}-grid`);
        if (!container) return;

        container.innerHTML = data.map(item => {
            const isArtist = type === 'artists';
            const imageSize = isArtist ? 'medium' : 'large';
            const imageUrl = item.image?.find(img => img.size === imageSize)?.['#text'] || 
                          `img/${type}/default.png`;
            
            const genres = item.tags?.tag?.slice(0, 3) || [];
            const genresHtml = genres.length > 0 
                ? genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')
                : '<span class="genre-tag">Various genres</span>';

            if (isArtist) {
                return `
                    <article class="artist-card">
                        <a href="${item.url}" class="artist-link" target="_blank" rel="noopener noreferrer">
                            <img src="${imageUrl}" 
                                 alt="${item.name}" 
                                 class="artist-image"
                                 onerror="this.src='img/artists/default.png'">
                        </a>
                        <h3 class="artist-name">${item.name}</h3>
                        <div class="genre-tags">${genresHtml}</div>
                    </article>
                `;
            } else {
                return `
                    <article class="track-card">
                        <a href="${item.url}" class="track-link" target="_blank" rel="noopener noreferrer">
                            <img src="${imageUrl}" 
                                 alt="${item.name}" 
                                 class="track-cover"
                                 onerror="this.src='img/tracks/default.png'">
                        </a>
                        <div class="track-details">
                            <h3 class="track-title">${item.name}</h3>
                            <p class="track-artist">${item.artist.name}</p>
                            <div class="genre-tags">${genresHtml}</div>
                        </div>
                    </article>
                `;
            }
        }).join('');
    }

    function renderError(containerSelector, message) {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                    <button class="retry-btn">Retry</button>
                </div>
            `;
            

            container.querySelector('.retry-btn')?.addEventListener('click', initApp);
        }
    }

    function handleGlobalError(error) {
        console.error('Application error:', error);
    }
});