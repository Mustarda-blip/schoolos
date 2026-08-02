import { useNavigate } from "react-router-dom";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "28px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            marginBottom: "10px",
            cursor: "pointer",
            color: "#68707a",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          ← Voltar ao início
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              margin: "6px 0 0",
              color: "#68707a",
              fontSize: "14px",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
}