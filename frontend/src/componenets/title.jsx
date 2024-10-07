// import React from "react";
import PropTypes from 'prop-types';

const Title = ({ title }) => {
  return (
    <p className='text-2xl 2xl:text-3xl font-semibold text-gray-600 dark:text-gray-500 mb-5'>
      {title}
    </p>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,  // Change the type to 'string'
};

export default Title;
