import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

import { getUserProfile } from "../services/userService";
import { getSchool } from "../services/schoolService";

import type { UserProfile } from "../services/userService";
import type { School } from "../services/schoolService";

type SchoolContextType = {
  profile: UserProfile | null;
  school: School | null;
  loading: boolean;
};

const SchoolContext =
  createContext<SchoolContextType | undefined>(
    undefined
  );

type SchoolProviderProps = {
  children: ReactNode;
};

export function SchoolProvider({
  children,
}: SchoolProviderProps) {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [school, setSchool] =
    useState<School | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    console.log("SchoolOS: iniciando autenticação...");

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          console.log(
            "SchoolOS: usuário:",
            user
          );

          if (!user) {
            console.log(
              "SchoolOS: nenhum usuário autenticado"
            );

            setProfile(null);
            setSchool(null);
            setLoading(false);

            return;
          }

          try {
            console.log(
              "SchoolOS: UID:",
              user.uid
            );

            console.log(
              "SchoolOS: buscando perfil..."
            );

            const userProfile =
              await getUserProfile(
                user.uid
              );

            console.log(
              "SchoolOS: perfil:",
              userProfile
            );

            if (!userProfile) {
              console.error(
                "SchoolOS: PERFIL NÃO ENCONTRADO"
              );

              setProfile(null);
              setSchool(null);
              setLoading(false);

              return;
            }

            setProfile(userProfile);

            console.log(
              "SchoolOS: schoolId:",
              userProfile.schoolId
            );

            console.log(
              "SchoolOS: buscando escola..."
            );

            const schoolData =
              await getSchool(
                userProfile.schoolId
              );

            console.log(
              "SchoolOS: escola:",
              schoolData
            );

            if (!schoolData) {
              console.error(
                "SchoolOS: ESCOLA NÃO ENCONTRADA"
              );

              setSchool(null);
              setLoading(false);

              return;
            }

            setSchool(schoolData);

            console.log(
              "SchoolOS: dados carregados com sucesso!"
            );
          } catch (error) {
            console.error(
              "SchoolOS: ERRO REAL:",
              error
            );

            setProfile(null);
            setSchool(null);
          } finally {
            setLoading(false);
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SchoolContext.Provider
      value={{
        profile,
        school,
        loading,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context =
    useContext(SchoolContext);

  if (!context) {
    throw new Error(
      "useSchool deve ser usado dentro de SchoolProvider"
    );
  }

  return context;
}