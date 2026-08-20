const express = require("express");
const Notification = require("../models/Notification");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/notifications -> meri saari notifications, latest pehle
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate("needId", "title category type")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/notifications/unread-count -> bell badge ke liye
router.get("/unread-count", protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/notifications/:id/read -> ek notification read mark karo
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification nahi mili" });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/notifications/read-all -> saari ek saath read mark karo
router.patch("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "Sab notifications read mark ho gayi" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
