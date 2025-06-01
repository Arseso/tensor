import { useState, useEffect, FormEvent, SyntheticEvent } from 'react';

interface Image {
  size: string;
  '#text': string;
}

interface Artist {
  name: string;
  listeners?: string;
  url: string;
  image?: Image[];
}

interface Album {
  name: string;
  artist: string;
  url: string;
  image?: Image[];
}

interface Track {
  name: string;
  artist: string;
  url: string;
  image?: Image[];
}

export const Search = () => {
  const [query, setQuery] = useState('never gonna give you up');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState({
    artists: false,
    albums: false,
    tracks: false
  });
  const [error, setError] = useState({
    artists: '',
    albums: '',
    tracks: ''
  });
  const [activeTab, setActiveTab] = useState('top');

  const API_KEY = 'c9cf057346427d330c85d164987c01e1';
  const API_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
  const DEFAULT_IMAGE = '/img/default.png';
  const PLAY_ICON = '/img/icons/play_dark.png';

  useEffect(() => {
    performSearch(query);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
  };

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading({
      artists: true,
      albums: true,
      tracks: true
    });

    setError({
      artists: '',
      albums: '',
      tracks: ''
    });

    Promise.all([
      searchArtists(searchQuery),
      searchAlbums(searchQuery),
      searchTracks(searchQuery)
    ]).catch(err => {
      console.error('Search error:', err);
    });
  };

  const buildUrl = (method: string, params: Record<string, string>, limit: number) => {
    const url = new URL(API_BASE_URL);
    url.searchParams.append('method', method);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', limit.toString());
    return url.toString();
  };

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const searchArtists = async (searchQuery: string) => {
    try {
      const url = buildUrl('artist.search', { artist: searchQuery }, 14);
      const data = await fetchData(url);
      const artists = data?.results?.artistmatches?.artist;
      
      if (artists?.length) {
        setArtists(artists);
      } else {
        setError(prev => ({ ...prev, artists: 'No artists found' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, artists: 'Error loading artists' }));
      console.error('Error searching artists:', err);
    } finally {
      setLoading(prev => ({ ...prev, artists: false }));
    }
  };

  const searchAlbums = async (searchQuery: string) => {
    try {
      const url = buildUrl('album.search', { album: searchQuery }, 14);
      const data = await fetchData(url);
      const albums = data?.results?.albummatches?.album;
      
      if (albums?.length) {
        setAlbums(albums);
      } else {
        setError(prev => ({ ...prev, albums: 'No albums found' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, albums: 'Error loading albums' }));
      console.error('Error searching albums:', err);
    } finally {
      setLoading(prev => ({ ...prev, albums: false }));
    }
  };

  const searchTracks = async (searchQuery: string) => {
    try {
      const url = buildUrl('track.search', { track: searchQuery }, 10);
      const data = await fetchData(url);
      const tracks = data?.results?.trackmatches?.track;
      
      if (tracks?.length) {
        setTracks(tracks);
      } else {
        setError(prev => ({ ...prev, tracks: 'No tracks found' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, tracks: 'Error loading tracks' }));
      console.error('Error searching tracks:', err);
    } finally {
      setLoading(prev => ({ ...prev, tracks: false }));
    }
  };

  const getImage = (images: Image[] | undefined, size: string) => {
    return images?.find(img => img.size === size)?.['#text'] || DEFAULT_IMAGE;
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = DEFAULT_IMAGE;
  };

  const formatNumber = (num: string | number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePlay = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <main className="search-results-page">
      <header className="search-header">
        <h1 className="search-title">Search results for "{query}"</h1>
        <nav className="search-tabs">
          <ul className="tab-list">
            <li className={`tab-item ${activeTab === 'top' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('top')} className="tab-link">Top Results</button>
            </li>
            <li className={`tab-item ${activeTab === 'artists' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('artists')} className="tab-link">Artists</button>
            </li>
            <li className={`tab-item ${activeTab === 'albums' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('albums')} className="tab-link">Albums</button>
            </li>
            <li className={`tab-item ${activeTab === 'tracks' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('tracks')} className="tab-link">Tracks</button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-group">
            <input 
              type="text" 
              className="search-field" 
              placeholder="Search for music..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                type="button" 
                className="clear-btn" 
                aria-label="Clear search"
                onClick={clearSearch}
              >
                <img src="/img/icons/clear_field.png" alt="Clear" />
              </button>
            )}
            <button type="submit" className="search-btn" aria-label="Search">
              <img src="/img/icons/search_dark.png" alt="Search" />
            </button>
          </div>
        </form>

        {(activeTab === 'top' || activeTab === 'artists') && (
          <section className="search-section artists-section">
            <h2 className="section-title">Artists</h2>
            {loading.artists ? (
              <div className="loading">Loading...</div>
            ) : error.artists ? (
              <div className="error">{error.artists}</div>
            ) : (
              <>
                <div className="artist-grid">
                  {artists.map(artist => (
                    <article className="artist-card" key={artist.name}>
                      <img 
                        src={getImage(artist.image, 'medium')} 
                        alt={artist.name} 
                        className="artist-img" 
                        onError={handleImageError}
                      />
                      <div className="artist-info">
                        <h3 className="artist-name">
                          <a href={artist.url} target="_blank" rel="noopener noreferrer">
                            {artist.name}
                          </a>
                        </h3>
                        <p className="artist-stats">
                          {formatNumber(artist.listeners || 0)} listeners
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                {artists.length > 0 && (
                  <a href="#" className="view-more-link">
                    More artists
                    <img src="/img/icons/arrow_small_right.png" alt="" className="arrow-icon" />
                  </a>
                )}
              </>
            )}
          </section>
        )}

        {(activeTab === 'top' || activeTab === 'albums') && (
          <section className="search-section albums-section">
            <h2 className="section-title">Albums</h2>
            {loading.albums ? (
              <div className="loading">Loading...</div>
            ) : error.albums ? (
              <div className="error">{error.albums}</div>
            ) : (
              <>
                <div className="album-grid">
                  {albums.map(album => (
                    <article className="album-card" key={`${album.name}-${album.artist}`}>
                      <img 
                        src={getImage(album.image, 'medium')} 
                        alt={album.name} 
                        className="album-cover" 
                        onError={handleImageError}
                      />
                      <div className="album-info">
                        <h3 className="album-title">
                          <a href={album.url} target="_blank" rel="noopener noreferrer">
                            {album.name}
                          </a>
                        </h3>
                        <p className="album-artist">{album.artist}</p>
                      </div>
                    </article>
                  ))}
                </div>
                {albums.length > 0 && (
                  <a href="#" className="view-more-link">
                    More albums
                    <img src="/img/icons/arrow_small_right.png" alt="" className="arrow-icon" />
                  </a>
                )}
              </>
            )}
          </section>
        )}

        {(activeTab === 'top' || activeTab === 'tracks') && (
          <section className="search-section tracks-section">
            <h2 className="section-title">Tracks</h2>
            {loading.tracks ? (
              <div className="loading">Loading...</div>
            ) : error.tracks ? (
              <div className="error">{error.tracks}</div>
            ) : (
              <>
                <div className="track-list">
                  {tracks.map(track => (
                    <article className="track-item" key={`${track.name}-${track.artist}`}>
                      <button 
                        className="play-btn" 
                        aria-label="Play"
                        onClick={() => handlePlay(track.url)}
                      >
                        <img src={PLAY_ICON} alt="Play" />
                      </button>
                      <img 
                        src={getImage(track.image, 'medium')} 
                        alt={track.name} 
                        className="track-art" 
                        onError={handleImageError}
                      />
                      <div className="track-details">
                        <h3 className="track-title">{track.name}</h3>
                        <p className="track-artist">{track.artist}</p>
                      </div>
                    </article>
                  ))}
                </div>
                {tracks.length > 0 && (
                  <a href="#" className="view-more-link">
                    More tracks
                    <img src="/img/icons/arrow_small_right.png" alt="" className="arrow-icon" />
                  </a>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
};