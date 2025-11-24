'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function FinancePage() {
    const { currentUser, selectedEntityId } = useApp();
    const [activeTab, setActiveTab] = useState<'EMPENHOS' | 'PAYMENTS'>('EMPENHOS');

    // Determine context: Entity sees own data, Admin/Auditor sees selected entity data
    const targetEntityId = currentUser.role === 'ENTITY' ? currentUser.entityId : selectedEntityId;

    // Only ADMIN can edit financial data
    const canEditFinance = currentUser.role === 'ADMIN';

    if (!targetEntityId && currentUser.role !== 'ENTITY') {
        return (
            <div className="container animate-fade-in">
                <h1>Financeiro</h1>
                <p>Selecione uma entidade no Dashboard para visualizar os dados financeiros.</p>
                <Link href="/">
                    <Button variant="outline">Voltar para Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Gestão Financeira</h1>
                    <p className="text-muted">Controle de empenhos e repasses.</p>
                </div>
                <div className={styles.actions}>
                    {canEditFinance && (
                        <>
                            <Link href="/finance/empenho/new">
                                <Button variant="outline">+ Novo Empenho</Button>
                            </Link>
                            <Link href="/finance/payment/new">
                                <Button>+ Novo Pagamento</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'EMPENHOS' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('EMPENHOS')}
                >
                    Empenhos
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'PAYMENTS' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('PAYMENTS')}
                >
                    Repasses Realizados
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'EMPENHOS' ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nº Empenho</th>
                                    <th>Data</th>
                                    <th>Dotação</th>
                                    <th>Valor</th>
                                    <th>Saldo</th>
                                    <th>Status</th>
                                    {canEditFinance && <th>Ações</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mock Data */}
                                <tr>
                                    <td>2023/00158</td>
                                    <td>10/01/2023</td>
                                    <td>02.05.12.365.0001</td>
                                    <td>R$ 150.000,00</td>
                                    <td>R$ 50.000,00</td>
                                    <td><span className={styles.badge} data-status="ACTIVE">Ativo</span></td>
                                    {canEditFinance && (
                                        <td>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Nº OB/PIX</th>
                                    <th>Referência</th>
                                    <th>Valor</th>
                                    <th>Conta Destino</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mock Data */}
                                <tr>
                                    <td>15/01/2023</td>
                                    <td>OB 123456</td>
                                    <td>1ª Parcela - Termo 01/23</td>
                                    <td>R$ 50.000,00</td>
                                    <td>BB Ag 1234 CC 98765</td>
                                    <td><span className={styles.badge} data-status="PAID">Pago</span></td>
                                </tr>
                                <tr>
                                    <td>15/04/2023</td>
                                    <td>OB 123457</td>
                                    <td>2ª Parcela - Termo 01/23</td>
                                    <td>R$ 50.000,00</td>
                                    <td>BB Ag 1234 CC 98765</td>
                                    <td><span className={styles.badge} data-status="PAID">Pago</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
