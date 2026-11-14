import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "medhu_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PIN || "dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function pinMatches(pin: string) {
  const expected = process.env.ADMIN_PIN || "";
  if (!expected) return false;
  const a = Buffer.from(pin);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const jar = await cookies();
  jar.set(COOKIE, `${exp}.${sign(exp)}`, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function isAdmin() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || sign(exp) !== sig) return false;
  return Number(exp) > Date.now();
}

export function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
