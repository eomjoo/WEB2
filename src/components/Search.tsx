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
    Action: 28,
    Adventure: 12,
    Comedy: 35,
    Crime: 80,
    Family: 10751,
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
