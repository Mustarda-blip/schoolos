import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Finance from "./pages/Finance";
import AICollaboration from "./pages/AICollaboration";
import ProtectedRoute from "./components/ProtectedRoute";
import { SchoolProvider } from "./context/SchoolContext";

function App() {
  return (
    <BrowserRouter>
      <SchoolProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ai-collaboration" element={<AICollaboration />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
          <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </SchoolProvider>
    </BrowserRouter>
  );
}

export default App;
