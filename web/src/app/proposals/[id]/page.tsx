'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, ProposalDocument, WorkPlanGoal, WorkPlanItem } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import AuditorNotes from '@/components/AuditorNotes';
import FileUploader from '@/components/FileUploader';
import styles from './page.module.css';

export default function ProposalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);
    const { proposals, entities, updateProposalStatus, deleteProposal, updateAuditorNotes, updateProposalWorkPlan, addProposalDocument, canEditData, currentUser } = useApp();

    const proposal = proposals.find(p => p.id === id);
    const entity = entities.find(e => e.id === proposal?.entityId);

    // Local state for Work Plan editing
    const [activeTab, setActiveTab] = useState<'DETAILS' | 'WORKPLAN' | 'DOCUMENTS'>('DETAILS');
    const [editingWorkPlan, setEditingWorkPlan] = useState(false);
    const [workPlanData, setWorkPlanData] = useState(proposal?.workPlan);

    if (!proposal || !workPlanData) {
        return <div className="container">Proposta não encontrada</div>;
    }

    const isEditable = canEditData() && proposal.status === 'DRAFT';
    const isAdmin = currentUser.role === 'ADMIN';

    const handleApprove = () => updateProposalStatus(proposal.id, 'APPROVED');
    const handleReject = () => updateProposalStatus(proposal.id, 'REJECTED');

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta proposta?')) {
            deleteProposal(proposal.id);
            router.push('/proposals');
        }
    };

    const handleSaveWorkPlan = () => {
        updateProposalWorkPlan(proposal.id, workPlanData);
        setEditingWorkPlan(false);
        alert('Plano de Trabalho atualizado com sucesso!');
    };

    const handleUpload = (file: File) => {
        const newDoc: ProposalDocument = {
            id: Math.random().toString(),
            name: file.name,
            type: 'Anexo',
            url: '#', // Mock URL
            uploadedAt: new Date().toISOString()
        };
        addProposalDocument(proposal.id, newDoc);
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <Button variant="ghost" onClick={() => router.back()}>← Voltar</Button>
                <div className={styles.headerActions}>
                    {isAdmin && proposal.status === 'UNDER_ANALYSIS' && (
                        <>
                            <Button variant="outline" onClick={handleReject} className={styles.rejectBtn}>Reprovar</Button>
                            <Button onClick={handleApprove}>Aprovar</Button>
                        </>
                    )}
                    {isEditable && (
                        <Button variant="outline" onClick={handleDelete} className={styles.deleteBtn}>
                            Excluir Proposta
                        </Button>
                    )}
                </div>
            </div>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'DETAILS' ? styles.activeTab : ''}`} onClick={() => setActiveTab('DETAILS')}>Detalhes da Proposta</button>
                <button className={`${styles.tab} ${activeTab === 'WORKPLAN' ? styles.activeTab : ''}`} onClick={() => setActiveTab('WORKPLAN')}>Plano de Trabalho</button>
                <button className={`${styles.tab} ${activeTab === 'DOCUMENTS' ? styles.activeTab : ''}`} onClick={() => setActiveTab('DOCUMENTS')}>Documentos Anexos</button>
            </div>

            <div className={styles.contentLayout}>
                {activeTab === 'DETAILS' && (
                    <div className={styles.section}>
                        <h1 className={styles.title}>{proposal.object}</h1>
                        <div className={styles.metaRow}>
                            <span className={styles.badge} data-status={proposal.status}>
                                {proposal.status === 'DRAFT' ? 'Rascunho' :
                                    proposal.status === 'UNDER_ANALYSIS' ? 'Em Análise' :
                                        proposal.status === 'APPROVED' ? 'Aprovada' : 'Reprovada'}
                            </span>
                            <span className={styles.date}>Enviado em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <span className={styles.label}>Entidade Proponente</span>
                                <span className={styles.value}>{entity?.name}</span>
                                <span className="text-sm text-muted">{entity?.cnpj}</span>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Valor Solicitado</span>
                                <span className={styles.value}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <AuditorNotes
                                type="PROPOSAL"
                                id={proposal.id}
                                initialNotes={proposal.auditorNotes}

                            />
                        </div>
                    </div>
                )}

                {activeTab === 'WORKPLAN' && (
                    <div className={styles.section}>
                        <div className="flex justify-between items-center mb-6">
                            <h2>Plano de Trabalho</h2>
                            {isEditable && !editingWorkPlan && (
                                <Button size="sm" onClick={() => setEditingWorkPlan(true)}>Editar Plano</Button>
                            )}
                            {editingWorkPlan && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setEditingWorkPlan(false)}>Cancelar</Button>
                                    <Button size="sm" onClick={handleSaveWorkPlan}>Salvar Alterações</Button>
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Justificativa do Projeto</label>
                            {editingWorkPlan ? (
                                <textarea
                                    className={styles.textarea}
                                    value={workPlanData.justification}
                                    onChange={e => setWorkPlanData({ ...workPlanData, justification: e.target.value })}
                                    rows={4}
                                    placeholder="Descreva a justificativa para a realização deste projeto..."
                                />
                            ) : (
                                <p className={styles.value}>{workPlanData.justification || 'Não preenchido.'}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Público Alvo</label>
                            {editingWorkPlan ? (
                                <input
                                    className={styles.input}
                                    value={workPlanData.targetAudience}
                                    onChange={e => setWorkPlanData({ ...workPlanData, targetAudience: e.target.value })}
                                    placeholder="Quem será beneficiado pelo projeto?"
                                />
                            ) : (
                                <p className={styles.value}>{workPlanData.targetAudience || 'Não preenchido.'}</p>
                            )}
                        </div>

                        <h3>Metas e Resultados Esperados</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Descrição da Meta</th>
                                    <th style={{ width: '150px' }}>Prazo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workPlanData.goals.length === 0 && <tr><td colSpan={2} className="text-center text-muted py-4">Nenhuma meta definida.</td></tr>}
                                {workPlanData.goals.map((goal, idx) => (
                                    <tr key={idx}>
                                        <td>{goal.description}</td>
                                        <td>{new Date(goal.deadline).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {editingWorkPlan && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    const desc = prompt('Descrição da Meta:');
                                    const date = prompt('Prazo (AAAA-MM-DD):');
                                    if (desc && date) {
                                        setWorkPlanData({
                                            ...workPlanData,
                                            goals: [...workPlanData.goals, { id: Math.random().toString(), description: desc, deadline: date }]
                                        });
                                    }
                                }}
                            >
                                + Adicionar Meta
                            </Button>
                        )}

                        <h3>Plano de Aplicação Financeira</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Item de Despesa</th>
                                    <th style={{ width: '80px' }}>Qtd</th>
                                    <th style={{ width: '120px' }}>Valor Unit.</th>
                                    <th style={{ width: '120px' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workPlanData.financialPlan.length === 0 && <tr><td colSpan={4} className="text-center text-muted py-4">Nenhum item definido.</td></tr>}
                                {workPlanData.financialPlan.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitValue)}</td>
                                        <td className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalValue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {editingWorkPlan && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    const desc = prompt('Descrição do Item:');
                                    const qtd = Number(prompt('Quantidade:'));
                                    const val = Number(prompt('Valor Unitário:'));
                                    if (desc && qtd && val) {
                                        setWorkPlanData({
                                            ...workPlanData,
                                            financialPlan: [...workPlanData.financialPlan, {
                                                id: Math.random().toString(),
                                                description: desc,
                                                quantity: qtd,
                                                unitValue: val,
                                                totalValue: qtd * val
                                            }]
                                        });
                                    }
                                }}
                            >
                                + Adicionar Item
                            </Button>
                        )}
                    </div>
                )}

                {activeTab === 'DOCUMENTS' && (
                    <div className={styles.section}>
                        <div className="flex justify-between items-center mb-6">
                            <h2>Documentos Anexos</h2>
                            {isEditable && <FileUploader onUpload={handleUpload} label="Anexar Documento" />}
                        </div>
                        <ul className={styles.docList}>
                            {proposal.documents.length === 0 ? (
                                <div className="text-center py-8 text-muted bg-gray-50 rounded-lg border border-dashed border-gray-200 col-span-full">
                                    <p>Nenhum documento anexado a esta proposta.</p>
                                </div>
                            ) : (
                                proposal.documents.map(doc => (
                                    <li key={doc.id} className={styles.docItem}>
                                        <span>
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <div className="font-medium">{doc.name}</div>
                                                <small className="text-muted">{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</small>
                                            </div>
                                        </span>
                                        <Button variant="ghost" size="sm">Baixar</Button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
