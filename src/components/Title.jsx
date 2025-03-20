import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ as: Component, className, children, ...props }) => {
  const baseStyles = 'font-bold text-gray-800 mb-2 capitalize';
  
  const variants = {
    h1: 'text-2xl md:text-3xl',
    h2: 'text-xl md:text-2xl',
    h3: 'text-lg md:text-xl'
  };

  return (
    <Component
      className={`${baseStyles} ${variants[Component]} ${className || ''}`}
      {...props}
    >
      {children}
    </Component>
  );
};

Title.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Title.defaultProps = {
  as: 'h1',
  className: ''
};

export default Title;