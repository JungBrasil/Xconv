'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from '../page.module.css'; // Reusing dashboard styles for layout consistency

export default function NewExpensePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        router.push('/accountability');
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <h1>Lançar Despesa</h1>
                <p className="text-muted">Registre um gasto realizado com recursos do convênio.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Descrição da Despesa</label>
                            <input type="text" className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }} required />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Data do Pagamento</label>
                            <input type="date" className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }} required />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Valor (R$)</label>
                            <input type="number" step="0.01" className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }} required />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Categoria / Rubrica</label>
                            <select className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }}>
                                <option>Material de Consumo</option>
                                <option>Serviços de Terceiros - PJ</option>
                                <option>Serviços de Terceiros - PF</option>
                                <option>Recursos Humanos</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Número do Documento (NF/Recibo)</label>
                            <input type="text" className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }} required />
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Comprovante (PDF/Imagem)</label>
                            <input type="file" className="input" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--input)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit" isLoading={isLoading}>Salvar Despesa</Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}
