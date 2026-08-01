import mongoose from 'mongoose';
import dns from 'dns';

// Ensure public DNS fallback for Windows local DNS SRV resolution issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('Custom DNS fallback set failed:', dnsErr.message);
}

let isConnected = false;
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI missing. Set MONGO_URI or MONGODB_URI.');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
