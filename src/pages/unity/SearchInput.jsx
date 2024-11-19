import React from 'react';
import { TextField, Box } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

export default function SearchInput({ searchTerm, onSearchChange, isSmallScreen }) {
  return (
    <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
      <SearchOutlined sx={{ mr: 1 }} />
      <TextField
        variant="outlined"
        size="small"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
          width: '100%',
          maxWidth: isSmallScreen ? '100%' : '300px',
        }}
      />
    </Box>
  );
}
