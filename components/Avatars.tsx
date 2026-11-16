import { GaneshaArt, KaaluArt, MooshakArt } from "@/components/Cast";

// Round avatar portraits for the cast: Mooshak, Kaalu, Medhu and the gods.

const Ring = ({ size, bg, children }: { size: number; bg: string; children: React.ReactNode }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, border: `${Math.max(2, size / 22)}px solid white`, boxShadow: "0 3px 0 rgba(0,0,0,.12)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {children}
  </div>
);

function Hanuman() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="22" cy="56" r="12" fill="#e65100" /><circle cx="78" cy="56" r="12" fill="#e65100" />
      <circle cx="22" cy="56" r="6" fill="#ffccbc" /><circle cx="78" cy="56" r="6" fill="#ffccbc" />
      <circle cx="50" cy="58" r="30" fill="#ef6c00" />
      <ellipse cx="50" cy="68" rx="20" ry="16" fill="#ffccbc" />
      <ellipse cx="41" cy="54" rx="6" ry="7" fill="#ffccbc" /><ellipse cx="59" cy="54" rx="6" ry="7" fill="#ffccbc" />
      <circle cx="41" cy="55" r="3.2" fill="#2b2118" /><circle cx="59" cy="55" r="3.2" fill="#2b2118" />
      <circle cx="42" cy="54" r="1" fill="white" /><circle cx="60" cy="54" r="1" fill="white" />
      <ellipse cx="50" cy="66" rx="5" ry="3" fill="#bf6b4e" />
      <path d="M42 74 Q50 80 58 74" stroke="#8a3f15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M46 40 L50 32 L54 40" fill="#d64545" />
      <path d="M28 34 L34 14 L42 26 L50 8 L58 26 L66 14 L72 34 Q50 28 28 34 Z" fill="#f2c230" stroke="#c99a10" strokeWidth="1.5" />
      <circle cx="50" cy="20" r="3.5" fill="#d64545" />
    </svg>
  );
}

function Krishna() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M60 4 Q74 10 70 30" stroke="#2e9d5b" strokeWidth="3" fill="none" />
      <ellipse cx="68" cy="12" rx="8" ry="11" fill="#2e7d32" transform="rotate(20 68 12)" />
      <ellipse cx="68" cy="12" rx="5" ry="7" fill="#1565c0" transform="rotate(20 68 12)" />
      <circle cx="68" cy="12" r="3" fill="#f2c230" />
      <circle cx="50" cy="60" r="28" fill="#4f7fd6" />
      <path d="M22 50 Q24 22 50 22 Q76 22 78 50 Q66 34 50 36 Q34 34 22 50 Z" fill="#1d1d3a" />
      <path d="M28 40 L36 24 L44 32 L50 20 L56 32 L64 24 L72 40 Q50 32 28 40 Z" fill="#f2c230" stroke="#c99a10" strokeWidth="1.2" />
      <circle cx="40" cy="58" r="3.5" fill="#1d1d3a" /><circle cx="60" cy="58" r="3.5" fill="#1d1d3a" />
      <circle cx="41" cy="57" r="1.1" fill="white" /><circle cx="61" cy="57" r="1.1" fill="white" />
      <path d="M46 48 L50 44 L54 48 L50 52 Z" fill="#f2c230" />
      <path d="M42 72 Q50 78 58 72" stroke="#1d1d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="68" r="4" fill="#7fa5ea" /><circle cx="66" cy="68" r="4" fill="#7fa5ea" />
    </svg>
  );
}

function Durga() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M18 70 Q14 30 50 26 Q86 30 82 70 L82 100 L18 100 Z" fill="#2b2118" />
      <circle cx="50" cy="60" r="26" fill="#f4b183" />
      <path d="M26 46 Q30 28 50 30 Q70 28 74 46 Q62 38 50 40 Q38 38 26 46 Z" fill="#2b2118" />
      <path d="M26 36 L34 14 L42 28 L50 6 L58 28 L66 14 L74 36 Q50 28 26 36 Z" fill="#f2c230" stroke="#c99a10" strokeWidth="1.2" />
      <circle cx="50" cy="20" r="3.5" fill="#d64545" />
      <circle cx="50" cy="48" r="3" fill="#d64545" />
      <ellipse cx="40" cy="58" rx="4" ry="3" fill="#2b2118" /><ellipse cx="60" cy="58" rx="4" ry="3" fill="#2b2118" />
      <path d="M34 54 Q40 51 45 54 M55 54 Q60 51 66 54" stroke="#2b2118" strokeWidth="1.5" fill="none" />
      <path d="M43 72 Q50 77 57 72" stroke="#c2185b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="66" r="3" fill="#f2c230" /><circle cx="76" cy="66" r="3" fill="#f2c230" />
    </svg>
  );
}

