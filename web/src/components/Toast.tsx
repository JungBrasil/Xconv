'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './Toast.module.css';

export default function Toast() {
    const { notifications, removeNotification } = useApp();
    const [exiting, setExiting] = useState<Set<string>>(new Set());

    const handleClose = (id: string) => {
        setExiting(prev => new Set(prev).add(id));
        setTimeout(() => {
            removeNotification(id);
            setExiting(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 300);
    };

    useEffect(() => {
        const timers = notifications.map(notification =>
            setTimeout(() => handleClose(notification.id), 5000)
        );
        return () => timers.forEach(clearTimeout);
    }, [notifications]);

    return (
        <div className={styles.toastContainer}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`${styles.toast} ${styles[notification.type]} ${exiting.has(notification.id) ? styles.exiting : ''}`}
                >
                    <div className={styles.icon}>
                        {notification.type === 'success' && '✓'}
                        {notification.type === 'error' && '✕'}
                        {notification.type === 'warning' && '⚠'}
                        {notification.type === 'info' && 'i'}
                    </div>
                    <div className={styles.content}>
                        <p className={styles.message}>{notification.message}</p>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={() => handleClose(notification.id)}
                        aria-label="Fechar notificação"
                    >
                        ×
                    </button>
                    <div className={styles.progress}></div>
                </div>
            ))}
        </div>
    );
}
