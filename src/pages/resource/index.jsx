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
import ResourceTable from './ResourceTable';
import ResourceFilter from './ResourceFilter';

// Modularized Components
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import { useNotification } from 'NotificationProvider';
import axis from 'axis'; // Replace with your API client setup
import { useStateContext } from 'contexts/contextProvider';

export default function Resources() {
  const theme = useTheme(); // Access the theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Use theme for breakpoint
  const {user, messageSuccess} = useStateContext();
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
      let response;
      if (query.trim() === '' || query.trim() === null) {
        // Execute the default request when search query is empty
        response = await axis.get(`/resource`);
      } else {
        // Execute the search-specific request when a query exists
        response = await axis.get('/resource/search', { params: { query } });
      }
  
      // Check if `data` and `resource` exist in the response
      const resources = response.data || [];
      setResources(resources);
      setFilteredResources(resources); // Ensure the table updates with the fetched data
      console.log(resources);
    } catch (error) {
      console.error('Failed to fetch filtered requests:', error);
      setResources([]); // Set resources to an empty array in case of failure
      setFilteredResources([]); // Reset filtered resources on error
    } finally {
      setIsLoading(false);
    }
  };
  

  // Effect to handle notifications
  useEffect(() => {
    if (notification?.model === 'Resource') {
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
          Liste des ressources
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
            <Box sx={{ textAlign: 'center', }}>
            <CircularProgress />
            <Typography>Chargement...</Typography>
          </Box>
          ) : filteredResources.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            <ResourceTable resources={filteredResources} />
          )}
        </MainCard>
      </Grid>

      {/* Resource Filter Modal */}
      <ResourceFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </Grid>
  );
}
