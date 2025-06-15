import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri); // Log the URI for debugging purposes
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Function to test the connection
export async function testConnection() {
  try {
    await clientPromise; // Await the connection
    console.log("MongoDB connection successful!");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return false;
  }
}

// Optionally, you can call testConnection() here to test immediately upon import
// testConnection();
