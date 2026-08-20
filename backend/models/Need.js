const mongoose = require("mongoose");

const needSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Books", "Furniture", "Electronics", "Stationery", "Other"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Buy", "Borrow", "Exchange", "Free"],
    },
    budget: { type: Number },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "matched", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Need", needSchema);
