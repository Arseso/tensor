document.addEventListener('DOMContentLoaded', () => {
  const MusicSearchApp = {
    config: {
      apiKey: 'c9cf057346427d330c85d164987c01e1',
      baseUrl: 'https://ws.audioscrobbler.com/2.0/',
      defaultImage: 'img/default.png',
      playIcon: 'img/icons/play_dark.png',
      initialQuery: 'never gonna give you up',

      limits: {
        artists: 14,
        albums: 14,
        tracks: 10
      }
    },

    elements: {
      searchForm: document.getElementById('searchForm'),
      searchField: document.querySelector('.search-field'),
      searchTitle: document.querySelector('.search-title'),
      artistGrid: document.querySelector('.artist-grid'),
      albumGrid: document.querySelector('.album-grid'),
      trackList: document.querySelector('.track-list'),
      clearBtn: document.querySelector('.clear-btn')
    },

    init() {
      this.setupEventListeners();
      this.performSearch(this.config.initialQuery);
    },

    setupEventListeners() {
      this.elements.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSearch();
      });

      this.elements.clearBtn.addEventListener('click', () => {
        this.clearSearch();
      });
    },

    handleSearch() {
      const query = this.elements.searchField.value.trim();
      if (query) {
        this.updateSearchTitle(query);
        this.performSearch(query);
      }
    },

    updateSearchTitle(query) {
      this.elements.searchTitle.textContent = `Search results for "${query}"`;
    },

    clearSearch() {
      this.elements.searchField.value = '';
      this.elements.searchField.focus();
    },

    performSearch(query) {
      this.showLoadingStates();
      this.executeSearches(query);
    },

    showLoadingStates() {
      const loadingHTML = '<div class="loading">Loading...</div>';
      this.elements.artistGrid.innerHTML = loadingHTML;
      this.elements.albumGrid.innerHTML = loadingHTML;
      this.elements.trackList.innerHTML = loadingHTML;
    },

    executeSearches(query) {
      Promise.all([
        this.searchArtists(query),
        this.searchAlbums(query),
        this.searchTracks(query)
      ]).catch(error => {
        console.error('Search error:', error);
      });
    },

    async searchArtists(query) {
      try {
        const url = this.buildUrl('artist.search', { artist: query }, this.config.limits.artists);
        const data = await this.fetchData(url);
        const artists = data?.results?.artistmatches?.artist;
        
        artists?.length 
          ? this.renderArtists(artists) 
          : this.showNoResults(this.elements.artistGrid, 'artists');
      } catch (error) {
        this.showError(this.elements.artistGrid, 'artists', error);
      }
    },

    async searchAlbums(query) {
      try {
        const url = this.buildUrl('album.search', { album: query }, this.config.limits.albums);
        const data = await this.fetchData(url);
        const albums = data?.results?.albummatches?.album;
        
        albums?.length 
          ? this.renderAlbums(albums) 
          : this.showNoResults(this.elements.albumGrid, 'albums');
      } catch (error) {
        this.showError(this.elements.albumGrid, 'albums', error);
      }
    },

    async searchTracks(query) {
      try {
        const url = this.buildUrl('track.search', { track: query }, this.config.limits.tracks);
        const data = await this.fetchData(url);
        const tracks = data?.results?.trackmatches?.track;
        
        tracks?.length 
          ? this.renderTracks(tracks) 
          : this.showNoResults(this.elements.trackList, 'tracks');
      } catch (error) {
        this.showError(this.elements.trackList, 'tracks', error);
      }
    },

    buildUrl(method, params, limit) {
      const url = new URL(this.config.baseUrl);
      url.searchParams.append('method', method);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append('api_key', this.config.apiKey);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', limit);
      return url.toString();
    },

    async fetchData(url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },

    showNoResults(element, type) {
      element.innerHTML = `<div class="no-results">No ${type} found</div>`;
    },

    showError(element, type, error) {
      console.error(`Error searching ${type}:`, error);
      element.innerHTML = `<div class="error">Error loading ${type}</div>`;
    },

    renderArtists(artists) {
      this.elements.artistGrid.innerHTML = artists.map(artist => `
        <article class="artist-card">
          <img src="${this.getImage(artist.image, 'medium')}" 
               alt="${artist.name}" 
               class="artist-img" 
               onerror="this.src='${this.config.defaultImage}'">
          <div class="artist-info">
            <h3 class="artist-name"><a href="${artist.url}" target="_blank">${artist.name}</a></h3>
            <p class="artist-stats">${this.formatNumber(artist.listeners || 0)} listeners</p>
          </div>
        </article>
      `).join('');
    },

    renderAlbums(albums) {
      this.elements.albumGrid.innerHTML = albums.map(album => `
        <article class="album-card">
          <img src="${this.getImage(album.image, 'medium')}" 
               alt="${album.name}" 
               class="album-cover" 
               onerror="this.src='${this.config.defaultImage}'">
          <div class="album-info">
            <h3 class="album-title><a href="${album.url}" target="_blank">${album.name}</a></h3>
            <p class="album-artist">${album.artist}</p>
          </div>
        </article>
      `).join('');
    },

    renderTracks(tracks) {
      this.elements.trackList.innerHTML = tracks.map(track => `
        <article class="track-item">
          <button class="play-btn" aria-label="Play" data-url="${track.url}">
            <img src="${this.config.playIcon}" alt="Play">
          </button>
          <img src="${this.getImage(track.image, 'medium')}" 
               alt="${track.name}" 
               class="track-art" 
               onerror="this.src='${this.config.defaultImage}'">
          <div class="track-details">
            <h3 class="track-title">${track.name}</h3>
            <p class="track-artist">${track.artist}</p>
          </div>
        </article>
      `).join('');

      this.setupPlayButtons();
    },

    getImage(images, size) {
      return images?.find(img => img.size === size)?.['#text'] || this.config.defaultImage;
    },

    setupPlayButtons() {
      document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.getAttribute('data-url');
          window.open(url, '_blank');
        });
      });
    },

    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  MusicSearchApp.init();
});