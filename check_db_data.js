import { sequelize } from "./src/db/db.config.js";

async function checkData() {
    try {
        const [results] = await sequelize.query("SELECT * FROM \"Users\";");
        console.log("-----------------------------------------");
        console.log(`📑 ROWS IN 'Users' TABLE: ${results.length}`);
        console.log(JSON.stringify(results, null, 2));
        console.log("-----------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error("Error checking data:", error.message);
        process.exit(1);
    }
}

checkData();
