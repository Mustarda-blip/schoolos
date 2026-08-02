import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string;
};

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const userRef = doc(
    db,
    "users",
    uid
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    console.error(
      "Perfil não encontrado para UID:",
      uid
    );

    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<UserProfile, "id">),
  };
}