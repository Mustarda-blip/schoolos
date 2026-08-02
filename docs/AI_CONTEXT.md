# SchoolOS — AI Development Context

## Objetivo

SchoolOS é um sistema de gestão escolar desenvolvido com:

- React
- TypeScript
- Vite
- Firebase
- React Router
- Lucide React

O sistema deve ser modular, seguro, escalável e fácil de manter.

---

## Arquitetura atual

src/
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
└── services/

---

## Pages atuais

- Dashboard
- Students
- Teachers
- Classes
- Attendance
- Grades
- Finance
- Login

---

## Services atuais

- firebase.ts
- schoolService.ts
- userService.ts
- studentService.ts
- teacherService.ts
- classService.ts
- attendanceService.ts
- gradeService.ts
- financeService.ts

---

## Regras importantes

1. Não apagar funcionalidades existentes sem autorização.
2. Não substituir a arquitetura atual sem justificar.
3. Reutilizar componentes existentes antes de criar novos.
4. Toda funcionalidade que envolve Firebase deve ficar na camada services quando possível.
5. Não colocar credenciais Firebase diretamente no código.
6. Respeitar o schoolId para isolamento dos dados entre escolas.
7. Não alterar a branch main diretamente durante desenvolvimento de funcionalidades.
8. Antes de grandes alterações, analisar os arquivos existentes.
9. Não criar dependências desnecessárias.
10. Manter TypeScript estrito e código tipado.
11. Não modificar arquivos não relacionados à tarefa.
12. Depois de alterar código, verificar erros TypeScript.
13. Sempre explicar quais arquivos foram alterados.
14. Nunca inventar APIs ou estruturas do projeto sem verificar primeiro.
15. Priorizar código simples, modular e sustentável.

---

## Equipa de desenvolvimento

### Product Owner
Usuário.

Define as ideias e prioridades do produto.

### Arquiteto / Coordenador
ChatGPT.

Responsável por:
- arquitetura
- análise
- planejamento
- revisão
- segurança
- integração das partes

### Implementação
Blackbox AI.

Responsável por:
- implementar código
- criar componentes
- corrigir bugs
- refatorar código quando solicitado

### UI/UX / Prototipagem
Lovable.

Responsável principalmente por:
- interfaces
- experiência do usuário
- protótipos
- componentes visuais

---

## Regra de colaboração

Nenhuma IA deve assumir que sua alteração é automaticamente correta.

Antes de alterar arquitetura ou remover código existente:

1. analisar o projeto;
2. identificar dependências;
3. explicar o impacto;
4. implementar somente após a tarefa estar clara.

---

## Qualidade

Após alterações importantes executar:

npm run build

e corrigir todos os erros TypeScript/build relacionados à alteração.

Quando possível também executar:

npm run lint
