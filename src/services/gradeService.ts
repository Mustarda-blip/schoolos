import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type Grade = {
  id: string;
  schoolId: string;
  studentId: string;
  subject: string;
  period: string;
  value: number;
  academicYear: string;
};

export type CreateGradeData =
  Omit<Grade, "id">;

export async function createGrade(
  data: CreateGradeData
) {
  if (!data.schoolId) {
    throw new Error(
      "schoolId obrigatório."
    );
  }

  if (
    Number.isNaN(data.value) ||
    data.value < 0 ||
    data.value > 20
  ) {
    throw new Error(
      "A nota deve estar entre 0 e 20."
    );
  }

  const ref =
    collection(db, "grades");

  const result =
    await addDoc(ref, data);

  return result.id;
}

export async function getGrades(
  schoolId: string
): Promise<Grade[]> {
  const ref =
    collection(db, "grades");

  const q = query(
    ref,
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
      ...(item.data() as Omit<
        Grade,
        "id"
      >),
    })
  );
}