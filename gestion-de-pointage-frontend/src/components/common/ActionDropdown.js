import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/components/directory/ActionDropdown.module.css';
import { FaEllipsisV } from 'react-icons/fa';

const ActionDropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button 
        className={styles.dropdownToggle} 
        aria-label="Menu d'actions"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaEllipsisV size={20} />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {children}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;