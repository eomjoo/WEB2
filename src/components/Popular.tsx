// @ts-nocheck
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import { URLService } from '../util/movie/URL';
import MovieGrid from './MovieGrid';
import "./Popular.css"
import MovieInfiniteScroll from './MovieInfiniteScroll';

const HomePopular = () => {
  const [currentView, setCurrentView] = useState('grid');
  const apiKey = localStorage.getItem('TMDb-Key') || '20e3e13b63bc683a69913dacd892a80a';
  const urlService = new URLService();

  useEffect(() => {
    disableScroll();
    return enableScroll; // Clean up scroll behavior on unmount
  }, []);

  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  const handleSetView = (view) => {
    setCurrentView(view);
    view === 'grid' ? disableScroll() : enableScroll();
  };

  const fetchURL =  urlService.getURL4PopularMovies(apiKey);

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button
          onClick={() => handleSetView('grid')}
          className={currentView === 'grid' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button
          onClick={() => handleSetView('list')}
          className={currentView === 'list' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Movie Grid */}
      {currentView === 'grid' && (
        <MovieGrid title="인기 영화" fetchUrl={fetchURL} />
      )}

      {/* Movie Infinite Scroll */}
      {currentView === 'list' && (
        <MovieInfiniteScroll
          apiKey={apiKey}
          genreCode="28"
          sortingOrder="all"
          voteAverage={-1}
        />
      )}
    </div>
  );
};

export default HomePopular;