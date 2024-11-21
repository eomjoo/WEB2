// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { URLService } from '../util/movie/URL';
import Banner from './Banner';
import MovieRow from './MovieRow';
import { Outlet } from 'react-router-dom';

function HomeMain() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const apiKey = localStorage.getItem('TMDb-Key') || '20e3e13b63bc683a69913dacd892a80a';
  const urlService = new URLService();
  
  const urls = {
    popular: urlService.getURL4PopularMovies(apiKey),
    newReleases: urlService.getURL4ReleaseMovies(apiKey),
    action: urlService.getURL4GenreMovies(apiKey, '28')
  };

  // Load featured movie
  const loadFeaturedMovie = useCallback(async () => {
    const movie = await urlService.fetchFeaturedMovie(apiKey);
    setFeaturedMovie(movie);
  }, [apiKey]);

  // Scroll listener
  const handleScroll = useCallback(() => {
    const header = document.querySelector('.app-header');
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, []);

  // Component lifecycle
  useEffect(() => {
    loadFeaturedMovie();
    
    // Initialize scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup (equivalent to ngOnDestroy)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadFeaturedMovie, handleScroll]);


  return (
    <div className="home-main">
      <Banner movie={featuredMovie} />
      <div className="movie-rows">
        <MovieRow 
          title="인기영화" 
          fetchUrl={urls.popular} 
        />
        <MovieRow 
          title="최신영화" 
          fetchUrl={urls.newReleases} 
        />
        <MovieRow 
          title="액션영화" 
          fetchUrl={urls.action} 
        />
      </div>
      <Outlet />
      
      
    </div>
  );
}

export default HomeMain;