import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

type ProtectedRouteProps = {
children: ReactNode;
};

export default function ProtectedRoute({
children,
}: ProtectedRouteProps) {
const { user, loading } = useAuthState();

if (loading) {
return (
<div
style={{
minHeight: "100vh",
display: "grid",
placeItems: "center",
background: "#f7f8fa",
color: "#68707a",
fontFamily: "system-ui, sans-serif",
fontSize: "13px",
}}
>
A verificar sessão... </div>
);
}

if (!user) {
return <Navigate to="/login" replace />;
}

return <>{children}</>;
}
