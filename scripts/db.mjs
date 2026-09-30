/**
 * Runs a project-local PostgreSQL server (no Docker, no system install).
 *
 *   node scripts/db.mjs setup   — initialises the data dir once + creates the DB
 *   node scripts/db.mjs start   — starts the server and keeps it running
 *
 * Data lives in backend/.postgres (gitignored).
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const USER = "medusa";
const PASSWORD = "medusa";
const PORT = 5432;
const DATABASE = "medusa-cloth";
const DATA_DIR = join(process.cwd(), ".postgres");

const command = process.argv[2] ?? "start";

/**
 * A hard-killed Postgres leaves postmaster.pid behind and refuses to start.
 * If the PID in the lock file is no longer alive, the lock is stale — remove it.
 */
function cleanStaleLock() {
  const pidFile = join(DATA_DIR, "postmaster.pid");
  if (!existsSync(pidFile)) return;
  try {
    const pid = Number(readFileSync(pidFile, "utf8").split("\n")[0]);
    try {
      process.kill(pid, 0); // throws if the process is gone
      console.log(`Postgres PID ${pid} is still running — not touching the lock.`);
      return;
    } catch {
      rmSync(pidFile);
      console.log(`Removed stale postmaster.pid (dead PID ${pid}).`);
    }
  } catch {
    rmSync(pidFile);
    console.log("Removed unreadable postmaster.pid.");
  }
}

function createPg() {
  return new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    // UTF8 server encoding — Medusa's currency seed inserts non-WIN1252 glyphs.
    initdbFlags: ["--encoding=UTF8"],
  });
}

if (command === "setup") {
  const pg = createPg();
  if (!existsSync(join(DATA_DIR, "PG_VERSION"))) {
    console.log("Initialising PostgreSQL data dir...");
    await pg.initialise();
  }
  await pg.start();
  try {
    await pg.createDatabase(DATABASE);
    console.log(`Database "${DATABASE}" created.`);
  } catch (error) {
    if (String(error).includes("already exists")) {
      console.log(`Database "${DATABASE}" already exists.`);
    } else {
      throw error;
    }
  }
  await pg.stop();
  console.log("Setup complete. Start the server with: node scripts/db.mjs start");
} else if (command === "reset") {
  const pg = createPg();
  await pg.start();
  try {
    await pg.dropDatabase(DATABASE);
    console.log(`Database "${DATABASE}" dropped.`);
  } catch (error) {
    if (String(error).includes("does not exist")) {
      console.log(`Database "${DATABASE}" did not exist.`);
    } else {
      throw error;
    }
  }
  await pg.createDatabase(DATABASE);
  console.log(`Database "${DATABASE}" recreated.`);
  await pg.stop();
} else if (command === "start") {
  cleanStaleLock();
  if (!existsSync(join(DATA_DIR, "PG_VERSION"))) {
    console.error("Data dir not initialised. Run: node scripts/db.mjs setup");
    process.exit(1);
  }
  const pg = createPg();
  await pg.start();
  console.log(`PostgreSQL running on port ${PORT} (data: ${DATA_DIR})`);
  console.log("Press Ctrl+C to stop.");
  // Keep the launcher alive so the server keeps running in the background.
  setInterval(() => {}, 1 << 30);
} else {
  console.error(`Unknown command: ${command}. Use "setup" or "start".`);
  process.exit(1);
}
