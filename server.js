import express from 'express';
import { createClient } from 'redis';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const redis = createClient();
redis.on('error', (err) => console.error('Redis error:', err));

await redis.connect();

app.get('/', (req, res) => {
    res.send('Server is running. Try /photos');
});

app.get('/photos', async (req, res) => {
    const CACHE_KEY = 'photos:list';
    const CACHE_TTL = 3600;

    try {
        const cached = await redis.get(CACHE_KEY);

        if (cached) {
            console.log('✅ Cache hit');
            return res.json(JSON.parse(cached));
        }

        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=10');
        const data = await response.json();

        await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));

        console.log('🌐 Fetched from API');
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
