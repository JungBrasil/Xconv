'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function MyEntityPage() {
    // Mocking the logged-in entity context
    const { entities } = useApp();
    const myEntity = entities[0]; // Assuming the first one is "me" for now

    if (!myEntity) return <div>Nenhuma entidade vinculada.</div>;

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Minha Entidade</h1>
                    <p className="text-muted">Gerencie seus dados cadastrais e documentos.</p>
                </div>
                <Button>Editar Dados</Button>
            </div>

            <div className={styles.grid}>
                <Card className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarPlaceholder}>{myEntity.name.charAt(0)}</div>
                        <div>
                            <h2 className={styles.entityName}>{myEntity.name}</h2>
                            <span className={styles.cnpj}>{myEntity.cnpj}</span>
                        </div>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <label>Presidente</label>
                            <span>{myEntity.president}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Endereço</label>
                            <span>{myEntity.address}</span>
                        </div>
                    </div>
                </Card>

                <div className={styles.sideColumn}>
                    <Card title="Certidões e Documentos">
                        <ul className={styles.docList}>
                            <li className={styles.docItem}>
                                <span className={styles.docName}>Estatuto Social</span>
                                <span className={styles.docStatus} data-valid="true">Válido</span>
                            </li>
                            <li className={styles.docItem}>
                                <span className={styles.docName}>Ata de Eleição</span>
                                <span className={styles.docStatus} data-valid="true">Válido</span>
                            </li>
                            <li className={styles.docItem}>
                                <span className={styles.docName}>CND Federal</span>
                                <span className={styles.docStatus} data-valid="false">Vencida</span>
                            </li>
                            <li className={styles.docItem}>
                                <span className={styles.docName}>CND Municipal</span>
                                <span className={styles.docStatus} data-valid="true">Válido</span>
                            </li>
                        </ul>
                        <Button variant="outline" size="sm" className={styles.fullBtn}>Atualizar Documentos</Button>
                    </Card>

                    <Card title="Resumo de Atividades">
                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>3</span>
                                <span className={styles.statLabel}>Propostas</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>1</span>
                                <span className={styles.statLabel}>Convênio Ativo</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
