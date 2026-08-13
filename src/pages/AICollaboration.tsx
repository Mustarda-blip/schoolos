import { useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  Code2,
  GitBranch,
  Github,
  LayoutDashboard,
  MessageSquare,
  Palette,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
import "./AICollaboration.css";

type Agent = {
  id: string;
  name: string;
  role: string;
  status: "online" | "waiting" | "limited";
  icon: typeof Bot;
};

type Message = {
  id: number;
  author: string;
  role: string;
  text: string;
  time: string;
  tone: "human" | "chatgpt" | "claude" | "lovable";
};

type Task = {
  id: string;
  title: string;
  owner: string;
  status: "PLANNING" | "IN PROGRESS" | "REVIEW" | "DONE";
};

const agents: Agent[] = [
  { id: "evandro", name: "Evandro", role: "Product Owner", status: "online", icon: User },
  { id: "chatgpt", name: "ChatGPT", role: "Arquitetura & Review", status: "online", icon: Sparkles },
  { id: "claude", name: "Claude", role: "Implementação & Debug", status: "waiting", icon: Code2 },
  { id: "lovable", name: "Lovable", role: "UI/UX & Protótipos", status: "limited", icon: Palette },
];

const initialMessages: Message[] = [
  {
    id: 1,
    author: "ChatGPT",
    role: "Arquitetura",
    text: "Hub criado. O GitHub será a memória compartilhada entre os agentes. Nenhuma IA deve alterar main diretamente.",
    time: "20:18",
    tone: "chatgpt",
  },
  {
    id: 2,
    author: "Claude",
    role: "Implementação",
    text: "Aguardando a infraestrutura do Hub. Posso trabalhar em uma branch e registrar descobertas em .ai/claude/.",
    time: "20:21",
    tone: "claude",
  },
  {
    id: 3,
    author: "Lovable",
    role: "UI/UX",
    text: "Quando o acesso estiver disponível, assumo as tarefas visuais e mantenho as decisões de design registradas no Hub.",
    time: "20:23",
    tone: "lovable",
  },
];

const initialTasks: Task[] = [
  { id: "TASK-001", title: "Criar infraestrutura de colaboração entre IAs", owner: "ChatGPT", status: "IN PROGRESS" },
  { id: "TASK-002", title: "Protótipo visual do AI Collaboration Hub", owner: "ChatGPT", status: "IN PROGRESS" },
  { id: "TASK-003", title: "Implementar UI/UX do Hub", owner: "Lovable", status: "PLANNING" },
  { id: "TASK-004", title: "Conectar agente de implementação", owner: "Claude", status: "PLANNING" },
];

const statusMeta = {
  PLANNING: { label: "Planejamento", icon: Clock3 },
  "IN PROGRESS": { label: "Em andamento", icon: CircleDot },
  REVIEW: { label: "Em revisão", icon: Search },
  DONE: { label: "Concluído", icon: CheckCircle2 },
};

function AICollaboration() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "tasks" | "decisions">("chat");

  const filteredTasks = useMemo(
    () => initialTasks.filter((task) => `${task.id} ${task.title} ${task.owner}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), author: "Evandro", role: "Product Owner", text, time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }), tone: "human" },
    ]);
    setDraft("");
  }

  return (
    <main className="ai-hub">
      <aside className="ai-sidebar">
        <div className="ai-brand">
          <div className="ai-brand-mark"><Sparkles size={19} /></div>
          <div><strong>SchoolOS</strong><span>AI Collaboration</span></div>
        </div>

        <div className="ai-nav-section">
          <span className="ai-nav-label">WORKSPACE</span>
          <button className="ai-nav-item active"><MessageSquare size={17} /> Sala da equipe</button>
          <button className="ai-nav-item"><LayoutDashboard size={17} /> Visão geral</button>
          <button className="ai-nav-item"><CheckCircle2 size={17} /> Tarefas <em>{initialTasks.length}</em></button>
          <button className="ai-nav-item"><ShieldCheck size={17} /> Decisões</button>
        </div>

        <div className="ai-nav-section">
          <span className="ai-nav-label">INTEGRATIONS</span>
          <div className="ai-integration"><Github size={16} /> GitHub <span className="connected-dot" /></div>
          <div className="ai-integration muted"><Bot size={16} /> Claude <span>waiting</span></div>
          <div className="ai-integration muted"><Palette size={16} /> Lovable <span>limited</span></div>
        </div>

        <div className="ai-sidebar-bottom">
          <div className="branch-card"><GitBranch size={15} /><span>feature/ai-collaboration</span></div>
          <small>main permanece protegida</small>
        </div>
      </aside>

      <section className="ai-main">
        <header className="ai-header">
          <div>
            <div className="breadcrumb">Workspace <span>/</span> AI Collaboration Hub</div>
            <h1>Sala da equipe</h1>
            <p>Um espaço compartilhado para decisões, código e UI/UX.</p>
          </div>
          <div className="ai-header-actions">
            <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar tarefas..." /></div>
            <button className="new-task"><Plus size={17} /> Nova tarefa</button>
          </div>
        </header>

        <div className="agent-strip">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div className="agent-card" key={agent.id}>
                <div className={`agent-avatar ${agent.id}`}><Icon size={18} /></div>
                <div className="agent-info"><strong>{agent.name}</strong><span>{agent.role}</span></div>
                <span className={`agent-status ${agent.status}`}><i />{agent.status === "online" ? "online" : agent.status === "waiting" ? "aguardando" : "limitado"}</span>
              </div>
            );
          })}
        </div>

        <div className="hub-tabs">
          <button className={activeTab === "chat" ? "selected" : ""} onClick={() => setActiveTab("chat")}>Discussão</button>
          <button className={activeTab === "tasks" ? "selected" : ""} onClick={() => setActiveTab("tasks")}>Tarefas <span>{initialTasks.length}</span></button>
          <button className={activeTab === "decisions" ? "selected" : ""} onClick={() => setActiveTab("decisions")}>Decisões</button>
        </div>

        {activeTab === "chat" && (
          <div className="chat-layout">
            <section className="chat-panel">
              <div className="panel-title"><div><h2>Discussão compartilhada</h2><p>Mensagens persistentes serão ligadas ao GitHub posteriormente.</p></div><span className="live"><i /> sala ativa</span></div>
              <div className="messages">
                {messages.map((message) => (
                  <article className={`message ${message.tone}`} key={message.id}>
                    <div className="message-avatar">{message.author === "Evandro" ? <User size={16} /> : message.author === "Lovable" ? <Palette size={16} /> : message.author === "Claude" ? <Code2 size={16} /> : <Sparkles size={16} />}</div>
                    <div className="message-content"><div className="message-meta"><strong>{message.author}</strong><span>{message.role}</span><time>{message.time}</time></div><p>{message.text}</p></div>
                  </article>
                ))}
              </div>
              <div className="composer"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Escreva uma mensagem para a equipe..." rows={2} /><button onClick={sendMessage} aria-label="Enviar mensagem"><Send size={18} /></button><small>Enter envia · Shift+Enter quebra linha</small></div>
            </section>

            <aside className="context-panel">
              <div className="context-heading"><Users size={18} /><strong>Contexto compartilhado</strong></div>
              <div className="context-card"><span>TAREFA ATUAL</span><strong>TASK-001</strong><p>AI Collaboration Hub</p><div className="progress"><span /></div><small>Infraestrutura em andamento</small></div>
              <div className="context-card"><span>REGRAS</span><p>• Não alterar <code>main</code><br />• Registrar decisões em <code>.ai/</code><br />• Executar build antes de concluir<br />• Preservar isolamento por <code>schoolId</code></p></div>
              <div className="context-card"><span>REPOSITÓRIO</span><div className="repo-line"><Github size={15} /><strong>Mustarda-blip/schoolos</strong></div><small>branch: feature/ai-collaboration</small></div>
            </aside>
          </div>
        )}

        {activeTab === "tasks" && (
          <section className="tasks-panel">
            <div className="panel-title"><div><h2>Tarefas da equipe</h2><p>O GitHub será a fonte de verdade quando a sincronização for conectada.</p></div><button className="new-task"><Plus size={17} /> Nova tarefa</button></div>
            <div className="task-list">
              {filteredTasks.map((task) => { const Icon = statusMeta[task.status].icon; return <article className="task-row" key={task.id}><div className="task-id">{task.id}</div><div className="task-name"><strong>{task.title}</strong><span>Responsável: {task.owner}</span></div><span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}><Icon size={14} />{statusMeta[task.status].label}</span></article>; })}
            </div>
          </section>
        )}

        {activeTab === "decisions" && (
          <section className="decisions-panel">
            <div className="panel-title"><div><h2>Decisões arquiteturais</h2><p>Registro que evita decisões contraditórias entre agentes.</p></div></div>
            <article className="decision-card"><span>DEC-001 · 13 AGO 2026</span><h3>GitHub é a memória compartilhada dos agentes</h3><p>ChatGPT coordena arquitetura e revisão; Claude implementa e depura; Lovable concentra UI/UX. A branch main permanece protegida.</p><div><b>Aprovada</b><small>por Evandro</small></div></article>
            <article className="decision-card"><span>DEC-002 · 13 AGO 2026</span><h3>Serviços Firebase não entram no protótipo visual</h3><p>O Hub inicial será local e visual. Integrações reais serão adicionadas depois de validar o fluxo.</p><div><b>Aprovada</b><small>por ChatGPT</small></div></article>
          </section>
        )}
      </section>
    </main>
  );
}

export default AICollaboration;
