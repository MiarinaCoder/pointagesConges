import React from 'react';
import '../../styles/components/directory/actionButtonsContainer.css';

const ActionButtonsContainer = ({ children }) => {
  return (
    <div className="action-buttons-container">
      {children}
    </div>
  );
};

export default ActionButtonsContainer;