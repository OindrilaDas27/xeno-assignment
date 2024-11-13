import React from 'react';
import styles from './Navbar.module.css'

const Navbar = ({ userName }) => {
  return (
    <div className={styles.navbar}>
        <span>Welcome, {userName}</span>
    </div>
  )
}

export default Navbar