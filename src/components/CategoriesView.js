/*
  CategoriesView.js

  This module displays the sections and reports when a user clicks on one.

  props:
    categories - an array of categories names
    setCurrentCategory - a callback that expects a category as an argument

*/

import PropTypes from "prop-types";
import styles from "../styles/CategoriesView.module.css";

export default function CategoriesView({ categories, setCurrentCategory }) {
  return (
    <div className={styles.buttonGroup}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Prevent default HTML behavior
            setCurrentCategory(category);
          }}
          className={styles.categoryButton}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoriesView.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
};
