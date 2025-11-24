'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function AuditPage() {
    // Mock audit logs
    const auditLogs = [
        { id: 1, timestamp: '2023-11-19T10:30:00', user: 'João Silva (Entidade)', action: 'SUBMIT_PROPOSAL', resource: 'Proposta #105', ip: '192.168.1.10' },
        { id: 2, timestamp: '2023-11-19T11:15:00', user: 'Admin User (Dept. Convênios)', action: 'APPROVE_PROPOSAL', resource: 'Proposta #105', ip: '10.0.0.5' },
        { id: 3, timestamp: '2023-11-19T14:20:00', user: 'Maria Oliveira (Financeiro)', action: 'CREATE_EMPENHO', resource: 'Empenho 2023/00160', ip: '10.0.0.8' },
        { id: 4, timestamp: '2023-11-19T15:45:00', user: 'João Silva (Entidade)', action: 'UPLOAD_RECEIPT', resource: 'Despesa #88', ip: '192.168.1.10' },
        { id: 5, timestamp: '2023-11-19T16:00:00', user: 'System (AI)', action: 'FLAG_RISK', resource: 'Prestação de Contas #12', ip: 'LOCALHOST' },
    ];

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Controle Interno e Auditoria</h1>
                    <p className="text-muted">Trilha de auditoria e relatórios de conformidade.</p>
                </div>
                <div className={styles.actions}>
                    <Link href="/audit/report">
                        <Button variant="secondary">✨ Gerar Relatório IA</Button>
                    </Link>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <span className={styles.statValue}>98%</span>
                    <span className={styles.statLabel}>Índice de Conformidade</span>
                </Card>
                <Card className={styles.statCard}>
                    <span className={styles.statValue} style={{ color: 'var(--warning)' }}>3</span>
                    <span className={styles.statLabel}>Alertas de Risco</span>
                </Card>
                <Card className={styles.statCard}>
                    <span className={styles.statValue}>152</span>
                    <span className={styles.statLabel}>Ações Registradas Hoje</span>
                </Card>
            </div>

            <Card title="Trilha de Auditoria (Audit Trail)" className={styles.logsCard}>
                <div className={styles.filters}>
                    <input type="text" placeholder="Buscar por usuário ou recurso..." className={styles.searchInput} />
                    <select className={styles.filterSelect}>
                        <option>Todas as Ações</option>
                        <option>Login/Logout</option>
                        <option>Edições</option>
                        <option>Aprovações</option>
                    </select>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Usuário</th>
                            <th>Ação</th>
                            <th>Recurso Afetado</th>
                            <th>IP de Origem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map((log) => (
                            <tr key={log.id}>
                                <td className={styles.timestamp}>
                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </td>
                                <td>
                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}>{log.user.split('(')[0]}</span>
                                        <span className={styles.userRole}>{log.user.split('(')[1]?.replace(')', '')}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.actionBadge} data-action={log.action.split('_')[0]}>
                                        {log.action}
                                    </span>
                                </td>
                                <td>{log.resource}</td>
                                <td className={styles.ip}>{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
