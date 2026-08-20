const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Windows par kai baar SRV DNS resolve nahi hota, isliye fallback DNS set kar rahe hain
    try {
      const dns = require("dns");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {}

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
