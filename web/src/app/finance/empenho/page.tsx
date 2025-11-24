'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function NewEmpenhoPage() {
    const router = useRouter();
    const { entities } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        router.push('/finance');
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <h1>Novo Empenho</h1>
                <p className="text-muted">Registre o comprometimento de despesa para um convênio.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formLayout}>
                <Card>
                    <div className={styles.grid}>
                        <div className={styles.fieldFull}>
                            <label>Entidade Beneficiária</label>
                            <select className={styles.selectInput} required>
                                <option value="">Selecione...</option>
                                {entities.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Número do Empenho</label>
                            <input type="text" className={styles.input} placeholder="Ex: 2023/00158" required />
                        </div>

                        <div className={styles.field}>
                            <label>Data de Emissão</label>
                            <input type="date" className={styles.input} required />
                        </div>

                        <div className={styles.fieldFull}>
                            <label>Dotação Orçamentária</label>
                            <input type="text" className={styles.input} placeholder="Ex: 02.05.12.365.0001.2.050..." required />
                        </div>

                        <div className={styles.field}>
                            <label>Valor (R$)</label>
                            <input type="number" className={styles.input} step="0.01" required />
                        </div>

                        <div className={styles.field}>
                            <label>Tipo</label>
                            <select className={styles.selectInput}>
                                <option>Global</option>
                                <option>Ordinário</option>
                                <option>Estimativo</option>
                            </select>
                        </div>

                        <div className={styles.fieldFull}>
                            <label>Histórico / Descrição</label>
                            <textarea className={styles.textarea} rows={3} required></textarea>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit" isLoading={isLoading}>Registrar Empenho</Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}
