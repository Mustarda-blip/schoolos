import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
  updateTeacherStatus,
} from "../services/teacherService";

import type {
  Teacher,
  TeacherStatus,
} from "../services/teacherService";

import { useSchool } from "../context/SchoolContext";

export default function Teachers() {
  const {
    school,
    loading: schoolLoading,
  } = useSchool();

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [statusChangingId, setStatusChangingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTeacher, setEditingTeacher] =
    useState<Teacher | null>(null);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [teacherNumber, setTeacherNumber] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState<TeacherStatus>("active");

  async function loadTeachers() {
    if (!school) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        await getTeachers(school.id);

      setTeachers(data);
    } catch (error) {
      console.error(
        "Erro ao carregar professores:",
        error
      );

      alert(
        "Não foi possível carregar os professores."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTeachers();
  }, [school]);

  function resetForm() {
    setName("");
    setTeacherNumber("");
    setSubject("");
    setPhone("");
    setEmail("");
    setStatus("active");
    setEditingTeacher(null);
    setShowForm(false);
  }

  function startCreate() {
    setEditingTeacher(null);

    setName("");
    setTeacherNumber("");
    setSubject("");
    setPhone("");
    setEmail("");
    setStatus("active");

    setShowForm(true);
  }

  function startEdit(
    teacher: Teacher
  ) {
    setEditingTeacher(teacher);

    setName(teacher.name);
    setTeacherNumber(
      teacher.teacherNumber
    );
    setSubject(teacher.subject);
    setPhone(teacher.phone);
    setEmail(teacher.email);
    setStatus(teacher.status);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!school) {
      alert("Escola não encontrada.");
      return;
    }

    const cleanName =
      name.trim();

    const cleanTeacherNumber =
      teacherNumber.trim();

    const cleanSubject =
      subject.trim();

    const cleanPhone =
      phone.trim();

    const cleanEmail =
      email.trim();

    if (
      !cleanName ||
      !cleanTeacherNumber ||
      !cleanSubject
    ) {
      alert(
        "Nome, número do professor e disciplina são obrigatórios."
      );

      return;
    }

    try {
      setSaving(true);

      if (editingTeacher) {
        await updateTeacher(
          editingTeacher.id,
          {
            name: cleanName,
            teacherNumber:
              cleanTeacherNumber,
            subject: cleanSubject,
            phone: cleanPhone,
            email: cleanEmail,
            status,
          }
        );

        setTeachers(
          (currentTeachers) =>
            currentTeachers.map(
              (teacher) =>
                teacher.id ===
                editingTeacher.id
                  ? {
                      ...teacher,
                      name: cleanName,
                      teacherNumber:
                        cleanTeacherNumber,
                      subject:
                        cleanSubject,
                      phone: cleanPhone,
                      email: cleanEmail,
                      status,
                    }
                  : teacher
            )
        );

        alert(
          "Professor atualizado com sucesso."
        );
      } else {
        const teacherData = {
          schoolId: school.id,
          name: cleanName,
          teacherNumber:
            cleanTeacherNumber,
          subject: cleanSubject,
          phone: cleanPhone,
          email: cleanEmail,
          status,
        };

        const id =
          await createTeacher(
            teacherData
          );

        setTeachers(
          (currentTeachers) => [
            ...currentTeachers,
            {
              id,
              ...teacherData,
            },
          ]
        );

        alert(
          "Professor cadastrado com sucesso."
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Erro ao guardar professor:",
        error
      );

      alert(
        editingTeacher
          ? "Não foi possível atualizar o professor."
          : "Não foi possível cadastrar o professor."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    teacher: Teacher
  ) {
    const confirmed =
      window.confirm(
        `Tem certeza que deseja excluir o professor "${teacher.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(teacher.id);

      await deleteTeacher(
        teacher.id
      );

      setTeachers(
        (currentTeachers) =>
          currentTeachers.filter(
            (item) =>
              item.id !== teacher.id
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir professor:",
        error
      );

      alert(
        "Não foi possível excluir o professor."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStatus(
    teacher: Teacher
  ) {
    const newStatus: TeacherStatus =
      teacher.status === "active"
        ? "inactive"
        : "active";

    try {
      setStatusChangingId(
        teacher.id
      );

      await updateTeacherStatus(
        teacher.id,
        newStatus
      );

      setTeachers(
        (currentTeachers) =>
          currentTeachers.map(
            (item) =>
              item.id === teacher.id
                ? {
                    ...item,
                    status: newStatus,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Erro ao alterar status:",
        error
      );

      alert(
        "Não foi possível alterar o status."
      );
    } finally {
      setStatusChangingId(null);
    }
  }

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredTeachers =
    useMemo(() => {
      if (!normalizedSearch) {
        return teachers;
      }

      return teachers.filter(
        (teacher) =>
          teacher.name
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          teacher.teacherNumber
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          teacher.subject
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          teacher.phone
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          teacher.email
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }, [
      teachers,
      normalizedSearch,
    ]);

  if (
    schoolLoading ||
    loading
  ) {
    return (
      <main
        style={
          styles.loadingPage
        }
      >
        <div
          style={
            styles.loadingCard
          }
        >
          <div
            style={
              styles.loadingIcon
            }
          >
            ⏳
          </div>

          <h2
            style={
              styles.loadingTitle
            }
          >
            A carregar professores...
          </h2>

          <p
            style={
              styles.mutedText
            }
          >
            Estamos a preparar a lista de professores.
          </p>
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main
        style={
          styles.loadingPage
        }
      >
        <div
          style={
            styles.loadingCard
          }
        >
          <div
            style={
              styles.loadingIcon
            }
          >
            🏫
          </div>

          <h2
            style={
              styles.loadingTitle
            }
          >
            Escola não encontrada
          </h2>

          <p
            style={
              styles.mutedText
            }
          >
            Não foi possível encontrar a escola associada à sua conta.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={
        styles.page
      }
    >
      <div
        style={
          styles.container
        }
      >
        <header
          style={
            styles.header
          }
        >
          <div>
            <p
              style={
                styles.schoolName
              }
            >
              {school.name}
            </p>

            <h1
              style={
                styles.title
              }
            >
              Professores
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              {teachers.length}{" "}
              {teachers.length === 1
                ? "professor cadastrado"
                : "professores cadastrados"}
            </p>
          </div>

          <button
            type="button"
            onClick={
              showForm
                ? resetForm
                : startCreate
            }
            style={
              styles.primaryButton
            }
          >
            {showForm
              ? "✕ Fechar"
              : "+ Novo professor"}
          </button>
        </header>

        {showForm && (
          <section
            style={
              styles.formCard
            }
          >
            <div
              style={
                styles.formHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.formTitle
                  }
                >
                  {editingTeacher
                    ? "Editar professor"
                    : "Novo professor"}
                </h2>

                <p
                  style={
                    styles.formSubtitle
                  }
                >
                  {editingTeacher
                    ? "Atualize os dados do professor."
                    : "Preencha os dados do novo professor."}
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div
                style={
                  styles.formGrid
                }
              >
                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Nome completo *
                  </label>

                  <input
                    type="text"
                    placeholder="Ex.: João Manuel"
                    value={name}
                    onChange={(
                      event
                    ) =>
                      setName(
                        event.target.value
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Número do professor *
                  </label>

                  <input
                    type="text"
                    placeholder="Ex.: PROF-001"
                    value={
                      teacherNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setTeacherNumber(
                        event.target.value
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Disciplina *
                  </label>

                  <input
                    type="text"
                    placeholder="Ex.: Matemática"
                    value={
                      subject
                    }
                    onChange={(
                      event
                    ) =>
                      setSubject(
                        event.target.value
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Telefone
                  </label>

                  <input
                    type="tel"
                    placeholder="Ex.: 923 000 000"
                    value={
                      phone
                    }
                    onChange={(
                      event
                    ) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="professor@email.com"
                    value={
                      email
                    }
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Status
                  </label>

                  <select
                    value={
                      status
                    }
                    onChange={(
                      event
                    ) =>
                      setStatus(
                        event.target
                          .value as TeacherStatus
                      )
                    }
                    style={
                      styles.input
                    }
                    disabled={
                      saving
                    }
                  >
                    <option value="active">
                      Ativo
                    </option>

                    <option value="inactive">
                      Inativo
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={
                  styles.formActions
                }
              >
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  style={
                    styles.secondaryButton
                  }
                  disabled={
                    saving
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={
                    styles.primaryButton
                  }
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "A guardar..."
                    : editingTeacher
                    ? "Guardar alterações"
                    : "Cadastrar professor"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section
          style={
            styles.listSection
          }
        >
          <div
            style={
              styles.listHeader
            }
          >
            <div>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                Lista de professores
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Professores cadastrados nesta escola.
              </p>
            </div>

            <div
              style={
                styles.searchWrapper
              }
            >
              <span
                style={
                  styles.searchIcon
                }
              >
                ⌕
              </span>

              <input
                type="text"
                placeholder="Pesquisar professor..."
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                style={
                  styles.searchInput
                }
              />
            </div>
          </div>

          {teachers.length ===
          0 ? (
            <div
              style={
                styles.emptyCard
              }
            >
              <div
                style={
                  styles.emptyIcon
                }
              >
                👨‍🏫
              </div>

              <h2
                style={
                  styles.emptyTitle
                }
              >
                Nenhum professor cadastrado
              </h2>

              <p
                style={
                  styles.emptyText
                }
              >
                Comece adicionando o primeiro professor da{" "}
                {school.name}.
              </p>

              <button
                type="button"
                onClick={
                  startCreate
                }
                style={
                  styles.primaryButton
                }
              >
                + Cadastrar primeiro professor
              </button>
            </div>
          ) : filteredTeachers.length ===
            0 ? (
            <div
              style={
                styles.emptyCard
              }
            >
              <div
                style={
                  styles.emptyIcon
                }
              >
                🔎
              </div>

              <h2
                style={
                  styles.emptyTitle
                }
              >
                Nenhum professor encontrado
              </h2>

              <p
                style={
                  styles.emptyText
                }
              >
                Tente pesquisar por outro nome, número ou disciplina.
              </p>
            </div>
          ) : (
            <div
              style={
                styles.teachersGrid
              }
            >
              {filteredTeachers.map(
                (teacher) => (
                  <article
                    key={
                      teacher.id
                    }
                    style={
                      styles.teacherCard
                    }
                  >
                    <div
                      style={
                        styles.teacherTop
                      }
                    >
                      <div
                        style={
                          styles.avatar
                        }
                      >
                        {teacher.name
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <div
                        style={
                          styles.teacherIdentity
                        }
                      >
                        <h3
                          style={
                            styles.teacherName
                          }
                        >
                          {teacher.name}
                        </h3>

                        <span
                          style={
                            teacher.status ===
                            "active"
                              ? styles.activeBadge
                              : styles.inactiveBadge
                          }
                        >
                          {teacher.status ===
                          "active"
                            ? "Ativo"
                            : "Inativo"}
                        </span>
                      </div>
                    </div>

                    <div
                      style={
                        styles.teacherDetails
                      }
                    >
                      <div
                        style={
                          styles.detail
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          Número
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {
                            teacher.teacherNumber
                          }
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detail
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          Disciplina
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {
                            teacher.subject
                          }
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detail
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          Telefone
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {teacher.phone ||
                            "Não informado"}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detail
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          Email
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {teacher.email ||
                            "Não informado"}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={
                        styles.cardActions
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            teacher
                          )
                        }
                        style={
                          styles.editButton
                        }
                        disabled={
                          saving ||
                          deletingId ===
                            teacher.id
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleToggleStatus(
                            teacher
                          )
                        }
                        style={
                          styles.statusButton
                        }
                        disabled={
                          statusChangingId ===
                          teacher.id
                        }
                      >
                        {statusChangingId ===
                        teacher.id
                          ? "..."
                          : teacher.status ===
                            "active"
                          ? "🔴 Desativar"
                          : "🟢 Ativar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            teacher
                          )
                        }
                        style={
                          styles.deleteButton
                        }
                        disabled={
                          deletingId ===
                          teacher.id
                        }
                      >
                        {deletingId ===
                        teacher.id
                          ? "..."
                          : "🗑 Excluir"}
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
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
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.06)",
    maxWidth: "420px",
    width: "100%",
  },

  loadingIcon: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  mutedText: {
    margin: 0,
    color: "#68707a",
    lineHeight: 1.5,
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
    border:
      "1px solid #d9dde5",
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
    border:
      "1px solid #e9ebef",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.04)",
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
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
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
    border:
      "1px solid #dfe3e8",
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
    transform:
      "translateY(-50%)",
    color: "#7b838e",
    fontSize: "20px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #dfe3e8",
    borderRadius: "11px",
    padding:
      "12px 13px 12px 38px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },

  teachersGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  teacherCard: {
    background: "#ffffff",
    border:
      "1px solid #e9ebef",
    borderRadius: "16px",
    padding: "20px",
    boxShadow:
      "0 5px 18px rgba(0, 0, 0, 0.035)",
  },

  teacherTop: {
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

  teacherIdentity: {
    minWidth: 0,
    flex: 1,
  },

  teacherName: {
    margin: "0 0 6px",
    fontSize: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  activeBadge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "4px 9px",
    background: "#edf8f0",
    color: "#26723c",
    fontSize: "11px",
    fontWeight: 700,
  },

  inactiveBadge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "4px 9px",
    background: "#fef0f0",
    color: "#b42318",
    fontSize: "11px",
    fontWeight: 700,
  },

  teacherDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "13px",
    paddingTop: "16px",
    borderTop:
      "1px solid #eef0f3",
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

  cardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "18px",
    paddingTop: "15px",
    borderTop:
      "1px solid #eef0f3",
  },

  editButton: {
    border:
      "1px solid #d9dde5",
    background: "#ffffff",
    color: "#303640",
    borderRadius: "9px",
    padding: "9px 11px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },

  statusButton: {
    border:
      "1px solid #d9dde5",
    background: "#ffffff",
    color: "#303640",
    borderRadius: "9px",
    padding: "9px 11px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },

  deleteButton: {
    border:
      "1px solid #f1d4d4",
    background: "#fff7f7",
    color: "#b42318",
    borderRadius: "9px",
    padding: "9px 11px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },

  emptyCard: {
    background: "#ffffff",
    border:
      "1px solid #e9ebef",
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
};