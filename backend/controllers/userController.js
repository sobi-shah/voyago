const User = require('../models/User');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user profile & analytics
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password').populate('wishlist');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // WOW Feature: User Analytics
    const bookings = await Booking.find({ user: req.user.id }).populate('package');
    
    let totalSpent = 0;
    const locationCounts = {};

    bookings.forEach(booking => {
        if (booking.package && booking.package.price && booking.people) {
            totalSpent += (booking.package.price * booking.people);
            const loc = booking.package.location;
            if (loc) {
                locationCounts[loc] = (locationCounts[loc] || 0) + 1;
            }
        }
    });

    // Find favorite destination (most booked)
    let favoriteDestination = 'None yet';
    let maxCount = 0;
    for (const loc in locationCounts) {
        if (locationCounts[loc] > maxCount) {
            maxCount = locationCounts[loc];
            favoriteDestination = loc;
        }
    }

    res.json({
        user,
        analytics: {
            totalBookings: bookings.length,
            totalSpent,
            favoriteDestination
        }
    });
});

// @desc    Add package to wishlist
// @route   POST /api/users/wishlist/:packageId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const packageId = req.params.packageId;

    if (!user.wishlist.includes(packageId)) {
        user.wishlist.push(packageId);
        await user.save();
    }
    
    res.json(user.wishlist);
});

// @desc    Remove package from wishlist
// @route   DELETE /api/users/wishlist/:packageId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const packageId = req.params.packageId;

    user.wishlist = user.wishlist.filter(id => id.toString() !== packageId);
    await user.save();
    
    res.json(user.wishlist);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

module.exports = {
    getUserProfile,
    addToWishlist,
    removeFromWishlist,
    getUsers
};
