const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');
const { z } = require('zod');

const bookingSchema = z.object({
    packageId: z.string().min(1, 'Package ID is required'),
    date: z.string().min(1, 'Date is required'),
    people: z.number().min(1, 'At least 1 person required').max(10, 'Maximum 10 people allowed'),
    contactInfo: z.object({
        phone: z.string().min(10, 'Valid phone number required'),
        address: z.string().optional()
    })
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const validatedData = bookingSchema.parse(req.body);

    const booking = new Booking({
        user: req.user.id,
        package: validatedData.packageId,
        date: validatedData.date,
        people: validatedData.people,
        contactInfo: validatedData.contactInfo
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'id name email').populate('package', 'id name price');
    res.json(bookings);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id }).populate('package', 'id name price image location');
    res.json(bookings);
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin or user who owns the booking)
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Check if user is admin or owns the booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this booking');
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
});

module.exports = {
    createBooking,
    getBookings,
    getMyBookings,
    deleteBooking
};
