const Package = require('../models/Package');
const asyncHandler = require('../middleware/asyncHandler');
const { z } = require('zod');
const connectDB = require('../config/db');

// Schema for package creation/update
const packageSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    image: z.string().url(),
    location: z.string().optional(),
    duration: z.string().optional(),
    includes: z.array(z.string()).optional()
});

// @desc    Get all packages (with Search & Filter)
// @route   GET /api/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
    try {
        await connectDB();
        
        // Search and Filter Logic
        const { search, minPrice, maxPrice, location } = req.query;
        
        let query = {};
        
        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        
        // Filter by price
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const packages = await Package.find(query);
        res.json(packages);
    } catch (error) {
        console.error("Database fetch failed:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
    try {
        await connectDB();
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error("Database fetch failed:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// @desc    Create a package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
    const validatedData = packageSchema.parse(req.body);

    const newPackage = new Package(validatedData);
    const createdPackage = await newPackage.save();
    
    res.status(201).json(createdPackage);
});

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
    const validatedData = packageSchema.parse(req.body);
    
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
        pkg.name = validatedData.name;
        pkg.description = validatedData.description;
        pkg.price = validatedData.price;
        pkg.image = validatedData.image;
        pkg.location = validatedData.location;
        pkg.duration = validatedData.duration;
        pkg.includes = validatedData.includes;

        const updatedPackage = await pkg.save();
        res.json(updatedPackage);
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
        // Cascade delete bookings related to this package
        const Booking = require('../models/Booking');
        await Booking.deleteMany({ package: req.params.id });

        // Remove package from all users' wishlists
        const User = require('../models/User');
        await User.updateMany(
            { wishlist: req.params.id },
            { $pull: { wishlist: req.params.id } }
        );

        await pkg.deleteOne();
        res.json({ message: 'Package removed' });
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
};
