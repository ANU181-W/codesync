import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env in the backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      const conn = await mongoose.connect(process.env.MONGO_URI, {
      
        serverSelectionTimeoutMS: 30000, // Increased timeout to 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4 // Force IPv4
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed: ${error.message}`);
      
      if (i === retries - 1) {
        console.error('Max retries reached. Could not connect to MongoDB');
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const connectDB = async () => {
  try {
    await connectWithRetry();

    // Add connection error handler
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      // Try to reconnect
      setTimeout(() => connectWithRetry(), 5000);
    });

    // Add disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      setTimeout(() => connectWithRetry(), 5000);
    });

    // Add successful reconnection handler
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`Error in database connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;