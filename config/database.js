const Sequelize = require("sequelize");
require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// database connection
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  dialect: "mysql",
  dialectModule: require("mysql2"),
  host: DB_HOST,
  logging: false,
});

module.exports = sequelize;
