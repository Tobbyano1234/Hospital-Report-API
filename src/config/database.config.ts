import { Sequelize } from "sequelize";

const db = new Sequelize("app", "username", "password", {
  storage: "./database.sqlite",
  dialect: "sqlite",
  logging: false,
});

export default db;
