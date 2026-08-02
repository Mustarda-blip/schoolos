import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type SchoolClass = {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  academicYear: string;
  room: string;
  teacherId: string;
  status: "active" | "inactive";
};

export type CreateClassData = Omit<
  SchoolClass,
  "id"
>;

export async function createClass(
  data: CreateClassData
) {
  if (!data.schoolId) {
    throw new Error("schoolId obrigatório.");
  }

  if (!data.name.trim()) {
    throw new Error("Nome da turma obrigatório.");
  }

  const ref = collection(db, "classes");

  const result = await addDoc(ref, data);

  return result.id;
}

export async function getClasses(
  schoolId: string
): Promise<SchoolClass[]> {
  if (!schoolId) {
    throw new Error("schoolId obrigatório.");
  }

  const ref = collection(db, "classes");

  const q = query(
    ref,
    where("schoolId", "==", schoolId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<
      SchoolClass,
      "id"
    >),
  }));
}

export async function updateClass(
  classId: string,
  data: Partial<CreateClassData>
) {
  if (!classId) {
    throw new Error("ID da turma obrigatório.");
  }

  await updateDoc(
    doc(db, "classes", classId),
    data
  );
}

export async function deleteClass(
  classId: string
) {
  if (!classId) {
    throw new Error("ID da turma obrigatório.");
  }

  await deleteDoc(
    doc(db, "classes", classId)
  );
}