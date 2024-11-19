import React from 'react';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import Ajouter from './Ajouter';
import ResourceTable from './ResourceTable';

export default function AvailableResource() {
  const theme = useTheme(); // Access the theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Use theme for breakpoint

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Liste des ressources disponibles</Typography>
          </Grid>
          <Grid item>
            <Ajouter />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} container spacing={0} sx={{ marginLeft: '0px' }}>
        <MainCard
          sx={{
            p: 0, // Remove all padding from MainCard
            width: '100%', // Ensure it takes the full width
            '& > .MuiBox-root': {
              margin: 0, // Remove margin from any nested Box
            },
          }}
        >
          <ResourceTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
