import { getDatabase } from "@netlify/database";

let cached: ReturnType<typeof getDatabase> | null = null;

export function db() {
  if (!cached) {
    const cs = process.env.NETLIFY_DB_URL;
    cached = cs ? getDatabase({ connectionString: cs }) : getDatabase();
  }
  return cached;
}
