import { NetlifyDB } from "@netlify/database-dev";
const db = new NetlifyDB({ port: 54329 });
const cs = await db.start();
await db.applyMigrations(new URL("../netlify/database/migrations", import.meta.url).pathname);
console.log("CS=" + cs);
setInterval(() => {}, 1e9);
