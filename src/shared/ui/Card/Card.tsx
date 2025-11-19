import React from 'react'
import styles from './Card.module.css'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

const Card: React.FC<CardProps> = ({ title, children, ...rest }) => {
  return (
    <div className={styles.card} {...rest}>
      {title && <div className={styles.title}>{title}</div>}
      <div>{children}</div>
    </div>
  )
}

export default Card
