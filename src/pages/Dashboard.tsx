import { useNavigate } from "react-router-dom";
import { useSchool } from "../context/SchoolContext";

type ModuleCardProps = {
  title: string;
  description: string;
  icon: string;
  path: string;
};

function ModuleCard({
  title,
  description,
  icon,
  path,
}: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      style={styles.moduleCard}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
        event.currentTarget.style.boxShadow =
          "0 12px 30px rgba(0, 0, 0, 0.08)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow =
          "0 5px 18px rgba(0, 0, 0, 0.04)";
      }}
    >
      <div style={styles.moduleIcon}>{icon}</div>

      <div style={styles.moduleContent}>
        <h3 style={styles.moduleTitle}>{title}</h3>

        <p style={styles.moduleDescription}>
          {description}
        </p>
      </div>

      <span style={styles.moduleArrow}>→</span>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    profile,
    school,
    loading,
  } = useSchool();

  console.log("DASHBOARD: componente iniciou");
  console.log("DASHBOARD:", {
    profile,
    school,
    loading,
  });

  if (loading) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>🏫</div>

          <h2 style={styles.loadingTitle}>
            A carregar SchoolOS...
          </h2>

          <p style={styles.loadingText}>
            Estamos a preparar o painel da sua escola.
          </p>
        </div>
      </main>
    );
  }

  if (!profile || !school) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.errorIcon}>⚠️</div>

          <h1 style={styles.loadingTitle}>
            Não foi possível carregar os dados
          </h1>

          <p style={styles.loadingText}>
            Verifique o perfil do usuário e a escola
            associada no Firestore.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={styles.primaryButton}
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <div style={styles.brand}>
              <div style={styles.brandIcon}>S</div>

              <span style={styles.brandName}>
                SchoolOS
              </span>
            </div>

            <p style={styles.greeting}>
              Bom dia, {profile.name} 👋
            </p>

            <h1 style={styles.title}>
              Painel da escola
            </h1>

            <p style={styles.subtitle}>
              Gerencie alunos, professores, turmas,
              notas, presenças e financeiro.
            </p>
          </div>

          <div style={styles.profileCard}>
            <div style={styles.profileAvatar}>
              {profile.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong style={styles.profileName}>
                {profile.name}
              </strong>

              <span style={styles.profileRole}>
                {profile.role}
              </span>
            </div>
          </div>
        </header>

        {/* SCHOOL INFO */}

        <section style={styles.schoolCard}>
          <div style={styles.schoolIcon}>
            🏫
          </div>

          <div style={styles.schoolInfo}>
            <span style={styles.schoolLabel}>
              ESCOLA
            </span>

            <h2 style={styles.schoolTitle}>
              {school.name}
            </h2>

            <p style={styles.schoolLocation}>
              {school.city || "Localização não definida"}
              {school.country
                ? `, ${school.country}`
                : ""}
            </p>
          </div>

          <div style={styles.schoolStatus}>
            <span style={styles.statusDot} />

            {school.status === "active"
              ? "Ativa"
              : "Inativa"}
          </div>
        </section>

        {/* QUICK INFO */}

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>
              📅
            </span>

            <div>
              <span style={styles.statLabel}>
                ANO LETIVO
              </span>

              <strong style={styles.statValue}>
                {school.academicYear}
              </strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>
              👤
            </span>

            <div>
              <span style={styles.statLabel}>
                PERFIL
              </span>

              <strong style={styles.statValue}>
                {profile.role}
              </strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>
              🔐
            </span>

            <div>
              <span style={styles.statLabel}>
                ACESSO
              </span>

              <strong style={styles.statValue}>
                Autenticado
              </strong>
            </div>
          </div>
        </section>

        {/* MODULES */}

        <section style={styles.modulesSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Gestão escolar
              </h2>

              <p style={styles.sectionSubtitle}>
                Aceda rapidamente aos principais
                módulos do SchoolOS.
              </p>
            </div>
          </div>

          <div style={styles.modulesGrid}>

            <ModuleCard
              title="Alunos"
              description="Cadastrar, pesquisar, editar e gerenciar alunos."
              icon="🎓"
              path="/students"
            />

            <ModuleCard
              title="Professores"
              description="Gerenciar professores, disciplinas e status."
              icon="👨‍🏫"
              path="/teachers"
            />

            <ModuleCard
              title="Turmas"
              description="Criar e organizar turmas e alunos."
              icon="🏫"
              path="/classes"
            />

            <ModuleCard
              title="Notas"
              description="Registar e acompanhar notas e avaliações."
              icon="📊"
              path="/grades"
            />

            <ModuleCard
              title="Presenças"
              description="Controlar presença e faltas dos alunos."
              icon="✅"
              path="/attendance"
            />

            <ModuleCard
              title="Financeiro"
              description="Gerenciar pagamentos, propinas e despesas."
              icon="💰"
              path="/finance"
            />

          </div>
        </section>

        {/* ADMIN AREA */}

        <section style={styles.adminSection}>
          <div>
            <span style={styles.adminLabel}>
              ADMINISTRAÇÃO
            </span>

            <h2 style={styles.adminTitle}>
              Configurações da escola
            </h2>

            <p style={styles.adminText}>
              Gerencie configurações e informações
              administrativas da sua escola.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            style={styles.secondaryButton}
          >
            Configurações →
          </button>
        </section>

        {/* FOOTER */}

        <footer style={styles.footer}>
          <span>
            SchoolOS
          </span>

          <span>
            © {new Date().getFullYear()}
          </span>
        </footer>

      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "32px 24px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#171a1f",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "30px",
    marginBottom: "30px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },

  brandIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "17px",
  },

  brandName: {
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "-0.3px",
  },

  greeting: {
    margin: 0,
    color: "#68707a",
    fontSize: "14px",
    fontWeight: 600,
  },

  title: {
    margin: "5px 0 7px",
    fontSize: "34px",
    lineHeight: 1.15,
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: 0,
    color: "#68707a",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "14px",
    padding: "10px 14px",
    minWidth: "180px",
  },

  profileAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#eef1f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#303640",
  },

  profileName: {
    display: "block",
    fontSize: "13px",
  },

  profileRole: {
    display: "block",
    marginTop: "3px",
    color: "#858c96",
    fontSize: "11px",
    textTransform: "uppercase",
  },

  schoolCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 5px 18px rgba(0, 0, 0, 0.035)",
  },

  schoolIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  schoolInfo: {
    flex: 1,
    minWidth: 0,
  },

  schoolLabel: {
    display: "block",
    color: "#858c96",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.7px",
    marginBottom: "4px",
  },

  schoolTitle: {
    margin: 0,
    fontSize: "19px",
  },

  schoolLocation: {
    margin: "4px 0 0",
    color: "#68707a",
    fontSize: "13px",
  },

  schoolStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 11px",
    borderRadius: "999px",
    background: "#edf8f0",
    color: "#26723c",
    fontSize: "12px",
    fontWeight: 700,
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#36a853",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "34px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "15px",
    padding: "18px",
  },

  statIcon: {
    fontSize: "21px",
  },

  statLabel: {
    display: "block",
    color: "#858c96",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.5px",
    marginBottom: "3px",
  },

  statValue: {
    display: "block",
    fontSize: "14px",
  },

  modulesSection: {
    marginBottom: "30px",
  },

  sectionHeader: {
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#68707a",
    fontSize: "13px",
  },

  modulesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },

  moduleCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    minHeight: "105px",
    padding: "18px",
    border: "1px solid #e9ebef",
    borderRadius: "16px",
    background: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease",
    boxShadow:
      "0 5px 18px rgba(0, 0, 0, 0.04)",
    boxSizing: "border-box",
  },

  moduleIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    background: "#f1f3f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  moduleContent: {
    minWidth: 0,
    flex: 1,
  },

  moduleTitle: {
    margin: "0 0 5px",
    fontSize: "15px",
  },

  moduleDescription: {
    margin: 0,
    color: "#68707a",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  moduleArrow: {
    color: "#8a919b",
    fontSize: "18px",
    flexShrink: 0,
  },

  adminSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "30px",
  },

  adminLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.8px",
    opacity: 0.6,
    marginBottom: "5px",
  },

  adminTitle: {
    margin: 0,
    fontSize: "18px",
  },

  adminText: {
    margin: "5px 0 0",
    color: "#c5cad2",
    fontSize: "13px",
  },

  secondaryButton: {
    border: "1px solid #3a4352",
    borderRadius: "10px",
    padding: "11px 15px",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  primaryButton: {
    border: 0,
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    color: "#9299a3",
    fontSize: "11px",
    padding: "5px 2px 20px",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f7fb",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
  },

  loadingCard: {
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "18px",
    padding: "45px",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.05)",
  },

  loadingIcon: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  errorIcon: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    fontSize: "21px",
  },

  loadingText: {
    margin: "0 0 20px",
    color: "#68707a",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};
