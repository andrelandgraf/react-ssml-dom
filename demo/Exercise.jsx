import React from 'react';
import PropTypes from 'prop-types';

const Exercise = ({ src }) => (
  <audio src={src}>
    This message will be played in case the src file is not working.
  </audio>
);

Exercise.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Exercise;
