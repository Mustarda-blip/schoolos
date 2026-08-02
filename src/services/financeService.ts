import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type TransactionType =
  | "income"
  | "expense";

export type FinanceTransaction = {
  id: string;
  schoolId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: "pending" | "paid";
};

export async function createTransaction(
  data: Omit<
    FinanceTransaction,
    "id"
  >
) {
  if (!data.schoolId) {
    throw new Error(
      "schoolId obrigatório."
    );
  }

  if (
    !Number.isFinite(
      data.amount
    ) ||
    data.amount <= 0
  ) {
    throw new Error(
      "Valor inválido."
    );
  }

  await addDoc(
    collection(
      db,
      "financeTransactions"
    ),
    data
  );
}

export async function getTransactions(
  schoolId: string
) {
  const q = query(
    collection(
      db,
      "financeTransactions"
    ),
    where(
      "schoolId",
      "==",
      schoolId
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}