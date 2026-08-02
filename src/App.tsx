import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Finance from "./pages/Finance";

import ProtectedRoute from "./components/ProtectedRoute";
import { SchoolProvider } from "./context/SchoolContext";

function App() {
  return (
    <BrowserRouter>
      <SchoolProvider>
        <Routes>
          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ALUNOS */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />

          {/* PROFESSORES */}
          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />

          {/* TURMAS */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <Classes />
              </ProtectedRoute>
            }
          />

          {/* NOTAS */}
          <Route
            path="/grades"
            element={
              <ProtectedRoute>
                <Grades />
              </ProtectedRoute>
            }
          />

          {/* PRESENÇAS */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          {/* FINANCEIRO */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />

          {/* RAIZ */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ROTA INEXISTENTE */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </SchoolProvider>
    </BrowserRouter>
  );
}

export default App;