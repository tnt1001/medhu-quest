"use client";
import Link from "next/link";
import { MooshakArt } from "@/components/Cast";

export default function LockModal({ title, need, needDay, onClose }: { title: string; need: string; needDay: number; onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal pop" onClick={(e) => e.stopPropagation()}>
        <div className="lock-big" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="12" rx="3" fill="#f2c230" stroke="#c99a10" strokeWidth="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#c99a10" strokeWidth="2.5" fill="none" /><circle cx="12" cy="16" r="2" fill="#8a5a1a" /></svg>
        </div>
        <MooshakArt size={80} mood="thinking" />
        <p className="title" style={{ marginTop: 6 }}>{title} is locked!</p>
        <p style={{ fontSize: 17, fontWeight: 700, margin: "6px 0 14px" }}>Games open one by one. Your next game is <b>Game {needDay}: {need}</b>.</p>
        <div className="row" style={{ justifyContent: "center", gap: 10 }}>
          <button className="btn ghost small" onClick={onClose}>OK</button>
          <Link href={`/quest/${needDay}`} className="btn small" style={{ textDecoration: "none" }}>Play Game {needDay}</Link>
        </div>
      </div>
    </div>
  );
}
