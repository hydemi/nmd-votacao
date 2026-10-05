# Tela da Ata da Reunião da Comissão de Mudanças (CAB - Banco BRB)

Visualização formal da Ata da Reunião da Comissão Consultiva de Mudanças do Banco BRB, estruturada como documento oficial contínuo para auditoria e governança, com navegação rápida por âncoras e formatação profissional para impressão/exportação em PDF.

### Decisões Confirmadas e Alinhamentos

> [!IMPORTANT]
> Decisões consolidadas com base nas respostas do usuário:
> - **Acesso por Aba no Topo**: Adição de um alternador limpo na barra superior institucional do BRB entre **"Fila de Votação (Speed Triage)"** e **"Ata da Reunião"**, além de um botão de ação rápida **"Imprimir / Salvar PDF"**.
> - **Formato de Documento Formal Contínuo**: A ata será exibida como um relatório institucional em folha contínua, com cabeçalho oficial do Banco BRB, numeração de documento (`Ata CAB nº 042/2026`) e barra lateral de navegação rápida por âncoras para saltar diretamente entre as seções.
> - **Consolidação Estática da Pauta**: Apresentação da reunião concluída com o histórico oficial deliberado, sem interferências acidentais de edição, preservando a fidelidade para fins de conformidade e auditoria interna do banco.

---

## 1. Visão Geral e Seções da Ata

A Ata do CAB conterá 5 blocos formais encadeados:

1. **Cabeçalho Institucional & Participantes**:
   - Identificação formal da sessão (`Ata da Reunião Ordinária do CAB nº 042/2026`).
   - Data, horário de início/término e modalidade.
   - Tabela de áreas votantes do BRB com o respectivo representante oficial presente:
     - **GEMUD** (Carlos Eduardo - Coordenação)
     - **GETIS** (Juliana Pires - Segurança da Informação)
     - **GEMOL** (Rogério Dantas - Operações e Logística)
     - **GMIB** (Hélio Castro - Mudanças e Infraestrutura)
     - **GEDAN** (Priscila Novaes - Dados e Analytics)
     - **GEROP** (Alexandre Prado - Redes e Telecom)
     - **SUDEC** (Valéria Rios - Desenvolvimento e Clientes)

2. **Relação de Implantações Apreciadas e Deliberações**:
   - Detalhamento de cada demanda apreciada no fim de semana.
   - Informações da demanda: ID (`CHG-2026-XXXX`), Título, Sistema/Serviço Afetado, Criticidade, Janela Planejada.
   - Relação de tarefas da implantação (Categoria técnica: DML, Deploy, Infra, Firewall, Testes; Horários; Grupos e Responsáveis).
   - Votos nominais registrados por cada uma das 7 áreas do CAB.
   - Ressalvas e condicionantes técnicas registradas formalmente em ata.

3. **Mapa de Riscos das Demandas Apreciadas (Planilha da Equipe de Mudanças)**:
   - Tabela com análise da equipe de governança de mudanças contendo:
     - Demanda (ID e Título)
     - Sistema / Ativo Afetado
     - **Relevância** (Baixa, Média, Alta, Estratégica)
     - **Severidade** (1 a 5)
     - **Probabilidade** (1 a 5)
     - **Nível de Risco** (Pontuação calculada Severidade × Probabilidade)
     - **Classificação de Risco** (Risco Baixo, Moderado, Elevado ou Extremo com indicador visual padronizado)

4. **Agenda Executiva de Implantação (Visão Macro do Fim de Semana)**:
   - Tabela concisa sem o detalhamento passo a passo, fornecendo a visão consolidada de agendamento:
     - Data Prevista / Janela (Sábado/Domingo)
     - Número / ID da Demanda
     - Sistema / Ativo
     - Título da Demanda
     - Área Negocial Requisitante
     - Área Técnica Responsável
     - Áreas Executoras Envolvidas

5. **Termo de Encerramento e Assinaturas Eletrônicas**:
   - Texto de encerramento do comitê com data de publicação e campos para atesto eletrônico dos 7 conselheiros.

---

## 2. Experiência do Usuário e Design Visual

- **Identidade Visual Banco BRB**:
  - Cabeçalho de documento com faixa institucional em Azul BRB (`#003882`), detalhes em Azul Claro (`#00A3E0`), brasão/emblema BRB e tipografia limpa.
  - Tabelas zebradas em tons suaves de azul institucional (`#EBF4FA` e `#F8FAFD`) com bordas nítidas em `#CCE2F2`.
  - Badges semânticos já aprovados mantidos intactos (verde esmeralda, âmbar, carmesim e ardósia).
