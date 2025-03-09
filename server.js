const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const imageRoutes = require("./routes/images");
const swaggerDocument = require("./docs/swagger.json");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const userDbPath = path.join(__dirname, "../user_dbs");

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());

// Ensure user database directory exists
if (!fs.existsSync(userDbPath)) {
    fs.mkdirSync(userDbPath);
}

// Function to create a database for each user
function createUserDatabase(userId) {
    const dbFile = path.join(userDbPath, `${userId}.sqlite3`);

    if (!fs.existsSync(dbFile)) {
        const db = new sqlite3.Database(dbFile);

        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        });

        db.close();
        console.log(`Database created for user: ${userId}`);
    }
}

module.exports = { createUserDatabase };

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/images", imageRoutes);

// Export app for Passenger
module.exports = app;

// If not running under Passenger, start manually
if (!process.env.PASSENGER_APP_ENV) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
