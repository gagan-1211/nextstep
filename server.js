const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Web search endpoint
app.post('/api/websearch', async (req, res) => {
    try {
        const { search_term } = req.body;
        
        if (!search_term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        // Perform web search
        const searchResponse = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(search_term)}`, {
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
            }
        });

        if (!searchResponse.ok) {
            throw new Error('Search API request failed');
        }

        const searchData = await searchResponse.json();
        
        // Format results
        const results = searchData.webPages.value.slice(0, 3).map(result => ({
            title: result.name,
            url: result.url,
            snippet: result.snippet
        }));

        res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 