import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the current directory
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
    console.log("Error loading .env file:", result.error);
}

console.log("DB_USER from env:", process.env.DB_USER);
console.log("DB_PASSWORD from env:", process.env.DB_PASSWORD);
console.log("Parsed from .env file:", result.parsed);
