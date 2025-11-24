'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---

export type UserRole = 'ADMIN' | 'ENTITY' | 'AUDITOR';

export type Permission = 'sys_admin' | 'entity_delete' | 'proposal_review' | 'auditor_notes';

export const PERMISSIONS: { id: Permission; label: string }[] = [
    { id: 'sys_admin', label: 'Acesso a Configurações e Gestão de Usuários' },
    { id: 'entity_delete', label: 'Excluir Entidades' },
    { id: 'proposal_review', label: 'Aprovar/Reprovar Propostas' },
    { id: 'auditor_notes', label: 'Criar/Editar Notas de Auditoria' }
];

export interface User {
    id: string;
    name: string;
    role: UserRole;
    entityId?: string;
}

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
    active: boolean;
}

export interface SystemSettings {
    orgName: string;
    fiscalYear: string;
    notifyProposals: boolean;
    notifyDeadlines: boolean;
}

export type ProposalStatus = 'DRAFT' | 'UNDER_ANALYSIS' | 'APPROVED' | 'REJECTED';
export type CovenantStatus = 'ACTIVE' | 'CONCLUDED' | 'CANCELED';
export type AccountabilityStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface AuditorNote {
    id: string;
    author: string;
    content: string;
    createdAt: string | Date;
}

export interface ProposalDocument {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string | Date;
}

export interface WorkPlanGoal {
    id: string;
    description: string;
    deadline: string;
}

export interface WorkPlanItem {
    id: string;
    description: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
}

export interface WorkPlan {
    justification: string;
    targetAudience: string;
    goals: WorkPlanGoal[];
    financialPlan: WorkPlanItem[];
}

export interface Proposal {
    id: string;
    entityId: string;
    object: string;
    value: number;
    status: ProposalStatus | string; // Allow string from Prisma
    createdAt: string | Date;
    auditorNotes?: string | null;
    auditorNotesList?: AuditorNote[];
    workPlan?: WorkPlan | null; // Make optional/nullable for Prisma compatibility
    documents: ProposalDocument[];
}

export interface Entity {
    id: string;
    name: string;
    cnpj: string;
    address: string;
    president: string;
    presidentCpf?: string | null;
    presidentRole?: string;
    active?: boolean;
    auditorNotes?: string | null;
}

export interface Covenant {
    id: string;
    entityId: string;
    proposalId: string;
    object: string;
    value: number;
    startDate: string | Date;
    endDate: string | Date;
    status: CovenantStatus | string;
    auditorNotes?: string | null;
}

export interface Expense {
    id: string;
    number: string;
    description: string;
    date: string | Date;
    value: number;
    document?: ProposalDocument;
    auditorNotes?: string | null;
}

export interface Accountability {
    id: string;
    entityId: string;
    covenantId: string;
    status: AccountabilityStatus | string;
    submittedAt?: string | Date | null;
    auditorNotes?: string | null;
    locked: boolean;
    justification?: string | null;
    documents: ProposalDocument[];
    expenses: Expense[];
}

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
}

