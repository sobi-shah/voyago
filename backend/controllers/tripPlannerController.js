const { GoogleGenerativeAI } = require('@google/generative-ai');
const Package = require('../models/Package');
const asyncHandler = require('../middleware/asyncHandler');

const planTrip = asyncHandler(async (req, res) => {
    const { userMessage, conversationHistory = [] } = req.body;

    if (!userMessage) {
        return res.status(400).json({ message: 'User message is required' });
    }

    // Fetch all packages for context
    const packages = await Package.find({});

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini_api_key')) {
        return res.json({
            message: "I'm currently running in demo mode (Gemini API key is missing or invalid). Based on what you said, here are a couple of great packages I found in our database:",
            recommendations: packages.slice(0, 2).map(pkg => ({
                packageId: pkg._id.toString(),
                name: pkg.name,
                reason: "This is a highly recommended destination based on your preferences!"
            }))
        });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Format packages into a readable string for the model
    const packageContext = packages.map(pkg => 
        `ID: ${pkg._id} | Name: ${pkg.name} | Location: ${pkg.location || 'Global'} | Price: $${pkg.price} | Duration: ${pkg.duration || 'N/A'} | Description: ${pkg.description}`
    ).join('\n\n');

    // System instruction (Gemini 1.5 format)
    const systemInstruction = `You are a travel assistant for Voyago, a premium travel booking platform. Based on the user's dream trip description, recommend 2-3 packages from the provided list. Always respond in this exact JSON format: { "message": "string", "recommendations": [{ "packageId": "string", "name": "string", "reason": "string" }] }`;

    try {
        // Initialize the model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json", // Force JSON response
            }
        });

        // Construct history for Gemini Chat
        const formattedHistory = [];
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                formattedHistory.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            });
        }

        // Start chat session
        const chat = model.startChat({
            history: formattedHistory
        });

        // Add the packages context invisibly alongside the user's message
        const contextMessage = `Available Packages Context:\n${packageContext}\n\nUser Message: ${userMessage}`;

        const result = await chat.sendMessage(contextMessage);
        const responseText = result.response.text();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Gemini JSON:', responseText);
            return res.status(500).json({ message: 'AI returned an invalid response format.' });
        }

        res.json(jsonResponse);
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to communicate with AI Trip Planner.' });
    }
});

module.exports = { planTrip };
