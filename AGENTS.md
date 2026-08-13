# SchoolOS — AI Agent Instructions

Antes de alterar qualquer código:

1. Leia `.ai/AI_COLLABORATION.md`.
2. Leia a tarefa ativa em `.ai/inbox/`.
3. Analise os arquivos existentes e o estado da branch.
4. Não altere `main` diretamente.
5. Não apague funcionalidades existentes sem autorização.
6. Não invente APIs, serviços ou estruturas sem verificar o projeto.
7. Preserve o isolamento por `schoolId`.
8. Evite alterações fora do escopo da tarefa.
9. Depois de alterações importantes, execute `npm run build` e, quando possível, `npm run lint`.
10. Registre bloqueios, decisões e descobertas em `.ai/`.

## Papéis

- **Evandro**: Product Owner e autoridade final sobre produto e prioridades.
- **ChatGPT**: arquitetura, planejamento, segurança, análise e revisão.
- **Blackbox AI**: implementação, debugging, refatoração e testes locais.
- **Lovable**: UI/UX, design system, prototipagem, responsividade e acessibilidade.

## Comunicação

Use `.ai/` como memória compartilhada da equipe. Não sobrescreva silenciosamente decisões ou relatórios de outra IA.

Quando encontrar um problema que exija outra IA, registre-o em `.ai/<agente>/` e marque o estado como `BLOCKED` ou `REVIEW` conforme o caso.
