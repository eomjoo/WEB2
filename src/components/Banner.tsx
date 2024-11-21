// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { URLService } from "../util/movie/URL"; // URLService를 가져옵니다.
import "./Banner.css";
import axios from "axios";

function Banner({ apiKey }) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const urlService = new URLService();

  // 현재 보여지는 영화 계산
  const currentMovie = useMemo(() => movies?.[currentIndex] || null, [movies, currentIndex]);

  const backdropUrl = useMemo(() => {
    return currentMovie ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}` : "";
  }, [currentMovie]);

  // 인기 영화 데이터를 불러옵니다.
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = urlService.getURL4PopularMovies(apiKey); // URL 생성
        const response = await axios.get(url); // API 호출
        setMovies(response.data.results.slice(0, 10)); // 상위 10개만 저장
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };

    fetchMovies();
  }, [apiKey, urlService]);

  // 3초마다 영화 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 3000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [movies]);

  // 데이터가 없으면 아무것도 렌더링하지 않음
  if (!currentMovie) return null;

  return (
    <div
      className="banner"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="banner-content">
        <h1>{currentMovie.title}</h1>
        <p>{currentMovie.overview}</p>
        <button className="play-btn title-btn">재생</button>
        <button className="info-btn title-btn">상세 정보</button>
      </div>
    </div>
  );
}

export default Banner;
