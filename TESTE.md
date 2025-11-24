# 🧪 Guia de Teste - XConv System

## Como Testar Todas as Funcionalidades

### 1. Dashboard (/)
- [ ] Visualizar cards de estatísticas
- [ ] Ver propostas recentes
- [ ] Verificar prazos

### 2. Entidades (/entities)
- [ ] Clicar em "Nova Entidade" → Deve abrir formulário
- [ ] Preencher formulário e salvar → Deve mostrar notificação verde
- [ ] Clicar em "Ver Detalhes" → Deve navegar para detalhes
- [ ] Clicar em "Excluir" → Deve pedir confirmação
- [ ] Confirmar exclusão → Deve remover e mostrar notificação

### 3. Propostas (/proposals)
- [ ] Testar filtros: Todas, Rascunhos, Em Análise, Aprovadas
- [ ] Clicar "Nova Proposta" → Deve abrir wizard
- [ ] Completar 3 passos do wizard → Deve criar proposta
- [ ] Clicar "Ver Detalhes" em proposta "Em Análise"
- [ ] Clicar "Aprovar" → Deve pedir confirmação e aprovar
- [ ] Clicar "Reprovar" → Deve pedir confirmação e reprovar
- [ ] Clicar "Excluir" → Deve pedir confirmação e excluir

### 4. Detalhes da Proposta (/proposals/[id])
- [ ] Ver informações completas
- [ ] Ver dados da entidade
- [ ] Ver resumo financeiro
- [ ] Botão "Aprovar" (só aparece se status = Em Análise)
- [ ] Botão "Reprovar" (só aparece se status = Em Análise)
- [ ] Verificar redirecionamento após aprovação

### 5. Financeiro (/finance)
- [ ] Ver dashboard com barras de progresso
- [ ] Clicar "Exportar Relatório" → Deve mostrar 2 notificações
- [ ] Clicar "Novo Empenho" → Deve navegar para formulário
- [ ] Clicar "Nova OP" → Deve navegar para formulário
- [ ] Ver tabela de movimentações

### 6. Prestação de Contas (/accountability)
- [ ] Ver saldo (Recebido, Gasto, Saldo)
- [ ] Clicar "Lançar Despesa" → Deve navegar para formulário
- [ ] Clicar botão ✓ (Aprovar) em despesa pendente
- [ ] Clicar botão ✕ (Reprovar) → Deve pedir confirmação
- [ ] Ver notificações de sucesso/aviso

### 7. Auditoria (/audit)
- [ ] Ver trilha de auditoria
- [ ] Ver estatísticas de conformidade
- [ ] Navegar para relatórios IA

### 8. Sistema de Notificações
- [ ] Verificar que todas as ações mostram notificações
- [ ] Verificar que notificações desaparecem após 5 segundos
- [ ] Clicar no X para fechar manualmente
- [ ] Verificar cores: verde (sucesso), amarelo (aviso), azul (info)

### 9. Navegação
- [ ] Testar todos os links da sidebar
- [ ] Verificar que página ativa está destacada
- [ ] Testar botão "Voltar" nas páginas de detalhes

### 10. Design
- [ ] Verificar hover effects nos cards
- [ ] Verificar animações de entrada nas páginas
- [ ] Verificar gradientes na sidebar
- [ ] Verificar glassmorphism nos cards
- [ ] Testar responsividade (redimensionar janela)

## ✅ Checklist de Funcionalidades Críticas

- [ ] Criar entidade → Notificação → Aparece na lista
- [ ] Excluir entidade → Confirmação → Notificação → Removida da lista
- [ ] Criar proposta → Wizard 3 passos → Notificação → Aparece na lista
- [ ] Filtrar propostas → Mostra apenas as do filtro selecionado
- [ ] Aprovar proposta → Notificação → Status muda → Redireciona
- [ ] Reprovar proposta → Confirmação → Notificação → Status muda
- [ ] Exportar relatório → 2 notificações (sucesso + download)
- [ ] Aprovar despesa → Notificação verde
- [ ] Reprovar despesa → Confirmação → Notificação amarela

## 🎯 Teste Rápido (5 minutos)

1. Vá para /entities → Clique "Excluir" → Confirme → Veja notificação
2. Vá para /proposals → Teste os 4 filtros
3. Clique em "Ver Detalhes" de uma proposta "Em Análise"
4. Clique "Aprovar" → Veja notificação → Volte para lista
5. Vá para /accountability → Clique ✓ em uma despesa pendente
6. Vá para /finance → Clique "Exportar Relatório"

Se todos esses passos funcionarem, o sistema está 100% operacional! ✅
