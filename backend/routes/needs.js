const express = require("express");
const Need = require("../models/Need");
const Response = require("../models/Response");
const Connection = require("../models/Connection");
const Notification = require("../models/Notification");
const User = require("../models/User");
const protect = require("../middleware/auth");
const { getIO } = require("../socket");

const router = express.Router();

// POST /api/needs -> naya need post karo
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, type, budget, location } = req.body;

    if (!title || !category || !type || !location) {
      return res.status(400).json({ message: "Title, category, type aur location zaroori hai" });
    }

    const need = await Need.create({
      userId: req.user.id,
      title,
      description,
      category,
      type,
      budget,
      location,
    });

    // sabko notification bhejo (poster ko chhod kar) — isse need creation fail nahi hona chahiye
    try {
      const otherUsers = await User.find({ _id: { $ne: req.user.id } }).select("_id");

      if (otherUsers.length > 0) {
        const message = `${req.user.name} ne ek nayi need post ki: "${need.title}"`;

        await Notification.insertMany(
          otherUsers.map((u) => ({
            userId: u._id,
            type: "new_need",
            needId: need._id,
            message,
          }))
        );

        const io = getIO();
        if (io) {
          io.to("logged_in")
            .except(`user:${req.user.id}`)
            .emit("new_need", {
              needId: need._id,
              title: need.title,
              category: need.category,
              type: need.type,
              location: need.location,
              postedBy: req.user.name,
              message,
              createdAt: need.createdAt,
            });
        }
      }
    } catch (notifyErr) {
      console.error("Notification broadcast failed:", notifyErr.message);
    }

    res.status(201).json(need);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/needs -> sab open needs, filter ke saath (category, type, location, search)
router.get("/", async (req, res) => {
  try {
    const { category, type, location, search } = req.query;
    const filter = { status: "open" };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (search) filter.title = { $regex: search, $options: "i" };

    const needs = await Need.find(filter)
      .populate("userId", "name city location ratingAvg")
      .sort({ createdAt: -1 });

    res.json(needs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/needs/mine -> meri khud ki posted needs
router.get("/mine", protect, async (req, res) => {
  try {
    const needs = await Need.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/needs/:id -> single need detail
router.get("/:id", async (req, res) => {
  try {
    const need = await Need.findById(req.params.id).populate(
      "userId",
      "name city location ratingAvg"
    );
    if (!need) return res.status(404).json({ message: "Need nahi mili" });
    res.json(need);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/needs/:id/close -> owner apni need close kar sake
router.patch("/:id/close", protect, async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) return res.status(404).json({ message: "Need nahi mili" });

    if (need.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sirf owner hi close kar sakta hai" });
    }

    need.status = "closed";
    await need.save();
    res.json(need);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/needs/:id -> owner apni need delete kar sake
router.delete("/:id", protect, async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) return res.status(404).json({ message: "Need nahi mili" });

    if (need.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sirf owner hi delete kar sakta hai" });
    }

    const existingConnection = await Connection.findOne({ needId: need._id });
    if (existingConnection) {
      return res.status(400).json({
        message: "Ye need already kisi se match ho chuki hai, isliye delete nahi ho sakti",
      });
    }

    await Response.deleteMany({ needId: need._id });
    await need.deleteOne();

    res.json({ message: "Need delete ho gayi" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;