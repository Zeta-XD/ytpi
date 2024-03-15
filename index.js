const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

async function fetchGitHubData(user) {
    try {
        const response = await axios.get(`https://api.github.com/users/${user}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

app.get('/api/info/githubstalk', async (req, res) => {
    const user = req.query.user;
    if (!user) return res.json({ status: false, creator: 'sezraah', message: '[!] masukan parameter user' });

    try {
        const gitstalk = await fetchGitHubData(user);
        if (gitstalk.message === 'Not Found') return res.json({ status: false, message: 'User not found' });

        res.json({ status: true, creator: 'zetahhh', result: gitstalk });
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
