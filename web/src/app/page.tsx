'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import styles from './page.module.css';

export default function Dashboard() {
  const { entities, proposals, covenants, accountabilities, currentUser } = useApp();

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalEntities = entities.length;
    const entitiesWithAccountability = accountabilities.filter(a => a.status === 'SUBMITTED').length;
    const entitiesPending = totalEntities - entitiesWithAccountability;

    const proposalsByStatus = {
      draft: proposals.filter(p => p.status === 'DRAFT').length,
      underAnalysis: proposals.filter(p => p.status === 'UNDER_ANALYSIS').length,
      approved: proposals.filter(p => p.status === 'APPROVED').length,
      rejected: proposals.filter(p => p.status === 'REJECTED').length,
    };

    const totalProposals = proposals.length;
    const activeCovenants = covenants.filter(c => c.status === 'ACTIVE').length;
    const completedCovenants = covenants.filter(c => c.status === 'COMPLETED').length;

    return {
      totalEntities,
      entitiesWithAccountability,
      entitiesPending,
      proposalsByStatus,
      totalProposals,
      activeCovenants,
      completedCovenants,
    };
  }, [entities, proposals, covenants, accountabilities]);

  // Dados para gráfico de pizza - Prestação de Contas
  const accountabilityData = [
    { name: 'Prestaram Contas', value: stats.entitiesWithAccountability, color: '#43e97b' },
    { name: 'Pendentes', value: stats.entitiesPending, color: '#f59e0b' },
  ];

  // Dados para gráfico de barras - Propostas por Status
  const proposalsData = [
    { name: 'Rascunho', value: stats.proposalsByStatus.draft, color: '#94a3b8' },
    { name: 'Em Análise', value: stats.proposalsByStatus.underAnalysis, color: '#f59e0b' },
    { name: 'Aprovadas', value: stats.proposalsByStatus.approved, color: '#43e97b' },
    { name: 'Reprovadas', value: stats.proposalsByStatus.rejected, color: '#f5576c' },
  ];

  // Dados para gráfico de linha - Convênios
  const covenantsData = [
    { name: 'Ativos', value: stats.activeCovenants, color: '#06b6d4' },
    { name: 'Concluídos', value: stats.completedCovenants, color: '#a855f7' },
  ];

  const COLORS = ['#43e97b', '#f59e0b', '#06b6d4', '#f5576c', '#a855f7'];

  return (
    <div className="container animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1>Dashboard - Painel de Controle</h1>
          <p className="text-muted">Visão geral do sistema de gestão de convênios</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className={styles.statsGrid}>
        <Card variant="gradient" className={`${styles.statCard} animate-scale-in stagger-1`}>
          <div className={styles.statIcon}>🏢</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalEntities}</div>
            <div className={styles.statLabel}>Entidades Cadastradas</div>
          </div>
        </Card>

        <Card variant="gradient" className={`${styles.statCard} animate-scale-in stagger-2`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalProposals}</div>
            <div className={styles.statLabel}>Propostas Totais</div>
          </div>
        </Card>

        <Card variant="gradient" className={`${styles.statCard} animate-scale-in stagger-3`}>
          <div className={styles.statIcon}>📄</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeCovenants}</div>
            <div className={styles.statLabel}>Convênios Ativos</div>
          </div>
        </Card>

        <Card variant="gradient" className={`${styles.statCard} animate-scale-in stagger-4`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.entitiesWithAccountability}</div>
            <div className={styles.statLabel}>Prestações Enviadas</div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        {/* Gráfico de Pizza - Prestação de Contas */}
        <Card title="Prestação de Contas" subtitle="Status das entidades" className="animate-slide-up stagger-1">
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#43e97b' }}></span>
                <span>Prestaram Contas: {stats.entitiesWithAccountability}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#f59e0b' }}></span>
                <span>Pendentes: {stats.entitiesPending}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Barras - Propostas */}
        <Card title="Propostas por Status" subtitle="Distribuição atual" className="animate-slide-up stagger-2">
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={proposalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {proposalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfico de Linha - Convênios */}
        <Card title="Convênios" subtitle="Ativos vs Concluídos" className="animate-slide-up stagger-3">
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={covenantsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.6)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {covenantsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card de Resumo Geral */}
        <Card title="Resumo Executivo" subtitle="Principais indicadores" className="animate-slide-up stagger-4">
          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Taxa de Prestação de Contas</span>
              <span className={styles.summaryValue}>
                {stats.totalEntities > 0
                  ? ((stats.entitiesWithAccountability / stats.totalEntities) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Taxa de Aprovação de Propostas</span>
              <span className={styles.summaryValue}>
                {stats.totalProposals > 0
                  ? ((stats.proposalsByStatus.approved / stats.totalProposals) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Convênios Ativos</span>
              <span className={styles.summaryValue}>{stats.activeCovenants}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Propostas em Análise</span>
              <span className={styles.summaryValue}>{stats.proposalsByStatus.underAnalysis}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
