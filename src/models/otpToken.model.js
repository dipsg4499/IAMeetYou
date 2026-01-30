import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.config.js";
import User from "./User.model.js";

const OtpToken = sequelize.define(
  "OtpToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
User.hasMany(OtpToken, { foreignKey: "userId" });
OtpToken.belongsTo(User, { foreignKey: "userId" });

export default OtpToken;
