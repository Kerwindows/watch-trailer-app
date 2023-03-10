import React, { useState, useEffect } from "react";

import "../../index.css";
import api from "../../utils/api";
import Nav from "../Header/Nav";
import Banner from "../Banners/Banner";
import Trailer from "../Trailers/Trailer";
import Footer from "../Footer/Footer";
import VideoPopup from "../Popups/VideoPopup";

import { ColorRing } from "react-loader-spinner";

function Discover({
  handleCardClick,
  trailerUrl,
  selectedCard,
  closeAllPopups,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [trendingVideos, setTrendingVideos] = useState({});
  const [trendingArray, setTrendingArray] = useState([]);
  const [movies, setMovies] = useState({
    newflix: [],
    trending: [],
    action: [],
    comedy: [],
    romantic: [],
    documentaries: [],
    kidsMovies: [],
  });

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      api
        .fetchTrending()
        .then((data) => {
          setTrendingArray(data.results);
          return setTrendingVideos(
            data.results[Math.floor(Math.random() * data.results.length)]
          );
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchTopRatedMovies()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            newflix: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchTrending()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            trending: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchActionMovies()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            action: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchComedyMovies()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            comedy: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchRomanticMovies()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            romantic: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchDocumentaries()
        .then((data) => {
          setMovies((prevMovies) => ({
            ...prevMovies,
            documentaries: data.results,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
      api
        .fetchKidsMovies()
        .then((data) => {
          const filteredResults = data.results.filter((result) => {
            return !result.genre_ids.includes(27);
          });
          setMovies((prevMovies) => ({
            ...prevMovies,
            kidsMovies: filteredResults,
          }));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomVideo =
        trendingArray[Math.floor(Math.random() * trendingArray.length)];

      setTrendingVideos(randomVideo);
    }, 15000);

    return () => clearInterval(interval);
  }, [trendingArray]);

  return (
    <>
      <Nav />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "#000",
          }}
        >
          <ColorRing
            visible={true}
            height="100"
            width="100"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"]}
          />
        </div>
      ) : (
        <>
          <Banner movie={trendingVideos} onCardClick={handleCardClick} />
          <div className="main">
            <Trailer
              title="New Releases"
              movies={movies.newflix}
              size="big"
              type="movie"
              onCardClick={handleCardClick}
            />
            <Trailer
              title="Trending Now"
              movies={movies.trending}
              onCardClick={handleCardClick}
            />

            <Trailer
              title="Action"
              movies={movies.action}
              onCardClick={handleCardClick}
            />
            <Trailer
              title="Comedies"
              movies={movies.comedy}
              onCardClick={handleCardClick}
            />
            <Trailer
              title="Romantic Movies"
              movies={movies.romantic}
              onCardClick={handleCardClick}
            />
            <Trailer
              title="Ducumentaries"
              movies={movies.documentaries}
              onCardClick={handleCardClick}
            />
            <Trailer
              title="Popular Kids Movies"
              movies={movies.kidsMovies}
              onCardClick={handleCardClick}
            />

            <Footer />
          </div>
        </>
      )}
      <VideoPopup
        movie={selectedCard}
        onClose={closeAllPopups}
        trailerUrl={trailerUrl}
      />
    </>
  );
}

export default Discover;
