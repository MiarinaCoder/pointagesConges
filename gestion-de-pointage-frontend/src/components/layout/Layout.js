"use client";

import React from 'react';
import Menu from '../common/Menu';
import styles from '../../styles/components/Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Menu />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
