import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables if not already loaded
dotenv.config();

console.log("-----------------------------------------");
console.log("🔍 DB CONNECTION DETAILS (from process.env):");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("-----------------------------------------");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");
    // Sync all models with the database
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
export { sequelize };
