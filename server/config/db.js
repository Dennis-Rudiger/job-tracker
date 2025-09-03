import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      autoIndex: true,
      maxPoolSize: 10,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

export default connectDB;