interface AppContextType {
    user: User | null; // Legacy
    currentUser: User;
    selectedEntityId: string | null; // For Admin/Auditor navigation context
    selectedCovenantId: string | null; // For Entity navigation context
    proposals: Proposal[];
    entities: Entity[];
    covenants: Covenant[];
    accountabilities: Accountability[];
    notifications: Notification[];
    systemSettings: SystemSettings;
    systemUsers: SystemUser[];
    addEntity: (entity: Entity) => void;
    addProposal: (proposal: Proposal) => void;
    updateProposalStatus: (id: string, status: ProposalStatus) => void;
    deleteProposal: (id: string) => void;
    updateProposalWorkPlan: (id: string, workPlan: WorkPlan) => void;
    addProposalDocument: (id: string, document: ProposalDocument) => void;
    switchUser: (role: UserRole, entityId?: string) => void;
    selectEntity: (id: string | null) => void;
    selectCovenant: (id: string | null) => void;
    updateAuditorNotes: (type: 'ENTITY' | 'PROPOSAL' | 'COVENANT' | 'ACCOUNTABILITY', id: string, notes: string) => void;
    canEditData: () => boolean; // Helper to check if current user can edit entity data
    canEditAuditorNotes: () => boolean; // Helper to check if current user can edit auditor notes
    checkPermission: (permission: Permission) => boolean; // New permission check
    submitAccountability: (covenantId: string) => void;
    unlockAccountability: (covenantId: string, justification: string) => void;
    addAccountabilityDocument: (covenantId: string, document: ProposalDocument) => void;
    addExpense: (covenantId: string, expense: Expense) => void;
    updateExpenseAuditorNotes: (covenantId: string, expenseId: string, notes: string) => void;
    deleteEntity: (id: string) => void; // Added deleteEntity
    updateSystemSettings: (settings: SystemSettings) => void;
    addSystemUser: (user: SystemUser) => void;
    updateSystemUser: (user: SystemUser) => void;
    removeSystemUser: (id: string) => void;
    addNotification: (message: string, type: Notification['type']) => void;
    removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Mock Data ---

const INITIAL_ENTITIES: Entity[] = [
    { id: '1', name: 'Associação Amigos do Bairro', cnpj: '12.345.678/0001-90', address: 'Rua das Flores, 123', president: 'João da Silva', auditorNotes: 'Documentação regular.' },
    { id: '2', name: 'Instituto Criança Feliz', cnpj: '98.765.432/0001-10', address: 'Av. Central, 500', president: 'Maria Oliveira', auditorNotes: 'Pendente certidão estadual.' },
    { id: '3', name: 'ONG Viver Bem', cnpj: '11.222.333/0001-55', address: 'Praça da Paz, 45', president: 'Carlos Santos' },
];

const INITIAL_PROPOSALS: Proposal[] = [
    {
        id: '1',
        entityId: '1',
        object: 'Reforma da Quadra Poliesportiva',
        value: 150000,
        status: 'UNDER_ANALYSIS',
        createdAt: '2023-11-01',
        auditorNotes: 'Verificar planilha orçamentária.',
        workPlan: {
            justification: 'A quadra encontra-se em estado precário.',
            targetAudience: 'Crianças e adolescentes do bairro.',
            goals: [{ id: 'g1', description: 'Reformar o piso', deadline: '2023-12-31' }],
            financialPlan: [{ id: 'fp1', description: 'Material de construção', quantity: 1, unitValue: 50000, totalValue: 50000 }]
        },
        documents: []
    },
    {
        id: '2',
        entityId: '2',
        object: 'Projeto Música para Todos',
        value: 80000,
        status: 'DRAFT',
        createdAt: '2023-11-10',
        workPlan: {
            justification: '',
            targetAudience: '',
            goals: [],
            financialPlan: []
        },
        documents: []
    },
];

const INITIAL_COVENANTS: Covenant[] = [
    { id: '1', entityId: '1', proposalId: '1', object: 'Reforma da Quadra Poliesportiva', value: 150000, startDate: '2023-01-10', endDate: '2023-12-31', status: 'ACTIVE' },
    { id: '2', entityId: '1', proposalId: '2', object: 'Projeto Música para Todos', value: 80000, startDate: '2023-02-15', endDate: '2023-12-31', status: 'ACTIVE' }
];

const INITIAL_ACCOUNTABILITIES: Accountability[] = [
    { id: '1', entityId: '1', covenantId: '1', status: 'PENDING', locked: false, documents: [], expenses: [] }
];

const INITIAL_SYSTEM_USERS: SystemUser[] = [
    {
        id: 'admin',
        name: 'Administrador',
        email: 'admin@sistema.gov.br',
        role: 'ADMIN',
        permissions: ['sys_admin', 'entity_delete', 'proposal_review', 'auditor_notes'],
        active: true
    },
    {
        id: 'auditor',
        name: 'Auditor Interno',
        email: 'auditor@sistema.gov.br',
        role: 'AUDITOR',
        permissions: ['auditor_notes'],
        active: true
    }
];

const INITIAL_SETTINGS: SystemSettings = {
    orgName: 'Controladoria Geral',
    fiscalYear: '2024',
    notifyProposals: true,
    notifyDeadlines: true
};

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User>({ id: 'admin', name: 'Administrador', role: 'ADMIN' });
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [selectedCovenantId, setSelectedCovenantId] = useState<string | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [covenants, setCovenants] = useState<Covenant[]>(INITIAL_COVENANTS);
    const [accountabilities, setAccountabilities] = useState<Accountability[]>(INITIAL_ACCOUNTABILITIES);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
    const [systemUsers, setSystemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entitiesRes, proposalsRes] = await Promise.all([
                    fetch('/api/entities'),
                    fetch('/api/proposals')
                ]);

