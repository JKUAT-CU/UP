const express = require("express");
const { createUserDatabase } = require("../database/init");
const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    createUserDatabase(userId);
    res.json({ message: `User ${userId} registered successfully` });
});

module.exports = router;
