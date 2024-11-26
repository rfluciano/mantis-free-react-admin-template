import React, { useEffect, useState } from 'react';
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
import AjouterUtilisateur from './Ajouter';
import UserTable from './UserTable';
import UserFilter from './UserFilter';
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';

export default function User() {
  const { user } = useStateContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]); // Ensure it's initialized as an empty array
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchFilteredUsers = async (query) => {
    setIsLoading(true);
    try {
      let response;
      if (query.trim() === '' || query.trim() === null) {
        response = await axis.get(`/users`);
      } else {
        response = await axis.get('/users/search', { params: { query } });
      }
      console.log(response.data); // Inspect the API response
      setFilteredUsers(response.data.users || []); // Adjust based on API response structure
    } catch (error) {
      console.error('Failed to fetch filtered users:', error);
      setFilteredUsers([]); // Reset to an empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    fetchFilteredUsers(newSearchTerm);
  };

  useEffect(() => {
    fetchFilteredUsers('');
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: -1.5 }}>
          Liste des utilisateurs
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
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
            isSmallScreen={isSmallScreen} 
          />
          <AjouterUtilisateur />
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>
          <ExportPopover />
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
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            <UserTable users={filteredUsers} />
          )}
        </MainCard>
      </Grid>

      <UserFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </Grid>
  );
}
