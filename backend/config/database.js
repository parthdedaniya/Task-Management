const { Pool } = require("pg");
require("dotenv").config();

// Support both DATABASE_URL (for Railway, Heroku, etc.) and individual env vars
const poolConfig = process.env.DATABASE_URL
	? {
			connectionString: process.env.DATABASE_URL,
			ssl:
				process.env.NODE_ENV === "production"
					? { rejectUnauthorized: false }
					: false,
	  }
	: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
	  };

const pool = new Pool({
	...poolConfig,
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
