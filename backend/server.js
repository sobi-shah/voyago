const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true })); // Important for cookies if cross-origin, though we are same-origin mostly
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/trip-planner', require('./routes/tripPlannerRoutes'));

// DEBUG ROUTE
app.get('/api/debug', (req, res) => {
    res.json({
        hasMongoUri: !!process.env.MONGO_URI,
        nodeEnv: process.env.NODE_ENV
    });
});

const { protect, admin } = require('./middleware/authMiddleware');

// Explicit Admin Route Protected by Middleware
app.get('/admin', protect, admin, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'admin.html'));
});
app.get('/admin.html', protect, admin, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'admin.html'));
});

// Serve static frontend files from the project root (must come after protected routes)
app.use(express.static(path.join(__dirname, '../')));

// Safe Fallback for Frontend SPA Routes (excluding API)
app.get(/.*/, (req, res, next) => {
    // If it's an API route that somehow bypassed earlier handling, pass to next (error handler)
    if (req.originalUrl.startsWith('/api/')) return next();
    
    // Otherwise serve frontend entry point
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
});

// Error Middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

module.exports = app;
