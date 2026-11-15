import { Avatar } from "@/components/Avatars";
// The cartoon cast, drawn as SVG so every character looks the same everywhere.
// Marvel heroes are named in stories but never drawn; their presence is shown
// through props (a web, motion lines), not their likeness.

type Mood = "happy" | "confused" | "excited" | "thinking";

export function MooshakArt({ size = 90, mood = "happy" }: { size?: number; mood?: Mood }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Mooshak the mouse">
      <ellipse cx="50" cy="94" rx="26" ry="4" fill="rgba(0,0,0,.12)" />
      <path d="M74 80 Q96 78 92 60 Q90 52 84 56" stroke="#a1887f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="74" rx="22" ry="20" fill="#bcaaa4" />
      <ellipse cx="50" cy="78" rx="13" ry="12" fill="#efebe9" />
      <circle cx="24" cy="26" r="15" fill="#a1887f" /><circle cx="24" cy="26" r="9" fill="#f8bbd0" />
      <circle cx="76" cy="26" r="15" fill="#a1887f" /><circle cx="76" cy="26" r="9" fill="#f8bbd0" />
      <ellipse cx="50" cy="44" rx="25" ry="22" fill="#bcaaa4" />
      <path d="M32 22 Q50 6 68 22" stroke="#f28c28" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="12" r="4" fill="#d64545" />
      {mood === "confused" ? (
        <>
          <path d="M36 36 L46 40" stroke="#2b2118" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="41" cy="44" r="3.5" fill="#2b2118" /><circle cx="60" cy="42" r="4.5" fill="#2b2118" />
          <path d="M42 58 Q46 55 50 58 Q54 61 58 58" stroke="#2b2118" strokeWidth="2.2" fill="none" />
          <text x="78" y="40" fontSize="18" fontWeight="800" fill="#f28c28">?</text>
        </>
      ) : mood === "thinking" ? (
        <>
          <circle cx="41" cy="43" r="3.5" fill="#2b2118" /><circle cx="59" cy="43" r="3.5" fill="#2b2118" />
          <path d="M44 58 L56 57" stroke="#2b2118" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="41" cy="43" r={mood === "excited" ? 5 : 4} fill="#2b2118" /><circle cx="59" cy="43" r={mood === "excited" ? 5 : 4} fill="#2b2118" />
          <circle cx="42.5" cy="41.5" r="1.4" fill="white" /><circle cx="60.5" cy="41.5" r="1.4" fill="white" />
          <path d={mood === "excited" ? "M40 55 Q50 66 60 55 Z" : "M42 56 Q50 63 58 56"} stroke="#2b2118" strokeWidth="2.2" fill={mood === "excited" ? "#e57373" : "none"} />
        </>
      )}
      <circle cx="50" cy="50" r="4" fill="#e57373" />
      <circle cx="33" cy="51" r="3.5" fill="#f8bbd0" opacity=".8" /><circle cx="67" cy="51" r="3.5" fill="#f8bbd0" opacity=".8" />
      <path d="M28 50 L16 47 M28 54 L16 56 M72 50 L84 47 M72 54 L84 56" stroke="#6d4c41" strokeWidth="1.5" />
    </svg>
  );
}

export function GaneshaArt({ size = 150, holding = true }: { size?: number; holding?: boolean }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 140 154" aria-label="Lord Ganesha">
      <ellipse cx="70" cy="148" rx="44" ry="5" fill="rgba(0,0,0,.12)" />
      {/* body and dhoti */}
      <ellipse cx="70" cy="112" rx="40" ry="34" fill="#f7a7a0" />
      <path d="M32 118 Q70 150 108 118 L110 140 Q70 156 30 140 Z" fill="#f2c230" />
      <path d="M32 118 Q70 150 108 118" stroke="#d64545" strokeWidth="4" fill="none" />
      <ellipse cx="70" cy="110" rx="22" ry="18" fill="#f9c4c0" />
      <path d="M46 90 Q70 104 94 90" stroke="#f2c230" strokeWidth="5" fill="none" />
      {/* arms */}
      <ellipse cx="30" cy="104" rx="10" ry="16" fill="#f7a7a0" transform="rotate(20 30 104)" />
      <ellipse cx="110" cy="104" rx="10" ry="16" fill="#f7a7a0" transform="rotate(-20 110 104)" />
      <circle cx="26" cy="118" r="7" fill="#f9c4c0" />
      <circle cx="114" cy="118" r="7" fill="#f9c4c0" />
      {holding && (
        <g transform="translate(104 98)">
          <path d="M10 0 C14 7 20 11 20 17 C20 22 15 24 10 24 C5 24 0 22 0 17 C0 11 6 7 10 0 Z" fill="#f6d38b" stroke="#c9963b" strokeWidth="1.5" />
          <path d="M10 3 L10 23 M6 9 C5 15 5 20 7 24 M14 9 C15 15 15 20 13 24" stroke="#c9963b" strokeWidth="1" fill="none" />
        </g>
      )}
      {/* ears */}
      <ellipse cx="28" cy="54" rx="22" ry="26" fill="#f48f8a" />
      <ellipse cx="30" cy="54" rx="14" ry="18" fill="#f9c4c0" />
      <ellipse cx="112" cy="54" rx="22" ry="26" fill="#f48f8a" />
      <ellipse cx="110" cy="54" rx="14" ry="18" fill="#f9c4c0" />
      {/* head */}
      <ellipse cx="70" cy="56" rx="32" ry="30" fill="#f7a7a0" />
      {/* trunk */}
      <path d="M66 70 Q60 96 70 104 Q80 110 86 100" stroke="#f7a7a0" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M66 74 Q62 94 70 100" stroke="#f48f8a" strokeWidth="2" fill="none" strokeDasharray="3 4" />
      {/* tusk */}
      <path d="M80 72 Q90 80 88 88" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="57" cy="54" rx="4.5" ry="5.5" fill="#2b2118" /><ellipse cx="83" cy="54" rx="4.5" ry="5.5" fill="#2b2118" />
      <circle cx="58.5" cy="52" r="1.6" fill="white" /><circle cx="84.5" cy="52" r="1.6" fill="white" />
      <path d="M52 46 Q57 43 62 46 M78 46 Q83 43 88 46" stroke="#2b2118" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="66" r="5" fill="#f48f8a" opacity=".7" /><circle cx="92" cy="66" r="5" fill="#f48f8a" opacity=".7" />
      {/* tilak */}
      <path d="M64 34 Q70 44 76 34" stroke="#d64545" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="40" r="2.5" fill="#d64545" />
      {/* crown */}
      <path d="M42 30 L48 8 L58 22 L70 0 L82 22 L92 8 L98 30 Q70 22 42 30 Z" fill="#f2c230" stroke="#c99a10" strokeWidth="1.5" />
      <circle cx="70" cy="14" r="4" fill="#d64545" /><circle cx="52" cy="22" r="2.5" fill="#2f6fd6" /><circle cx="88" cy="22" r="2.5" fill="#2e9d5b" />
      <rect x="42" y="27" width="56" height="6" rx="3" fill="#f2c230" stroke="#c99a10" strokeWidth="1.2" />
    </svg>
  );
}

