/*
Prop validation shape for the Building object, containing information about each dorm building on campus
*/
import PropTypes from "prop-types";

const BuildingShape = PropTypes.shape({
  buildingID: PropTypes.string.isRequired,
  buildingName: PropTypes.string.isRequired,
  buildingCategory: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  buildingPhotoLink: PropTypes.string,
  floorPlanLinks: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.string),
});

export default BuildingShape;
