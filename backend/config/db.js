import mongoose from "mongoose";

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;

  if (!primaryURI) {
    console.error("Database connection error: MONGO_URI is not defined in .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(primaryURI);
    console.log(`Database: Connected to cloud: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.error(`Database connection error: ${primaryError.message}`);
    process.exit(1);
  }
};

export default connectDB;
