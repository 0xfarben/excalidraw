import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// auto-load the .env file
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

export const HTTP_PORT = process.env.HTTP_PORT ?? 3001;
export const WS_PORT = process.env.WS_PORT ?? 8080;
export const JWT_SECRET = process.env.JWT_SECRET ?? "my_secret_string";