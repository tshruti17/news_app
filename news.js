const express = require('express');
const axios = require('axios');
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

// Get top headlines
router.get('/headlines', async (req, res) => {
  try {
    const { country = 'us', category, pageSize = 20 } = req.query;
    
    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        country,
        category,
        pageSize,
        apiKey: NEWS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching headlines:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message 
    });
  }
});

// Search news
router.get('/search', async (req, res) => {
  try {
    const { q, language = 'en', sortBy = 'publishedAt', pageSize = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        q,
        language,
        sortBy,
        pageSize,
        apiKey: NEWS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error searching news:', error.message);
    res.status(500).json({ 
      error: 'Failed to search news',
      message: error.message 
    });
  }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { country = 'us', pageSize = 20 } = req.query;

    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        country,
        category,
        pageSize,
        apiKey: NEWS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching category news:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch category news',
      message: error.message 
    });
  }
});

module.exports = router;
