// @ts-nocheck
import { useMemo } from 'react';
import './Banner.css';

function Banner({ movie }) {
  // Memoize the backdrop URL calculation
  const backdropUrl = useMemo(() => {
    return movie ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
  }, [movie]);

  // If no movie, don't render anything (equivalent to *ngIf="movie")
  if (!movie) return null;
  
  return (
    <div 
      className="banner" 
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="banner-content">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <button className="play-btn title-btn">재생</button>
        <button className="info-btn title-btn">상세 정보</button>
      </div>
    </div>
  );
}

export default Banner;