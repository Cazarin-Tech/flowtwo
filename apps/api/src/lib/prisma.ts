import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não encontrada no .env");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });