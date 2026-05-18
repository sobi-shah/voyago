const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');
const connectDB = require('./config/db');

dotenv.config();

const realPackages = [
    {
        name: "Dubai Luxury Escape",
        description: "Experience the ultimate luxury in Dubai. Includes a stay at the Burj Al Arab, a desert safari, and a private yacht tour around the Palm Jumeirah.",
        price: 980000,
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Dubai, UAE",
        duration: "5 Days, 4 Nights",
        includes: ["Burj Al Arab Stay", "Desert Safari", "Yacht Tour"]
    },
    {
        name: "Turkey Cultural Journey",
        description: "Discover the magic of Turkey, from the bustling streets of Istanbul to the surreal landscapes of Cappadocia. Includes a hot air balloon ride.",
        price: 504000,
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Istanbul/Cappadocia, Turkey",
        duration: "8 Days, 7 Nights",
        includes: ["Bosphorus Cruise", "Hot Air Balloon", "Guided Tours"]
    },
    {
        name: "Hunza Valley Expedition",
        description: "Breathtaking views of the Karakoram range. Visit the ancient Baltit Fort, Attabad Lake, and experience the rich local culture of Gilgit-Baltistan.",
        price: 238000,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Hunza, Pakistan",
        duration: "7 Days, 6 Nights",
        includes: ["Hotel Stay", "Transport", "Attabad Lake Boating"]
    },
    {
        name: "Skardu Alpine Adventure",
        description: "A trip to the land of mountains and lakes. Explore Shangrila Resort, Upper Kachura Lake, and the majestic Deosai National Park.",
        price: 252000,
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Skardu, Pakistan",
        duration: "6 Days, 5 Nights",
        includes: ["Shangrila Visit", "Deosai Safari", "Jeep Rides"]
    },
    {
        name: "Murree Weekend Getaway",
        description: "A quick and refreshing escape to the pine-covered hills of Murree and Patriata. Enjoy the chairlift and cool mountain breeze.",
        price: 70000,
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Murree, Pakistan",
        duration: "3 Days, 2 Nights",
        includes: ["Hotel Stay", "Breakfast", "Patriata Chairlift"]
    },
    {
        name: "Paris Romantic Retreat",
        description: "Fall in love with the city of lights. Includes a stay near the Eiffel Tower, a Seine river cruise, and an exclusive Louvre museum tour.",
        price: 616000,
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Paris, France",
        duration: "6 Days, 5 Nights",
        includes: ["Eiffel Tower Dinner", "Seine River Cruise", "Louvre Pass"]
    },
    {
        name: "Swiss Alps Adventure",
        description: "A thrilling escape to the Swiss Alps. Enjoy premium skiing resorts, hot springs, and a scenic ride on the Glacier Express.",
        price: 798000,
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Swiss Alps, Switzerland",
        duration: "6 Days, 5 Nights",
        includes: ["Premium Ski Resort", "Hot Springs", "Glacier Express"]
    },
    {
        name: "Maldives Overwater Bliss",
        description: "The ultimate relaxation in the Maldives. Includes an overwater bungalow, scuba diving sessions, and an underwater restaurant dinner.",
        price: 896000,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Maldives",
        duration: "5 Days, 4 Nights",
        includes: ["Overwater Bungalow", "Scuba Diving", "Underwater Dinner"]
    },
    {
        name: "Tokyo Neon Nights",
        description: "Immerse yourself in the vibrant culture of Tokyo. Features guided culinary tours, a visit to Mt. Fuji, and a stay in a luxury high-rise.",
        price: 588000,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Tokyo, Japan",
        duration: "8 Days, 7 Nights",
        includes: ["High-rise Stay", "Culinary Tour", "Mt. Fuji Trip"]
    },
    {
        name: "Santorini Sunset Retreat",
        description: "Experience the famous white architecture and breathtaking sunsets of Santorini. Includes luxury accommodation and a private yacht tour.",
        price: 532000,
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: "Santorini, Greece",
        duration: "5 Days, 4 Nights",
        includes: ["Luxury Villa", "Daily Breakfast", "Sunset Yacht Tour"]
    }
];

const importData = async () => {
    try {
        await connectDB();
        
        // Clear existing packages
        await Package.deleteMany();
        
        // Insert new real packages
        await Package.insertMany(realPackages);
        
        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
