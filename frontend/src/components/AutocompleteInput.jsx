import React, { useState, useEffect } from 'react';

const AutocompleteInput = ({ suggestions, placeholder, value, onChange }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce function to delay the API request
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = debounce((value) => {
    if (value.length > 1) {
      setLoading(true);
      setError(null);

      fetch(`https://vicopo.selfbuild.fr/ville/${value}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.cities) {
            setFilteredSuggestions(data.cities.slice(0, 5)); // Limit to 5 suggestions
          } else {
            setFilteredSuggestions([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setError('Failed to fetch cities. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setFilteredSuggestions([]);
    }
  }, 500); // 500ms debounce

  useEffect(() => {
    if (value.length > 1) {
      fetchSuggestions(value);
    }
  }, [value, fetchSuggestions]);

  const handleSuggestionClick = (city) => {
    onChange(city); // Update parent state
    setFilteredSuggestions([]);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="autocomplete-input"
        aria-label={placeholder}
      />
      {/*loading && <div className="loading">Loading...</div>*/}
      {error && <div className="error">{error}</div>}
      {filteredSuggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.city)}
              className="autocomplete-suggestion"
            >
              {suggestion.city} ({suggestion.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
