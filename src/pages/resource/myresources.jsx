import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  IconButton, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import AjouterRessource from './AjouterRessource';
import ResourceFilter from './ResourceFilter';

// Modularized Components
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import MyResourceTable from './MyResourceTable';

import { useNotification } from 'NotificationProvider';
import axis from 'axis'; // Replace with your API client setup
import { useStateContext } from 'contexts/contextProvider';

export default function MyResource() {
  const {user, messageSuccess} = useStateContext()
  const theme = useTheme(); // Access the theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Use theme for breakpoint
  
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const notification = useNotification();

  // Fetch resources from the API
  const fetchResources = async (query = '') => {
    setIsLoading(true);
    try {
      const response = query
        ? await axis.get('resource/search/', { params: { query } })
        : await axis.get(`/resource/chief/${user.matricule}`);
      setResources(response.data || []); // Adjust for your API response structure
      setFilteredResources(response.data || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle notifications
  useEffect(() => {
    if (notification?.model === 'MyResource') {
      if (['created', 'modified', 'deleted'].includes(notification.action)) {
        fetchResources(searchTerm); // Re-fetch resources with current search term
      } else {
        console.warn('Unhandled notification action:', notification.action);
      }
    }
  }, [notification, searchTerm]);

  // Effect to fetch data initially
  useEffect(() => {
    fetchResources();
  }, []);

  // Handle search input changes
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    // Filter resources dynamically without triggering API calls
    const filtered = resources.filter((resource) =>
      resource.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResources(filtered);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 0 }}>
          Liste de mes ressources
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

          {/* AjouterRessource Button */}
          <AjouterRessource />

          {/* Filter Button */}
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>

          {/* Export Button */}
          <ExportPopover />

          {/* Import Button */}
          <ImportPopover />
        </Box>
      </Grid>

      {/* Resource Table */}
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
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredResources.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            <MyResourceTable resources={filteredResources} />
          )}
        </MainCard>
      </Grid>

      {/* Resource Filter Modal */}
      <ResourceFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </Grid>
  );
}
