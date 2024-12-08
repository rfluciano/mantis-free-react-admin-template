import React, { useState } from 'react';
import { 
  Grid, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  IconButton, 
  Box 
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import Ajouter from './Ajouter';
import UnityTable from './UnityTable';
import UnityFilter from './UnityFilter'; // Unity-specific filter

// Modularized Components
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';

export default function Unity() {
  const theme = useTheme(); // Access the theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Use theme for breakpoint
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({}); // This will store the applied filters
  const [isLoading, setIsLoading] = useState(true);

  // Search handler
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Apply filter and close modal
  const handleFilterApply = (appliedFilters) => {
    setFilters(appliedFilters); // Set the applied filters
    setIsFilterOpen(false); // Close the filter modal
  };

  // Open filter modal
  const handleFilterOpen = () => setIsFilterOpen(true);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 0 }}>
          Liste des unités
        </Typography>
      </Grid>

      {/* Table Options */}
      <Grid item xs={12}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={isSmallScreen ? 2 : 1}
          sx={{
            position: 'relative',
            zIndex: 1,
            mb: -3,
          }}
        >
          {/* Search Input */}
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
            isSmallScreen={isSmallScreen} 
          />

          {/* Ajouter Button */}
          <Ajouter />

          {/* Filter Button */}
          <IconButton aria-label="Filtrer" onClick={handleFilterOpen}>
            <FilterList />
          </IconButton>

          {/* Export Button */}
          <ExportPopover />

          {/* Import Button */}
          <ImportPopover />
        </Box>
      </Grid>

      {/* Unity Table */}
      <Grid item xs={12}>
        <MainCard
          sx={{
            p: 0,
            width: '100%',
            '& > .MuiBox-root': {
              margin: 0,
            },
          }}
        >
          <UnityTable 
            searchTerm={searchTerm} 
            filters={filters} // Pass filters to the table
          />
        </MainCard>
      </Grid>

      {/* Unity Filter Modal */}
      <UnityFilter
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleFilterApply} // Pass callback to apply the filter
      />
    </Grid>
  );
}
