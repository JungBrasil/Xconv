'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import styles from './AuditorNotes.module.css';

interface AuditorNotesProps {
    type: 'ENTITY' | 'PROPOSAL' | 'COVENANT' | 'ACCOUNTABILITY';
    id: string;
    initialNotes?: string | null;
}

export default function AuditorNotes({ type, id, initialNotes }: AuditorNotesProps) {
    const { currentUser, updateAuditorNotes } = useApp();
    const [notes, setNotes] = useState(initialNotes || '');
    const [isEditing, setIsEditing] = useState(false);

    // Update local state if initialNotes changes
    useEffect(() => {
        setNotes(initialNotes || '');
    }, [initialNotes]);

    const canEdit = currentUser.role === 'AUDITOR' || currentUser.role === 'ADMIN';

    const handleSave = () => {
        updateAuditorNotes(type, id, notes);
        setIsEditing(false);
    };

    if (!canEdit && !notes) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    🛡️ Anotações da Auditoria
                    <span className={styles.badge}>Uso Interno</span>
                </h3>
                {canEdit && !isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        Editar
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className={styles.editor}>
                    <textarea
                        className={styles.textarea}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Digite suas observações técnicas aqui..."
                        rows={5}
                    />
                    <div className={styles.actions}>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Salvar Anotações
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    {notes ? (
                        <p className={styles.text}>{notes}</p>
                    ) : (
                        <p className={styles.empty}>Nenhuma observação registrada.</p>
                    )}
                </div>
            )}

            <div className={styles.footer}>
                <small>Estas informações serão processadas pela IA para análise de risco.</small>
            </div>
        </div>
    );
}
