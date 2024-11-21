// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './MovieRow.css';
import { wishlistService } from '../util/movie/wishlist';

function MovieRow({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Refs (equivalent to @ViewChild)
  const sliderRef = useRef(null);
  const sliderWindowRef = useRef(null);

  // Computed properties
  const atLeftEdge = scrollAmount <= 0;
  const atRightEdge = scrollAmount >= maxScroll;

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(fetchUrl);
      setMovies(response.data.results);
      setTimeout(calculateMaxScroll, 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }, [fetchUrl]);

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  // Scroll handling
  const slide = useCallback((direction, amount = null) => {
    const slideAmount = amount || sliderWindowRef.current?.clientWidth * 0.8;
    setScrollAmount(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - slideAmount);
      }
      return Math.min(maxScroll, prev + slideAmount);
    });
  }, [maxScroll]);

  const calculateMaxScroll = useCallback(() => {
    if (sliderRef.current && sliderWindowRef.current) {
      const newMaxScroll = Math.max(
        0,
        sliderRef.current.scrollWidth - sliderWindowRef.current.clientWidth
      );
      setMaxScroll(newMaxScroll);
    }
  }, []);

  // Event handlers
  const handleMouseMove = () => setShowButtons(true);
  const handleMouseLeave = () => setShowButtons(false);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (isScrolling) return;

    setIsScrolling(true);
    const direction = event.deltaY > 0 ? 'right' : 'left';
    slide(direction);

    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }, [isScrolling, slide]);

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(event.touches[0].clientX);
  };

  const genreMap = {
    28: "액션",
    12: "어드벤처",
    16: "애니메이션",
    35: "코미디",
    80: "범죄",
    99: "다큐멘터리",
    18: "드라마",
    10751: "가족",
    14: "판타지",
    36: "역사",
    27: "공포",
    10402: "음악",
    9648: "미스터리",
    10749: "로맨스",
    878: "SF",
    10770: "TV 영화",
    53: "스릴러",
    10752: "전쟁",
    37: "서부"
  };

  const handleTouchMove = (event) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = useCallback(() => {
    const touchDiff = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      const direction = touchDiff > 0 ? 'right' : 'left';
      slide(direction, Math.abs(touchDiff));
    }
  }, [touchStartX, touchEndX, slide]);

  const handleResize = useCallback(() => {
    calculateMaxScroll();
    setScrollAmount(prev => Math.min(prev, maxScroll));
  }, [calculateMaxScroll, maxScroll]);

  // Wishlist functions
  const toggleWishlist = (movie) => {
    wishlistService.toggleWishlist(movie);
  };

  const isInWishlist = (movieId) => {
    return wishlistService.isInWishlist(movieId);
  };

  // Effects (lifecycle)
  useEffect(() => {
    fetchMovies();
  }, [fetchUrl, fetchMovies]);

  useEffect(() => {
    calculateMaxScroll();
  }, [movies, calculateMaxScroll]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <>
      <h2>{title}</h2>
      <div className="movie-row">
        <div 
          className="slider-container"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            className="slider-button left"
            onClick={() => slide('left')}
            style={{ opacity: showButtons && !atLeftEdge ? 1 : 0 }}
            disabled={atLeftEdge}
          >
            &lt;
          </button>

          <div className="slider-window" ref={sliderWindowRef}>
            <div 
              className="movie-slider" 
              ref={sliderRef}
              style={{ transform: `translateX(${-scrollAmount}px)` }}
            >
              {movies.map(movie => (
                <div 
                  key={movie.id}
                  className="movie-card"
                  onClick={() => toggleWishlist(movie)}
                >
                  <img 
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                  />
                  <div className="movie-info">
        <h3>{movie.title}</h3>
      <p>평점: ⭐{movie.vote_average}</p>
      <p>장르: {movie.genre_ids.map(id => genreMap[id]).join(', ')}</p>
    </div>


                  {isInWishlist(movie.id) && (
                    <div className="wishlist-indicator">❤️</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button 
            className="slider-button right"
            onClick={() => slide('right')}
            style={{ opacity: showButtons && !atRightEdge ? 1 : 0 }}
            disabled={atRightEdge}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}

export default MovieRow;