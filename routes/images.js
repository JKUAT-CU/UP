const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getUserDb } = require("../database/connection");
const sharp = require("sharp");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Upload an image
router.post("/upload", upload.single("image"), (req, res) => {
    const { userId } = req.body;
    if (!userId || !req.file) {
        return res.status(400).json({ error: "User ID and image are required" });
    }

    const db = getUserDb(userId);
    db.run("INSERT INTO images (filename) VALUES (?)", [req.file.filename], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Image uploaded successfully", filename: req.file.filename });
    });

    db.close();
});

// Append one image to another
router.post("/append", async (req, res) => {
    const { userId, baseImage, appendImage } = req.body;

    if (!userId || !baseImage || !appendImage) {
        return res.status(400).json({ error: "User ID, base image, and append image are required" });
    }

    const basePath = path.join(uploadDir, baseImage);
    const appendPath = path.join(uploadDir, appendImage);

    if (!fs.existsSync(basePath) || !fs.existsSync(appendPath)) {
        return res.status(400).json({ error: "One or both images not found" });
    }

    const outputImage = `${Date.now()}-appended.png`;
    const outputPath = path.join(uploadDir, outputImage);

    try {
        await sharp(basePath)
            .composite([{ input: appendPath, gravity: "southeast" }])
            .toFile(outputPath);

        res.json({ message: "Image appended successfully", filename: outputImage });
    } catch (err) {
        res.status(500).json({ error: "Error appending images" });
    }
});

// Download an image
router.get("/download/:userId/:filename", (req, res) => {
    const { userId, filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath);
});

module.exports = router;
