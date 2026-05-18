const express = require('express');
const router = express.Router();
const { getUserProfile, addToWishlist, removeFromWishlist, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile);
router.route('/wishlist/:packageId')
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

module.exports = router;
