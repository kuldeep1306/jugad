const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // kisko notification jaani hai
    type: {
      type: String,
      enum: ["new_need"],
      default: "new_need",
    },
    needId: { type: mongoose.Schema.Types.ObjectId, ref: "Need", required: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ek user ki unread notifications jaldi nikalne ke liye index
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
