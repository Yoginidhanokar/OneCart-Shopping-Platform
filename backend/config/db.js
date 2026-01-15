// config/db.js
import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        // Make sure you're using the correct environment variable name
        const connectionString = process.env.MONGODB_URL || process.env.MONGODB_URI;
        
        if (!connectionString) {
            throw new Error('MongoDB connection string not found in environment variables');
        }
        
        console.log('Connecting to MongoDB...');
        
        await mongoose.connect(connectionString);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ DB connection error:', error.message);
        throw error; // Re-throw so index.js can catch it
    }
};

export default connectDb;