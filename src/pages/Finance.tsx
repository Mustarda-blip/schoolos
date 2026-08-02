import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createTransaction,
  getTransactions,
} from "../services/financeService";

import {
  useSchool,
} from "../context/SchoolContext";

import PageHeader from "../components/PageHeader";

type Transaction = {
  id: string;
  schoolId: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
  status: "pending" | "paid";
};

export default function Finance() {
  const {
    school,
    loading: schoolLoading,
  } = useSchool();

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [type, setType] =
    useState<
      "income" | "expense"
    >("income");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  async function loadData() {
    if (!school) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await getTransactions(
          school.id
        );

      setTransactions(
        data as Transaction[]
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao carregar financeiro."
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

    const numericAmount =
      Number(amount);

    if (!description.trim()) {
      alert(
        "Informe a descrição."
      );

      return;
    }

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      alert(
        "Informe um valor válido."
      );

      return;
    }

    try {
      setSaving(true);

      await createTransaction({
        schoolId: school.id,
        type,
        description:
          description.trim(),
        amount: numericAmount,
        date,
        category:
          category.trim() ||
          "Geral",
        status: "paid",
      });

      setDescription("");
      setAmount("");
      setCategory("");

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível guardar a movimentação."
      );
    } finally {
      setSaving(false);
    }
  }

  const totals =
    useMemo(() => {
      let income = 0;
      let expense = 0;

      for (const item of transactions) {
        if (
          item.type ===
          "income"
        ) {
          income += item.amount;
        } else {
          expense += item.amount;
        }
      }

      return {
        income,
        expense,
        balance:
          income - expense,
      };
    }, [transactions]);

  if (
    schoolLoading ||
    loading
  ) {
    return (
      <main style={styles.center}>
        A carregar financeiro...
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PageHeader
          title="Financeiro"
          description="Controle as entradas e saídas financeiras da escola."
        />

        <section
          style={styles.summary}
        >
          <div style={styles.card}>
            <small>
              Entradas
            </small>

            <h2>
              {totals.income.toLocaleString(
                "pt-AO"
              )}{" "}
              Kz
            </h2>
          </div>

          <div style={styles.card}>
            <small>
              Despesas
            </small>

            <h2>
              {totals.expense.toLocaleString(
                "pt-AO"
              )}{" "}
              Kz
            </h2>
          </div>

          <div style={styles.card}>
            <small>
              Saldo
            </small>

            <h2>
              {totals.balance.toLocaleString(
                "pt-AO"
              )}{" "}
              Kz
            </h2>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          style={styles.card}
        >
          <h2>
            Nova movimentação
          </h2>

          <div style={styles.grid}>
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target
                    .value as
                    | "income"
                    | "expense"
                )
              }
              style={styles.input}
            >
              <option value="income">
                Entrada
              </option>

              <option value="expense">
                Despesa
              </option>
            </select>

            <input
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Descrição"
              style={styles.input}
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="Valor em Kz"
              style={styles.input}
            />

            <input
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              placeholder="Categoria"
              style={styles.input}
            />

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
          </div>

          <button
            type="submit"
            disabled={saving}
            style={styles.button}
          >
            {saving
              ? "A guardar..."
              : "Guardar movimentação"}
          </button>
        </form>

        {transactions.map(
          (item) => (
            <article
              key={item.id}
              style={styles.card}
            >
              <strong>
                {item.description}
              </strong>

              <p>
                {item.category}
                {" • "}
                {item.date}
              </p>

              <strong>
                {item.type ===
                "income"
                  ? "+"
                  : "-"}
                {item.amount.toLocaleString(
                  "pt-AO"
                )}{" "}
                Kz
              </strong>
            </article>
          )
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
  },

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "16px",
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