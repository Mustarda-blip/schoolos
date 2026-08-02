import {
  useEffect,
  useState,
} from "react";

import {
  createAttendance,
  getAttendance,
} from "../services/attendanceService";

import type {
  AttendanceStatus,
} from "../services/attendanceService";

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

export default function Attendance() {
  const {
    school,
    loading: schoolLoading,
  } = useSchool();

  const [students, setStudents] =
    useState<Student[]>([]);

  const [attendance, setAttendance] =
    useState<any[]>([]);

  const [studentId, setStudentId] =
    useState("");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  const [status, setStatus] =
    useState<AttendanceStatus>(
      "present"
    );

  const [note, setNote] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  async function loadData() {
    if (!school) {
      return;
    }

    try {
      setLoading(true);

      const [
        studentsData,
        attendanceData,
      ] = await Promise.all([
        getStudents(school.id),
        getAttendance(
          school.id
        ),
      ]);

      setStudents(
        studentsData
      );

      setAttendance(
        attendanceData
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao carregar presenças."
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

    if (!studentId) {
      alert(
        "Selecione um aluno."
      );

      return;
    }

    try {
      setSaving(true);

      await createAttendance({
        schoolId: school.id,
        studentId,
        date,
        status,
        note:
          note.trim(),
      });

      setNote("");

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível registar a presença."
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
        A carregar presenças...
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PageHeader
          title="Presenças"
          description="Registe e acompanhe a assiduidade dos alunos."
        />

        <form
          onSubmit={handleSubmit}
          style={styles.card}
        >
          <h2>
            Registar presença
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
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              style={styles.input}
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as AttendanceStatus
                )
              }
              style={styles.input}
            >
              <option value="present">
                Presente
              </option>

              <option value="absent">
                Ausente
              </option>

              <option value="late">
                Atrasado
              </option>

              <option value="justified">
                Justificado
              </option>
            </select>

            <input
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              placeholder="Observação"
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
              : "Registar presença"}
          </button>
        </form>

        <div>
          {attendance.map(
            (item) => {
              const student =
                students.find(
                  (student) =>
                    student.id ===
                    item.studentId
                );

              return (
                <article
                  key={item.id}
                  style={styles.card}
                >
                  <strong>
                    {student?.name ??
                      "Aluno"}
                  </strong>

                  <p>
                    {item.date}
                    {" • "}
                    {item.status}
                  </p>

                  {item.note && (
                    <small>
                      {item.note}
                    </small>
                  )}
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
    padding: "22px",
    marginBottom: "15px",
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
};