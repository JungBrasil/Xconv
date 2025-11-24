'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function EntitiesPage() {
    const { entities, deleteEntity } = useApp();

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja excluir a entidade "${name}"?`)) {
            deleteEntity(id);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Entidades Cadastradas</h1>
                    <p className="text-muted">Gerencie as organizações do terceiro setor.</p>
                </div>
                <Link href="/entities/new">
                    <Button>+ Nova Entidade</Button>
                </Link>
            </div>

            <div className={styles.grid}>
                {entities.map((entity) => (
                    <div key={entity.id} className={styles.entityCard}>
                        <div className={styles.cardHeader}>
                            <h3>{entity.name}</h3>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>CNPJ:</span>
                                <span>{entity.cnpj}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Presidente:</span>
                                <span>{entity.president}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Endereço:</span>
                                <span>{entity.address}</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <Link href={`/entities/${entity.id}`}>
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(entity.id, entity.name)}
                                className={styles.deleteBtn}
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
