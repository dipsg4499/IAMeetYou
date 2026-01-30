import { sequelize } from "./src/db/db.config.js";

async function checkTables() {
    try {
        const [results] = await sequelize.query(
            "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog');"
        );
        console.log("-----------------------------------------");
        console.log("📊 CURRENT TABLES IN DATABASE:");
        if (results.length === 0) {
            console.log("No tables found.");
        } else {
            results.forEach(row => {
                console.log(`- Schema: ${row.table_schema} | Table: ${row.table_name}`);
            });
        }
        console.log("-----------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error("Error checking tables:", error);
        process.exit(1);
    }
}

checkTables();
