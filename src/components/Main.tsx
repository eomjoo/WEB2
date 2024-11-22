// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { URLService } from "../util/movie/URL";
import Banner from "./Banner"; // 수정된 Banner 컴포넌트를 사용
import MovieRow from "./MovieRow";
import { Outlet } from "react-router-dom";

function HomeMain() {
  const [featuredMovies, setFeaturedMovies] = useState([]); // 영화 리스트
  const apiKey = localStorage.getItem("TMDb-Key") || "20e3e13b63bc683a69913dacd892a80a";
  const urlService = new URLService();

  const urls = {
    popular: urlService.getURL4PopularMovies(apiKey),
    newReleases: urlService.getURL4ReleaseMovies(apiKey),
    action: urlService.getURL4GenreMovies(apiKey, "28"),
    horror: urlService.getURL4GenreMovies(apiKey, "27"), // 공포 영화 추가
    comedy: urlService.getURL4GenreMovies(apiKey, "35"), // 코미디
    documentary: urlService.getURL4GenreMovies(apiKey, "99"), // 다큐
    romance: urlService.getURL4GenreMovies(apiKey, "10749"), // 로맨스
    sf: urlService.getURL4GenreMovies(apiKey, "878"), // SF
    nowPlaying: urlService.getURL4NowPlayingMovies(apiKey), // 현재 상영작 추가
  };

  // Load featured movies
  const loadFeaturedMovies = useCallback(async () => {
    try {
      const response = await fetch(urls.popular);
      const data = await response.json();
      setFeaturedMovies(data.results.slice(0, 5)); // 슬라이더에 사용할 상위 5개 영화
    } catch (error) {
      console.error("Error fetching featured movies:", error);
    }
  }, [urls.popular]);

  // Scroll listener
  const handleScroll = useCallback(() => {
    const header = document.querySelector(".app-header");
    if (window.scrollY > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, []);

  // Component lifecycle
  useEffect(() => {
    loadFeaturedMovies();

    // Initialize scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup (equivalent to ngOnDestroy)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadFeaturedMovies, handleScroll]);

  return (
    <div className="home-main">
      {/* 슬라이더 형태로 영화 목록 전달 */}
      <Banner movies={featuredMovies} />
      <div className="movie-rows">
        <MovieRow title="현재 상영작" fetchUrl={urls.nowPlaying} />
        <MovieRow title="인기영화" fetchUrl={urls.popular} />
        <MovieRow title="최신영화" fetchUrl={urls.newReleases} />
        <MovieRow title="액션영화" fetchUrl={urls.action} />
        <MovieRow title="공포영화" fetchUrl={urls.horror} />
        <MovieRow title="코미디" fetchUrl={urls.comedy} />
        <MovieRow title="로맨스" fetchUrl={urls.romance} />
        <MovieRow title="SF" fetchUrl={urls.sf} />
        <MovieRow title="다큐멘터리" fetchUrl={urls.documentary} />
      </div>
      <Outlet />
    </div>
  );
}

export default HomeMain;
