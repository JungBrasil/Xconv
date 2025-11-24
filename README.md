# XConv - Sistema de Gestão de Convênios

Sistema completo para gestão de parcerias entre Prefeitura e Terceiro Setor.

## 🚀 Como Usar

### Iniciar o Sistema
```bash
cd web
npm run dev
```

Acesse: **http://localhost:3000**

## ✨ Funcionalidades Implementadas

### 📋 Gestão de Entidades
- Listar entidades cadastradas
- Cadastrar nova entidade
- Ver detalhes da entidade
- Excluir entidade (com confirmação)
- Status badges (Regular, Pendente, Irregular)

### 📝 Gestão de Propostas
- Listar propostas
- Filtrar por status (Todas, Rascunhos, Em Análise, Aprovadas)
- Criar nova proposta (wizard 3 passos)
- Ver detalhes completos da proposta
- **Aprovar proposta** (apenas se status = Em Análise)
- **Reprovar proposta** (com confirmação)
- Excluir proposta (com confirmação)

### 💰 Execução Financeira
- Dashboard com barras de progresso
- Exportar relatório financeiro
- Registrar novo empenho
- Registrar ordem de pagamento
- Visualizar movimentações recentes

### 🧾 Prestação de Contas
- Dashboard de saldo (Recebido, Gasto, Saldo)
- Lançar nova despesa
- **Aprovar despesa** (botão ✓)
- **Reprovar despesa** (botão ✕ com confirmação)
- Extrato completo de despesas

### 🛡️ Auditoria
- Trilha de auditoria completa
- Relatórios de conformidade
- Geração de relatórios IA (mockup)

## 🔔 Sistema de Notificações

Todas as ações geram notificações visuais:
- ✅ Sucesso (verde)
- ⚠️ Aviso (amarelo)
- ℹ️ Informação (azul)
- ✕ Erro (vermelho)

Notificações desaparecem automaticamente após 5 segundos.

## 🎨 Design

- Paleta moderna com gradientes
- Glassmorphism em cards e sidebar
- Animações suaves
- Modo escuro automático
- Totalmente responsivo

## 📦 Tecnologias

- Next.js 16 (App Router)
- TypeScript
- Vanilla CSS (CSS Modules)
- Context API (gerenciamento de estado)

## 🎯 Fluxo Completo

1. Cadastrar Entidade
2. Criar Proposta (3 passos)
3. Analisar e Aprovar/Reprovar
4. Formalizar Convênio
5. Executar Financeiramente
6. Prestar Contas
7. Auditar

---

**Desenvolvido com Next.js e muito ☕**
