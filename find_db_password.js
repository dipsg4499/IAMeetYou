import pkg from "pg";
const { Client } = pkg;

const passwordsToTry = [
    "root",
    "admin",
    "password",
    "1234",
    "postgres",
    "welcome",
    "12345",
    "123456"
];

const testPassword = async (password) => {
    const client = new Client({
        host: "localhost",
        user: "postgres",
        password: password,
        database: "postgres", // Connect to default DB first to check auth
        port: 5432,
    });

    try {
        await client.connect();
        console.log(`\n🎉 SUCCESS! The correct password is: "${password}"`);
        console.log("Please update your .env file with this password.");
        await client.end();
        return true;
    } catch (err) {
        // console.log(`Failed with: ${password}`);
        await client.end();
        return false;
    }
};

(async () => {
    console.log("🕵️  Searching for the correct PostgreSQL password...");

    for (const password of passwordsToTry) {
        process.stdout.write(`Trying "${password}"... `);
        const success = await testPassword(password);
        if (success) {
            process.exit(0);
        }
        console.log("❌");
    }

    console.log("\n❌ Could not find the password in the common list.");
    console.log("⚠️  You MUST reset the password in pgAdmin.");
})();
