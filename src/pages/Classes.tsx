import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../services/classService";

import type {
  SchoolClass,
} from "../services/classService";

import {
  useSchool,
} from "../context/SchoolContext";

import PageHeader from "../components/PageHeader";

export default function Classes() {
  const {
    school,
    loading: schoolLoading,
  } = useSchool();

  const [classes, setClasses] =
    useState<SchoolClass[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [name, setName] =
    useState("");

  const [grade, setGrade] =
    useState("");

  const [academicYear, setAcademicYear] =
    useState("");

  const [room, setRoom] =
    useState("");

  async function loadClasses() {
    if (!school) {
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        await getClasses(school.id);

      setClasses(data);
    } catch (error) {
      console.error(
        "Erro ao carregar turmas:",
        error
      );

      alert(
        "Não foi possível carregar as turmas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClasses();
  }, [school]);

  function resetForm() {
    setName("");
    setGrade("");
    setAcademicYear(
      String(school?.academicYear ?? "")
    );
    setRoom("");
    setEditingId(null);
  }

  function startEdit(
    schoolClass: SchoolClass
  ) {
    setEditingId(schoolClass.id);
    setName(schoolClass.name);
    setGrade(schoolClass.grade);
    setAcademicYear(
      schoolClass.academicYear
    );
    setRoom(schoolClass.room);
    setShowForm(true);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!school) {
      alert("Escola não encontrada.");
      return;
    }

    const cleanName = name.trim();
    const cleanGrade = grade.trim();
    const cleanYear =
      academicYear.trim();
    const cleanRoom = room.trim();

    if (!cleanName || !cleanGrade) {
      alert(
        "Nome da turma e classe são obrigatórios."
      );

      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateClass(
          editingId,
          {
            name: cleanName,
            grade: cleanGrade,
            academicYear: cleanYear,
            room: cleanRoom,
          }
        );
      } else {
        await createClass({
          schoolId: school.id,
          name: cleanName,
          grade: cleanGrade,
          academicYear:
            cleanYear ||
            String(school.academicYear),
          room: cleanRoom,
          teacherId: "",
          status: "active",
        });
      }

      resetForm();
      setShowForm(false);

      await loadClasses();
    } catch (error) {
      console.error(
        "Erro ao guardar turma:",
        error
      );

      alert(
        "Não foi possível guardar a turma."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    schoolClass: SchoolClass
  ) {
    const confirmed =
      window.confirm(
        `Tem certeza que deseja excluir a turma "${schoolClass.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteClass(
        schoolClass.id
      );

      setClasses(
        (current) =>
          current.filter(
            (item) =>
              item.id !== schoolClass.id
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir turma:",
        error
      );

      alert(
        "Não foi possível excluir a turma."
      );
    }
  }

  const filteredClasses =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return classes;
      }

      return classes.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(term) ||
          item.grade
            .toLowerCase()
            .includes(term) ||
          item.room
            .toLowerCase()
            .includes(term)
      );
    }, [classes, search]);

  if (
    schoolLoading ||
    loading
  ) {
    return (
      <main style={styles.center}>
        A carregar turmas...
      </main>
    );
  }

  if (!school) {
    return (
      <main style={styles.center}>
        Escola não encontrada.
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PageHeader
          title="Turmas"
          description="Gira as turmas da sua escola."
        />

        <div style={styles.toolbar}>
          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Pesquisar turma..."
            style={styles.input}
          />

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(
                (value) => !value
              );
            }}
            style={styles.primaryButton}
          >
            {showForm
              ? "Fechar"
              : "+ Nova turma"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={styles.card}
          >
            <h2>
              {editingId
                ? "Editar turma"
                : "Nova turma"}
            </h2>

            <div style={styles.grid}>
              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Nome da turma"
                style={styles.input}
              />

              <input
                value={grade}
                onChange={(e) =>
                  setGrade(
                    e.target.value
                  )
                }
                placeholder="Classe. Ex.: 10ª"
                style={styles.input}
              />

              <input
                value={academicYear}
                onChange={(e) =>
                  setAcademicYear(
                    e.target.value
                  )
                }
                placeholder="Ano letivo"
                style={styles.input}
              />

              <input
                value={room}
                onChange={(e) =>
                  setRoom(
                    e.target.value
                  )
                }
                placeholder="Sala"
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={styles.primaryButton}
            >
              {saving
                ? "A guardar..."
                : editingId
                  ? "Guardar alterações"
                  : "Criar turma"}
            </button>
          </form>
        )}

        {filteredClasses.length === 0 ? (
          <div style={styles.empty}>
            <h2>
              Nenhuma turma encontrada
            </h2>

            <p>
              Crie a primeira turma da
              escola.
            </p>
          </div>
        ) : (
          <div style={styles.cards}>
            {filteredClasses.map(
              (schoolClass) => (
                <article
                  key={schoolClass.id}
                  style={styles.card}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h2>
                        {schoolClass.name}
                      </h2>

                      <p>
                        {schoolClass.grade}
                        {" • "}
                        {schoolClass.academicYear}
                      </p>

                      <p>
                        Sala:{" "}
                        {schoolClass.room ||
                          "Não definida"}
                      </p>
                    </div>

                    <span>
                      {schoolClass.status ===
                      "active"
                        ? "Ativa"
                        : "Inativa"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(
                          schoolClass
                        )
                      }
                      style={
                        styles.secondaryButton
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDelete(
                          schoolClass
                        )
                      }
                      style={
                        styles.dangerButton
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "32px 24px",
    fontFamily:
      "system-ui, sans-serif",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    fontFamily:
      "system-ui, sans-serif",
  },

  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border:
      "1px solid #dfe3e8",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#fff",
    border:
      "1px solid #e9ebef",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.035)",
  },

  empty: {
    background: "#fff",
    borderRadius: "16px",
    padding: "50px",
    textAlign: "center",
  },

  primaryButton: {
    border: 0,
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  secondaryButton: {
    border:
      "1px solid #d9dde5",
    borderRadius: "9px",
    padding: "9px 14px",
    background: "#fff",
    cursor: "pointer",
  },

  dangerButton: {
    border: 0,
    borderRadius: "9px",
    padding: "9px 14px",
    background: "#fee2e2",
    color: "#991b1b",
    cursor: "pointer",
  },
};