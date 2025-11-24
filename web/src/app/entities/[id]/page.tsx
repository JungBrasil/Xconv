'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import AuditorNotes from '@/components/AuditorNotes';
import styles from './page.module.css';

export default function EntityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { entities, deleteEntity, checkPermission } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    const { id } = React.use(params);
    const entity = entities.find(e => e.id === id);

    if (!entity) {
        return (
            <div className="container">
                <h1>Entidade não encontrada</h1>
                <Button onClick={() => router.back()}>Voltar</Button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (confirm(`Tem certeza que deseja excluir a entidade "${entity.name}"?`)) {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            deleteEntity(entity.id);
            setIsLoading(false);
            router.push('/entities');
        }
    };

    // Permission Check: Uses the new granular permission system
    const canDeleteEntity = checkPermission('entity_delete');

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <Button variant="ghost" onClick={() => router.back()}>← Voltar</Button>
                <div className={styles.headerActions}>
                    {canDeleteEntity && (
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className={styles.deleteBtn}
                        >
                            Excluir Entidade
                        </Button>
                    )}
                    {/* Edit button placeholder - could be another permission */}
                    {checkPermission('sys_admin') && (
                        <Button onClick={() => alert('Funcionalidade de edição em breve!')}>
                            Editar Dados
                        </Button>
                    )}
                </div>
            </div>

            <div className={styles.contentLayout}>
                <div className={styles.mainColumn}>
                    <div className={styles.section}>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{entity.name}</h1>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <span className={styles.label}>CNPJ</span>
                                <span className={styles.value}>{entity.cnpj}</span>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Presidente</span>
                                <span className={styles.value}>{entity.president}</span>
                            </div>
                            <div className={styles.fieldFull}>
                                <span className={styles.label}>Endereço</span>
                                <span className={styles.value}>{entity.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Documentos</h2>
                        <ul className={styles.docList}>
                            <li>
                                <span className="text-2xl">📄</span>
                                <span>Estatuto Social.pdf</span>
                            </li>
                            <li>
                                <span className="text-2xl">📄</span>
                                <span>Ata de Eleição.pdf</span>
                            </li>
                            <li>
                                <span className="text-2xl">📄</span>
                                <span>Cartão CNPJ.pdf</span>
                            </li>
                            <li>
                                <span className="text-2xl">📄</span>
                                <span>Certidões Negativas.zip</span>
                            </li>
                        </ul>
                        {canDeleteEntity && (
                            <Button variant="ghost" size="sm">
                                Gerenciar Documentos
                            </Button>
                        )}
                    </div>

                    <AuditorNotes type="ENTITY" id={entity.id} initialNotes={entity.auditorNotes} />
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.card}>
                        <h3>Resumo</h3>
                        <div className={styles.summaryItem}>
                            <span>Propostas Ativas</span>
                            <strong>2</strong>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Convênios Firmados</span>
                            <strong>1</strong>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Pendências</span>
                            <strong>0</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
