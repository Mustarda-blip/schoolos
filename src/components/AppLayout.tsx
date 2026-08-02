import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div style={styles.app}>
      <Sidebar />

      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "#f7f8fa",
  },

  content: {
    minHeight: "100vh",
    marginLeft: "250px",
  },
};