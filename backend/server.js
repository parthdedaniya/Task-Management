const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for production
const corsOptions = {
	origin: process.env.CORS_ORIGIN || "*", // Allow all origins in development, specific in production
	credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const initializeDatabase = async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

		await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

		console.log("Database tables initialized");
	} catch (error) {
		console.error("Database initialization error:", error);
	}
};

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.initializeDatabase = initializeDatabase;

// Only start the server if this file is run directly (because test was failing)
if (require.main === module) {
	app.listen(PORT, async () => {
		await initializeDatabase();
		console.log(`Server running on port ${PORT}`);
	});
} else {
	// Initialize database when imported (because test was failing)
	initializeDatabase().catch((err) => {
		console.error("Database initialization error (non-fatal):", err);
	});
}

module.exports = app;
