import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  School,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha o e-mail e a palavra-passe.");
      return;
    }

  try {
  setLoading(true);

  await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  navigate("/dashboard", { replace: true });
} catch (error: unknown) {
      console.error("Erro no login:", error);

      const firebaseError = error as {
        code?: string;
      };

      switch (firebaseError.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("E-mail ou palavra-passe incorretos.");
          break;

        case "auth/invalid-email":
          setError("Digite um e-mail válido.");
          break;

        case "auth/too-many-requests":
          setError(
            "Muitas tentativas. Aguarde alguns minutos e tente novamente."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Não foi possível conectar ao Firebase."
          );
          break;

        default:
          setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-background" />

      <section className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">
            <School size={23} />
          </div>

          <div>
            <strong>SchoolOS</strong>
            <span>Gestão inteligente para escolas</span>
          </div>
        </div>

        <div className="login-heading">
          <h1>Bem-vindo de volta</h1>
          <p>
            Entre na sua conta para acessar o SchoolOS.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">
                Palavra-passe
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  setError(
                    "A recuperação de palavra-passe será adicionada em breve."
                  )
                }
              >
                Esqueceu?
              </button>
            </div>

            <div className="input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="password"
                type={
                  showPassword ? "text" : "password"
                }
                placeholder="Digite sua palavra-passe"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Ocultar palavra-passe"
                    : "Mostrar palavra-passe"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <span>SchoolOS</span>
          <span>•</span>
          <span>Gestão escolar inteligente</span>
        </div>
      </section>
    </main>
  );
}