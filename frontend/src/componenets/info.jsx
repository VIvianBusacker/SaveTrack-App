// import React from "react";
import PropTypes from 'prop-types';

const Info = ({ title, subTitle }) => {
  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between py-8'>
      <div className='mb-6'>
        <h1 className='text-4xl font-semibold text-black dark:text-gray-300 mb-2'>
          {title}
        </h1>
        <span className='text-gray-600 dark:text-gray-500'>{subTitle}</span>
      </div>
    </div>
  );
};

Info.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired
}

export default Info;