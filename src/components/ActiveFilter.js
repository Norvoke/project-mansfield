import PropTypes from "prop-types";
import styles from "../styles/ActiveFilter.module.css";

export default function ActiveFilter({ activeFilter, removeFilter }) {
  if (!activeFilter || activeFilter.length === 0) return null; // Do not render if no active filters

  return (
    <div className={styles.activeFilterContainer} data-testid="active-filter">
      <ul className={styles.activeFilterList}>
        {activeFilter.map((filter) => (
          <li
            key={filter}
            className={styles.activeFilterItem}
            onClick={() => removeFilter(filter)}
          >
            {filter}
            <button
              type="button"
              className={styles.removeIcon}
              aria-label={`Remove ${filter}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ActiveFilter.propTypes = {
  activeFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeFilter: PropTypes.func.isRequired,
};
