const express = require("express");
const Connection = require("../models/Connection");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/connections -> meri sab connections (requester ya helper dono role mein)
router.get("/", protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requesterId: req.user.id }, { helperId: req.user.id }],
    })
      .populate("needId", "title category type status")
      .populate("requesterId", "name city")
      .populate("helperId", "name city")
      .sort({ createdAt: -1 });

    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/connections/:id -> single connection detail
router.get("/:id", protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id)
      .populate("needId")
      .populate("requesterId", "name city")
      .populate("helperId", "name city");

    if (!connection) return res.status(404).json({ message: "Connection nahi mili" });

    const isParticipant =
      connection.requesterId._id.toString() === req.user.id ||
      connection.helperId._id.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "Ye connection tumhari nahi hai" });
    }

    res.json(connection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/connections/:id/complete -> deal complete mark karo
router.patch("/:id/complete", protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ message: "Connection nahi mili" });

    const isParticipant =
      connection.requesterId.toString() === req.user.id ||
      connection.helperId.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "Ye connection tumhari nahi hai" });
    }

    connection.status = "completed";
    await connection.save();
    res.json(connection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
