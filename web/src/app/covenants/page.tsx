'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function CovenantsPage() {
    const { currentUser } = useApp();

    // Mock data for Covenants
    const allCovenants = [
        { id: '001/2023', entityId: '1', entity: 'Associação Amigos do Bairro', object: 'Reforma da Quadra Poliesportiva', value: 150000, start: '2023-01-10', end: '2023-12-31', status: 'ACTIVE' },
        { id: '002/2023', entityId: '2', entity: 'Instituto Criança Feliz', object: 'Oficinas de Música', value: 50000, start: '2023-02-15', end: '2023-08-15', status: 'CONCLUDED' },
        { id: '003/2023', entityId: '1', entity: 'Associação Amigos do Bairro', object: 'Apoio à Terceira Idade', value: 80000, start: '2023-03-01', end: '2024-02-28', status: 'ACTIVE' },
    ];

    const covenants = allCovenants.filter(covenant => {
        if (currentUser.role === 'ENTITY' && currentUser.entityId) {
            return covenant.entityId === currentUser.entityId;
        }
        return true;
    });

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Convênios e Termos</h1>
                    <p className="text-muted">Parcerias formalizadas e em execução.</p>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline">Exportar Relatório</Button>
                </div>
            </div>

            <div className={styles.grid}>
                {covenants.map((covenant) => (
                    <Card key={covenant.id} className={styles.covenantCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.covenantId}>Termo nº {covenant.id}</span>
                            <span className={styles.statusBadge} data-status={covenant.status}>
                                {covenant.status === 'ACTIVE' ? 'Vigente' : 'Concluído'}
                            </span>
                        </div>

                        <div className={styles.cardBody}>
                            <h3 className={styles.object}>{covenant.object}</h3>
                            <p className={styles.entity}>{covenant.entity}</p>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Valor Total</span>
                                    <span className={styles.metaValue}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(covenant.value)}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Vigência</span>
                                    <span className={styles.metaValue}>
                                        {new Date(covenant.start).toLocaleDateString('pt-BR')} até {new Date(covenant.end).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <Link href={`/covenants/${encodeURIComponent(covenant.id)}`}>
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                            <Button variant="outline" size="sm">Aditivos</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
