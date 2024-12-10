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
import AjouterRequete from './Ajouter';
import RequestFilter from './RequestFilter';
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';
import ReceivedRequestTable from './ReceivedRequestTable';
import SentRequestTable from './SentRequestTable';
import { useNotification } from 'NotificationProvider';

export default function Request() {
  const { user } = useStateContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const RequestColumns = ['id_request', 'id_requester', 'id_receiver', 'id_resource', 'validation.status', 'validation.validation_date'];

  useEffect(() => {
    if (notification?.model === 'Request') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
          fetchFilteredRequests();  // Call without the searchTerm to see all users
          break;
        default:
          console.warn('Unhandled action:', notification.action);
      }
    }
  }, [notification]);

  const fetchFilteredRequests = async (query) => {
    setIsLoading(true);
    try {
      let response;
      if (query.trim() === '' || query.trim() === null) {
        // Execute the default request when search query is empty
        response = await axis.get(`/request/sent/${user.matricule}`);
      } else {
        // Execute the search-specific request when a query exists
        response = await axis.get('/request/search', { params: { query } });
      }
      setFilteredRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch filtered requests:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    fetchFilteredRequests(newSearchTerm);
  };

  useEffect(() => {
    fetchFilteredRequests('');
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: -1.5 }}>
          Liste des requêtes envoyées
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
          <AjouterRequete />
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>
          <ExportPopover data={filteredRequests} columns={RequestColumns} />
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
            <Box sx={{ textAlign: 'center'}}>
            <CircularProgress />
            <Typography>Chargement...</Typography>
          </Box>
          ) : filteredRequests.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            <SentRequestTable requests={filteredRequests} />
          )}
        </MainCard>
      </Grid>

      <RequestFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </Grid>
  );
}
