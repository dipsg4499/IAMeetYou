import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "iammeet_you",
    port: 5432,
});

(async () => {
    try {
        console.log("Attempting direct connection with config:", {
            user: client.user,
            host: client.host,
            database: client.database,
            password: "xxxxx" // hiding password in log
        });
        await client.connect();
        console.log("✅ Direct DB connection successful");
        await client.end();
    } catch (err) {
        console.error("❌ Direct connection failed:", err.message);
    }
})();
