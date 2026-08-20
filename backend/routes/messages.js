const express = require("express");
const Message = require("../models/Message");
const Connection = require("../models/Connection");
const protect = require("../middleware/auth");

const router = express.Router();

// POST /api/messages -> message bhejo
router.post("/", protect, async (req, res) => {
  try {
    const { connectionId, text } = req.body;
    if (!connectionId || !text) {
      return res.status(400).json({ message: "connectionId aur text zaroori hai" });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection nahi mili" });

    const isParticipant =
      connection.requesterId.toString() === req.user.id ||
      connection.helperId.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "Ye connection tumhari nahi hai" });
    }

    const message = await Message.create({
      connectionId,
      senderId: req.user.id,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/messages/:connectionId -> chat history
router.get("/:connectionId", protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection) return res.status(404).json({ message: "Connection nahi mili" });

    const isParticipant =
      connection.requesterId.toString() === req.user.id ||
      connection.helperId.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "Ye connection tumhari nahi hai" });
    }

    const messages = await Message.find({ connectionId: req.params.connectionId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
