"use client";

import { useEffect, useState, useCallback } from "react";

export default function Historico() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?status=done", { cache: "no-store" });
      if (res.ok) setOrders(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(poll);
  }, [load]);

  function dateTime(iso) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  }
  function clockTime(iso) {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  const totalItems = orders.reduce(
    (s, o) => s + o.items.reduce((a, it) => a + it.qty, 0), 0
  );

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "2px solid var(--line)", padding: "18px 24px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 600 }}>Toast.</a>
        <span style={{ display: "flex", gap: "20px", alignItems: "baseline" }}>
          <a href="/cashier" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>Caixa</a>
          <a href="/kitchen" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>Cozinha</a>
          <span style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)" }}>Histórico</span>
        </span>
      </header>

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: "32px", marginBottom: "24px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--muted)" }}>
          <span><b style={{ color: "var(--ink)", fontSize: "22px", fontFamily: "var(--serif)" }}>{orders.length}</b> pedidos concluídos</span>
          <span><b style={{ color: "var(--ink)", fontSize: "22px", fontFamily: "var(--serif)" }}>{totalItems}</b> itens no total</span>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: "14px" }}>Carregando…</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontSize: "20px" }}>Nenhum pedido concluído ainda.</p>
        ) : (
          <div style={{ border: "2px solid var(--line)" }}>
            {orders.map((o, i) => {
              const requested = o.requested_time ? clockTime(o.requested_time) : "Agora";
              return (
                <div key={o.id} style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "baseline", padding: "16px", borderBottom: i < orders.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <div style={{ minWidth: "200px" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 600 }}>
                      #{o.id} · {o.customer_name}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                      concluído {dateTime(o.created_at)} · pedido p/ {requested}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "15px", textAlign: "right", flex: 1, minWidth: "180px" }}>
                    {o.items.map((it, idx) => (
                      <span key={idx}>
                        {it.qty}× {it.name}{idx < o.items.length - 1 ? "  ·  " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
