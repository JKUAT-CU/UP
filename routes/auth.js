const express = require("express");
const router = express.Router();

// Example login route
router.post("/login", (req, res) => {
  res.json({ message: "User logged in" });
});

// Example register route
router.post("/register", (req, res) => {
  res.json({ message: "User registered" });
});

module.exports = router;
