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

export type TeacherStatus = "active" | "inactive";

export type Teacher = {
  id: string;
  schoolId: string;
  name: string;
  teacherNumber: string;
  subject: string;
  phone: string;
  email: string;
  status: TeacherStatus;
};

export type CreateTeacherData = Omit<Teacher, "id">;

export type UpdateTeacherData = Omit<
  Teacher,
  "id" | "schoolId"
>;

/**
 * Criar professor
 */
export async function createTeacher(
  data: CreateTeacherData
): Promise<string> {
  const teachersRef = collection(db, "teachers");

  const document = await addDoc(teachersRef, {
    ...data,
    createdAt: new Date(),
  });

  return document.id;
}

/**
 * Buscar professores de uma escola
 */
export async function getTeachers(
  schoolId: string
): Promise<Teacher[]> {
  const teachersRef = collection(db, "teachers");

  const teachersQuery = query(
    teachersRef,
    where("schoolId", "==", schoolId)
  );

  const snapshot = await getDocs(teachersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Teacher, "id">),
  }));
}

/**
 * Atualizar professor
 */
export async function updateTeacher(
  teacherId: string,
  data: UpdateTeacherData
): Promise<void> {
  const teacherRef = doc(
    db,
    "teachers",
    teacherId
  );

  await updateDoc(teacherRef, {
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * Alterar apenas o status
 */
export async function updateTeacherStatus(
  teacherId: string,
  status: TeacherStatus
): Promise<void> {
  const teacherRef = doc(
    db,
    "teachers",
    teacherId
  );

  await updateDoc(teacherRef, {
    status,
    updatedAt: new Date(),
  });
}

/**
 * Excluir professor
 */
export async function deleteTeacher(
  teacherId: string
): Promise<void> {
  const teacherRef = doc(
    db,
    "teachers",
    teacherId
  );

  await deleteDoc(teacherRef);
}