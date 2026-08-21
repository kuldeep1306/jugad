const express = require("express");
const Feedback = require("../models/Feedback");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/feedback -> everyone can see everyone's feedback, newest first
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/feedback/mine -> only the logged-in user's own feedback
router.get("/mine", protect, async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/feedback -> logged-in user submits their feedback
router.post("/", protect, async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating || !message) {
      return res.status(400).json({ message: "Rating and message are required" });
    }

    const feedback = await Feedback.create({
      userId: req.user.id,
      rating,
      message,
    });

    const populated = await feedback.populate("userId", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/feedback/:id -> only the owner can delete their own feedback
router.delete("/:id", protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own feedback" });
    }

    await feedback.deleteOne();

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
