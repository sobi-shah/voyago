const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getMyBookings, deleteBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getBookings); // Changed from Public to Private/Admin for security

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id')
    .delete(protect, deleteBooking);

module.exports = router;
