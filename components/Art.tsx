import { MooshakArt } from "@/components/Cast";
import type { Item, ShapeName } from "@/content/quests";

export function ItemArt({ item, size = 48, color }: { item: Item; size?: number; color?: string }) {
  if (item === "modak") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-label="modak">
        <path d="M24 4 C30 14 40 22 40 32 C40 40 33 44 24 44 C15 44 8 40 8 32 C8 22 18 14 24 4 Z" fill={color || "#f6d38b"} stroke="#c9963b" strokeWidth="2" />
        <path d="M24 8 L24 42 M17 16 C16 26 16 36 19 43 M31 16 C32 26 32 36 29 43" stroke="#c9963b" strokeWidth="1.6" fill="none" />
      </svg>
    );
  }
  if (item === "laddoo") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-label="laddoo">
        <circle cx="24" cy="26" r="18" fill={color || "#f4a62a"} stroke="#c97a10" strokeWidth="2" />
        <circle cx="18" cy="20" r="2" fill="#c97a10" /><circle cx="28" cy="24" r="2" fill="#c97a10" /><circle cx="22" cy="32" r="2" fill="#c97a10" /><circle cx="31" cy="33" r="2" fill="#c97a10" />
      </svg>
    );
  }
  if (item === "star") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-label="star">
        <path d="M24 4 L29.5 17 L43.5 18 L32.8 27.2 L36.2 41 L24 33.6 L11.8 41 L15.2 27.2 L4.5 18 L18.5 17 Z" fill={color || "#f2c230"} stroke="#c99a10" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="diya">
      <path d="M24 6 C28 12 29 16 24 22 C19 16 20 12 24 6 Z" fill="#ffb300" />
      <path d="M24 11 C26 14 26 17 24 20 C22 17 22 14 24 11 Z" fill="#fff3c4" />
      <path d="M6 26 L42 26 C40 36 33 42 24 42 C15 42 8 36 6 26 Z" fill={color || "#c0602a"} stroke="#8a3f15" strokeWidth="2" />
    </svg>
  );
}

export function ShapeArt({ shape, size = 64, color = "#2f6fd6" }: { shape: ShapeName; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label={shape}>
      {shape === "circle" && <circle cx="32" cy="32" r="26" fill={color} />}
      {shape === "triangle" && <path d="M32 6 L59 56 L5 56 Z" fill={color} />}
      {shape === "square" && <rect x="8" y="8" width="48" height="48" rx="3" fill={color} />}
      {shape === "rectangle" && <rect x="2" y="18" width="60" height="30" rx="3" fill={color} />}
    </svg>
  );
}

export function Mooshak({ size = 64, mood = "happy" }: { size?: number; mood?: "happy" | "confused" }) {
  return <MooshakArt size={size} mood={mood} />;
}

export function Badge({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const initials = name.split(/[\s-]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.38, flexShrink: 0, border: "3px solid white", boxShadow: "0 1px 0 rgba(0,0,0,.15)" }}>
      {initials}
    </div>
  );
}
