export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "8px",
          }}
        >
          Order System
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(48px, 9vw, 96px)",
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          Toast.
        </h1>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/cashier"
          style={{
            border: "2px solid var(--line)",
            padding: "20px 40px",
            fontFamily: "var(--mono)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "var(--ink)",
            color: "var(--bg)",
          }}
        >
          Cashier →
        </a>
        <a
          href="/kitchen"
          style={{
            border: "2px solid var(--line)",
            padding: "20px 40px",
            fontFamily: "var(--mono)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Kitchen →
        </a>
      </div>
    </main>
  );
}
