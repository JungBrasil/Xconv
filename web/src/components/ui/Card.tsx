'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    variant?: 'default' | 'glass' | 'gradient';
    hoverable?: boolean;
}

export default function Card({
    children,
    title,
    subtitle,
    className = '',
    variant = 'glass',
    hoverable = true
}: CardProps) {
    return (
        <div className={`${styles.card} ${styles[variant]} ${hoverable ? styles.hoverable : ''} ${className}`}>
            {(title || subtitle) && (
                <div className={styles.header}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.glow}></div>
        </div>
    );
}
