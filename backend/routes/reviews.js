const express = require("express");
const Review = require("../models/Review");
const Connection = require("../models/Connection");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// POST /api/reviews -> rating do (deal complete hone ke baad)
router.post("/", protect, async (req, res) => {
  try {
    const { connectionId, rating, comment } = req.body;

    if (!connectionId || !rating) {
      return res.status(400).json({ message: "connectionId aur rating zaroori hai" });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection nahi mili" });

    const isRequester = connection.requesterId.toString() === req.user.id;
    const isHelper = connection.helperId.toString() === req.user.id;

    if (!isRequester && !isHelper) {
      return res.status(403).json({ message: "Ye connection tumhari nahi hai" });
    }

    const revieweeId = isRequester ? connection.helperId : connection.requesterId;

    const review = await Review.create({
      connectionId,
      reviewerId: req.user.id,
      revieweeId,
      rating,
      comment,
    });

    // reviewee ka average rating update karo
    const reviewee = await User.findById(revieweeId);
    const newCount = reviewee.ratingCount + 1;
    const newAvg = (reviewee.ratingAvg * reviewee.ratingCount + rating) / newCount;
    reviewee.ratingAvg = newAvg;
    reviewee.ratingCount = newCount;
    await reviewee.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
