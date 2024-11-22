// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import "./Banner.css";

function Banner({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 배너 데이터를 계산
  const currentMovie = movies[currentIndex];
  const backdropUrl = useMemo(() => {
    return currentMovie
      ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
      : "";
  }, [currentMovie]);

  // 자동 슬라이드 (3초마다 실행)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 3초 간격

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [movies]);

  // 이전 배너로 이동
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  // 다음 배너로 이동
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 배너가 없는 경우
  if (!movies || movies.length === 0) return null;

  return (
    <div className="banner" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="banner-content">
        <h1>{currentMovie.title}</h1>
        <p>{currentMovie.overview}</p>
        <button className="play-btn title-btn">재생</button>
        <button className="info-btn title-btn">상세 정보</button>
      </div>
      {/* 화살표 버튼 */}
      
    </div>
  );
}

export default Banner;
