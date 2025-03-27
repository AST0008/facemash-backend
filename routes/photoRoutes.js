const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../models/photoModel");
const multer = require("multer");
const router = express.Router();

// Elo Calculation
function eloCalculation(winnerRating, loserRating, k = 32) {
  const expectedWinner =
    1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return {
    winner: winnerRating + k * (1 - expectedWinner),
    loser: loserRating + k * (0 - expectedWinner),
  };
}

//Store photos
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const { name } = req.body;

    const photo = new Photo({ name, imageUrl });
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error("Error adding photo:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get 2 Random Photos
router.get("/random", async (req, res) => {
  try {
    const photos = await Photo.aggregate([{ $sample: { size: 2 } }]);
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle Vote and Update Ratings
router.post("/vote", async (req, res) => {
  try {
    const { winnerId, loserId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(winnerId) ||
      !mongoose.Types.ObjectId.isValid(loserId)
    ) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const winner = await Photo.findById(winnerId);
    const loser = await Photo.findById(loserId);

    if (!winner || !loser) {
      return res.status(404).json({ error: "Photo(s) not found" });
    }

    const { winner: newWinnerRating, loser: newLoserRating } = eloCalculation(
      winner.rating,
      loser.rating
    );

    winner.rating = Math.round(newWinnerRating);
    loser.rating = Math.round(newLoserRating);

    await winner.save();
    await loser.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error during vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add New Photo
router.post("/add", async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const photo = new Photo({ name, imageUrl, rating: 1200 });
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error("Error adding photo:", err);
    res.status(500).json({ message: err.message });
  }
});

//Leadboard
router.get("/leaderboard", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ rating: -1 }).limit(10);
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
