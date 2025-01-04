// Star review object adapted from Professor Biester's FilmExplorer
import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/StarRating.module.css";

function StarRating({ rating, setRating }) {
  const stars = [];

  for (let i = 1; i <= rating; i += 1) {
    stars.push(
      <span
        className={styles.filled}
        key={i}
        onClick={() => {
          setRating(i);
        }}
      >
        ★
      </span>
    );
  }

  for (let i = rating + 1; i <= 5; i += 1) {
    stars.push(
      <span
        className={styles.empty}
        key={i}
        onClick={() => {
          setRating(i);
        }}
      >
        ★
      </span>
    );
  }

  return <span>{stars}</span>;
}

StarRating.propTypes = {
  rating: PropTypes.number,
  setRating: PropTypes.func.isRequired,
};

StarRating.defaultProps = {
  rating: 0,
};

export default StarRating;
