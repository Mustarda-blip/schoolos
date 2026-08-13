# TASK-001 — AI Collaboration Hub

## Objetivo

Criar a infraestrutura inicial para permitir colaboração organizada entre ChatGPT, Blackbox AI e Lovable no desenvolvimento do SchoolOS.

## Product Owner

Evandro

## Arquitetura

ChatGPT

## Implementação

Blackbox AI

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

## Critérios de conclusão

- Estrutura `.ai` criada.
- Protocolo documentado.
- Instruções de agente disponíveis na raiz.
- Templates de relatório e revisão disponíveis.
- Git funcionando.
- Build funcionando.
- Nenhuma funcionalidade existente quebrada.

## Próxima etapa

Configurar Blackbox e Lovable para consumir o protocolo e registrar trabalho no `.ai/`. Depois, implementar a camada de automação que observa tarefas, relatórios e bloqueios.
