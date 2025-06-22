import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

// type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: string;
}

export const Button = ({ children, variant = 'ready', className, ...props }: ButtonProps) => {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className || ''}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};
