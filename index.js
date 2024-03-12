const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.get('/api/ytsearch', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    const regex = /(?<=watch\?v=)[\w-]+/;
    const videoId = url.match(regex);

    if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId[0]}&format=json`)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'An error occurred while fetching data from YouTube API.' }));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
