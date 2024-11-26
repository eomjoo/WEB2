// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./MovieInfiniteScroll.css";
import { wishlistService } from "../util/movie/wishlist";

const genreMap = {
  28: "액션",
  12: "어드벤처",
  35: "코미디",
  80: "범죄",
  10749: "로맨스",
  878: "SF",
  18: "드라마",
  27: "공포",
  16: "애니메이션",
  99: "다큐멘터리",
  14: "판타지",
  36: "역사",
  10402: "음악",
  9648: "미스터리",
  53: "스릴러",
  10752: "전쟁",
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
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from the wishlistService when the component mounts
    const subscription = wishlistService.wishlist$.subscribe((movies) => {
      setWishlist(movies);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        setMovies((prev) =>
          shouldReset ? newMovies : [...prev, ...newMovies]
        );
        setCurrentPage(page + 1);
        setHasMore(newMovies.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [genreCode, apiKey]);

  const toggleWishlist = (movie) => {
    wishlistService.toggleWishlist(movie);
  };

  const isInWishlist = (movieId) => wishlist.some((movie) => movie.id === movieId);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [genreCode, apiKey, sortingOrder, voteAverage]);

  const calculateRowSize = useCallback(() => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 100 : 300;
      const horizontalGap = isMobile ? 10 : 15;
      setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
    }
  }, [isMobile]);

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
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlist(movie)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/placeholder-image.jpg"
                  }
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>평점: ⭐{movie.vote_average}</p>
                  <p>장르: {movie.genre_ids.map((id) => genreMap[id]).join(", ")}</p>
                </div>
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">❤️</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieInfiniteScroll;
