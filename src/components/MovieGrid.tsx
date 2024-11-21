// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./MovieGrid.css"
import { wishlistService } from "../util/movie/wishlist";

const MovieGrid = ({ title, fetchUrl }) => {
  const gridContainerRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [, setRenderCount] = useState(0);

  const wishlistTimerRef = useRef(null);

  useEffect(() => {
    fetchMovies();
    calculateLayout();
    const resizeListener = () => {
      setIsMobile(window.innerWidth <= 768);
      calculateLayout();
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
      if (wishlistTimerRef.current) {
        clearTimeout(wishlistTimerRef.current);
      }
    };
  }, []);

  const fetchMovies = async () => {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(fetchUrl, {
          params: { page, per_page: moviesPerPage },
        });
        allMovies = [...allMovies, ...response.data.results];
      }

      setMovies(allMovies.slice(0, totalMoviesNeeded));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const calculateLayout = useCallback(() => {
    if (gridContainerRef.current) {
      const container = gridContainerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = isMobile ? 90 : 200;
      const movieCardHeight = isMobile ? 150 : 220;
      const horizontalGap = isMobile ? 10 : 15;
      const verticalGap = -10;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      setRowSize(newRowSize);
      setMoviesPerPage(newRowSize * maxRows);
    }
  }, [isMobile]);

  const toggleWishlist = (movie) => {
    wishlistService.toggleWishlist(movie);
    setRenderCount((prev) => prev + 1);
  };

  const isInWishlist = (movieId) => wishlistService.isInWishlist(movieId);

  const visibleMovieGroups = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="movie-grid grid" ref={gridContainerRef}>
      <div className={`grid-container`}>
        {visibleMovieGroups().map((movieGroup, groupIndex) => (
          <div
            key={groupIndex}
            className="movie-row"
          >
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onMouseUp={() => toggleWishlist(movie)}
              >
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                {isInWishlist(movie.id) && <div className="wishlist-indicator">👍</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            &lt; 이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            다음 &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;