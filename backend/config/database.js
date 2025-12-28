const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
	console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
	console.error("Error connecting to PostgreSQL database", err);
	process.exit(-1);
});

module.exports = pool;
