import { Logo } from "./icons";

export function TopBar({
  user,
  onHome,
  step,
}: {
  user?: string;
  onHome?: () => void;
  step?: React.ReactNode;
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "oklch(0.985 0.008 78 / 0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="topbar-inner"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div onClick={onHome} style={{ cursor: onHome ? "pointer" : "default" }}>
          <Logo />
        </div>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "var(--muted)" }}>
            {step}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--accent-wash)",
                color: "var(--accent-ink)",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {user[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen-enter shell" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 96px" }}>
      {children}
    </div>
  );
}
