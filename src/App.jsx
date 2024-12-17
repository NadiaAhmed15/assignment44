import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '5e15a6f1683c5e45017dc3423d85e612';
const API_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState('');
  const [sortOption, setSortOption] = useState('popularity.desc');
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie

  const fetchMovies = async (query = 'Avengers') => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all([
        axios.get(API_URL, {
          params: { api_key: API_KEY, query, page: 1, include_adult: false },
        }),
        axios.get(API_URL, {
          params: { api_key: API_KEY, query, page: 2, include_adult: false },
        }),
      ]);
      const combinedResults = [...responses[0].data.results, ...responses[1].data.results];
      setMovies(combinedResults);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchTerm);
  };

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const filteredMovies = movies
    .filter((movie) => (filterYear ? movie.release_date?.includes(filterYear) : true))
    .sort((a, b) => {
      switch (sortOption) {
        case 'title.asc':
          return a.title.localeCompare(b.title);
        case 'title.desc':
          return b.title.localeCompare(a.title);
        case 'release_date.desc':
          return new Date(b.release_date) - new Date(a.release_date);
        case 'release_date.asc':
          return new Date(a.release_date) - new Date(b.release_date);
        case 'popularity.desc':
        default:
          return b.popularity - a.popularity;
      }
    });

  return (
    <div className="app">
      <header className="header">
        <h1> Dnadosh Movies </h1>
        <div className='filters'>
      <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {/* Filter and Sort Controls */}
        <div className="filters">
          <input
          style={{
            width:"300px"
          }}
            type="text"
            placeholder="Filter by year (e.g., 2023)"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-input"
          />
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
            <option value="popularity.desc">Sort by Popularity (High to Low)</option>
            <option value="release_date.desc">Sort by Release Date (Newest First)</option>
            <option value="release_date.asc">Sort by Release Date (Oldest First)</option>
            <option value="title.asc">Sort by Title (A-Z)</option>
            <option value="title.desc">Sort by Title (Z-A)</option>
          </select>
        </div>
      </div>
      </header>
     
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Display Selected Movie Details */}
      {selectedMovie && (
        <div className="selected-movie">
          <img
            src={selectedMovie.poster_path ? `${IMAGE_URL}${selectedMovie.poster_path}` : 'https://via.placeholder.com/300'}
            alt={selectedMovie.title}
            className="selected-movie-image"
          />
          <div className="selected-movie-details">
            <h2>{selectedMovie.title}</h2>
            <p><strong>Release Date:</strong> {selectedMovie.release_date || 'N/A'}</p>
            <p><strong>Rating:</strong> {selectedMovie.vote_average || 'N/A'}</p>
            <p><strong>Overview:</strong> {selectedMovie.overview || 'No description available.'}</p>
          </div>
        </div>
      )}

      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleCardClick(movie)}>
            <img
              src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/150'}
              alt={movie.title}
              className="movie-image"
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p>Release Date: {movie.release_date || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
