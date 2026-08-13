# TASK-001 — AI Collaboration Hub

## Objetivo

Criar a infraestrutura inicial para permitir colaboração organizada entre ChatGPT, Claude e Lovable no desenvolvimento do SchoolOS.

## Product Owner

Evandro

## Arquitetura

ChatGPT

## Implementação

Claude

## UI/UX

Lovable

## Estado

IN_PROGRESS

## Requisitos

- Criar protocolo de colaboração.
- Criar estrutura `.ai/`.
- Criar instruções compartilhadas para agentes.
- Criar sistema de tarefas.
- Criar sistema de decisões.
- Permitir registro de revisões.
- Manter main protegida.
- Exigir build antes de conclusão.
- Não alterar funcionalidades existentes.
- Preparar o repositório para comunicação assíncrona entre os agentes.
- Definir caminho para futura automação em tempo real via GitHub Actions/MCP/orquestrador.

## Progresso

- Protocolo `.ai/` criado.
- Instruções de agente disponíveis na raiz.
- Templates de relatório/revisão disponíveis.
- Protótipo visual do AI Collaboration Hub criado em `src/pages/AICollaboration.tsx`.
- Estilos responsivos criados em `src/pages/AICollaboration.css`.
- Rota `/ai-collaboration` adicionada ao `App.tsx`.
- Hub inclui discussão, tarefas, decisões, agentes, branch e contexto compartilhado.

## Validação pendente

Executar localmente na branch `feature/ai-collaboration`:

```bash
npm run build
npm run lint
```

Se houver erros relacionados ao protótipo, corrigir antes de considerar a tarefa concluída.

## Próxima etapa

Configurar Claude e Lovable para consumir o protocolo e registrar trabalho no `.ai/`. Depois, implementar a camada de automação que observa tarefas, relatórios e bloqueios.
