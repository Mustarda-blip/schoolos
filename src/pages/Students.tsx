import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

import {
  createStudent,
  deleteStudent,
  getStudents,
} from "../services/studentService";

import type { Student } from "../services/studentService";
import { useSchool } from "../context/SchoolContext";

export default function Students() {
  const { school, loading: schoolLoading } = useSchool();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [className, setClassName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  async function loadStudents() {
    if (!school) {
      setStudents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getStudents(school.id);

      setStudents(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      alert("Não foi possível carregar os alunos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, [school]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!school) {
      alert("Escola não encontrada.");
      return;
    }

    const cleanName = name.trim();
    const cleanStudentNumber = studentNumber.trim();
    const cleanClassName = className.trim();
    const cleanGuardianName = guardianName.trim();
    const cleanGuardianPhone = guardianPhone.trim();

    if (!cleanName || !cleanStudentNumber) {
      alert("Nome e número de matrícula são obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      await createStudent({
        schoolId: school.id,
        name: cleanName,
        studentNumber: cleanStudentNumber,
        className: cleanClassName,
        guardianName: cleanGuardianName,
        guardianPhone: cleanGuardianPhone,
        status: "active",
      });

      setName("");
      setStudentNumber("");
      setClassName("");
      setGuardianName("");
      setGuardianPhone("");

      setShowForm(false);

      await loadStudents();
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      alert("Não foi possível cadastrar o aluno.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(student: Student) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o aluno "${student.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(student.id);

      await deleteStudent(student.id);

      setStudents((currentStudents) =>
        currentStudents.filter(
          (currentStudent) => currentStudent.id !== student.id
        )
      );
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Não foi possível excluir o aluno.");
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredStudents = useMemo(() => {
    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.studentNumber.toLowerCase().includes(normalizedSearch) ||
        student.className.toLowerCase().includes(normalizedSearch) ||
        student.guardianName.toLowerCase().includes(normalizedSearch) ||
        student.guardianPhone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [students, normalizedSearch]);

  if (schoolLoading || loading) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}>⏳</div>

          <h2 style={styles.loadingTitle}>A carregar alunos...</h2>

          <p style={styles.mutedText}>
            Estamos a preparar a lista de alunos.
          </p>
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.emptyIcon}>🏫</div>

          <h2 style={styles.loadingTitle}>Escola não encontrada</h2>

          <p style={styles.mutedText}>
            Não foi possível encontrar a escola associada à sua conta.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.schoolName}>{school.name}</p>

            <h1 style={styles.title}>Alunos</h1>

            <p style={styles.subtitle}>
              {students.length}{" "}
              {students.length === 1
                ? "aluno cadastrado"
                : "alunos cadastrados"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            style={styles.primaryButton}
          >
            {showForm ? "✕ Fechar" : "+ Novo aluno"}
          </button>
        </header>

        {showForm && (
          <section style={styles.formCard}>
            <div style={styles.formHeader}>
              <div>
                <h2 style={styles.formTitle}>Novo aluno</h2>

                <p style={styles.formSubtitle}>
                  Preencha os dados do aluno.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Nome completo *</label>

                  <input
                    type="text"
                    placeholder="Ex.: João Manuel"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    style={styles.input}
                    disabled={saving}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Número de matrícula *
                  </label>

                  <input
                    type="text"
                    placeholder="Ex.: 2026-001"
                    value={studentNumber}
                    onChange={(event) =>
                      setStudentNumber(event.target.value)
                    }
                    style={styles.input}
                    disabled={saving}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Turma</label>

                  <input
                    type="text"
                    placeholder="Ex.: 10ª A"
                    value={className}
                    onChange={(event) =>
                      setClassName(event.target.value)
                    }
                    style={styles.input}
                    disabled={saving}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Nome do encarregado
                  </label>

                  <input
                    type="text"
                    placeholder="Nome do encarregado"
                    value={guardianName}
                    onChange={(event) =>
                      setGuardianName(event.target.value)
                    }
                    style={styles.input}
                    disabled={saving}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Telefone do encarregado
                  </label>

                  <input
                    type="tel"
                    placeholder="Ex.: 923 000 000"
                    value={guardianPhone}
                    onChange={(event) =>
                      setGuardianPhone(event.target.value)
                    }
                    style={styles.input}
                    disabled={saving}
                  />
                </div>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.secondaryButton}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                  disabled={saving}
                >
                  {saving ? "A cadastrar..." : "Cadastrar aluno"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section style={styles.listSection}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Lista de alunos</h2>

              <p style={styles.sectionSubtitle}>
                Consulte os alunos cadastrados nesta escola.
              </p>
            </div>

            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>⌕</span>

              <input
                type="text"
                placeholder="Pesquisar aluno..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {students.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIcon}>🎓</div>

              <h2 style={styles.emptyTitle}>
                Nenhum aluno cadastrado
              </h2>

              <p style={styles.emptyText}>
                Comece adicionando o primeiro aluno da {school.name}.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                style={styles.primaryButton}
              >
                + Cadastrar primeiro aluno
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIcon}>🔎</div>

              <h2 style={styles.emptyTitle}>
                Nenhum aluno encontrado
              </h2>

              <p style={styles.emptyText}>
                Tente pesquisar por outro nome, matrícula ou turma.
              </p>
            </div>
          ) : (
            <div style={styles.studentsGrid}>
              {filteredStudents.map((student) => (
                <article
                  key={student.id}
                  style={styles.studentCard}
                >
                  <div style={styles.studentTop}>
                    <div style={styles.avatar}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    <div style={styles.studentIdentity}>
                      <h3 style={styles.studentName}>
                        {student.name}
                      </h3>

                      <span style={styles.statusBadge}>
                        {student.status === "active"
                          ? "Ativo"
                          : "Inativo"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDelete(student)}
                      disabled={deletingId === student.id}
                      style={styles.deleteButton}
                      title="Excluir aluno"
                    >
                      {deletingId === student.id ? "..." : "🗑"}
                    </button>
                  </div>

                  <div style={styles.studentDetails}>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>
                        Matrícula
                      </span>

                      <strong style={styles.detailValue}>
                        {student.studentNumber}
                      </strong>
                    </div>

                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Turma</span>

                      <strong style={styles.detailValue}>
                        {student.className || "Não definida"}
                      </strong>
                    </div>

                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>
                        Encarregado
                      </span>

                      <strong style={styles.detailValue}>
                        {student.guardianName || "Não informado"}
                      </strong>
                    </div>

                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>
                        Telefone
                      </span>

                      <strong style={styles.detailValue}>
                        {student.guardianPhone || "Não informado"}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "32px 24px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#171a1f",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f7fb",
    padding: "24px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  loadingCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "48px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
    maxWidth: "420px",
    width: "100%",
  },

  loadingSpinner: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
  },

  schoolName: {
    margin: 0,
    color: "#68707a",
    fontSize: "14px",
    fontWeight: 600,
  },

  title: {
    margin: "4px 0",
    fontSize: "34px",
    lineHeight: 1.15,
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: 0,
    color: "#68707a",
    fontSize: "14px",
  },

  primaryButton: {
    border: 0,
    borderRadius: "11px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    background: "#111827",
    color: "#ffffff",
    whiteSpace: "nowrap",
  },

  secondaryButton: {
    border: "1px solid #d9dde5",
    borderRadius: "11px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    background: "#ffffff",
    color: "#343a40",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "26px",
    marginBottom: "26px",
    border: "1px solid #e9ebef",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.04)",
  },

  formHeader: {
    marginBottom: "22px",
  },

  formTitle: {
    margin: 0,
    fontSize: "21px",
  },

  formSubtitle: {
    margin: "5px 0 0",
    color: "#68707a",
    fontSize: "14px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#3c424a",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dfe3e8",
    borderRadius: "10px",
    padding: "12px 13px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
    color: "#171a1f",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
  },

  listSection: {
    marginTop: "10px",
  },

  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#68707a",
    fontSize: "14px",
  },

  searchWrapper: {
    position: "relative",
    width: "300px",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7b838e",
    fontSize: "20px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dfe3e8",
    borderRadius: "11px",
    padding: "12px 13px 12px 38px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },

  studentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  studentCard: {
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 5px 18px rgba(0, 0, 0, 0.035)",
  },

  studentTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef1f5",
    color: "#303640",
    fontSize: "18px",
    fontWeight: 800,
    flexShrink: 0,
  },

  studentIdentity: {
    minWidth: 0,
    flex: 1,
  },

  studentName: {
    margin: "0 0 6px",
    fontSize: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "4px 9px",
    background: "#edf8f0",
    color: "#26723c",
    fontSize: "11px",
    fontWeight: 700,
  },

  deleteButton: {
    border: "1px solid #eceef1",
    background: "#ffffff",
    borderRadius: "9px",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    flexShrink: 0,
  },

  studentDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "13px",
    paddingTop: "16px",
    borderTop: "1px solid #eef0f3",
  },

  detail: {
    minWidth: 0,
  },

  detailLabel: {
    display: "block",
    color: "#858c96",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: "4px",
  },

  detailValue: {
    display: "block",
    color: "#303640",
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  emptyCard: {
    background: "#ffffff",
    border: "1px solid #e9ebef",
    borderRadius: "18px",
    padding: "60px 30px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "21px",
  },

  emptyText: {
    margin: "0 auto 20px",
    maxWidth: "480px",
    color: "#68707a",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  mutedText: {
    margin: 0,
    color: "#68707a",
    lineHeight: 1.5,
  },
};