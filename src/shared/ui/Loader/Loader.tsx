import React from 'react'
import styles from './Loader.module.css'

const Loader: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <div className={styles.loader} style={{ width: size, height: size }} />
)

export default Loader

