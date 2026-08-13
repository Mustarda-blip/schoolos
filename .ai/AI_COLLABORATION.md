# SchoolOS AI Collaboration Protocol

## Objetivo

Este diretório coordena o trabalho entre:

- Evandro: Product Owner
- ChatGPT: Arquiteto, Planejador e Revisor
- Blackbox AI: Implementação e Debug
- Lovable: UI/UX e Prototipagem

---

# Papéis

## Evandro

Responsável por:

- definir ideias;
- definir prioridades;
- aprovar mudanças importantes;
- decidir conflitos;
- aprovar merge de funcionalidades.

Evandro possui a decisão final sobre o produto.

---

## ChatGPT

Responsabilidades:

- arquitetura;
- planejamento;
- análise de requisitos;
- revisão de código;
- segurança;
- modelagem de dados;
- análise de impacto;
- revisão de Pull Requests;
- identificação de conflitos entre componentes.

ChatGPT não deve assumir que uma implementação está correta sem analisá-la.

---

## Blackbox AI

Responsabilidades:

- implementação;
- criação de componentes;
- implementação de serviços;
- correção de bugs;
- refatoração;
- testes locais;
- correção de TypeScript.

Blackbox deve analisar o código existente antes de modificar arquivos.

---

## Lovable

Responsabilidades:

- UI;
- UX;
- prototipagem;
- design system;
- componentes visuais;
- responsividade;
- acessibilidade visual.

Lovable não deve alterar lógica de negócio ou serviços Firebase sem autorização.

---

# Fluxo de trabalho

Toda tarefa deve possuir um identificador.

Exemplo:

TASK-001

A tarefa começa em:

.ai/inbox/

Depois passa pelas etapas:

1. PLANNING
2. IMPLEMENTATION
3. UI/UX
4. REVIEW
5. APPROVAL
6. COMPLETED

---

# Estados

Uma tarefa pode possuir os seguintes estados:

- TODO
- PLANNING
- IN_PROGRESS
- REVIEW
- BLOCKED
- APPROVED
- REJECTED
- COMPLETED

---

# Comunicação

Cada IA deve registrar suas decisões em arquivos Markdown.

Estrutura:

.ai/
├── inbox/
├── chatgpt/
├── blackbox/
├── lovable/
├── reviews/
├── decisions/
└── completed/

---

# Regra de comunicação

Uma IA nunca deve apagar silenciosamente a decisão de outra IA.

Caso exista conflito:

1. registrar o conflito;
2. explicar o motivo;
3. propor solução;
4. enviar para revisão do ChatGPT;
5. quando necessário, solicitar decisão do Product Owner.

---

# Regra de segurança

Nenhuma IA deve:

- modificar main diretamente;
- apagar funcionalidades existentes sem autorização;
- alterar Firebase Rules sem revisão;
- remover dados;
- alterar arquitetura crítica sem registrar a decisão;
- adicionar dependências sem justificar.

---

# Git

Cada funcionalidade deve utilizar uma branch.

Exemplo:

feature/enrollment

feature/attendance

fix/login-auth

ui/dashboard

Não trabalhar diretamente na main.

---

# Validação

Antes de considerar uma tarefa concluída:

npm run build

Quando possível:

npm run lint

Nenhuma tarefa pode ser marcada como COMPLETED se o build estiver quebrado.

---

# Registro de decisões

Decisões arquiteturais importantes devem ser registradas em:

.ai/decisions/

Formato:

DECISION-001.md

---

# Revisão

Toda alteração importante deve passar por revisão.

A revisão deve verificar:

- arquitetura;
- segurança;
- TypeScript;
- Firebase;
- isolamento por schoolId;
- UX;
- acessibilidade;
- regressões;
- performance.

---

# Princípio principal

As IAs trabalham como uma equipe.

Nenhuma IA é autoridade absoluta.

O objetivo é produzir código seguro, simples, escalável e sustentável.

Evandro possui a decisão final.
