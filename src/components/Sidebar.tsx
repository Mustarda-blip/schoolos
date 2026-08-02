import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const menuItems = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", icon: "⌂", path: "/dashboard" },
    ],
  },
  {
    title: "Gestão escolar",
    items: [
      { label: "Alunos", icon: "🎓", path: "/students" },
      { label: "Professores", icon: "👨‍🏫", path: "/teachers" },
      { label: "Turmas", icon: "🏫", path: "/classes" },
      { label: "Disciplinas", icon: "📚", path: "/subjects" },
    ],
  },
  {
    title: "Académico",
    items: [
      { label: "Notas", icon: "📝", path: "/grades" },
      { label: "Presenças", icon: "📅", path: "/attendance" },
    ],
  },
  {
    title: "Administração",
    items: [
      { label: "Financeiro", icon: "💰", path: "/finance" },
      { label: "Relatórios", icon: "📊", path: "/reports" },
      { label: "Avisos", icon: "🔔", path: "/notices" },
      { label: "Utilizadores", icon: "👥", path: "/users" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
      alert("Não foi possível terminar a sessão.");
    }
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>S</div>

        <div>
          <div style={styles.logoTitle}>SchoolOS</div>
          <div style={styles.logoSubtitle}>Gestão escolar</div>
        </div>
      </div>

      <nav style={styles.navigation}>
        {menuItems.map((section) => (
          <div key={section.title} style={styles.section}>
            <div style={styles.sectionTitle}>
              {section.title}
            </div>

            <div style={styles.sectionItems}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    ...styles.link,
                    ...(isActive ? styles.activeLink : {}),
                  })}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div style={styles.bottomArea}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <span style={styles.icon}>⚙️</span>
          <span>Definições</span>
        </NavLink>

        <button
          type="button"
          onClick={() => void handleLogout()}
          style={styles.logoutButton}
        >
          <span style={styles.icon}>↪</span>
          <span>Terminar sessão</span>
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "250px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflowY: "auto",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    display: "grid",
    placeItems: "center",
    background: "#ffffff",
    color: "#111827",
    fontSize: "20px",
    fontWeight: 900,
  },

  logoTitle: {
    fontSize: "17px",
    fontWeight: 800,
  },

  logoSubtitle: {
    marginTop: "2px",
    color: "#9ca3af",
    fontSize: "11px",
  },

  navigation: {
    flex: 1,
    padding: "18px 12px",
  },

  section: {
    marginBottom: "22px",
  },

  sectionTitle: {
    padding: "0 10px",
    marginBottom: "7px",
    color: "#6b7280",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  sectionItems: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "10px 11px",
    borderRadius: "9px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.15s ease",
  },

  activeLink: {
    background: "#ffffff",
    color: "#111827",
  },

  icon: {
    width: "22px",
    textAlign: "center",
    fontSize: "15px",
    flexShrink: 0,
  },

  bottomArea: {
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    border: 0,
    padding: "10px 11px",
    borderRadius: "9px",
    background: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
};
