const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { packageId, date, people, contactInfo } = req.body;

        if (!packageId || !date || !contactInfo) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const booking = new Booking({
            user: req.user.id,
            package: packageId,
            date,
            people,
            contactInfo
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin)
// @access  Public (Temporary for screenshot)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name email').populate('package', 'id name price');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/bookings/mybookings
// @desc    Get logged in user bookings
// @access  Private
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('package', 'id name price image');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private (Admin or user who owns the booking)
router.delete('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is admin or owns the booking
        if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this booking' });
        }

        await booking.deleteOne();
        res.json({ message: 'Booking removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
