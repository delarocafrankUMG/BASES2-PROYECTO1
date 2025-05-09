const oracledb = require("oracledb");
require("dotenv").config();

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
  });
}

module.exports = { getConnection };