- **Barra Lateral de Navegação (Índice Flutuante)**:
  - Permite aos conselheiros saltarem com 1 clique para qualquer uma das 4 seções principais ou para uma demanda específica.
- **Preparação para Impressão / PDF (`@media print`)**:
  - Estilos de impressão dedicados que ocultam barras de navegação, expandem o documento para 100% da largura, forçam quebras de página limpas entre seções e garantem contraste perfeito em papel/PDF.

---

## 3. Arquitetura Técnica e Modelo de Dados

### 3.1 Diagrama de Componentes e Fluxo

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Barra Superior BRB                                   │
│  [BRB CAB Votação]   [Aba: Fila Rápida | Aba: Ata da Reunião]   [PDF]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴─────────────────────────┐
           ▼                                                  ▼
┌───────────────────────────────┐              ┌─────────────────────────┐
│     Fila Rápida               │              │   Tela da Ata           │
│   (Speed Triage Queue)        │              │ ├─ Índice de Âncoras    │
│ ├─ Lista de Triagem           │              │ ├─ 1. Dados da Reunião  │
│ ├─ Painel de Inspeção         │              │ ├─ 2. Demandas & Votos  │
│ └─ Voto e Ressalvas           │              │ ├─ 3. Mapa de Risco     │
│                               │              │ ├─ 4. Agenda Macro      │
│                               │              │ └─ 5. Assinaturas       │
└───────────────────────────────┘              └─────────────────────────┘
```

### 3.2 Extensão do Modelo de Dados (`src/types/cab.ts`)

- **Dados de Risco (`RiskAssessment`)**:
  - `relevancia`: `'Baixa' | 'Média' | 'Alta' | 'Estratégica'`
  - `severidade`: number (1 a 5)
  - `probabilidade`: number (1 a 5)
  - `nivelRisco`: number (Severidade × Probabilidade)
  - `classificacaoRisco`: `'Baixo' | 'Moderado' | 'Elevado' | 'Extremo'`
- **Dados da Agenda Macro (`ImplementationSchedule`)**:
  - `dataPrevista`: string (ex.: `'10/10/2026 - 22:00'`)
  - `areaNegocial`: string (ex.: `'Superintendência de Meios de Pagamento'`)
  - `areaTecnica`: string (ex.: `'Gerência de Canais Digitais'`)
  - `areasExecutoras`: string[] (ex.: `['DBA Corporativo', 'SecOps', 'DevOps Pagamentos']`)
- **Dados da Ata (`CABMeetingMinutes`)**:
  - `numeroAta`: string (ex.: `'042/2026'`)
  - `dataRealizacao`: string
  - `horario`: string
  - `local`: string
  - `coordenador`: string
  - `secretario`: string
  - `participantes`: Array com área, nome do representante e cargo.

---

## 4. Etapas de Execução

1. **Atualização do Modelo de Dados (`src/types/cab.ts`)**:
   - Adicionar interfaces para `RiskAssessment`, `ImplementationSchedule` e `CABMeetingMinutes`.
2. **Atualização do Dataset de Mock (`src/data/mockChanges.ts` e `src/data/mockMeetingMinutes.ts`)**:
   - Enriquecer as mudanças com os dados de análise de risco e agenda executiva.
   - Criar arquivo estruturado com as informações oficiais da ata do CAB.
3. **Construção do Componente da Ata (`src/components/CABMeetingMinutesView.tsx`)**:
   - Cabeçalho oficial BRB e dados da reunião.
   - Índice lateral com âncoras de navegação suave.
   - Bloco de demandas apreciadas (tarefas, votos das 7 áreas e ressalvas).
   - Planilha do Mapa de Risco formatada com indicadores de criticidade.
   - Tabela de Agenda de Implantação (visão macro).
   - Termo formal de encerramento e assinaturas.
4. **Integração no Cabeçalho e App (`src/components/Header.tsx` e `src/App.tsx`)**:
   - Alternador de abas no Header ("Fila Rápida" e "Ata da Reunião").
   - Botão "Imprimir / Salvar PDF" acionando a impressão nativa estilizada.
5. **Estilos de Impressão (`src/index.css`)**:
   - Regras `@media print` para exportação limpa em PDF.
6. **Compilação e Verificação**:
   - Validação com `compile_applet` e `lint_applet`.
