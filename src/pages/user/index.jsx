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
import AjouterUtilisateur from './Ajouter';
import UserTable from './UserTable';
import UserFilter from './UserFilter';
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';
import { useNotification } from './../../NotificationProvider'; // Import the hook

export default function User() {
  const { user } = useStateContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const notification = useNotification();
  const UserColumns = ['matricule', 'username', 'isactive', 'discriminator'];

  useEffect(() => {
    if (notification?.model === 'User') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
          fetchFilteredUsers();  // Call without the searchTerm to see all users
          break;
        default:
          console.warn('Unhandled action:', notification.action);
      }
    }
  }, [notification]); // Use the notification hook

  const [isLoading, setIsLoading] = useState(true);
  const fetchFilteredUsers = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axis.get(query ? `/users/search?query=${query}` : '/users');
      setFilteredUsers(response.data.users || []);
    } catch (err) {
      console.error('API Fetch Error:', err);
      setError('Une erreur s\'est produite lors du chargement des utilisateurs.');
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value.trim();
    setSearchTerm(newSearchTerm);
    fetchFilteredUsers(newSearchTerm);
  };


   // Dependency array includes `notification`

  useEffect(() => {
    fetchFilteredUsers();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: -1.5 }}>
          Liste des utilisateurs
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={isSmallScreen ? 2 : 1}>
          <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} isSmallScreen={isSmallScreen} />
          <AjouterUtilisateur />
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>
          <ExportPopover data={filteredUsers} columns={UserColumns} />
          {/* <ImportPopover /> */}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <MainCard sx={{ p: 0, width: '100%' }}>
          {isLoading ? (
            <Box sx={{ textAlign: 'center', }}>
            <CircularProgress />
            <Typography>Chargement...</Typography>
          </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1" color="error">{error}</Typography>
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
