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
import PositionTable from './PositionTable';
import PositionFilter from './PositionFilter';
import AjouterPosition from './Ajouter';
import SearchInput from './SearchInput';
import ExportPopover from './ExportPopover';
import ImportPopover from './ImportPopover';
import { useNotification } from 'NotificationProvider';
import axis from 'axis';

export default function Position() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification();
  

  useEffect(() => {
    if (notification?.model === 'Position') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
          fetchPositions(); // Actualise la liste
          break;
        default:
          console.warn('Action non gérée:', notification.action);
      }
    }
  }, [notification]);

  const fetchPositions = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      // Remplacez axis par votre méthode API appropriée
      const response = await axis.get(query ? `/position/search?query=${query}` : '/position');
      setPositions(response.data || []);
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Une erreur s’est produite lors du chargement des postes.');
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value.trim();
    setSearchTerm(newSearchTerm);
    fetchPositions(newSearchTerm);
  };

  const handleFilterApply = (appliedFilters) => {
    // Applique les filtres et recharge les données
    console.log('Filtres appliqués:', appliedFilters);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 0 }}>
          Liste des postes
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={isSmallScreen ? 2 : 1}>
          <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} isSmallScreen={isSmallScreen} />
          <AjouterPosition />
          <IconButton aria-label="Filtrer" onClick={() => setIsFilterOpen(true)}>
            <FilterList />
          </IconButton>
          <ExportPopover />
          <ImportPopover />
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
          ) : positions.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
              <Typography variant="body1">Aucune donnée trouvée.</Typography>
            </Box>
          ) : (
            <PositionTable positions={positions} />
          )}
        </MainCard>
      </Grid>

      <PositionFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleFilterApply} />
    </Grid>
  );
}
