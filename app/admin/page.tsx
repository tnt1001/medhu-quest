"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CHECK_ITEMS, CHECK_STRANDS, LEVELS, SKILLS, STRANDS, type Strand } from "@/content/skills";
import { CARDS, QUESTS, STARS_PER_CARD } from "@/content/quests";

interface Log { id: number; log_date: string; quest_day: number | null; skill_id: string; game: string | null; tries: number; correct: number; method: number | null; engagement: number | null; note: string | null }
interface Check { id: number; check_date: string; label: string; scores: number[]; total: number }
interface Reward { id: number; kind: string; amount: number; reason: string; quest_day: number | null; created_at: string }
interface Data {
  levels: Record<string, number>;
  storedLevels: Record<string, number>;
  logs: Log[];
  checks: Check[];
  rewards: Reward[];
  completions: { id: number; quest_day: number; stars: number; completed_at: string }[];
  rec: { target: string | null; side: string | null; review: string[]; hints: string[]; questsForTarget: number[] };
}

const TABS = ["Today", "Skills", "Checks", "Rewards", "Sync"] as const;
const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
const skillName = (id: string) => SKILLS.find((s) => s.id === id)?.name ?? id;
const GAMES = Array.from(new Set(["Flash!", "How Many Hiding", "Modak Shop", "Tray Fill", "Hanuman Hop", "Smash & Count", "Shrink & Grow", "Mooshak's Mistakes", "Race to Lanka", "Battle Cards", "Story Theatre", "Pattern Garland", "Shape Quest", "Assemble the Team", ...QUESTS.map((q) => q.gameName), "Everyday maths"]));

async function post(body: object) {
  const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
}

function Seg({ value, onChange, options }: { value: number | null; onChange: (n: number) => void; options: { v: number; label: string }[] }) {
  return (
    <div className="seg">
      {options.map((o) => <button type="button" key={o.v} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>{o.label}</button>)}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Today");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/data", { cache: "no-store" });
    if (r.status === 401) return setAuthed(false);
    if (!r.ok) { setErr(`Could not load data (${r.status}).`); setAuthed(true); return; }
    setData(await r.json());
    setAuthed(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (authed === null) return <main className="admin"><p>Loading...</p></main>;
  if (!authed) {
    return (
      <main className="admin" style={{ maxWidth: 360 }}>
        <h1>Papa&apos;s admin</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
          if (r.ok) load(); else setErr("Wrong PIN");
        }}>
          <label className="field">PIN<input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus /></label>
          <button className="btn small" style={{ marginTop: 12 }}>Open</button>
          {err && <p style={{ color: "#d64545" }}>{err}</p>}
        </form>
        <p><Link href="/">Back to Medhu&apos;s Quest</Link></p>
      </main>
    );
  }

  return (
    <main className="admin">
      <div className="row spread">
        <h1 style={{ margin: 0, fontSize: 22 }}>Papa&apos;s admin</h1>
        <Link href="/" style={{ fontSize: 14 }}>Medhu&apos;s Quest</Link>
      </div>
      <div className="tabs">{TABS.map((t) => <button key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</button>)}</div>
      {err && <p style={{ color: "#d64545" }}>{err}</p>}
      {!data ? <p>Loading...</p> : (
        <>
          {tab === "Today" && <TodayTab data={data} reload={load} />}
          {tab === "Skills" && <SkillsTab data={data} reload={load} />}
          {tab === "Checks" && <ChecksTab data={data} reload={load} />}
          {tab === "Rewards" && <RewardsTab data={data} reload={load} />}
          {tab === "Sync" && <SyncTab data={data} />}
        </>
      )}
    </main>
  );
}