                if (entitiesRes.ok) {
                    const data = await entitiesRes.json();
                    setEntities(data);
                }
                if (proposalsRes.ok) {
                    const data = await proposalsRes.json();
                    // Map Prisma structure to AppContext structure if needed, or ensure they match
                    setProposals(data);
                }
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                addNotification('Erro ao carregar dados do servidor.', 'error');
            }
        };

        fetchData();
    }, []);

    const addNotification = (message: string, type: Notification['type']) => {
        const notification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now(),
        };
        setNotifications(prev => [...prev, notification]);
        setTimeout(() => {
            removeNotification(notification.id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const switchUser = (role: UserRole, entityId?: string) => {
        setSelectedEntityId(null); // Reset selection on switch
        setSelectedCovenantId(null); // Reset covenant selection
        if (role === 'ADMIN') {
            const admin = systemUsers.find(u => u.role === 'ADMIN' && u.active) || systemUsers[0];
            setCurrentUser({ id: admin.id, name: admin.name, role: 'ADMIN' });
        } else if (role === 'AUDITOR') {
            const auditor = systemUsers.find(u => u.role === 'AUDITOR' && u.active) || { id: 'auditor', name: 'Auditor', role: 'AUDITOR' };
            setCurrentUser({ id: auditor.id, name: auditor.name, role: 'AUDITOR' });
        } else {
            const entity = entities.find(e => e.id === entityId);
            setCurrentUser({ id: entityId!, name: entity?.name || 'Entidade', role: 'ENTITY', entityId });
        }
        addNotification(`Perfil alterado para: ${role}`, 'info');
    };

    const selectEntity = (id: string | null) => {
        setSelectedEntityId(id);
    };

    const selectCovenant = (id: string | null) => {
        setSelectedCovenantId(id);
    };

    const checkPermission = (permission: Permission): boolean => {
        if (currentUser.role === 'ENTITY') return false; // Entities have no system permissions

        // Find the current system user to check their specific permissions
        const sysUser = systemUsers.find(u => u.id === currentUser.id);
        if (!sysUser || !sysUser.active) return false;

        return sysUser.permissions.includes(permission);
    };

    const canEditData = () => {
        // Admin/Auditor are read-only for entity data unless they have specific permission (none currently defined for editing entity data directly)
        if (currentUser.role === 'ADMIN' || currentUser.role === 'AUDITOR') return false;

        // Entity can edit unless locked
        if (currentUser.role === 'ENTITY') {
            if (selectedCovenantId) {
                const acc = accountabilities.find(a => a.covenantId === selectedCovenantId);
                if (acc?.locked) return false;
            }
            return true;
        }
        return false;
    };

    const canEditAuditorNotes = () => {
        return checkPermission('auditor_notes');
    };

    const addEntity = async (entity: Entity) => {
        try {
            const res = await fetch('/api/entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entity)
            });

            if (res.ok) {
                const newEntity = await res.json();
                setEntities([newEntity, ...entities]);
                addNotification('Entidade cadastrada com sucesso!', 'success');
            } else {
                throw new Error('Failed to create entity');
            }
        } catch (error) {
            console.error(error);
            addNotification('Erro ao cadastrar entidade.', 'error');
        }
    };

    const addProposal = async (proposal: Proposal) => {
        try {
            const res = await fetch('/api/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proposal)
            });

            if (res.ok) {
                const newProposal = await res.json();
                setProposals([...proposals, newProposal]);
                addNotification('Proposta criada com sucesso!', 'success');
            } else {
                throw new Error('Failed to create proposal');
            }
        } catch (error) {
            console.error(error);
            addNotification('Erro ao criar proposta.', 'error');
        }
    };

    const updateProposalStatus = (id: string, status: ProposalStatus) => {
        setProposals(proposals.map(p => p.id === id ? { ...p, status } : p));
        const statusText = status === 'APPROVED' ? 'aprovada' : 'reprovada';
        addNotification(`Proposta ${statusText} com sucesso!`, status === 'APPROVED' ? 'success' : 'warning');
    };

    const deleteProposal = (id: string) => {
        setProposals(proposals.filter(p => p.id !== id));
        addNotification('Proposta removida com sucesso!', 'success');
    };

    const updateProposalWorkPlan = (id: string, workPlan: WorkPlan) => {
        setProposals(proposals.map(p => p.id === id ? { ...p, workPlan } : p));
        addNotification('Plano de trabalho atualizado!', 'success');
    };

    const addProposalDocument = (id: string, document: ProposalDocument) => {
        setProposals(proposals.map(p => p.id === id ? { ...p, documents: [...p.documents, document] } : p));
        addNotification('Documento anexado com sucesso!', 'success');
    };

    const updateAuditorNotes = (type: 'ENTITY' | 'PROPOSAL' | 'COVENANT' | 'ACCOUNTABILITY', id: string, notes: string) => {
        if (type === 'PROPOSAL') {
            setProposals(proposals.map(p => p.id === id ? { ...p, auditorNotes: notes } : p));
        } else if (type === 'ENTITY') {
            setEntities(entities.map(e => e.id === id ? { ...e, auditorNotes: notes } : e));
        } else if (type === 'COVENANT') {
            setCovenants(covenants.map(c => c.id === id ? { ...c, auditorNotes: notes } : c));
        } else if (type === 'ACCOUNTABILITY') {
            setAccountabilities(accountabilities.map(a => a.id === id ? { ...a, auditorNotes: notes } : a));
        }
        addNotification('Anotações salvas com sucesso!', 'success');
    };

    const submitAccountability = (covenantId: string) => {
        setAccountabilities(prev => {
            const exists = prev.find(a => a.covenantId === covenantId);
            if (exists) {
                return prev.map(a => a.covenantId === covenantId ? { ...a, status: 'SUBMITTED', locked: true, submittedAt: new Date().toISOString() } : a);
            } else {
                const covenant = covenants.find(c => c.id === covenantId);
                return [...prev, {
                    id: Math.random().toString(),
                    entityId: covenant?.entityId || '',
                    covenantId,
                    status: 'SUBMITTED',
                    locked: true,
                    submittedAt: new Date().toISOString(),
                    documents: [],
                    expenses: []
                }];
            }
        });
        addNotification('Prestação de contas enviada!', 'success');
    };

    const unlockAccountability = (covenantId: string, justification: string) => {
        setAccountabilities(prev => prev.map(a => a.covenantId === covenantId ? { ...a, locked: false, justification } : a));
        addNotification('Prestação de contas desbloqueada!', 'info');
    };

    const addAccountabilityDocument = (covenantId: string, document: ProposalDocument) => {
        setAccountabilities(prev => prev.map(a => a.covenantId === covenantId ? { ...a, documents: [...a.documents, document] } : a));
        addNotification('Comprovante anexado com sucesso!', 'success');
    };

    const addExpense = (covenantId: string, expense: Expense) => {
        setAccountabilities(prev => {
            const exists = prev.find(a => a.covenantId === covenantId);
            if (exists) {
                return prev.map(a => a.covenantId === covenantId ? { ...a, expenses: [...a.expenses, expense] } : a);
            } else {
                const covenant = covenants.find(c => c.id === covenantId);
                return [...prev, {
                    id: Math.random().toString(),
                    entityId: covenant?.entityId || '',
                    covenantId,
                    status: 'PENDING',
                    locked: false,
                    documents: [],
                    expenses: [expense]
                }];
            }
        });
        addNotification('Despesa lançada com sucesso!', 'success');
    };

    const updateExpenseAuditorNotes = (covenantId: string, expenseId: string, notes: string) => {
        setAccountabilities(prev => prev.map(a => {
            if (a.covenantId === covenantId) {
                return {
                    ...a,
                    expenses: a.expenses.map(e => e.id === expenseId ? { ...e, auditorNotes: notes } : e)
                };
            }
            return a;
        }));
        addNotification('Anotação na despesa salva!', 'success');
    };

    const deleteEntity = (id: string) => {
        setEntities(entities.filter(e => e.id !== id));
        addNotification('Entidade excluída com sucesso!', 'success');
    };

    const updateSystemSettings = (settings: SystemSettings) => {
        setSystemSettings(settings);
        addNotification('Configurações atualizadas!', 'success');
    };

    const addSystemUser = (user: SystemUser) => {
        setSystemUsers([...systemUsers, user]);
        addNotification('Usuário adicionado com sucesso!', 'success');
    };

    const updateSystemUser = (user: SystemUser) => {
        setSystemUsers(systemUsers.map(u => u.id === user.id ? user : u));
        addNotification('Usuário atualizado com sucesso!', 'success');
    };

    const removeSystemUser = (id: string) => {
        setSystemUsers(systemUsers.filter(u => u.id !== id));
        addNotification('Usuário removido com sucesso!', 'success');
    };

    return (
        <AppContext.Provider value={{
            user: currentUser,
            currentUser,
            selectedEntityId,
            selectedCovenantId,
            proposals,
            entities,
            covenants,
            accountabilities,
            notifications,
            systemSettings,
            systemUsers,
            addEntity,
            addProposal,
            updateProposalStatus,
            deleteProposal,
            updateProposalWorkPlan,
            addProposalDocument,
            switchUser,
            selectEntity,
            selectCovenant,
            updateAuditorNotes,
            canEditData,
            canEditAuditorNotes,
            checkPermission,
            submitAccountability,
            unlockAccountability,
            addAccountabilityDocument,
            addExpense,
            updateExpenseAuditorNotes,
            deleteEntity,
            updateSystemSettings,
            addSystemUser,
            updateSystemUser,
            removeSystemUser,
            addNotification,
            removeNotification
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
