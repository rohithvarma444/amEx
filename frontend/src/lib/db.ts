import { PrismaClient } from "@/app/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

export const db =
  globalForPrisma.db ??
  new PrismaClient({
    log: ["query"], 
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}