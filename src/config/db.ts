import mongoose from "mongoose";
import * as dotenv from "dotenv";
//database connection
const connectDB = async () => {
  dotenv.config();
  const uri = process.env.DB_CONN_STRING!;
  const dbName = process.env.DB_NAME!;
  try {
    await mongoose.connect(uri, { dbName: dbName }).then(() => {
      console.log("MongoDB connection successful.");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
