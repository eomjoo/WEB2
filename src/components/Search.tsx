// @ts-nocheck
import { useState } from "react";
import "./Search.css"; // Adjust for your CSS structure
import MovieInfiniteScroll from "./MovieInfiniteScroll";
import MovieSearch from "./MovieSearch";

const Search = () => {
  const apiKey = localStorage.getItem("TMDb-Key") || "20e3e13b63bc683a69913dacd892a80a";
  const [genreId, setGenreId] = useState("28");
  const [ageId, setAgeId] = useState(-1);
  const [sortId, setSortId] = useState("all");

  const genreCode = {
    "장르 (전체)": 0,
    액션: 28,
    어드밴처: 12,
    코미디: 35,
    범죄: 80,
    가족: 10751,
    공포: 27,
    애니메이션: 16,
    코미디: 35,
    다큐멘터리: 99,
    드라마: 18,
    판타지: 14,
    역사: 36,
    음악: 10402,
    미스터리: 9648,
    로맨스: 10749,
    SF: 878,
    TV영화: 10770,
    스릴러: 53,
    전쟁: 10752,
    서부: 37,
   
  };

  const sortingCode = {
    "언어 (전체)": "all",
    영어: "en",
    한국어: "ko",
  };

  const ageCode = {
    "평점 (전체)": -1,
    "9~10": 9,
    "8~9": 8,
    "7~8": 7,
    "6~7": 6,
    "5~6": 5,
    "4~5": 4,
    "4점 이하": -2,
  };

  const changeOptions = (options) => {
    setGenreId(`${genreCode[options.originalLanguage]}`);
    setAgeId(ageCode[options.translationLanguage]);
    setSortId(sortingCode[options.sorting]);
    console.log(options)
  };

  return (
    <div className="container-search">
      <div className="container-search-bar">
        <MovieSearch onChangeOptions={changeOptions} />
      </div>
      <div className="content-search">
        <MovieInfiniteScroll apiKey={apiKey} genreCode={genreId} sortingOrder={sortId} voteAverage={ageId} />
      </div>
    </div>
  );
};

export default Search;
