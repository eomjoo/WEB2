// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import "./Wishlist.css";
import { wishlistService } from "../util/movie/wishlist";

const MovieWishlist = () => {
  const gridContainerRef = useRef(null);
  const [wishlistMovies, setWishlistMovies] = useState(() => 
    JSON.parse(localStorage.getItem('movieWishlist') ?? '[]')
  );
  const [visibleWishlistMovies, setVisibleWishlistMovies] = useState([]);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      calculateLayout();
    };

    const subscription = wishlistService.wishlist$.subscribe((movies) => {
      setWishlistMovies(movies);
    });

    window.addEventListener("resize", handleResize);
    calculateLayout();

    return () => {
      window.removeEventListener("resize", handleResize);
      subscription.unsubscribe();
    };
  }, []);

  // Update visible movies whenever relevant states change
  useEffect(() => {
    updateVisibleMovies();
  }, [currentPage, rowSize, moviesPerPage, wishlistMovies]);

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const container = gridContainerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = isMobile ? 90 : 220;
      const movieCardHeight = isMobile ? 150 : 330;
      const horizontalGap = isMobile ? 10 : 15;
      const verticalGap = -10;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      const newMoviesPerPage = newRowSize * maxRows;

      setRowSize(newRowSize);
      setMoviesPerPage(newMoviesPerPage);
    }
  };

  const updateVisibleMovies = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = wishlistMovies.slice(startIndex, endIndex);

    const groupedMovies = paginatedMovies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);

    setVisibleWishlistMovies(groupedMovies);
  };

  const getImageUrl = (path) => (path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder-image.jpg");

  const totalPages = Math.ceil(wishlistMovies.length / moviesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleWishlist = (movie) => {
    wishlistService.toggleWishlist(movie);
  };

  return (
    <div className="wishlist movie-grid" ref={gridContainerRef}>
      <div className="grid-container">
        {visibleWishlistMovies.map((row, rowIndex) => (
          <div key={rowIndex} className="movie-row">
            {row.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => toggleWishlist(movie)}>
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                <div className="wishlist-indicator">👍</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {wishlistMovies.length === 0 && <div className="empty-wishlist">위시리스트가 비어 있습니다.</div>}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            &lt; 이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            다음 &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieWishlist;