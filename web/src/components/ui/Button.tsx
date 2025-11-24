'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    className?: string;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className} ${isLoading ? styles.loading : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className={styles.spinner}></span>
                    <span className={styles.loadingText}>Carregando...</span>
                </>
            ) : (
                <>
                    <span className={styles.content}>{children}</span>
                    <span className={styles.shimmer}></span>
                </>
            )}
        </button>
    );
}
