import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { fileURLToPath } from "node:url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loads packages/db/.env whether compiled to dist/ or dist/src/
dotenv.config({
    path: [
        path.resolve(__dirname, "../.env"),
        path.resolve(__dirname, "../../.env")
    ]
});

const connectionString = process.env.DATABASE_URL;
console.log("Loaded DB URL:", connectionString ? "Found" : "UNDEFINED");

if (!connectionString) {
    throw new Error(`DATABASE_URL is undefined! Searched near: ${__dirname}`);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };