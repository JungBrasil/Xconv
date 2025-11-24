'use client';

import React from 'react';
import { useApp, ProposalDocument } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import AuditorNotes from '@/components/AuditorNotes';
import FileUploader from '@/components/FileUploader';
import styles from './page.module.css';

export default function AccountabilityPage() {
    const {
        accountabilities,
        currentUser,
        selectedEntityId,
        submitAccountability,
        unlockAccountability,
        updateAuditorNotes,
        canEditData,
        addAccountabilityDocument
    } = useApp();

    // Determine target entity ID
    const targetEntityId = currentUser.role === 'ENTITY' ? currentUser.entityId : selectedEntityId;

    if (!targetEntityId) {
        return <div className="container">Selecione uma entidade para ver a prestação de contas.</div>;
    }

    const accountability = accountabilities.find(a => a.entityId === targetEntityId);
    const isEditable = canEditData();

    const handleSubmit = () => {
        if (confirm('Confirma o envio da prestação de contas? Após o envio, não será possível fazer alterações.')) {
            submitAccountability(targetEntityId);
        }
    };

    const handleUnlock = () => {
        const justification = prompt('Justificativa para desbloqueio:');
        if (justification) {
            unlockAccountability(targetEntityId, justification);
        }
    };

    const handleUpload = (file: File) => {
        const newDoc: ProposalDocument = {
            id: Math.random().toString(),
            name: file.name,
            type: 'Comprovante',
            url: '#',
            uploadedAt: new Date().toISOString()
        };
        addAccountabilityDocument(targetEntityId, newDoc);
    };

    if (!accountability) {
        return (
            <div className="container animate-fade-in">
                <h1>Prestação de Contas</h1>
                <p>Nenhuma prestação de contas iniciada para esta entidade.</p>
                {currentUser.role === 'ENTITY' && (
                    <Button onClick={() => submitAccountability(targetEntityId)}>Iniciar Prestação de Contas</Button>
                )}
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Prestação de Contas</h1>
                    <p className="text-muted">Envio de documentos e comprovantes.</p>
                </div>
                <div className={styles.actions}>
                    <span className={styles.statusBadge} data-status={accountability.status}>
                        {accountability.status === 'PENDING' ? 'Pendente' : 'Enviada'}
                    </span>
                    {isEditable && accountability.status === 'PENDING' && (
                        <Button onClick={handleSubmit}>Finalizar e Enviar</Button>
                    )}
                    {currentUser.role === 'ADMIN' && accountability.locked && (
                        <Button variant="outline" onClick={handleUnlock}>🔓 Desbloquear Edição</Button>
                    )}
                </div>
            </div>

            {accountability.justification && (
                <div className={styles.alert}>
                    <strong>⚠️ Desbloqueado pelo Gestor:</strong> {accountability.justification}
                </div>
            )}

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Documentos Comprobatórios</h3>
                    <p className="text-muted mb-4">Anexe notas fiscais, extratos bancários e relatórios de execução.</p>

                    {isEditable && (
                        <div className="mb-4">
                            <FileUploader onUpload={handleUpload} label="Anexar Comprovante" />
                        </div>
                    )}

                    <ul className={styles.docList}>
                        {accountability.documents.length === 0 ? (
                            <p className="text-muted text-sm">Nenhum documento enviado.</p>
                        ) : (
                            accountability.documents.map(doc => (
                                <li key={doc.id} className={styles.docItem}>
                                    <span>📎 {doc.name}</span>
                                    <small>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</small>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className={styles.card}>
                    <h3>Resumo Financeiro</h3>
                    <div className={styles.summaryRow}>
                        <span>Total Repassado:</span>
                        <strong>R$ 150.000,00</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Total Comprovado:</span>
                        <strong>R$ 0,00</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Saldo em Conta:</span>
                        <strong>R$ 150.000,00</strong>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <AuditorNotes
                    type="ACCOUNTABILITY"
                    id={accountability.id}
                    initialNotes={accountability.auditorNotes}
                />
            </div>
        </div>
    );
}
