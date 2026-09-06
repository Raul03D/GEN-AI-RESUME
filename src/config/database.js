const mongoose = require("mongoose");

async function connectToDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ ERROR: MONGO_URI environment variable is not defined!");
    console.error("Please verify that your .env file exists in the root folder with MONGO_URI set.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB database successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message || err);
  }
}

module.exports = connectToDB;