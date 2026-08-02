import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type Student = {
  id: string;
  schoolId: string;
  name: string;
  studentNumber: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  status: "active" | "inactive";
};

type CreateStudentData = Omit<
  Student,
  "id"
>;

export async function createStudent(
  data: CreateStudentData
) {
  const studentsRef = collection(
    db,
    "students"
  );

  const document = await addDoc(
    studentsRef,
    data
  );

  return document.id;
}

export async function getStudents(
  schoolId: string
): Promise<Student[]> {
  const studentsRef = collection(
    db,
    "students"
  );

  const studentsQuery = query(
    studentsRef,
    where("schoolId", "==", schoolId)
  );

  const snapshot = await getDocs(
    studentsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Student, "id">),
  }));
}

export async function deleteStudent(
  studentId: string
) {
  const studentRef = doc(
    db,
    "students",
    studentId
  );

  await deleteDoc(studentRef);
}