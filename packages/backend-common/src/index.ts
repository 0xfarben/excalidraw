import dotenv from "dotenv";

// auto-load the .env file
dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || 3001;
export const WS_PORT = Number(process.env.WS_PORT ?? 8080);
export const JWT_SECRET = process.env.JWT_SECRET || "";