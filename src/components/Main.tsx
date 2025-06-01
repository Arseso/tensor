import { useState, useEffect } from 'react';

interface Image {
  size: string;
  '#text': string;
}

interface Tag {
  name: string;
}

interface Artist {
  name: string;
  url: string;
  image?: Image[];
  tags?: { tag?: Tag[] };
}

interface Track {
  name: string;
  url: string;
  artist: {
    name: string;
  };
  image?: Image[];
  tags?: { tag?: Tag[] };
}

export const Main = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'c9cf057346427d330c85d164987c01e1';
  const API_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
  const ARTISTS_LIMIT = 14;
  const TRACKS_LIMIT = 21;

  useEffect(() => {
    const fetchData = async (method: string, limit: number) => {
      try {
        const url = `${API_BASE_URL}?method=${method}&api_key=${API_KEY}&format=json&limit=${limit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const items = data?.[method === 'chart.gettopartists' ? 'artists' : 'tracks']?.artist || 
                     data?.[method === 'chart.gettoptracks' ? 'tracks' : 'artists']?.track;

        if (!items || items.length === 0) {
          throw new Error(`No ${method.includes('artists') ? 'artists' : 'tracks'} data received`);
        }

        return {
          type: method.includes('artists') ? 'artists' : 'tracks',
          data: items
        };
      } catch (error) {
        console.error(`Error loading ${method.includes('artists') ? 'artists' : 'tracks'}:`, error);
        setError(`Failed to load ${method.includes('artists') ? 'artists' : 'tracks'}. Please try again later.`);
        throw error;
      }
    };

    const initApp = async () => {
      try {
        setLoading(true);
        const [artistsData, tracksData] = await Promise.all([
          fetchData('chart.gettopartists', ARTISTS_LIMIT),
          fetchData('chart.gettoptracks', TRACKS_LIMIT)
        ]);
        
        if (artistsData.type === 'artists') setArtists(artistsData.data as Artist[]);
        if (tracksData.type === 'tracks') setTracks(tracksData.data as Track[]);
      } catch (error) {
        console.error('Application error:', error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const renderItem = (item: Artist | Track, type: 'artists' | 'tracks') => {
    const isArtist = type === 'artists';
    const imageSize = isArtist ? 'medium' : 'large';
    const imageUrl = item.image?.find((img: Image) => img.size === imageSize)?.['#text'] || 
                    `/img/${type}/default.png`;
    
    const genres = item.tags?.tag?.slice(0, 3) || [];
    const genreNames = genres.length > 0 
      ? genres.map((genre: Tag) => genre.name)
      : ['Various genres'];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = `/img/${type}/default.png`;
    };

    if (isArtist) {
      return (
        <article className="artist-card" key={item.name}>
          <a href={item.url} className="artist-link" target="_blank" rel="noopener noreferrer">
            <img 
              src={imageUrl} 
              alt={item.name} 
              className="artist-image"
              onError={handleImageError}
            />
          </a>
          <h3 className="artist-name">{item.name}</h3>
          <div className="genre-tags">
            {genreNames.map((genre: string) => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
        </article>
      );
    } else {
      const track = item as Track;
      return (
        <article className="track-card" key={track.name}>
          <a href={track.url} className="track-link" target="_blank" rel="noopener noreferrer">
            <img 
              src={imageUrl} 
              alt={track.name} 
              className="track-cover"
              onError={handleImageError}
            />
          </a>
          <div className="track-details">
            <h3 className="track-title">{track.name}</h3>
            <p className="track-artist">{track.artist.name}</p>
            <div className="genre-tags">
              {genreNames.map((genre: string) => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        </article>
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <main className="content">
      <h1 className="page-title">Music</h1>
      
      <section className="featured-section trending-artists">
        <h2 className="section-title">Hot right now</h2>
        <div className="grid-container artists-grid">
          {artists.map(artist => renderItem(artist, 'artists'))}
        </div>
      </section>
      
      <section className="featured-section popular-tracks">
        <h2 className="section-title">Popular tracks</h2>
        <div className="grid-container tracks-grid">
          {tracks.map(track => renderItem(track, 'tracks'))}
        </div>
      </section>
    </main>
  );
};