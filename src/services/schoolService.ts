import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type School = {
  id: string;
  name: string;
  city: string;
  country: string;
  academicYear: string;
  status: string;
};

export async function getSchool(
  schoolId: string
): Promise<School | null> {
  const schoolRef = doc(
    db,
    "schools",
    schoolId
  );

  const snapshot = await getDoc(schoolRef);

  if (!snapshot.exists()) {
    console.error(
      "Escola não encontrada:",
      schoolId
    );

    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<School, "id">),
  };
}