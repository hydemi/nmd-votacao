# Protótipos de Votação Rápida para o CAB (Conselho Consultivo de Mudanças)

Interface de alta performance para membros do CAB avaliarem e votarem dezenas de mudanças planejadas para janelas de fim de semana com máxima agilidade, mantendo alto rigor técnico na análise de atividades, tarefas, responsáveis, horários e planos de rollback.

### Decisões Confirmadas e Alinhamentos

> [!IMPORTANT]
> Decisões consolidadas a partir do alinhamento inicial:
> - **3 Protótipos Alternáveis**: Implementação de um seletor no topo da aplicação que permite ao colegiado testar e comparar 3 abordagens de UX:
>   1. **Fila Rápida (Speed Triage & Hotkeys)**: Focado em produtividade máxima, navegação teclado/clique rápido, painel lateral com resumo executivo e ação de voto instantânea com ressalva inline.
>   2. **Cockpit Executivo & Linha do Tempo (Weekend Timeline & Conflict Hub)**: Focado na sincronização de horários de fim de semana (Sábado/Domingo), detecção de janelas concorrentes em serviços críticos e visualização tabular categorizada.
>   3. **Painel Kanban de Governança & Quórum**: Organização por status de deliberação (Em Votação, Aprovada sem Ressalva, Aprovada com Ressalva, Bloqueada/Rejeitada) com matriz matricial de votos das 7 áreas.
> - **Simulador de Perfil da Área Votante**: O usuário pode atuar como representante de qualquer uma das 7 áreas técnicas do CAB (**GEMOL**, **GETIS**, **GMIB**, **GEDAN**, **GEROP**, **GEMUD**, **SUDEC**) para emitir votos (Favorável, Favorável com Ressalva, Contrário, Abstenção) e redigir ressalvas formais.
> - **Visualização Técnica Agrupada por Categoria**: Tabela detalhada de tarefas dividida por categorias (**DML**, **Deploy**, **Configuração de Infra**, **Firewall/Redes**, **Testes de Fumaça**) com início, término, grupo designado e status.
> - **Inspeção Imediata do Rollback**: Seção de contingência em evidência (tempo estimado de retorno, responsável e gatilhos de aborto de mudança).

---

## 1. Visão Geral e Conceito do Produto

- **O que faz**: Permite que os conselheiros do CAB analisem uma pauta pesada de mudanças de fim de semana com velocidade de triagem sem perder a visibilidade dos detalhes essenciais: impacto no serviço, horários de execução, quem executa cada tarefa, se há risco de banco/rede e se o plano de rollback é seguro.
- **Público-alvo**: Membros e coordenadores do CAB representando áreas estratégicas e técnicas (GEMUD, GETIS, GEMOL, GMIB, GEDAN, GEROP, SUDEC).
- **Valor Principal**: Redução drástica do tempo de reunião e análise assíncrona, eliminando navegação labiríntica e permitindo decisões fundamentadas com um clique.

---

## 2. Experiência do Usuário e Design Visual

### 2.1 Os Três Protótipos de Interface

1. **Protótipo 1 — Fila Rápida (Speed Triage)**:
   - *Layout*: Lista de mudanças à esquerda com badges de quórum e serviço afetado; à direita, painel de inspeção unificado.
   - *Recursos*: Atalhos de teclado (`A` para Aprovar, `C` para Ressalva, `R` para Rejeitar, setas para navegar), barra de voto fixada, checklist rápido de itens críticos.
2. **Protótipo 2 — Cockpit de Fim de Semana (Timeline & Conflitos)**:
   - *Layout*: Régua cronológica das janelas de Sábado 00:00 até Domingo 23:59, destacando horários de pico e serviços interconectados.
   - *Recursos*: Identificação visual de sobreposição de mudanças no mesmo serviço/banco, tabela técnica com visualização de categoria sanfonada.
3. **Protótipo 3 — Painel Kanban de Consenso & Quórum**:
   - *Layout*: Colunas por status de aprovação com matriz expandida de votos dos 7 órgãos técnicos.
   - *Recursos*: Votação em lote para mudanças de baixo risco (Standard/Menor risco), visualização do painel de ressalvas com filtros por área.

### 2.2 Estrutura Visual e Anti-Slop
- **Paleta**: Slate corporativo neutro e sofisticado (`#0F172A`, `#1E293B`, `#F8FAFC`), com acentos de alta legibilidade para estados de votação:
  - Esmeralda (`#16A34A`): Aprovado / Favorável
  - Âmbar (`#D97706`): Favorável com Ressalva / Janela de Atenção
  - Carmesim (`#DC2626`): Contrário / Risco Crítico
  - Índigo/Ardósia (`#475569`): Pendente / Abstenção
