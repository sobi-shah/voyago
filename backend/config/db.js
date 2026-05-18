const mongoose = require('mongoose');

const connectDB = async () => {
    // If already connected, return early
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is missing');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 15000, // Increased for serverless cold starts
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error; // Crucial: Throw the error so the API can catch it and avoid buffering
    }
};

module.exports = connectDB;
