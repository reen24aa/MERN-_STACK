require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

const connectToMongoDB = async () => {
  if (!client) {
    try {
      console.log("Connecting to MongoDB...");
      client = await MongoClient.connect(uri, options);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }
  return client;
};

const getConnectedClient = () => {
  if (!client) {
    throw new Error("MongoDB client not connected");
  }
  return client;
};

module.exports = { connectToMongoDB, getConnectedClient };
