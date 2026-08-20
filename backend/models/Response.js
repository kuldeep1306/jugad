const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    needId: { type: mongoose.Schema.Types.ObjectId, ref: "Need", required: true },
    helperId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
