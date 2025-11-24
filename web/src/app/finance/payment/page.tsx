'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from '../empenho/page.module.css'; // Reusing styles

export default function NewPaymentPage() {
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
                <h1>Nova Ordem de Pagamento</h1>
                <p className="text-muted">Autorize o pagamento de um empenho liquidado.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formLayout}>
                <Card>
                    <div className={styles.grid}>
                        <div className={styles.fieldFull}>
                            <label>Empenho Vinculado</label>
                            <select className={styles.input} required>
                                <option value="">Selecione um empenho...</option>
                                <option value="1">2023/00158 - Associação Amigos do Bairro (R$ 15.000,00)</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Número da OP</label>
                            <input type="text" className={styles.input} placeholder="Ex: 452/23" required />
                        </div>

                        <div className={styles.field}>
                            <label>Data do Pagamento</label>
                            <input type="date" className={styles.input} required />
                        </div>

                        <div className={styles.field}>
                            <label>Valor a Pagar (R$)</label>
                            <input type="number" className={styles.input} step="0.01" required />
                        </div>

                        <div className={styles.field}>
                            <label>Conta Bancária de Origem</label>
                            <select className={styles.input}>
                                <option>Banco do Brasil - Ag 1234 cc 5678-9</option>
                                <option>Caixa - Ag 4321 cc 8765-4</option>
                            </select>
                        </div>

                        <div className={styles.fieldFull}>
                            <label>Anexar Comprovante</label>
                            <input type="file" className={styles.input} />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit" isLoading={isLoading}>Emitir Ordem</Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}
