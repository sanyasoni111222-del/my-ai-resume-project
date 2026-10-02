const mongoose = require("mongoose");

async function connectToDB(retryCount = 0, maxRetries = 5) {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    });

    console.log("Connected to Database");
    return true;
  } catch (err) {
    const message = err?.message || String(err);
    console.error(`Database connection failed (attempt ${retryCount + 1}/${maxRetries + 1}): ${message}`);

    if (retryCount < maxRetries) {
      console.log("Retrying MongoDB connection in 3 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return connectToDB(retryCount + 1, maxRetries);
    }

    throw err;
  }
}

module.exports = connectToDB;
