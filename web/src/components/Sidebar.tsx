'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const { currentUser, switchUser, selectedEntityId, selectEntity } = useApp();

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const menuItems = [
        { label: 'Dashboard', path: '/', roles: ['ADMIN', 'ENTITY', 'AUDITOR'] },
        { label: 'Entidades', path: '/entities', roles: ['ADMIN', 'AUDITOR'] },
        { label: 'Propostas', path: '/proposals', roles: ['ADMIN', 'ENTITY', 'AUDITOR'] },
        { label: 'Convênios', path: '/covenants', roles: ['ADMIN', 'ENTITY', 'AUDITOR'] },
        { label: 'Financeiro', path: '/finance', roles: ['ADMIN', 'ENTITY', 'AUDITOR'] },
        { label: 'Prestação de Contas', path: '/accountability', roles: ['ADMIN', 'ENTITY', 'AUDITOR'] },
        { label: 'Auditoria', path: '/audit', roles: ['ADMIN', 'AUDITOR'] },
        { label: 'Configurações', path: '/settings', roles: ['ADMIN'] },
    ];

    // Filter items based on role
    const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>XConv</h2>
                <span className={styles.badge}>{currentUser.role}</span>
            </div>

            {selectedEntityId && currentUser.role !== 'ENTITY' && (
                <div className={styles.contextBanner}>
                    <small>Visualizando:</small>
                    <strong>Entidade Selecionada</strong>
                    <button onClick={() => selectEntity(null)} className={styles.backButton}>
                        ← Trocar Entidade
                    </button>
                </div>
            )}

            <nav className={styles.nav}>
                {filteredItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.userProfile}>
                <div className={styles.userInfo}>
                    <strong>{currentUser.name}</strong>
                    <span>{currentUser.role === 'ENTITY' ? 'Parceiro' : currentUser.role === 'ADMIN' ? 'Gestor' : 'Auditor'}</span>
                </div>

                <div className={styles.roleSwitcher}>
                    <p className={styles.switcherTitle}>Simular Perfil:</p>
                    <div className={styles.switcherButtons}>
                        <button
                            className={`${styles.switchBtn} ${currentUser.role === 'ADMIN' ? styles.activeBtn : ''}`}
                            onClick={() => switchUser('ADMIN')}
                            title="Gestor"
                        >
                            G
                        </button>
                        <button
                            className={`${styles.switchBtn} ${currentUser.role === 'ENTITY' ? styles.activeBtn : ''}`}
                            onClick={() => switchUser('ENTITY')}
                            title="Entidade"
                        >
                            E
                        </button>
                        <button
                            className={`${styles.switchBtn} ${currentUser.role === 'AUDITOR' ? styles.activeBtn : ''}`}
                            onClick={() => switchUser('AUDITOR')}
                            title="Auditor"
                        >
                            A
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
