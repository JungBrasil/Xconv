'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp, ProposalStatus } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

type FilterType = ProposalStatus | 'ALL';

export default function ProposalsPage() {
    const { proposals, entities, currentUser, deleteProposal, selectedEntityId } = useApp();
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

    const filteredProposals = proposals.filter(proposal => {
        // Role-based filtering
        if (currentUser.role === 'ENTITY' && currentUser.entityId) {
            if (proposal.entityId !== currentUser.entityId) return false;
        }

        // Admin/Auditor Context filtering
        if ((currentUser.role === 'ADMIN' || currentUser.role === 'AUDITOR') && selectedEntityId) {
            if (proposal.entityId !== selectedEntityId) return false;
        }

        // Status filtering
        if (activeFilter === 'ALL') return true;
        return proposal.status === activeFilter;
    });

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta proposta?')) {
            deleteProposal(id);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Propostas</h1>
                    <p className="text-muted">Gerencie as propostas de parceria.</p>
                </div>
                <Link href="/proposals/new">
                    <Button>+ Nova Proposta</Button>
                </Link>
            </div>

            <div className={styles.filters}>
                <Button
                    variant={activeFilter === 'ALL' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('ALL')}
                >
                    Todas
                </Button>
                <Button
                    variant={activeFilter === 'DRAFT' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('DRAFT')}
                >
                    Rascunhos
                </Button>
                <Button
                    variant={activeFilter === 'UNDER_ANALYSIS' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('UNDER_ANALYSIS')}
                >
                    Em Análise
                </Button>
                <Button
                    variant={activeFilter === 'APPROVED' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('APPROVED')}
                >
                    Aprovadas
                </Button>
            </div>

            <div className={styles.grid}>
                {filteredProposals.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Nenhuma proposta encontrada.</p>
                    </div>
                ) : (
                    filteredProposals.map((proposal) => {
                        const entity = entities.find(e => e.id === proposal.entityId);
                        return (
                            <div key={proposal.id} className={styles.proposalCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.statusBadge} data-status={proposal.status}>
                                        {proposal.status === 'DRAFT' ? 'Rascunho' :
                                            proposal.status === 'UNDER_ANALYSIS' ? 'Em Análise' :
                                                proposal.status === 'APPROVED' ? 'Aprovada' : 'Reprovada'}
                                    </span>
                                </div>

                                <h3 className={styles.object}>{proposal.object}</h3>
                                <p className={styles.entity}>{entity?.name}</p>

                                <div className={styles.value}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                                </div>

                                <div className={styles.cardActions}>
                                    <Link href={`/proposals/${proposal.id}`}>
                                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                                    </Link>
                                    {/* Only show delete if it's the entity's own proposal or if Admin is in a context where deletion is allowed (though we restricted it in details) */}
                                    {/* For consistency with details page, let's hide delete here for non-owners or if locked */}
                                    {currentUser.role === 'ENTITY' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(proposal.id)}
                                            className={styles.deleteBtn}
                                        >
                                            Excluir
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
