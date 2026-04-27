const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect, admin } = require('../middleware/authMiddleware');

const fallbackPackages = [
    {
        _id: "pkg-01",
        name: "Dubai Desert Safari & City Luxury",
        description: "Experience the ultimate luxury in Dubai. Includes a stay at a 5-star hotel, a thrilling evening desert safari, a visit to the top of the Burj Khalifa, and a luxury Dhow cruise dinner.",
        price: 850,
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
        location: "Dubai, UAE",
        duration: "5 Days, 4 Nights",
        includes: ["5-Star Hotel Stay", "Burj Khalifa Tickets", "Desert Safari & BBQ", "Dhow Cruise Dinner", "Airport Transfers"]
    },
    {
        _id: "pkg-02",
        name: "Bali Tropical Beach Escape",
        description: "Discover the exotic beauty of Bali. Includes a stay at a jungle resort in Ubud, cultural temple visits, exclusive access to a beach club, and a private island boat tour.",
        price: 950,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
        location: "Bali, Indonesia",
        duration: "7 Days, 6 Nights",
        includes: ["Ubud Jungle Resort", "Private Island Tour", "Temple Guide", "Beach Club Pass", "Daily Breakfast"]
    },
    {
        _id: "pkg-03",
        name: "Beijing Historical Wonders",
        description: "Immerse yourself in the rich history of China. Features a guided tour of the Great Wall of China, the Forbidden City, and a traditional Peking Duck culinary experience.",
        price: 1100,
        image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop",
        location: "Beijing, China",
        duration: "6 Days, 5 Nights",
        includes: ["4-Star Accommodation", "Great Wall Tour", "Forbidden City Access", "Traditional Meals", "English-speaking Guide"]
    },
    {
        _id: "pkg-04",
        name: "Maldives Overwater Bliss",
        description: "The ultimate relaxation getaway. Includes a private overwater bungalow, unlimited scuba diving sessions, spa treatments, and an exclusive underwater restaurant dinner.",
        price: 2500,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop",
        location: "Maldives",
        duration: "5 Days, 4 Nights",
        includes: ["Overwater Bungalow", "Seaplane Transfer", "Scuba Diving", "Spa Treatment", "Underwater Dinner"]
    },
    {
        _id: "pkg-05",
        name: "Istanbul Cultural Experience",
        description: "Explore the city where East meets West. Includes a Bosphorus cruise, tours of the Hagia Sophia and Blue Mosque, and shopping in the historic Grand Bazaar.",
        price: 900,
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
        location: "Istanbul, Turkey",
        duration: "6 Days, 5 Nights",
        includes: ["Boutique Hotel", "Bosphorus Cruise", "Historical Sites Pass", "Grand Bazaar Tour", "Local Transportation"]
    },
    {
        _id: "pkg-06",
        name: "Kuala Lumpur & Langkawi Tour",
        description: "Experience the vibrant city life of Kuala Lumpur and the pristine beaches of Langkawi. Includes Petronas Twin Towers tour and a tropical island hopping adventure.",
        price: 800,
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop",
        location: "Malaysia",
        duration: "7 Days, 6 Nights",
        includes: ["Domestic Flights (KL to Langkawi)", "Twin Towers Ticket", "Island Hopping", "4-Star Hotels", "Daily Buffet Breakfast"]
    }
];

// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Server error' });
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
