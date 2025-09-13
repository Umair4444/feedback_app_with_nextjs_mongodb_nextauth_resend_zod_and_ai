import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(process.env.MONGODB_URI)
    // console.log(process.env.MONGODB_DATABASE)
    // console.log("db", db);
    // console.log("db Connections", db.connections);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connect Successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}
