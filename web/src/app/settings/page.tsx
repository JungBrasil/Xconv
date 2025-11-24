'use client';

import React, { useState, useEffect } from 'react';
import { useApp, SystemUser, PERMISSIONS, Permission } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function SettingsPage() {
    const { currentUser, systemSettings, updateSystemSettings, systemUsers, addSystemUser, updateSystemUser, removeSystemUser, checkPermission } = useApp();

    // Local state for form inputs
    const [orgName, setOrgName] = useState(systemSettings.orgName);
    const [fiscalYear, setFiscalYear] = useState(systemSettings.fiscalYear);
    const [notifyProposals, setNotifyProposals] = useState(systemSettings.notifyProposals);
    const [notifyDeadlines, setNotifyDeadlines] = useState(systemSettings.notifyDeadlines);

    // Local state for user form
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [userFormData, setUserFormData] = useState<Partial<SystemUser>>({
        name: '',
        email: '',
        role: 'AUDITOR',
        active: true,
        permissions: ['auditor_notes']
    });

    // Sync state if context changes
    useEffect(() => {
        setOrgName(systemSettings.orgName);
        setFiscalYear(systemSettings.fiscalYear);
        setNotifyProposals(systemSettings.notifyProposals);
        setNotifyDeadlines(systemSettings.notifyDeadlines);
    }, [systemSettings]);

    if (!checkPermission('sys_admin')) {
        return <div className={styles.container}>Acesso negado. Você não tem permissão para gerenciar configurações.</div>;
    }

    const handleSaveSettings = () => {
        updateSystemSettings({
            orgName,
            fiscalYear,
            notifyProposals,
            notifyDeadlines
        });
    };

    const handleEditUser = (user: SystemUser) => {
        setEditingUser(user);
        setUserFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
            permissions: user.permissions
        });
        setShowUserForm(true);
    };

    const handleSaveUser = () => {
        if (!userFormData.name || !userFormData.email) {
            alert('Preencha nome e e-mail.');
            return;
        }

        if (editingUser) {
            // Update existing user
            updateSystemUser({
                ...editingUser,
                name: userFormData.name!,
                email: userFormData.email!,
                role: userFormData.role as 'ADMIN' | 'AUDITOR',
                active: userFormData.active!,
                permissions: userFormData.permissions!
            });
        } else {
            // Add new user
            addSystemUser({
                id: Math.random().toString(36).substr(2, 9),
                name: userFormData.name!,
                email: userFormData.email!,
                role: userFormData.role as 'ADMIN' | 'AUDITOR',
                active: true,
                permissions: userFormData.permissions!
            });
        }

        setShowUserForm(false);
        setEditingUser(null);
        setUserFormData({ name: '', email: '', role: 'AUDITOR', active: true, permissions: ['auditor_notes'] });
    };

    const handleCancelUserForm = () => {
        setShowUserForm(false);
        setEditingUser(null);
        setUserFormData({ name: '', email: '', role: 'AUDITOR', active: true, permissions: ['auditor_notes'] });
    };

    const togglePermission = (permId: Permission) => {
        const currentPerms = userFormData.permissions || [];
        if (currentPerms.includes(permId)) {
            setUserFormData({ ...userFormData, permissions: currentPerms.filter(p => p !== permId) });
        } else {
            setUserFormData({ ...userFormData, permissions: [...currentPerms, permId] });
        }
    };

    return (
        <div className={`${styles.container} animate-fade-in`}>
            <div className={styles.header}>
                <h1>Configurações do Sistema</h1>
                <p>Gerencie parâmetros globais e permissões de acesso.</p>
            </div>

            <div className={styles.grid}>
                {/* --- General Parameters --- */}
                <div className={styles.card}>
                    <h3>Parâmetros Gerais</h3>
                    <div className={styles.formGroup}>
                        <label>Nome do Órgão</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Exercício Financeiro</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={fiscalYear}
                            onChange={e => setFiscalYear(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
                </div>

                {/* --- Notifications --- */}
                <div className={styles.card}>
                    <h3>Notificações</h3>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={notifyProposals}
                                onChange={e => setNotifyProposals(e.target.checked)}
                            />
                            <span>Notificar novas propostas por e-mail</span>
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={notifyDeadlines}
                                onChange={e => setNotifyDeadlines(e.target.checked)}
                            />
                            <span>Notificar prazos de prestação de contas</span>
                        </label>
                    </div>
                    <Button variant="outline" onClick={() => alert('Funcionalidade simulada: Configuração SMTP aberta.')}>
                        Configurar Servidor SMTP
                    </Button>
                </div>

                {/* --- User Management --- */}
                <div className={`${styles.card} ${styles.fullWidth}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3>Gestão de Usuários e Permissões</h3>
                            <p className="text-muted">Defina quem pode acessar e o que pode fazer no sistema.</p>
                        </div>
                        {!showUserForm && (
                            <Button onClick={() => setShowUserForm(true)}>
                                + Adicionar Usuário
                            </Button>
                        )}
                    </div>

                    {showUserForm && (
                        <div className={styles.userForm}>
                            <h4 className="font-semibold mb-4">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h4>
                            <div className={styles.formGrid}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={userFormData.name}
                                        onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        value={userFormData.email}
                                        onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Função</label>
                                    <select
                                        className={styles.select}
                                        value={userFormData.role}
                                        onChange={e => setUserFormData({ ...userFormData, role: e.target.value as any })}
                                    >
                                        <option value="AUDITOR">Auditor</option>
                                        <option value="ADMIN">Gestor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6 bg-white p-4 rounded border border-gray-200">
                                <h5 className="font-medium mb-3">Permissões de Acesso</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {PERMISSIONS.map(perm => (
                                        <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                checked={userFormData.permissions?.includes(perm.id)}
                                                onChange={() => togglePermission(perm.id)}
                                            />
                                            <span className="text-sm text-gray-700">{perm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={handleCancelUserForm}>Cancelar</Button>
                                <Button onClick={handleSaveUser}>{editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}</Button>
                            </div>
                        </div>
                    )}

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Função</th>
                                    <th>Permissões</th>
                                    <th className="text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {systemUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleAuditor}`}>
                                                {user.role === 'ADMIN' ? 'Gestor' : 'Auditor'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {user.permissions.map(p => (
                                                    <span key={p} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                                        {PERMISSIONS.find(perm => perm.id === p)?.label.split(' ')[0] + '...'}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                                    Editar
                                                </Button>
                                                {user.id !== currentUser.id && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            if (confirm('Remover este usuário?')) removeSystemUser(user.id);
                                                        }}
                                                    >
                                                        Remover
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