// A spider-web prop: tells the reader the web-slinging hero is around without drawing him.
export function WebArt({ size = 120, children }: { size?: number; children?: React.ReactNode }) {
  const spokes = Array.from({ length: 8 }, (_, k) => (k * Math.PI) / 4);
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" aria-label="a web">
      {spokes.map((a, k) => <line key={k} x1="0" y1="0" x2={Math.cos(a) * 58} y2={Math.sin(a) * 58} stroke="#9aa6b2" strokeWidth="1.2" />)}
      {[14, 28, 42, 56].map((r) => (
        <polygon key={r} points={spokes.map((a) => `${Math.cos(a) * r},${Math.sin(a) * r}`).join(" ")} fill="none" stroke="#9aa6b2" strokeWidth="1.2" />
      ))}
      {children}
    </svg>
  );
}

export function SpeedLines({ color = "#d64545" }: { color?: string }) {
  return (
    <svg width="90" height="50" viewBox="0 0 90 50" aria-hidden="true">
      <path d="M5 10 H55 M15 25 H80 M5 40 H50" stroke={color} strokeWidth="4" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function Toran() {
  return (
    <svg width="100%" height="34" viewBox="0 0 360 34" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 4 Q180 18 360 4" stroke="#2e9d5b" strokeWidth="3" fill="none" />
      {Array.from({ length: 12 }, (_, k) => {
        const x = 15 + k * 30;
        const y = 4 + 14 * Math.sin((Math.PI * x) / 360);
        return k % 2 === 0
          ? <path key={k} d={`M${x} ${y} q-7 10 0 22 q7 -12 0 -22z`} fill="#3aa864" />
          : <circle key={k} cx={x} cy={y + 9} r="6" fill="#f28c28" />;
      })}
    </svg>
  );
}

// Card portrait: drawn art where we have it, initials badge otherwise.
export function CardPortrait({ name, color, size = 90 }: { name: string; color: string; size?: number }) {
  void color;
  return <Avatar name={name} size={size} />;
}

// Kaalu, the cheeky crow who keeps trying to steal the modaks (an original character).
export function KaaluArt({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Kaalu the crow">
      <path className="flap" d="M40 50 Q10 30 4 52 Q22 50 34 62 Z" fill="#3a3f4b" />
      <ellipse cx="52" cy="60" rx="26" ry="20" fill="#2b2f38" />
      <path d="M74 64 L96 58 L92 72 Z" fill="#2b2f38" />
      <circle cx="40" cy="38" r="17" fill="#2b2f38" />
      <path d="M22 38 L6 44 L22 46 Z" fill="#f2a516" />
      <circle cx="36" cy="34" r="6" fill="white" />
      <circle cx="34" cy="34" r="3" fill="#111" />
      <circle cx="33" cy="33" r="1" fill="white" />
      <path d="M28 25 L42 29" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 20 Q40 6 52 20 Z" fill="#d64545" />
      <circle cx="41" cy="9" r="3" fill="#f2c230" />
      <path d="M46 78 L44 90 M56 78 L58 90" stroke="#f2a516" strokeWidth="3" strokeLinecap="round" />
      <path className="flap" d="M58 52 Q80 30 92 44 Q76 50 66 64 Z" fill="#3a3f4b" />
    </svg>
  );
}
