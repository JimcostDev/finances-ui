// components/SidebarButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SidebarButton = ({ 
  view, 
  currentView, 
  onClick, 
  icon = '📌', 
  children, 
  className = '' 
}) => {
  const baseClasses = 'w-full text-left p-2 rounded transition-colors duration-200';
  const activeClasses = 'bg-blue-100 text-blue-600';
  const inactiveClasses = 'hover:bg-gray-100 text-gray-700';
  
  return (
    <button
      onClick={() => onClick(view)}
      className={`${baseClasses} ${
        currentView === view ? activeClasses : inactiveClasses
      } ${className}`}
      aria-current={currentView === view ? 'page' : undefined}
    >
      <span className="mr-2 inline-block">{icon}</span>
      {children}
    </button>
  );
};

SidebarButton.propTypes = {
  view: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default SidebarButton;