- **Tipografia**: `Plus Jakarta Sans` para interface e cabeçalhos nítidos; `JetBrains Mono` / `tabular-nums` para horários, códigos de mudança (ex.: `CHG-2026-0412`), IDs e janelas de execução.
- **Zero-Pill**: Metadados formatados com separadores tipográficos limpos (`PIX · Janela: Sáb 22:00–02:00 · 4 tarefas`), reservando botões e abas para ações funcionais.

---

## 3. Arquitetura Técnica e Modelo de Dados

### 3.1 Diagrama de Componentes e Fluxo

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Barra Superior de Governança                         │
│  [Protótipo: Fila | Cockpit | Kanban]  [Área Ativa: GEMUD/GETIS/etc]   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴─────────────────────────┐
           ▼                                                  ▼
┌───────────────────────────────┐              ┌─────────────────────────┐
│     Visão Ativa               │              │   Modal / Gaveta        │
│ ├─ Protótipo 1: Fila Rápida   │              │ ├─ Formulário de Voto   │
│ ├─ Protótipo 2: Cockpit Horas │◄────────────►│ │  (Parecer + Ressalva) │
│ └─ Protótipo 3: Kanban Quórum │              │ ├─ Tabela de Atividades │
│                               │              │ └─ Detalhe de Rollback  │
└───────────────────────────────┘              └─────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Estado Centralizado (CABStore)                        │
│ - Mudanças do Fim de Semana (Título, Serviço, Atividades, Rollback)    │
│ - Matriz de Votos por Área (GEMOL, GETIS, GMIB, GEDAN, GEROP, GEMUD,   │
│   SUDEC) e Histórico de Ressalvas                                      │
│ - Filtros de Busca, Categoria Técnica e Status                         │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Estrutura dos Dados

- **Mudança**:
  - `id`: Ex. `"CHG-2026-0814"`
  - `titulo`: Ex. `"Migração do Barramento de Mensageria PIX para Cluster v3"`
  - `servicoAfetado`: Ex. `"PIX & Transferências Instantâneas"`
  - `criticidade`: `"Crítica"` | `"Alta"` | `"Média"` | `"Baixa"`
  - `descricao`: Texto contextual com impacto arquitetural e justificativa de negócio.
  - `janela`: Início e término planejado (ex.: `"10/10 22:00"` a `"11/10 02:30"`).
  - `atividades`: Array com categoria (`"DML"`, `"Deploy"`, `"Infraestrutura"`, `"Firewall/Redes"`, `"Testes"`), descrição detalhada, horário de início, término e grupo designado (ex: `"DBA Core"`, `"DevOps Pagamentos"`).
  - `rollback`: Array de passos de contingência, tempo estimado de retorno (ex.: `"45 min"`) e critério de acionamento do rollback.
  - `votos`: Objeto mapeando cada uma das 7 áreas:
    - `"GEMOL"` | `"GETIS"` | `"GMIB"` | `"GEDAN"` | `"GEROP"` | `"GEMUD"` | `"SUDEC"`
    - Estado do voto: `"favoravel"` | `"ressalva"` | `"contrario"` | `"pendente"` | `"abstencao"`
    - `ressalvaTexto`: Justificativa técnica ou condição para aprovação.
    - `dataHora`: Timestamp do registro.

---

## 4. Etapas de Execução

1. **Configuração de Metadados e Estilos**: Atualizar `metadata.json` com nome e propósito do app, e index.html com títulos em português.
2. **Camada de Dados do CAB**: Criação de dataset rico e realista com 8 mudanças representativas de fins de semana (com sistemas variados, sobreposição de janelas, tarefas DML, Deploy, Firewall, e votos parciais das 7 áreas com ressalvas).
3. **Módulo de Alternância de Área Votante**: Barra de contexto que permite selecionar qual conselheiro está logado (GEMUD, GETIS, etc.), computando automaticamente o quórum de aprovação.
4. **Protótipo 1 (Fila Rápida)**: Implementação do layout de triagem ágil com atalhos de teclado, split-view e voto em 1 clique.
5. **Protótipo 2 (Cockpit Executivo & Linha do Tempo)**: Régua de 48h de fim de semana, indicador de concorrência de serviços e agrupamento técnico de tarefas.
6. **Protótipo 3 (Painel Kanban de Governança)**: Visualização em colunas por consenso, resumo de ressalvas registradas e contadores de quórum.
7. **Tabela de Atividades & Inspeção de Rollback**: Componente reutilizável com agrupamento visual por categoria técnica, tempos e validação do plano de retorno.
8. **Compilação e Verificação**: Teste de compilação sem erros (`compile_applet`).
