"use client";

import { useState } from "react";
import { MENU, CATEGORIES } from "../../lib/menu";

export default function Cashier() {
  const [cart, setCart] = useState({}); // id -> qty
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });

  const lines = Object.entries(cart).map(([id, qty]) => {
    const item = MENU.find((m) => m.id === id);
    return { id, name: item.name, qty };
  });
  const total = lines.reduce((s, l) => s + l.qty, 0);

  async function submit() {
    if (total === 0 || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, items: lines }),
      });
      if (!res.ok) throw new Error("failed");
      setCart({});
      setName("");
      setToast("Order sent to kitchen");
      setTimeout(() => setToast(null), 2200);
    } catch {
      setToast("Error — try again");
      setTimeout(() => setToast(null), 2200);
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header label="Cashier" />

      <div style={{ flex: 1, display: "flex", flexWrap: "wrap" }}>
        {/* Menu */}
        <section
          style={{
            flex: "1 1 480px",
            padding: "24px",
            borderRight: "2px solid var(--line)",
          }}
        >
          {CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "12px",
                }}
              >
                {cat}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {MENU.filter((m) => m.category === cat).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => add(m.id)}
                    style={{
                      border: "2px solid var(--line)",
                      background: cart[m.id] ? "var(--ink)" : "var(--bg)",
                      color: cart[m.id] ? "var(--bg)" : "var(--ink)",
                      padding: "20px 16px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontWeight: 500,
                      fontFamily: "var(--serif)",
                      position: "relative",
                      transition: "background 0.12s, color 0.12s",
                    }}
                  >
                    {m.name}
                    {cart[m.id] ? (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "10px",
                          fontFamily: "var(--mono)",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        ×{cart[m.id]}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Ticket */}
        <aside
          style={{
            flex: "1 1 320px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Current Order
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            style={{
              border: "2px solid var(--line)",
              padding: "14px",
              fontFamily: "var(--mono)",
              fontSize: "15px",
              marginBottom: "20px",
              background: "var(--bg)",
              color: "var(--ink)",
            }}
          />

          <div style={{ flex: 1 }}>
            {lines.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>No items yet.</p>
            ) : (
              lines.map((l) => (
                <div
                  key={l.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ fontFamily: "var(--serif)", fontSize: "16px" }}>{l.name}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => remove(l.id)}
                      style={{
                        border: "2px solid var(--line)",
                        width: "30px",
                        height: "30px",
                        background: "var(--bg)",
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>
                    <b style={{ width: "20px", textAlign: "center" }}>{l.qty}</b>
                    <button
                      onClick={() => add(l.id)}
                      style={{
                        border: "2px solid var(--line)",
                        width: "30px",
                        height: "30px",
                        background: "var(--bg)",
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={submit}
            disabled={total === 0 || sending}
            style={{
              marginTop: "20px",
              border: "2px solid var(--line)",
              padding: "20px",
              background: total === 0 ? "var(--bg)" : "var(--ink)",
              color: total === 0 ? "var(--muted)" : "var(--bg)",
              fontFamily: "var(--mono)",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "Sending…" : `Send to Kitchen (${total})`}
          </button>
        </aside>
      </div>

      {toast ? (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--bg)",
            padding: "14px 28px",
            fontSize: "14px",
            letterSpacing: "0.05em",
          }}
        >
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function Header({ label }) {
  return (
    <header
      style={{
        borderBottom: "2px solid var(--line)",
        padding: "18px 24px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <a href="/" style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 600 }}>
        Toast.
      </a>
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
      </span>
    </header>
  );
}
