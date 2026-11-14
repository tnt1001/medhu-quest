"use client";
import { useEffect, useState } from "react";
import { musicOn, setMusicOn } from "@/lib/audio";

export default function MusicToggle() {
  const [on, set] = useState(true);
  useEffect(() => set(musicOn()), []);
  return (
    <button className="pill" aria-label={on ? "Turn music off" : "Turn music on"} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", padding: "4px 9px", opacity: on ? 1 : 0.5 }} onClick={() => { setMusicOn(!on); set(!on); }}>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18V5l11-2v13" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
        <circle cx="6.5" cy="18" r="3" fill="currentColor" /><circle cx="17.5" cy="16" r="3" fill="currentColor" />
        {!on && <path d="M3 3l18 18" stroke="#d64545" strokeWidth="2.4" />}
      </svg>
    </button>
  );
}
