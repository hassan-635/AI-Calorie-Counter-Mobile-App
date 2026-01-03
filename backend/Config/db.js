const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // process.env.MONGO_URI aapki .env file se aayega
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Agar connect nahi hua toh app ko band kar do
  }
};

module.exports = connectDB;
