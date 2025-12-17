import React from 'react'
import styles from './Card.module.css'

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
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
