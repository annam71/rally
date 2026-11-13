"use client";

export default function VideoModal({
  embedUrl,
  rawUrl,
  onClose,
}: {
  embedUrl: string;
  rawUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "oklch(0.2 0.02 60 / 0.72)",
        zIndex: 60,
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="screen-enter"
        style={{
          width: "100%",
          maxWidth: 720,
          background: "var(--surface)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          <iframe
            src={embedUrl}
            title="Exercise demo"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
        <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href={rawUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14.5, fontWeight: 600 }}>
            Open in YouTube ↗
          </a>
          <button
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: "8px 16px", borderRadius: 999, fontSize: 14.5, fontWeight: 600 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
