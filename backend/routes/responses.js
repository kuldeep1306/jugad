const express = require("express");
const Response = require("../models/Response");
const Need = require("../models/Need");
const Connection = require("../models/Connection");
const protect = require("../middleware/auth");

const router = express.Router();

// POST /api/responses/:needId -> "I Can Help" click
router.post("/:needId", protect, async (req, res) => {
  try {
    const need = await Need.findById(req.params.needId);
    if (!need) return res.status(404).json({ message: "Need nahi mili" });

    if (need.userId.toString() === req.user.id) {
      return res.status(400).json({ message: "Apni khud ki need pe respond nahi kar sakte" });
    }

    const existing = await Response.findOne({
      needId: req.params.needId,
      helperId: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ message: "Already respond kar chuke ho is need pe" });
    }

    const response = await Response.create({
      needId: req.params.needId,
      helperId: req.user.id,
      message: req.body.message || "",
    });

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/responses/need/:needId -> ek need ke sab responses (sirf need owner dekh sakta hai)
router.get("/need/:needId", protect, async (req, res) => {
  try {
    const need = await Need.findById(req.params.needId);
    if (!need) return res.status(404).json({ message: "Need nahi mili" });

    if (need.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sirf need owner hi responses dekh sakta hai" });
    }

    const responses = await Response.find({ needId: req.params.needId }).populate(
      "helperId",
      "name city location ratingAvg"
    );

    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/responses/:id -> accept ya reject
router.patch("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected"
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status accepted ya rejected hona chahiye" });
    }

    const response = await Response.findById(req.params.id).populate("needId");
    if (!response) return res.status(404).json({ message: "Response nahi mila" });

    const need = response.needId;
    if (need.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sirf need owner accept/reject kar sakta hai" });
    }

    response.status = status;
    await response.save();

    let connection = null;

    if (status === "accepted") {
      connection = await Connection.create({
        needId: need._id,
        requesterId: need.userId,
        helperId: response.helperId,
      });

      need.status = "matched";
      await need.save();
    }

    res.json({ response, connection });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
