"use client";
import { useEffect, useState } from "react";
import { isMuted, setMuted } from "@/lib/audio";

export default function MuteToggle() {
  const [muted, set] = useState(false);
  useEffect(() => set(isMuted()), []);
  return (
    <button
      className="pill"
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
      onClick={() => { setMuted(!muted); set(!muted); }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {muted ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" />}
      </svg>
      {muted ? "Sound off" : "Sound on"}
    </button>
  );
}
