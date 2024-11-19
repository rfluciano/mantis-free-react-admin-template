import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchInputRef = useRef(null); // Reference for the input field

  const handleSearch = async () => {
    if (query.length > 2) {
      try {
        const response = await axios.get('/search', {
          params: { query }
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Activate search input on Ctrl + K
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current.focus(); // Focus the search input
      }
    };
    window.addEventListener('keydown', handleShortcut);
    
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, position: 'relative' }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          ref={searchInputRef} // Attach the ref to the input
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} aria-label="search">
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ctrl + K"
        />
      </FormControl>
      {results.length > 0 && (
        <Box sx={{ position: 'absolute', zIndex: 10, background: 'white', width: { xs: '100%', md: 224 }, mt: 1 }}>
          {results.map((result, index) => (
            <Box key={index} sx={{ padding: 1, borderBottom: '1px solid #eee' }}>
              {result.name} {/* Render relevant result data */}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