function TodayTab({ data, reload }: { data: Data; reload: () => void }) {
  const { rec } = data;
  const done = new Set(data.completions.map((c) => c.quest_day));
  const nextQuest = QUESTS.find((q) => !done.has(q.day));
  const [f, setF] = useState({ log_date: today(), quest_day: nextQuest?.day ?? "", skill_id: nextQuest?.skill ?? rec.target ?? "C2", game: nextQuest?.gameName ?? "", tries: 5, correct: 4, method: 2 as number | null, engagement: 3 as number | null, note: "", everyday: false });
  const [msg, setMsg] = useState("");
  const set = (k: string, v: unknown) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>What to work on</h2>
        <p><b>Next quest:</b> {nextQuest ? `Quest ${nextQuest.day} - ${nextQuest.title} (${nextQuest.skill})` : "Arc 1 complete"}</p>
        <p><b>Target skill:</b> {rec.target ? `${rec.target} - ${skillName(rec.target)} (${LEVELS[data.levels[rec.target] ?? 0]})` : "All core skills secure"}</p>
        {rec.target && nextQuest && nextQuest.skill !== rec.target && (
          <p className="hint">The next quest teaches {nextQuest.skill}, but the map says {rec.target} needs work first.{rec.questsForTarget.length ? ` Consider replaying quest ${rec.questsForTarget.join(" or ")}.` : ""}</p>
        )}
        <p><b>Side skill:</b> {rec.side ? `${rec.side} - ${skillName(rec.side)}` : "-"}</p>
        <p><b>Review:</b> {rec.review.length ? rec.review.map((r) => `${r} - ${skillName(r)}`).join("; ") : "Nothing due"}</p>
        {rec.hints.map((h) => <p key={h} className="hint">{h}</p>)}
      </div>

      <h2>Log a session (1 minute)</h2>
      <form className="card" onSubmit={async (e) => {
        e.preventDefault();
        try {
          const r = await post({ action: "log", ...f });
          setMsg(`Saved. ${f.skill_id} is now ${LEVELS[r.level]} by the mastery rule.`);
          set("note", "");
          reload();
        } catch (er) { setMsg(`Error: ${er}`); }
      }}>
        <div className="grid2">
          <label className="field">Date<input type="date" value={f.log_date} onChange={(e) => set("log_date", e.target.value)} /></label>
          <label className="field">Quest<select value={f.quest_day} onChange={(e) => { const q = QUESTS.find((x) => x.day === Number(e.target.value)); setF((x) => ({ ...x, quest_day: e.target.value, ...(q ? { skill_id: q.skill, game: q.gameName } : {}) })); }}>
            <option value="">None</option>{QUESTS.map((q) => <option key={q.day} value={q.day}>{q.day}. {q.title}</option>)}
          </select></label>
          <label className="field">Skill<select value={f.skill_id} onChange={(e) => set("skill_id", e.target.value)}>
            {SKILLS.map((s) => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
          </select></label>
          <label className="field">Game<select value={f.game} onChange={(e) => set("game", e.target.value)}>
            <option value="">-</option>{GAMES.map((g) => <option key={g}>{g}</option>)}
          </select></label>
          <label className="field">Tries<input type="number" min={0} max={50} value={f.tries} onChange={(e) => set("tries", Number(e.target.value))} /></label>
          <label className="field">Right<input type="number" min={0} max={50} value={f.correct} onChange={(e) => set("correct", Number(e.target.value))} /></label>
        </div>
        <div className="grid2" style={{ marginTop: 10 }}>
          <label className="field">How he did it<Seg value={f.method} onChange={(v) => set("method", v)} options={[{ v: 1, label: "Help" }, { v: 2, label: "Objects" }, { v: 3, label: "In head" }]} /></label>
          <label className="field">Engagement<Seg value={f.engagement} onChange={(v) => set("engagement", v)} options={[{ v: 1, label: "Resisted" }, { v: 2, label: "Okay" }, { v: 3, label: "More!" }]} /></label>
        </div>
        <label className="field" style={{ marginTop: 10 }}>Note<input value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="What surprised you, what flopped" /></label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, fontSize: 14 }}>
          <input type="checkbox" checked={f.everyday} onChange={(e) => set("everyday", e.target.checked)} /> Everyday maths moment (side quest, +1 star)
        </label>
        <button className="btn small" style={{ marginTop: 12 }}>Save log</button>
        {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      </form>

      <h2>Recent logs</h2>
      <table className="t">
        <thead><tr><th>Date</th><th>Skill</th><th>Game</th><th>Right</th><th>Method</th><th>Eng.</th><th>Note</th><th /></tr></thead>
        <tbody>
          {data.logs.slice(0, 20).map((l) => (
            <tr key={l.id}>
              <td>{l.log_date}</td><td>{l.skill_id}</td><td>{l.game}</td><td>{l.correct}/{l.tries}</td><td>{l.method ?? "-"}</td><td>{l.engagement ?? "-"}</td><td>{l.note}</td>
              <td><button className="tab" onClick={async () => { if (confirm("Delete this log?")) { await post({ action: "deleteLog", id: l.id }); reload(); } }}>x</button></td>
            </tr>
          ))}
          {data.logs.length === 0 && <tr><td colSpan={8} className="muted">No logs yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function SkillsTab({ data, reload }: { data: Data; reload: () => void }) {
  const lastSeen: Record<string, string> = {};
  for (const l of data.logs) if (!lastSeen[l.skill_id]) lastSeen[l.skill_id] = l.log_date;
  const counts = LEVELS.map((_, i) => SKILLS.filter((s) => (data.levels[s.id] ?? 0) === i).length);
  return (
    <div>
      <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
        {LEVELS.map((l, i) => <span key={l} className={`lvl lvl${i}`}>{l}: {counts[i]}</span>)}
      </div>
      {(Object.keys(STRANDS) as Strand[]).map((st) => (
        <div key={st}>
          <h2>{STRANDS[st]}</h2>
          <table className="t">
            <thead><tr><th>ID</th><th>Skill</th><th>Needs</th><th>Level</th><th>Set level</th><th>Last practised</th></tr></thead>
            <tbody>
              {SKILLS.filter((s) => s.strand === st).map((s) => (
                <tr key={s.id}>
                  <td><b>{s.id}</b></td>
                  <td>{s.name}<div className="muted" style={{ fontSize: 12 }}>Check: {s.check}</div></td>
                  <td>{s.needs.join(", ") || "-"}</td>
                  <td><span className={`lvl lvl${data.levels[s.id] ?? 0}`}>{LEVELS[data.levels[s.id] ?? 0]}</span></td>
                  <td>
                    <select value={data.storedLevels[s.id] ?? 0} onChange={async (e) => { await post({ action: "level", skill_id: s.id, level: Number(e.target.value) }); reload(); }}>
                      {LEVELS.map((l, i) => <option key={l} value={i}>{l}</option>)}
                    </select>
                  </td>
                  <td>{lastSeen[s.id] ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <p className="muted" style={{ fontSize: 13 }}>Level shown = the higher of what you set and what the mastery rule says (3 successes, 2 days, 2 different games).</p>
    </div>
  );
}

const DRAFT_KEY = "medhu-check-draft";
const LABELS = ["Baseline", "Day 14", "Day 28", "Day 42", "Day 60"];

function strandScores(scores: number[]) {
  return CHECK_STRANDS.map((s) => ({ label: s.label, got: s.items.reduce((a, n) => a + (scores[n - 1] ?? 0), 0), max: s.items.length * 2 }));
}

function ChecksTab({ data, reload }: { data: Data; reload: () => void }) {
  const nextLabel = LABELS[data.checks.length] ?? "Extra check";
  const [draft, setDraft] = useState<{ label: string; check_date: string; scores: (number | null)[] }>({ label: nextLabel, check_date: today(), scores: Array(12).fill(null) });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    try { const d = localStorage.getItem(DRAFT_KEY); if (d) setDraft(JSON.parse(d)); } catch {}
  }, []);
  const update = (d: typeof draft) => { setDraft(d); try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {} };
  const filled = draft.scores.filter((s) => s !== null).length;

  return (
    <div>
      <h2>Medhu Maths Check</h2>
      <p className="muted" style={{ fontSize: 14 }}>0 = can&apos;t, 1 = with help or slow count from 1, 2 = alone and quick. The draft saves on this phone, so you can do items 1-4, 5-8 and 9-12 on different days.</p>
      <div className="card">
        <div className="grid2">
          <label className="field">Label<select value={draft.label} onChange={(e) => update({ ...draft, label: e.target.value })}>{[...LABELS, "Extra check"].map((l) => <option key={l}>{l}</option>)}</select></label>
          <label className="field">Date<input type="date" value={draft.check_date} onChange={(e) => update({ ...draft, check_date: e.target.value })} /></label>
        </div>
        <table className="t" style={{ marginTop: 10 }}>
          <tbody>
            {CHECK_ITEMS.map((c, i) => (
              <tr key={c.n}>
                <td style={{ width: 24 }}><b>{c.n}</b></td>
                <td>{c.item}<div className="muted" style={{ fontSize: 12 }}>{c.skills}</div></td>
                <td style={{ width: 170 }}><Seg value={draft.scores[i]} onChange={(v) => { const s = [...draft.scores]; s[i] = v; update({ ...draft, scores: s }); }} options={[{ v: 0, label: "0" }, { v: 1, label: "1" }, { v: 2, label: "2" }]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn small" style={{ marginTop: 12 }} disabled={filled < 12} onClick={async () => {
          try {
            const r = await post({ action: "check", label: draft.label, check_date: draft.check_date, scores: draft.scores });
            setMsg(`Saved: ${r.total}/24.`);
            try { localStorage.removeItem(DRAFT_KEY); } catch {}
            setDraft({ label: LABELS[data.checks.length + 1] ?? "Extra check", check_date: today(), scores: Array(12).fill(null) });
            reload();
          } catch (e) { setMsg(`Error: ${e}`); }
        }}>Save check ({filled}/12 scored)</button>
        {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      </div>

      <h2>Results over time</h2>
      {data.checks.length === 0 ? <p className="muted">No checks saved yet.</p> : (
        <table className="t">
          <thead><tr><th>Check</th>{CHECK_STRANDS.map((s) => <th key={s.label}>{s.label}</th>)}<th>Total (target 18)</th></tr></thead>
          <tbody>
            {data.checks.map((c) => (
              <tr key={c.id}>
                <td><b>{c.label}</b><div className="muted" style={{ fontSize: 12 }}>{c.check_date}</div></td>
                {strandScores(c.scores).map((s) => (
                  <td key={s.label}>
                    {s.got}/{s.max}
                    <div style={{ height: 6, background: "#eadfcf", borderRadius: 9, marginTop: 4 }}><div style={{ width: `${(s.got / s.max) * 100}%`, height: "100%", background: s.got / s.max >= 0.5 ? "#2e9d5b" : "#f28c28", borderRadius: 9 }} /></div>
                  </td>
                ))}
                <td><span className="stat" style={{ fontSize: 20 }}>{c.total}</span>/24</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RewardsTab({ data, reload }: { data: Data; reload: () => void }) {
  const total = data.rewards.filter((r) => r.kind === "star").reduce((a, r) => a + r.amount, 0);
  const cards = Math.min(Math.floor(total / STARS_PER_CARD), CARDS.length);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");
  return (
    <div>
      <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
        <div><div className="stat">{total}</div><div className="muted">stars</div></div>
        <div><div className="stat">{cards}</div><div className="muted">hero cards</div></div>
        <div><div className="stat">{new Set(data.completions.map((c) => c.quest_day)).size}</div><div className="muted">quests done</div></div>
      </div>
      <p className="muted" style={{ fontSize: 14 }}>Cards unlocked: {CARDS.slice(0, cards).map((c) => c.name).join(", ") || "none yet"}.</p>
      <h2>Give bonus stars</h2>
      <form className="card row" style={{ flexWrap: "wrap", alignItems: "flex-end" }} onSubmit={async (e) => { e.preventDefault(); await post({ action: "bonus", amount, reason: reason || "Bonus from Papa" }); setReason(""); reload(); }}>
        <label className="field">Stars<input type="number" min={1} max={10} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: 80 }} /></label>
        <label className="field" style={{ flex: 1 }}>Reason<input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Counted the stairs by himself" /></label>
        <button className="btn small">Give</button>
      </form>
      <h2>Ledger</h2>
      <table className="t">
        <thead><tr><th>When</th><th>Stars</th><th>Why</th></tr></thead>
        <tbody>
          {data.rewards.map((r) => <tr key={r.id}><td>{String(r.created_at).slice(0, 10)}</td><td>+{r.amount}</td><td>{r.reason}</td></tr>)}
          {data.rewards.length === 0 && <tr><td colSpan={3} className="muted">No stars yet.</td></tr>}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: 13 }}>Stars are never taken away.</p>
    </div>
  );
}

function SyncTab({ data }: { data: Data }) {
  const since = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
  const recent = data.logs.filter((l) => l.log_date >= since);
  const sessions = new Set(recent.map((l) => l.log_date)).size;
  const eng = recent.filter((l) => l.engagement).map((l) => l.engagement as number);
  const avgEng = eng.length ? (eng.reduce((a, b) => a + b, 0) / eng.length).toFixed(1) : "-";
  const flops = recent.filter((l) => l.engagement === 1 || (l.tries > 0 && l.correct / l.tries < 0.5));
  const [last, prev] = [data.checks.at(-1), data.checks.at(-2)];
  const secure = SKILLS.filter((s) => (data.levels[s.id] ?? 0) >= 3).map((s) => s.id);
  const developing = SKILLS.filter((s) => (data.levels[s.id] ?? 0) === 2 || (data.levels[s.id] ?? 0) === 1).map((s) => s.id);

  const text = useMemo(() => [
    `Medhu Maths sync - ${today()}`,
    `Sessions logged (last 14 days): ${sessions}; average engagement ${avgEng}/3`,
    last ? `Latest check (${last.label}): ${last.total}/24${prev ? `, was ${prev.total}/24 at ${prev.label}` : ""}` : "No check saved yet",
    last ? `By strand: ${strandScores(last.scores).map((s) => `${s.label} ${s.got}/${s.max}`).join("; ")}` : "",
    `Secure or fluent: ${secure.join(", ") || "none"}`,
    `In progress: ${developing.join(", ") || "none"}`,
    `Next target: ${data.rec.target ?? "-"}; side: ${data.rec.side ?? "-"}`,
    `Tough or low-energy sessions: ${flops.map((l) => `${l.log_date} ${l.skill_id} ${l.game ?? ""} ${l.note ?? ""}`.trim()).join(" | ") || "none"}`,
  ].filter(Boolean).join("\n"), [sessions, avgEng, last, prev, secure, developing, flops, data.rec]);

  return (
    <div>
      <h2>2-week sync report</h2>
      <p className="muted" style={{ fontSize: 14 }}>Copy this into our sync chat.</p>
      <pre className="card" style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>{text}</pre>
      <button className="btn small" onClick={() => navigator.clipboard?.writeText(text)}>Copy</button>
    </div>
  );
}
