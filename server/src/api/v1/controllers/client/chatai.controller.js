const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // TTL = 100s
const { callCopilotAI } = require('../../models/chatai');  

exports.allChatais = async (req, res) => {
    try {
        console.log('Request received');
        const prompt = req.query.prompt || 'Hello, ChatAI';
        
        // Check cache first
        let result = myCache.get(prompt);
        if (result) {
            console.log('Cache hit');
            return res.status(200).json(result); // Return result from cache
        }

        // If not in cache, call the API and cache the result
        result = await callCopilotAI(prompt);
        myCache.set(prompt, result); // Save result to cache
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in allChatais:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
};
