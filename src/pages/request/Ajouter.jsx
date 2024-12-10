import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import axis from 'axis';
import { useEffect, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useStateContext } from 'contexts/contextProvider';

const style = (isSmallScreen, isVisible) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: isVisible ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)',
  width: isSmallScreen ? '90%' : '60%',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  transition: 'transform 0.5s ease, opacity 0.5s ease',
  opacity: isVisible ? 1 : 0,
});

export default function AjouterRequete() {
  const { user } = useStateContext();
  const [resources, setResources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [requestData, setRequestData] = useState({
    id_resource: '',
    id_beneficiary: '',
    request_date: '',
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourcesResponse = await axis.get('/resource/mandeha');
        const employeeResponse = await axis.get(`/employee/chief/${user.matricule}`);
        setResources(resourcesResponse.data?.resource);
        setEmployees(employeeResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 500);
  };

  const handleChange = (field) => (event) => {
    setRequestData({ ...requestData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...requestData,
        id_requester: user.matricule,
      };

      await axis.post('/request/new', payload);
      console.log('Requête créée avec succès');
      handleClose();
    } catch (error) {
      console.error(error);
      console.log('Erreur lors de la création de la requête');
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Créer une requête
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Créer une Requête
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Solliciteur (id_requester):</Typography>
              <TextField fullWidth value={user.matricule} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Ressource (id_resource):</Typography>
              <Select
                fullWidth
                value={requestData.id_resource}
                onChange={handleChange('id_resource')}
              >
                {resources.map((resource) => (
                  <MenuItem key={resource.id_resource} value={resource.id_resource}>
                    {resource.id_resource} - {resource.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Bénéficiaire (id_beneficiary):</Typography>
              <Select
                fullWidth
                value={requestData.id_beneficiary}
                onChange={handleChange('id_beneficiary')}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.matricule} value={employee.matricule}>
                    {employee.matricule} - {employee.name} {employee.firstname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Date de la requête:</Typography>
              <TextField
                fullWidth
                type="date"
                value={requestData.request_date}
                onChange={handleChange('request_date')}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ mr: 2 }}
            >
              Sauvegarder
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Annuler
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
