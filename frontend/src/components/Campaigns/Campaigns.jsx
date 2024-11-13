import React from 'react'
import Navbar from '../Navbar/Navbar'
import styles from './Campaigns.module.css'
import Segments from '../Segments/Segments';

const Campaigns = () => {
  const userName = localStorage.getItem('userName');
  return (
    <div className={styles.container}>
      <Navbar userName={userName} />
      <div className={styles.components}>
        <div className={styles.segments}>
          <h2>Segments</h2>
          <Segments />
        </div>
        <div className={styles.campaigns}>
          <h2>Previous Campaigns</h2>
        </div>
      </div>
    </div>
  )
}

export default Campaigns