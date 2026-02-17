import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  define: { underscored: true, timestamps: true },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

export default sequelize;
