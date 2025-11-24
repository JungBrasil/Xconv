'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './new.module.css';

export default function NewProposalPage() {
    const router = useRouter();
    const { addProposal, entities } = useApp();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        entityId: '',
        object: '',
        justification: '',
        startDate: '',
        endDate: '',
        value: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        addProposal({
            id: Math.random().toString(36).substr(2, 9),
            entityId: formData.entityId,
            object: formData.object,
            value: Number(formData.value),
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            documents: [],
            workPlan: {
                justification: formData.justification,
                targetAudience: '',
                goals: [],
                financialPlan: []
            }
        });

        setIsLoading(false);
        router.push('/proposals');
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <h1>Nova Proposta</h1>
                <p className="text-muted">Preencha os dados para submeter um novo plano de trabalho.</p>
            </div>

            <div className={styles.stepper}>
                <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>1. Dados Básicos</div>
                <div className={styles.line}></div>
                <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>2. Plano de Trabalho</div>
                <div className={styles.line}></div>
                <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>3. Orçamento</div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formLayout}>
                {step === 1 && (
                    <Card title="Informações Iniciais">
                        <div className={styles.grid}>
                            <div className={styles.fieldFull}>
                                <label htmlFor="entityId">Entidade Proponente</label>
                                <select
                                    id="entityId"
                                    name="entityId"
                                    className={styles.selectInput}
                                    value={formData.entityId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione uma entidade...</option>
                                    {entities.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.cnpj})</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldFull}>
                                <label htmlFor="object">Objeto da Parceria</label>
                                <input
                                    type="text"
                                    id="object"
                                    name="object"
                                    className={styles.input}
                                    value={formData.object}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Manutenção das atividades de ensino..."
                                />
                            </div>

                            <div className={styles.fieldFull}>
                                <label htmlFor="justification">Justificativa</label>
                                <textarea
                                    id="justification"
                                    name="justification"
                                    className={styles.textarea}
                                    value={formData.justification}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="startDate">Início da Vigência</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className={styles.input}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="endDate">Fim da Vigência</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className={styles.input}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                            <Button type="button" onClick={handleNext}>Próximo</Button>
                        </div>
                    </Card>
                )}

                {step === 2 && (
                    <Card title="Metas e Indicadores">
                        <div className={styles.emptyState}>
                            <p>Funcionalidade de Metas em desenvolvimento...</p>
                            <p className="text-muted">Aqui você poderá adicionar metas quantitativas e qualitativas.</p>
                        </div>
                        <div className={styles.actions}>
                            <Button type="button" variant="outline" onClick={handleBack}>Voltar</Button>
                            <Button type="button" onClick={handleNext}>Próximo</Button>
                        </div>
                    </Card>
                )}

                {step === 3 && (
                    <Card title="Orçamento e Cronograma">
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label htmlFor="value">Valor Total Solicitado (R$)</label>
                                <input
                                    type="number"
                                    id="value"
                                    name="value"
                                    className={styles.input}
                                    value={formData.value}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button type="button" variant="outline" onClick={handleBack}>Voltar</Button>
                            <Button type="submit" isLoading={isLoading}>Finalizar Proposta</Button>
                        </div>
                    </Card>
                )}
            </form>
        </div>
    );
}
