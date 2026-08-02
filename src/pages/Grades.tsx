import {
  useEffect,
  useState,
} from "react";

import {
  createGrade,
  getGrades,
} from "../services/gradeService";

import type {
  Grade,
} from "../services/gradeService";

import {
  getStudents,
} from "../services/studentService";

import type {
  Student,
} from "../services/studentService";

import {
  useSchool,
} from "../context/SchoolContext";

import PageHeader from "../components/PageHeader";

export default function Grades() {
  const {
    school,
    loading: schoolLoading,
  } = useSchool();

  const [grades, setGrades] =
    useState<Grade[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [studentId, setStudentId] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [period, setPeriod] =
    useState("1º Trimestre");

  const [value, setValue] =
    useState("");

  async function loadData() {
    if (!school) {
      return;
    }

    try {
      setLoading(true);

      const [
        gradesData,
        studentsData,
      ] = await Promise.all([
        getGrades(school.id),
        getStudents(school.id),
      ]);

      setGrades(gradesData);
      setStudents(studentsData);
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível carregar as notas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [school]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!school) {
      return;
    }

    const numericValue =
      Number(value);

    if (!studentId) {
      alert(
        "Selecione o aluno."
      );
      return;
    }

    if (!subject.trim()) {
      alert(
        "Informe a disciplina."
      );
      return;
    }

    if (
      Number.isNaN(
        numericValue
      ) ||
      numericValue < 0 ||
      numericValue > 20
    ) {
      alert(
        "A nota deve estar entre 0 e 20."
      );
      return;
    }

    try {
      setSaving(true);

      await createGrade({
        schoolId: school.id,
        studentId,
        subject:
          subject.trim(),
        period,
        value: numericValue,
        academicYear:
          String(
            school.academicYear
          ),
      });

      setSubject("");
      setValue("");

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível guardar a nota."
      );
    } finally {
      setSaving(false);
    }
  }

  if (
    schoolLoading ||
    loading
  ) {
    return (
      <main style={styles.center}>
        A carregar notas...
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PageHeader
          title="Notas"
          description="Registo e acompanhamento das notas dos alunos."
        />

        <form
          onSubmit={handleSubmit}
          style={styles.card}
        >
          <h2>
            Registar nota
          </h2>

          <div style={styles.grid}>
            <select
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value
                )
              }
              style={styles.input}
            >
              <option value="">
                Selecionar aluno
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name}
                  </option>
                )
              )}
            </select>

            <input
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              placeholder="Disciplina"
              style={styles.input}
            />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
              style={styles.input}
            >
              <option>
                1º Trimestre
              </option>
              <option>
                2º Trimestre
              </option>
              <option>
                3º Trimestre
              </option>
              <option>
                Exame
              </option>
            </select>

            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={value}
              onChange={(e) =>
                setValue(
                  e.target.value
                )
              }
              placeholder="Nota 0 - 20"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={styles.button}
          >
            {saving
              ? "A guardar..."
              : "Registar nota"}
          </button>
        </form>

        <div style={styles.cards}>
          {grades.map(
            (grade) => {
              const student =
                students.find(
                  (item) =>
                    item.id ===
                    grade.studentId
                );

              return (
                <article
                  key={grade.id}
                  style={styles.card}
                >
                  <h3>
                    {student?.name ??
                      "Aluno"}
                  </h3>

                  <p>
                    {grade.subject}
                  </p>

                  <strong
                    style={{
                      fontSize:
                        "28px",
                    }}
                  >
                    {grade.value}
                  </strong>

                  <p>
                    {grade.period}
                  </p>
                </article>
              );
            }
          )}
        </div>
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
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "18px",
    border:
      "1px solid #e9ebef",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border:
      "1px solid #dfe3e8",
    borderRadius: "10px",
    background: "#fff",
  },

  button: {
    border: 0,
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },
};