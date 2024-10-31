import React, { useState } from 'react';
import styles from '../../styles/components/directory/ActionDropdown.module.css';

const ActionDropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dropdown}>
      <button 
        className={styles.dropdownToggle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        Actions
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;