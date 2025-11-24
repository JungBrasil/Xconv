'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './report.module.css';

export default function AIReportPage() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setReportReady(true);
        }, 2000);
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <h1>Relatório de Auditoria IA</h1>
                <p className="text-muted">Análise automatizada de conformidade e riscos.</p>
            </div>

            {!reportReady ? (
                <div className={styles.generateContainer}>
                    <Card className={styles.configCard}>
                        <h3>Configuração da Análise</h3>
                        <div className={styles.formGroup}>
                            <label>Período de Análise</label>
                            <select className={styles.select}>
                                <option>Últimos 30 dias</option>
                                <option>Exercício 2023</option>
                                <option>Personalizado</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Escopo</label>
                            <div className={styles.checkboxes}>
                                <label><input type="checkbox" defaultChecked /> Execução Financeira</label>
                                <label><input type="checkbox" defaultChecked /> Documentação</label>
                                <label><input type="checkbox" defaultChecked /> Metas do Plano de Trabalho</label>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            onClick={handleGenerate}
                            isLoading={isGenerating}
                            className={styles.generateBtn}
                        >
                            {isGenerating ? 'Analisando dados...' : 'Iniciar Análise IA'}
                        </Button>
                    </Card>
                </div>
            ) : (
                <div className={styles.reportResult}>
                    <div className={styles.reportHeader}>
                        <div className={styles.scoreCircle}>
                            <span className={styles.scoreValue}>92</span>
                            <span className={styles.scoreLabel}>Score</span>
                        </div>
                        <div className={styles.reportMeta}>
                            <h2>Relatório de Conformidade #8823</h2>
                            <p>Gerado em {new Date().toLocaleString('pt-BR')}</p>
                            <div className={styles.tags}>
                                <span className={styles.tag}>Risco Baixo</span>
                                <span className={styles.tag}>3 Recomendações</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setReportReady(false)}>Nova Análise</Button>
                    </div>

                    <div className={styles.findingsGrid}>
                        <Card title="Achados de Auditoria" className={styles.findingsCard}>
                            <ul className={styles.findingsList}>
                                <li className={styles.findingItem} data-severity="high">
                                    <span className={styles.severityDot}></span>
                                    <div>
                                        <strong>Inconsistência de Datas</strong>
                                        <p>Nota Fiscal #459 emitida fora do período de vigência do convênio.</p>
                                    </div>
                                </li>
                                <li className={styles.findingItem} data-severity="medium">
                                    <span className={styles.severityDot}></span>
                                    <div>
                                        <strong>Desvio de Rubrica</strong>
                                        <p>Gasto com "Alimentação" excedeu 10% do planejado na Proposta #105.</p>
                                    </div>
                                </li>
                                <li className={styles.findingItem} data-severity="low">
                                    <span className={styles.severityDot}></span>
                                    <div>
                                        <strong>Documentação Pendente</strong>
                                        <p>Certidão Negativa da Entidade "Associação Amigos" vence em 5 dias.</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>

                        <Card title="Recomendações da IA" className={styles.recommendationsCard}>
                            <p className={styles.aiText}>
                                Com base na análise dos dados, recomenda-se:
                                <br /><br />
                                1. Solicitar justificativa formal para a NF #459 ou glosar o valor.
                                <br />
                                2. Notificar a entidade sobre o vencimento da CND.
                                <br />
                                3. Reforçar o treinamento sobre limites de remanejamento de rubricas.
                            </p>
                            <Button className={styles.downloadBtn}>Baixar PDF Completo</Button>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
