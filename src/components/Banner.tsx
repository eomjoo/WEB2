// @ts-nocheck
import { useMemo, useState } from "react";
import "./Banner.css";

function Banner({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 표시할 영화
  const currentMovie = movies[currentIndex];

  // 배경 이미지 URL 계산
  const backdropUrl = useMemo(() => {
    return currentMovie
      ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
      : "";
  }, [currentMovie]);

  // 이전 영화로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  // 다음 영화로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 영화가 없을 경우 아무것도 렌더링하지 않음
  if (!movies || movies.length === 0) return null;

  return (
    <div className="banner-slider">
      <button className="slider-button left" onClick={handlePrev}>
        ◀
      </button>
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
      <button className="slider-button right" onClick={handleNext}>
        ▶
      </button>
    </div>
  );
}

export default Banner;
