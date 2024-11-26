import React, { useEffect, useState } from 'react';
import axis from 'axis';
import { Box, TextField, Typography, Grid, Paper, Avatar, Input } from '@mui/material';
import { useStateContext } from 'contexts/contextProvider';
import MainCard from 'components/MainCard';

const Profile = () => {
  const { user } = useStateContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axis.get(`/users/${user.matricule}`);
        console.log('Fetched Data:', response.data); // Log the raw API response
        setUserData(response.data.user); // Ensure the correct object is being set
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.matricule]);

  if ( userData == null) return <Typography>Loading...</Typography>;

  // Destructure user and employee data
  const { username, discriminator, isactive, employee } = userData;
  const { firstname, name, date_entry, position } = employee;
  const { title: positionTitle, unity } = position;

  return (
    <MainCard elevation={3} sx={{ padding: 4, maxWidth: '900px', margin: '0 auto', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Grid container spacing={4}>
        {/* User Information Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Avatar
              alt={`${firstname} ${name}`}
              sx={{ width: 120, height: 120, marginBottom: 2 }}
              src="/placeholder-image.jpg" // Replace with actual image path when available
            />
            <Grid item xs={14} sm={'auto'}>
              <Typography>Nom d'utilisateur :</Typography>
              <TextField value={` ${username}`} InputProps={{ readOnly: true }} fullWidth />
            </Grid>            <Grid item xs={14} sm={'auto'}>
              <Typography>Rôle :</Typography>
              <TextField value={` ${discriminator}`} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            {/* <TextField label="Active" value={isactive ? 'Yes' : 'No'} InputProps={{ readOnly: true }} fullWidth /> */}
          </Box>
        </Grid>

        {/* Employee Information Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Employee Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid item xs={14} sm={'auto'}>
              <Typography>Nom complet :</Typography>
              <TextField value={`${name} ${firstname}`} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={14} sm={'auto'}>
              <Typography>Poste :</Typography>
              <TextField value={positionTitle} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={14} sm={'auto'}>
              <Typography>Unité :</Typography>
              <TextField value={`${unity.type} ${unity.title}`} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={14} sm={'auto'}>
              <Typography>Date d'embauche :</Typography>
              <TextField value={date_entry} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Profile;
