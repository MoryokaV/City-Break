import mongoose from "mongoose";

const connectToDatabse = async () => {
  const connectionString = process.env.CB_MONGODB_URL || "";

  try {
    await mongoose.connect(connectionString);
  } catch (e) {
    console.log(e);
  }
};

export default connectToDatabse;
