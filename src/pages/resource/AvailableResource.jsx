import React, { useState, useEffect } from 'react';
import { Grid, Typography, useMediaQuery, useTheme, IconButton, Box } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import Ajouter from './AjouterRessource';
import AvailableResourceTable from './AvailableResourceTable';
import SearchInput from './SearchInput';
import { useNotification } from 'NotificationProvider';
import axis from 'axis'; // Assuming axis is your API utility
import ResourceFilter from './ResourceFilter';

export default function AvailableResource() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch data on mount
  useEffect(() => {
    fetchFilteredResource('');
    // Fetch employees
    axis.get('/employee')
      .then((response) => setEmployees(response.data.employees))
      .catch((error) => console.error('Failed to fetch employees:', error));
  }, []);

  const fetchFilteredResource = async (query) => {
    setIsLoading(true);
    try {
      let response;
  
      if (query.trim() === '' || query.trim() === null) {
        // Execute the default request when search query is empty
        response = await axis.get('/resource/mandeha'); // Added `await`
      } else {
        // Execute the search-specific request when a query exists
        response = await axis.get('/resource/search', { params: { query } });
      }
  
      // Check if `data` and `resource` exist in the response
      const resources = response?.data?.resource || [];
      setResources(resources);
      console.log(resources);
    } catch (error) {
      console.error('Failed to fetch filtered requests:', error);
      setResources([]); // Set resources to an empty array in case of failure
    } finally {
      setIsLoading(false);
    }
  };
  

  // Handle notifications
  const notification = useNotification();
  useEffect(() => {
    if (notification?.model === 'Resource') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
          fetchFilteredResource('');
          break;
        default:
          console.warn('Unhandled action:', notification.action);
      }
    }
  }, [notification]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 0 }}>
          Liste des ressources disponibles
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
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>
        </Box>
      </Grid>

      {/* Available Resource Table */}
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
          <AvailableResourceTable 
            resources={resources} 
            searchTerm={searchTerm}
            sx={{md:-2}}
          />
        </MainCard>
      </Grid>

      {/* Available Resource Filter Modal */}
      <ResourceFilter 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </Grid>
  );
}
