const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voyago');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error(`Please ensure MongoDB is installed and running locally, or update MONGO_URI in .env`);
        // We will not exit the process here so the frontend can still be served
        // process.exit(1);
    }
};

module.exports = connectDB;
