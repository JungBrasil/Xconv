'use client';

import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
    variant?: 'card' | 'list' | 'table' | 'text';
    count?: number;
}

export default function LoadingSkeleton({ variant = 'card', count = 3 }: LoadingSkeletonProps) {
    if (variant === 'card') {
        return (
            <div className={styles.cardGrid}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                        <div className={`${styles.skeletonLine} ${styles.title}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.subtitle}`}></div>
                        <div className={styles.skeletonBlock}></div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className={styles.list}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={`${styles.listItem} ${styles.skeleton}`}>
                        <div className={styles.skeletonCircle}></div>
                        <div className={styles.skeletonContent}>
                            <div className={`${styles.skeletonLine} ${styles.title}`}></div>
                            <div className={`${styles.skeletonLine} ${styles.subtitle}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.skeleton}>
            <div className={styles.skeletonLine}></div>
        </div>
    );
}
