'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import AuditorNotes from '@/components/AuditorNotes';
import styles from './page.module.css';

export default function CovenantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);
    const { covenants, entities, updateAuditorNotes, currentUser } = useApp();

    const covenant = covenants.find(c => c.id === id);
    // Mock data extension since our context is simple
    const extendedCovenant = covenant ? {
        ...covenant,
        processNumber: '2023/00158',
        bankAccount: 'Banco do Brasil - Ag: 1234-5 CC: 98765-4',
        signatories: ['Prefeito Municipal', 'Presidente da Associação'],
        value: 150000,
        startDate: '2023-01-10',
        endDate: '2023-12-31',
        entityName: entities.find(e => e.id === covenant.entityId)?.name
    } : null;

    if (!extendedCovenant) {
        return <div className="container">Convênio não encontrado</div>;
    }

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <Button variant="ghost" onClick={() => router.back()}>← Voltar</Button>
                <div className={styles.headerActions}>
                    {currentUser.role === 'ADMIN' && (
                        <Button variant="outline">Gerar Aditivo</Button>
                    )}
                    <Button>Exportar PDF</Button>
                </div>
            </div>

            <div className={styles.contentLayout}>
                <div className={styles.mainColumn}>
                    <div className={styles.section}>
                        <h1 className={styles.title}>Convênio nº {extendedCovenant.id}</h1>
                        <div className={styles.metaRow}>
                            <span className={styles.badge} data-status={extendedCovenant.status}>
                                {extendedCovenant.status === 'ACTIVE' ? 'Em Execução' : 'Concluído'}
                            </span>
                            <span className={styles.date}>
                                Vigência: {new Date(extendedCovenant.startDate).toLocaleDateString('pt-BR')} a {new Date(extendedCovenant.endDate).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.fieldFull}>
                                <span className={styles.label}>Objeto</span>
                                <span className={styles.value}>{extendedCovenant.object}</span>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Entidade Parceira</span>
                                <span className={styles.value}>{extendedCovenant.entityName}</span>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Processo Administrativo</span>
                                <span className={styles.value}>{extendedCovenant.processNumber}</span>
                            </div>
                            <div className={styles.fieldFull}>
                                <span className={styles.label}>Conta Bancária Específica</span>
                                <span className={styles.value}>{extendedCovenant.bankAccount}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Cronograma de Desembolso</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Parcela</th>
                                        <th>Data Prevista</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1ª Parcela</td>
                                        <td>15/01/2023</td>
                                        <td>R$ 50.000,00</td>
                                        <td><span className={styles.paidBadge}>Pago</span></td>
                                    </tr>
                                    <tr>
                                        <td>2ª Parcela</td>
                                        <td>15/04/2023</td>
                                        <td>R$ 50.000,00</td>
                                        <td><span className={styles.paidBadge}>Pago</span></td>
                                    </tr>
                                    <tr>
                                        <td>3ª Parcela</td>
                                        <td>15/07/2023</td>
                                        <td>R$ 50.000,00</td>
                                        <td><span className={styles.pendingBadge}>Agendado</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <AuditorNotes
                        type="COVENANT"
                        id={extendedCovenant.id}
                        initialNotes={extendedCovenant.auditorNotes}
                    />
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.card}>
                        <h3>Resumo Financeiro</h3>
                        <div className={styles.financialSummary}>
                            <div className={styles.finRow}>
                                <span>Valor Global</span>
                                <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(extendedCovenant.value)}</strong>
                            </div>
                            <div className={styles.finRow}>
                                <span>Repassado</span>
                                <strong>R$ 100.000,00</strong>
                            </div>
                            <div className={`${styles.finRow} ${styles.total}`}>
                                <span>Saldo a Repassar</span>
                                <strong>R$ 50.000,00</strong>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Signatários</h3>
                        <ul className={styles.signatoriesList}>
                            {extendedCovenant.signatories.map((sig, index) => (
                                <li key={index}>✍️ {sig}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
