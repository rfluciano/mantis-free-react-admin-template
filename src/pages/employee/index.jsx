import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import Ajouter from './Ajouter';
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';
import EmployeeTable from './EmployeeTable';
import EmployeeFilter from './EmployeeFilter';
import { useNotification } from 'NotificationProvider';

export default function Employee() {
  const theme = useTheme();
  const { user } = useStateContext();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  useEffect(() => {
    if (notification?.model === 'Employee') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
          fetchEmployees('');
          break;
        default:
          console.warn('Unhandled action:', notification.action);
      }
    }
  }, [notification]);

  const fetchEmployees = async (query) => {
    setIsLoading(true);
    try {
      const searchQuery = query?.trim?.() || ''; // Safely trim or default to an empty string
      let response;
  
      if (searchQuery === '') {
        // Fetch all employees
        response = await axis.get('/employee');
      } else {
        // Fetch filtered employees
        response = await axis.get('/search/employee', { query: searchQuery });
      }
  
      setEmployee(response.data.employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Handle changes in search input
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    fetchEmployees(newSearchTerm);
  };

  // Fetch data initially when the component is mounted
  useEffect(() => {
    fetchEmployees('');
  }, []); // Empty dependency array to only run once

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: -1.5 }}>
          Liste des employés
        </Typography>
      </Grid>

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
          {/* Export Popover */}
          <ExportPopover />
          {/* Import Popover */}
          <ImportPopover />
        </Box>
      </Grid>

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
          ) : employee.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            // Display Received Request Table
            <EmployeeTable employees={employee} />
          )}
        </MainCard>
      </Grid>

      {/* Request Filter Modal */}
      <EmployeeFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </Grid>
  );
}
