import { GaneshaArt, KaaluArt, MooshakArt, SpeedLines, Toran, WebArt } from "@/components/Cast";
import { ItemArt } from "@/components/Art";
import type { Scene as SceneSpec } from "@/content/quests";

const BG: Record<SceneSpec["bg"], { sky: string; ground: string }> = {
  feast: { sky: "linear-gradient(#ffe3b8, #fff4e2)", ground: "#e9b872" },
  temple: { sky: "linear-gradient(#bfe3ff, #eaf6ff)", ground: "#d9c08f" },
  night: { sky: "linear-gradient(#1f2a5a, #3b4a8a)", ground: "#2c335c" },
  kitchen: { sky: "linear-gradient(#fff3c4, #fffaf0)", ground: "#d7a86e" },
  sky: { sky: "linear-gradient(#9fd4ff, #e5f4ff)", ground: "#9bd38b" },
};

function Backdrop({ bg }: { bg: SceneSpec["bg"] }) {
  if (bg === "feast") {
    return (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}><Toran /></div>
        {[12, 88].map((x) => (
          <div key={x} style={{ position: "absolute", left: `${x}%`, bottom: "22%", transform: "translateX(-50%)" }} className="flicker"><ItemArt item="diya" size={30} /></div>
        ))}
      </>
    );
  }
  if (bg === "temple") {
    return (
      <svg style={{ position: "absolute", right: "4%", bottom: "20%" }} width="130" height="120" viewBox="0 0 130 120" aria-hidden="true">
        <path d="M65 4 L66 0 L67 4 M65 4 Q40 40 38 70 L92 70 Q90 40 65 4 Z" fill="#f28c28" />
        <path d="M60 4 L74 4 L67 -6 Z" fill="#d64545" />
        <rect x="20" y="70" width="90" height="46" fill="#f6b26b" />
        <rect x="52" y="84" width="26" height="32" rx="13" fill="#8a3f15" />
        <path d="M16 70 H114" stroke="#c96a10" strokeWidth="4" />
      </svg>
    );
  }
  if (bg === "night") {
    return (
      <>
        <div style={{ position: "absolute", right: "10%", top: "10%", width: 34, height: 34, borderRadius: "50%", background: "#fff6c9", boxShadow: "0 0 24px #fff6c9" }} />
        {[[10, 15], [25, 30], [45, 12], [62, 26], [80, 40], [35, 45]].map(([x, y], k) => (
          <div key={k} className="twinkle" style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 4, height: 4, borderRadius: "50%", background: "white", animationDelay: `${k * 0.3}s` }} />
        ))}
      </>
    );
  }
  if (bg === "sky") {
    return (
      <>
        {[[8, 14, 70], [60, 8, 90], [35, 32, 60]].map(([x, y, w], k) => (
          <div key={k} className="drift" style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: w * 0.4, borderRadius: 99, background: "white", opacity: 0.9, animationDelay: `${k}s` }} />
        ))}
      </>
    );
  }
  return (
    <div style={{ position: "absolute", top: "14%", left: "8%", right: "8%", height: 10, background: "#b5835a", borderRadius: 6 }}>
      {[10, 40, 70].map((x) => <div key={x} style={{ position: "absolute", left: `${x}%`, bottom: 10, width: 26, height: 30, borderRadius: "40% 40% 30% 30%", background: "#c0602a" }} />)}
    </div>
  );
}

export function SceneView({ scene, height = "var(--scene-h)" }: { scene: SceneSpec; height?: string }) {
  const bg = BG[scene.bg];
  const cast = scene.cast ?? [];
  const items = scene.items;
  const solo = cast.length === 1 && !!items && items.on !== "web";
  return (
    <div className="scene" style={{ position: "relative", height, background: bg.sky, borderRadius: 24, overflow: "hidden", border: "3px solid white", boxShadow: "0 6px 0 rgba(0,0,0,.06)" }}>
      <Backdrop bg={scene.bg} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "22%", background: bg.ground }} />
      {scene.swing && (
        <div className="swing-in" style={{ position: "absolute", left: "6%", top: "12%" }}><SpeedLines /></div>
      )}
      {scene.web && (
        <div style={{ position: "absolute", left: "50%", top: "4%", transform: "translateX(-50%)" }}><div className="sway">
          <WebArt size={130}>
            {items && items.on === "web" && Array.from({ length: items.n }, (_, k) => {
              const a = (k / Math.max(items.n, 1)) * Math.PI * 2;
              return <g key={k} transform={`translate(${Math.cos(a) * 30 - 10} ${Math.sin(a) * 30 - 12})`}><path d="M10 0 C14 7 20 11 20 17 C20 22 15 24 10 24 C5 24 0 22 0 17 C0 11 6 7 10 0 Z" fill="#f6d38b" stroke="#c9963b" strokeWidth="1.5" /></g>;
            })}
          </WebArt>
        </div></div>
      )}
      {items && items.on !== "web" && (
        <div style={{ position: "absolute", left: solo ? (cast.includes("ganesha") ? "66%" : "36%") : "50%", bottom: "12%", transform: "translateX(-50%)", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, width: cast.length > 1 ? "32%" : "46%", padding: "6px 8px", background: items.on === "plate" ? "rgba(255,255,255,.85)" : "transparent", borderRadius: 999 }}>
          {Array.from({ length: items.n }, (_, k) => <div key={k} className="pop" style={{ animationDelay: `${k * 0.08}s`, animationFillMode: "both" }}><ItemArt item={items.item} size={28} /></div>)}
        </div>
      )}
      {scene.big && (
        <div className="pop" style={{ position: "absolute", left: "50%", top: "10%", transform: "translateX(-50%)", fontSize: 46, zIndex: 2, background: "rgba(255,255,255,.85)", padding: "2px 16px", borderRadius: 20, fontWeight: 900, color: "#f28c28", textShadow: "0 4px 0 white, 0 0 0 white" }}>{scene.big}</div>
      )}
      {scene.kaalu && (
        <div className="kaalu-fly" style={{ position: "absolute", right: "6%", top: "8%", zIndex: 3 }}>
          <KaaluArt size={78} />
        </div>
      )}
      {cast.includes("ganesha") && (
        <div style={{ position: "absolute", left: cast.length > 1 || solo ? "2%" : "50%", bottom: "4%", transform: cast.length > 1 || solo ? "none" : "translateX(-50%)" }}>
          <div className="bob"><GaneshaArt size={120} /></div>
        </div>
      )}
      {cast.includes("mooshak") && (
        <div style={{ position: "absolute", right: cast.length > 1 || solo ? "4%" : "auto", left: cast.length > 1 || solo ? "auto" : "50%", bottom: "6%", transform: cast.length > 1 || solo ? "none" : "translateX(-50%)" }}>
          <div className="hop"><MooshakArt size={86} mood={scene.mood} /></div>
        </div>
      )}
    </div>
  );
}
