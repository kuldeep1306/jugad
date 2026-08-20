const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    needId: { type: mongoose.Schema.Types.ObjectId, ref: "Need", required: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    helperId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Connection", connectionSchema);
