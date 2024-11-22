// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./MovieInfiniteScroll.css";

const genreMap = {
  28: "액션",
  12: "어드벤처",
  35: "코미디",
  80: "범죄",
  10749: "로맨스",
  878: "SF",
  18: "드라마",
};

const MovieInfiniteScroll = ({
  genreCode,
  apiKey,
  sortingOrder,
  voteAverage,
}) => {
  const gridContainerRef = useRef(null);
  const loadingTriggerRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const fetchMovies = useCallback(async (page, shouldReset = false) => {
    if (isLoading || (!hasMore && !shouldReset)) return;

    setIsLoading(true);
    try {
      const url =
        genreCode === "0"
          ? "https://api.themoviedb.org/3/movie/popular"
          : "https://api.themoviedb.org/3/discover/movie";

      const params = {
        api_key: apiKey,
        language: "ko-KR",
        page: page,
        ...(genreCode !== "0" && { with_genres: genreCode }),
      };

      const response = await axios.get(url, { params });
      const newMovies = response.data.results;

      if (newMovies.length > 0) {
        let filteredMovies = newMovies;

        if (sortingOrder !== "all") {
          filteredMovies = filteredMovies.filter(
            (movie) => movie.original_language === sortingOrder
          );
        }

        filteredMovies = filteredMovies.filter((movie) => {
          if (voteAverage === -1) return true;
          if (voteAverage === -2) return movie.vote_average <= 4;
          return (
            movie.vote_average >= voteAverage &&
            movie.vote_average < voteAverage + 1
          );
        });

        setMovies((prev) => (shouldReset ? filteredMovies : [...prev, ...filteredMovies]));
        setCurrentPage(page + 1);
        setHasMore(filteredMovies.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [genreCode, apiKey, sortingOrder, voteAverage]);

  // Reset and fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [genreCode, apiKey, sortingOrder, voteAverage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      calculateRowSize();
    };

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchMovies(currentPage);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMovies, hasMore, currentPage]);

  const calculateRowSize = useCallback(() => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 100 : 300;
      const horizontalGap = isMobile ? 10 : 15;
      setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
    }
  }, [isMobile]);

  const scrollToTopAndReset = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  };

  const visibleMovieGroups = movies.reduce((result, movie, index) => {
    const groupIndex = Math.floor(index / rowSize);
    if (!result[groupIndex]) {
      result[groupIndex] = [];
    }
    result[groupIndex].push(movie);
    return result;
  }, []);

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className="grid-container">
        {visibleMovieGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="movie-row">
            {group.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/placeholder-image.jpg"
                  }
                  alt={movie.title}
                  loading="lazy"
                />
                {/* 추가된 영화 정보 */}
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>평점: ⭐{movie.vote_average}</p>
                  <p>장르: {movie.genre_ids.map((id) => genreMap[id]).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={loadingTriggerRef} className="loading-trigger">
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>

      {showTopButton && (
        <button
          className="top-button"
          onClick={scrollToTopAndReset}
          aria-label="맨 위로 이동"
        >
          Top
        </button>
      )}
    </div>
  );
};

export default MovieInfiniteScroll;
