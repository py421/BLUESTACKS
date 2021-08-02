const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

var connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  port:dbConfig.PORT,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: "utf8mb4_unicode_ci"
});

module.exports = connection;