import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

// On Vercel serverless runtime, copy seeded SQLite database to writable /tmp
if (process.env.VERCEL) {
  try {
    const tmpDb = "/tmp/dev.db";
    const bundledDb = path.join(process.cwd(), "prisma", "dev.db");
    if (!fs.existsSync(tmpDb) && fs.existsSync(bundledDb)) {
      fs.copyFileSync(bundledDb, tmpDb);
    }
  } catch (err) {
    console.warn("Could not copy database to /tmp:", err);
  }
}

const prisma = globalThis.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