function Shiva() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="50" cy="22" rx="16" ry="14" fill="#3e2723" />
      <path d="M56 12 A8 8 0 1 0 62 24 A6 6 0 1 1 56 12 Z" fill="#fff6c9" />
      <circle cx="50" cy="60" r="28" fill="#7fb3d5" />
      <path d="M22 54 Q24 32 50 32 Q76 32 78 54 Q64 42 50 44 Q36 42 22 54 Z" fill="#3e2723" />
      <path d="M38 48 H62 M38 51 H62 M38 54 H62" stroke="white" strokeWidth="1.5" />
      <ellipse cx="50" cy="47" rx="2" ry="4" fill="#d64545" />
      <path d="M36 62 Q41 66 46 62 M54 62 Q59 66 64 62" stroke="#1d1d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M43 74 Q50 78 57 74" stroke="#1d1d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M26 86 Q50 100 74 86" stroke="#6d4c41" strokeWidth="4" fill="none" />
      <circle cx="36" cy="92" r="3" fill="#8d6e63" /><circle cx="50" cy="95" r="3" fill="#8d6e63" /><circle cx="64" cy="92" r="3" fill="#8d6e63" />
    </svg>
  );
}

function Ram() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M84 12 Q100 50 84 88" stroke="#8a3f15" strokeWidth="4" fill="none" />
      <path d="M84 12 L84 88" stroke="#d7ccc8" strokeWidth="1.2" />
      <circle cx="48" cy="60" r="27" fill="#6fa86f" />
      <path d="M21 56 Q22 34 48 34 Q74 34 75 56 Q62 44 48 46 Q34 44 21 56 Z" fill="#1d1d3a" />
      <path d="M26 40 L32 16 L40 30 L48 8 L56 30 L64 16 L70 40 Q48 32 26 40 Z" fill="#f2c230" stroke="#c99a10" strokeWidth="1.2" />
      <circle cx="48" cy="22" r="3.5" fill="#2f6fd6" />
      <path d="M45 48 L48 42 L51 48" stroke="#d64545" strokeWidth="2.2" fill="none" />
      <circle cx="38" cy="60" r="3.2" fill="#1d1d3a" /><circle cx="58" cy="60" r="3.2" fill="#1d1d3a" />
      <path d="M41 72 Q48 77 55 72" stroke="#1d1d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Medhu as his own superhero: an original character, not based on any brand.
export function MedhuHero({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Medhu the hero">
      <path d="M26 58 Q14 92 30 98 L70 98 Q86 92 74 58 Z" fill="#d64545" />
      <rect x="32" y="62" width="36" height="34" rx="10" fill="#f28c28" />
      <path d="M40 72 L44 86 L50 76 L56 86 L60 72" stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="50" cy="38" r="24" fill="#f4b183" />
      <path d="M26 34 Q28 12 50 12 Q72 12 74 34 Q66 22 54 24 Q48 18 40 24 Q30 24 26 34 Z" fill="#2b2118" />
      <path d="M28 34 Q50 26 72 34 L72 42 Q50 36 28 42 Z" fill="#2f6fd6" />
      <ellipse cx="41" cy="38" rx="5" ry="4.5" fill="white" /><ellipse cx="59" cy="38" rx="5" ry="4.5" fill="white" />
      <circle cx="42" cy="38" r="2.6" fill="#2b2118" /><circle cx="60" cy="38" r="2.6" fill="#2b2118" />
      <path d="M42 50 Q50 57 58 50" stroke="#2b2118" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="48" r="3" fill="#f48f8a" opacity=".7" /><circle cx="66" cy="48" r="3" fill="#f48f8a" opacity=".7" />
    </svg>
  );
}

export function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  if (name === "Mooshak") return <Ring size={size} bg="#fff1dd"><div style={{ marginTop: size * 0.12 }}><MooshakArt size={size * 0.95} mood="happy" /></div></Ring>;
  if (name === "Ganesha") return <Ring size={size} bg="#ffe3b8"><div style={{ marginTop: size * 0.32 }}><GaneshaArt size={size * 1.05} /></div></Ring>;
  if (name === "Medhu") return <Ring size={size} bg="#e8f1ff"><div style={{ marginTop: size * 0.1 }}><MedhuHero size={size * 0.95} /></div></Ring>;
  if (name === "Kaalu") return <Ring size={size} bg="#dfe7f2"><div style={{ marginTop: size * 0.06 }}><KaaluArt size={size * 0.9} /></div></Ring>;
  if (name === "Hanuman") return <Ring size={size} bg="#fff3c4"><Hanuman /></Ring>;
  if (name === "Krishna") return <Ring size={size} bg="#e8f1ff"><Krishna /></Ring>;
  if (name === "Durga") return <Ring size={size} bg="#fde4ec"><Durga /></Ring>;
  if (name === "Shiva") return <Ring size={size} bg="#e3f2fd"><Shiva /></Ring>;
  if (name === "Ram") return <Ring size={size} bg="#e8f5e9"><Ram /></Ring>;
  const initials = name.split(/[\s-]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <Ring size={size} bg="#8d6e63"><span style={{ color: "white", fontWeight: 900, fontSize: size * 0.36 }}>{initials}</span></Ring>;
}
