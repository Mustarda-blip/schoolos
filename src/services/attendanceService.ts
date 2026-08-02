import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "justified";

export type Attendance = {
  id: string;
  schoolId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note: string;
};

export async function createAttendance(
  data: Omit<Attendance, "id">
) {
  if (!data.schoolId) {
    throw new Error(
      "schoolId obrigatório."
    );
  }

  if (!data.studentId) {
    throw new Error(
      "studentId obrigatório."
    );
  }

  await addDoc(
    collection(
      db,
      "attendance"
    ),
    data
  );
}

export async function getAttendance(
  schoolId: string
) {
  const q = query(
    collection(
      db,
      "attendance"
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