import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import NewsGrid from './components/NewsGrid';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  const fetchNews = async (type, query = '') => {
    setLoading(true);
    setError('');
    
    try {
      let url = '';
      let params = {};

      if (type === 'headlines') {
        url = `${API_URL}/news/headlines`;
        params = { category, pageSize: 30 };
      } else if (type === 'search') {
        url = `${API_URL}/news/search`;
        params = { q: query, pageSize: 30 };
      }

      const response = await axios.get(url, { params });
      setArticles(response.data.articles || []);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchNews('search', searchQuery);
    } else {
      fetchNews('headlines');
    }
  }, [category, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchQuery('');
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="filters">
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            categories={categories}
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading && <div className="loading">Loading news...</div>}
        {error && <div className="error">{error}</div>}

        <Routes>
          <Route path="/" element={<NewsGrid articles={articles} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
