import React from 'react';
import PropTypes from 'prop-types';

const Exercise = ({ src }) => (
  <audio src={src}>
    Oh, I am sorry, this file seems not to work, please try another song
  </audio>
);

Exercise.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Exercise;
