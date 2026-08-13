# SchoolOS AI Collaboration Hub

Este diretório é a memória compartilhada entre Evandro, ChatGPT, Blackbox AI e Lovable.

## Fluxo

```text
Evandro → inbox → ChatGPT/planejamento → Blackbox/implementação → Lovable/UI → revisão → aprovação → completed
```

## Diretórios

- `inbox/`: tarefas novas e tarefas em andamento.
- `chatgpt/`: análises, planos e revisões arquiteturais.
- `blackbox/`: relatórios de implementação, testes e bloqueios.
- `lovable/`: análises de UI/UX e propostas visuais.
- `reviews/`: revisões cruzadas.
- `decisions/`: decisões que precisam permanecer como referência.
- `completed/`: tarefas encerradas.
- `templates/`: modelos de comunicação.

## Regra prática

Git é a memória compartilhada. Branches e Pull Requests são a fronteira de segurança. Nenhum agente deve assumir que uma alteração de outro agente está correta sem revisão.

## Conversa entre agentes

O sistema de arquivos permite comunicação assíncrona. Ele não cria, por si só, uma sessão de conversa em tempo real entre modelos. Para automação futura, o hub pode ser ligado a GitHub Actions, MCP ou um serviço externo de orquestração.
