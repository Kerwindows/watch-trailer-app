import React, { useState, useEffect } from "react";
import "./BannerMoreInfo.css";
import { ColorRing } from "react-loader-spinner";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
const base_url = "https://image.tmdb.org/t/p";
const votes = "https://cdn-icons-png.flaticon.com/128/126/126473.png";

function BannerMoreInfo({ movie }) {
  const [loadingWords, setLoadingWords] = useState("Searching for Trailer...");
  const [timeoutId, setTimeoutId] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieInfo, setMovieInfo] = useState([]);

  useEffect(() => {
    setMovieInfo(movie);
    getTrailer(movie);
    // eslint-disable-next-line
  }, [movie]);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (!trailerUrl) {
      setLoadingWords("Searching for Trailer...");
      setTimeoutId(
        setTimeout(() => {
          setLoadingWords("Trailer cannot be found");
        }, 15000)
      );
    }
    // eslint-disable-next-line
  }, [trailerUrl]);

  function convertTimeString(totalMinutes) {
    if (totalMinutes == null) {
      return "";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours + "h " + minutes + "m ";
  }

  function getYearFromDate(dateString) {
    if (dateString == null) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    return year;
  }
  const opts = {
    minHeight: "390",
    minWidth: "320",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  function getTrailer(mov) {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      // movieTrailer(
      //   movie?.imdb_id
      //     ? (null, { tmdbId: movie?.imdb_id })
      //     : movie?.title || movie?.name || movie?.original_name,
      //   {
      //     year: movie?.release_date?.slice(0, 4),
      //   }
      // )
      movieTrailer(movie?.title || movie?.name || movie?.original_name, {
        year: movie?.release_date?.slice(0, 4),
      })
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          } else {
            setTrailerUrl("");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <div className="more-info">
      <header
        className="more-info-banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(${base_url}/original/${movieInfo?.backdrop_path})`,
          backgroundPosition: "center center",
        }}
      >
        <div className="more-info__banner-contents">
          <h1 className="more-info__banner-title">
            {movieInfo?.title || movieInfo?.name || movieInfo?.original_name}
          </h1>
          <section className="more-info__banner-info-block">
            <div>
              <div className="more-info__banner-movie-details">
                <span className="more-info__banner-release-date">
                  {getYearFromDate(movieInfo?.release_date)}
                </span>
                <span className="more-info__banner-runtime">
                  {convertTimeString(movieInfo?.runtime)}
                </span>
                <span className="more-info__banner-rating">
                  <span className="more-info__banner-rating-text">
                    Rating: {movieInfo?.vote_average}
                  </span>
                  <img
                    className="more-info__banner-rating-icon"
                    src={votes}
                    alt="Votes"
                  />
                </span>
                <span>Vote Count: {movieInfo?.vote_count}</span>
              </div>
              <p className="more-info__banner-description">
                {movieInfo?.overview}
              </p>
            </div>
            <div>
              <div className="more-info__banner-info">
                <div className="more-info__banner-logos">
                  {movieInfo?.production_companies &&
                    movieInfo?.production_companies.map(
                      (movie, i) =>
                        movie.logo_path && (
                          <img
                            key={i}
                            className="more-info__banner-logo"
                            src={`${base_url}/w185/${movie.logo_path}`}
                            alt="Logo"
                          />
                        )
                    )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="more-info__banner-fadeBottom"></div>
      </header>
      <section className="more-info__description">
        <div className="more-info__video">
          {(trailerUrl && (
            <YouTube
              className="more-info__youtube"
              videoId={trailerUrl}
              opts={opts}
            />
          )) || (
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={[
                "#d81f26",
                "#d81f26",
                "#d81f26",
                "#d81f26",
                "#d81f26",
                "#d81f26",
                "#d81f26",
              ]}
            />
          )}
          <p className="popup__card-image-preview-name">
            {!trailerUrl && loadingWords}
          </p>
        </div>
        <div className="more-info__details">
          <div className="more-info__genres">
            <span className="more-info__title">Genre: </span>
            <div>
              {movieInfo?.genres &&
                movieInfo?.genres.map((genre, i) => (
                  <span key={i} className="more-info__text">
                    {genre.name}
                    {i < movieInfo?.genres.length - 1 && ", "}
                  </span>
                ))}
            </div>
          </div>
          <div className="more-info__site">
            <span className="more-info__title">Official Site: </span>
            <div>
              <a
                className="more-info__link"
                href={movieInfo?.homepage}
                target="_blank"
                rel="noreferrer"
              >
                {movieInfo?.homepage}
              </a>
            </div>
          </div>
          <div className="more-info__languages">
            <span className="more-info__title">Languages: </span>
            <div>
              {movieInfo?.spoken_languages &&
                movieInfo?.spoken_languages.map((prod, i) => (
                  <span key={i} className="more-info__text">
                    {prod.name}
                    {i < movieInfo?.spoken_languages.length - 1 && ", "}
                  </span>
                ))}
            </div>
          </div>
          <div className="more-info__production">
            <span className="more-info__title">Production Companies: </span>
            <div>
              {movieInfo?.production_companies &&
                movieInfo?.production_companies.map((prod, i) => (
                  <span key={i} className="more-info__text">
                    {prod.name}
                    {i < movieInfo?.production_companies.length - 1 && ", "}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BannerMoreInfo;
