import { Button, Grid, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react';
import OrdersTable from './OrdersTable';
import { PersonAddSharp } from '@mui/icons-material';
import Ajouter from './Ajouter';



export default function MyTeam() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Liste des employés</Typography>
          </Grid>
          <Grid item>
            <Ajouter/>
            {/* <Button ><PersonAddSharp fontSize='little' /><Typography variant="h5">Ajouter</Typography></Button> */}
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  )
}
