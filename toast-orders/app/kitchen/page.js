"use client";

import { useEffect, useState, useCallback } from "react";

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) setOrders(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 3000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load]);

  async function complete(id) {
    setOrders((o) => o.filter((x) => x.id !== id));
    try {
      await fetch(`/api/orders/${id}`, { method: "PATCH" });
    } catch {
      load();
    }
  }

  function clockTime(iso) {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function elapsed(created) {
    const s = Math.floor((now - new Date(created).getTime()) / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "2px solid var(--line)", padding: "18px 24px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 600 }}>Toast.</a>
        <span style={{ display: "flex", gap: "20px", alignItems: "baseline" }}>
          <a href="/historico" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>Histórico</a>
          <span style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)" }}>
            Cozinha · {orders.length} ativos
          </span>
        </span>
      </header>

      {orders.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "var(--serif)", fontSize: "22px" }}>
          Sem pedidos. Tudo em dia.
        </div>
      ) : (
        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", alignItems: "start" }}>
          {orders.map((o) => {
            const requested = o.requested_time ? clockTime(o.requested_time) : null;
            return (
              <article key={o.id} style={{ border: "2px solid var(--line)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 16px", borderBottom: "2px solid var(--line)" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 600 }}>
                    #{o.id} · {o.customer_name}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--muted)" }}>
                    {elapsed(o.created_at)}
                  </span>
                </div>

                {/* Requested time banner */}
                <div style={{ padding: "8px 16px", borderBottom: "2px solid var(--line)", background: requested ? "var(--ink)" : "var(--bg)", color: requested ? "var(--bg)" : "var(--muted)", fontFamily: "var(--mono)", fontSize: "13px", letterSpacing: "0.05em", display: "flex", justifyContent: "space-between" }}>
                  <span>{requested ? "Para às" : "Entregar"}</span>
                  <b>{requested || "AGORA"}</b>
                </div>

                <ul style={{ listStyle: "none", padding: "14px 16px", flex: 1 }}>
                  {o.items.map((it, idx) => (
                    <li key={idx} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--serif)", fontSize: "18px", padding: "6px 0" }}>
                      <span>{it.name}</span>
                      <b style={{ fontFamily: "var(--mono)" }}>×{it.qty}</b>
                    </li>
                  ))}
                </ul>

                <button onClick={() => complete(o.id)} style={{ border: "none", borderTop: "2px solid var(--line)", background: "var(--ink)", color: "var(--bg)", padding: "16px", fontFamily: "var(--mono)", fontWeight: 700, fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ✓ Concluir
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
