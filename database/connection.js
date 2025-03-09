const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function getUserDb(userId) {
    const dbPath = path.join(__dirname, "../user_dbs", `${userId}.sqlite3`);
    return new sqlite3.Database(dbPath);
}

module.exports = { getUserDb };
