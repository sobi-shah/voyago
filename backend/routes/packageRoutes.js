const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const connectDB = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

const fallbackPackages = [
    {
        _id: "pkg-01",
        name: "Santorini Sunset Retreat",
        description: "Experience the famous white architecture and breathtaking sunsets of Santorini. Includes luxury accommodation, daily breakfast, and a private sunset yacht tour.",
        price: 1290,
        image: "./images/santorini.jpg",
        location: "Santorini, Greece",
        duration: "5 Days, 4 Nights",
        includes: ["Luxury Accommodation", "Daily Breakfast", "Sunset Yacht Tour"]
    },
    {
        _id: "pkg-02",
        name: "Bali Tropical Escape",
        description: "Discover the exotic beauty of Bali. Includes stay at a jungle resort in Ubud, cultural templar visits, and exclusive access to a beach club.",
        price: 950,
        image: "./images/bali.jpg",
        location: "Bali, Indonesia",
        duration: "7 Days, 6 Nights",
        includes: ["Ubud Jungle Resort", "Temple Guide", "Beach Club Pass"]
    },
    {
        _id: "pkg-03",
        name: "Swiss Alps Adventure",
        description: "A thrilling escape to the Swiss Alps. Enjoy premium skiing resorts, hot springs, and a scenic ride on the Glacier Express.",
        price: 1850,
        image: "./images/swiss.jpg",
        location: "Swiss Alps, Switzerland",
        duration: "6 Days, 5 Nights",
        includes: ["Premium Ski Resort", "Hot Springs Access", "Glacier Express Ticket"]
    },
    {
        _id: "pkg-04",
        name: "Tokyo Neon Nights",
        description: "Immerse yourself in the vibrant culture of Tokyo. Features guided culinary tours, a visit to Mt. Fuji, and a stay in a luxury high-rise.",
        price: 1450,
        image: "./images/tokyo.jpg",
        location: "Tokyo, Japan",
        duration: "8 Days, 7 Nights",
        includes: ["Luxury High-rise Stay", "Culinary Tour", "Mt. Fuji Trip"]
    },
    {
        _id: "pkg-05",
        name: "Maldives Overwater Bliss",
        description: "The ultimate relaxation in the Maldives. Includes an overwater bungalow, unlimited scuba diving sessions, and an underwater restaurant dinner.",
        price: 2500,
        image: "./images/maldives.jpg",
        location: "Maldives",
        duration: "5 Days, 4 Nights",
        includes: ["Overwater Bungalow", "Scuba Diving", "Underwater Dinner"]
    }
];

// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
    try {
        await connectDB();
        let packages = await Package.find({});
        
        // Seed DB with fallbackPackages if empty
        if (packages.length === 0) {
            const mappedPackages = fallbackPackages.map(p => {
                const { _id, ...rest } = p;
                return rest;
            });
            packages = await Package.insertMany(mappedPackages);
        }
        
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// @route   GET /api/packages/:id
// @desc    Get single package
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/packages
// @desc    Create a package
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, description, price, image, location } = req.body;
        
        const newPackage = new Package({
            name,
            description,
            price,
            image,
            location
        });

        const createdPackage = await newPackage.save();
        res.status(201).json(createdPackage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/packages/:id
// @desc    Delete a package
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (package) {
            await package.deleteOne();
            res.json({ message: 'Package removed' });
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
