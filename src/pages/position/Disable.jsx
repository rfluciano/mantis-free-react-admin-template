import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, Input, Select, MenuItem, Grid, TextField } from '@mui/material';
import axis from 'axis';

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
  opacity: isVisible ? 1 : 0
});

export default function Disable({ employeeId, open, onClose }) {
  const [positions, setPositions] = useState([]);
  const [unities, setUnities] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [employee, setEmployee] = useState({
    name: '',
    firstname: '',
    date_entry: '',
    id_position: '',
    isactive: true,
    id_unity: ''
  });

  const isSmallScreen = window.innerWidth <= 600;

  // Fetch positions by unity
  const getPositions = async (id_unity = null) => {
    try {
      const response = await axis.get(`/position`);
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  // Fetch all unities
  const getUnities = async () => {
    try {
      const response = await axis.get('/unity');
      setUnities(response.data);
    } catch (err) {
      console.error('Error fetching unities:', err);
    }
  };

  // Fetch employee data by ID
  useEffect(() => {
    if (employeeId) {
      console.log(employeeId);
      const fetchEmployee = async () => {
        try {
          const response = await axis.get(`/employee/${employeeId}`);
          const employeeData = response.data || {};
          setEmployee({
            name: employeeData.name || '',
            firstname: employeeData.firstname || '',
            date_entry: employeeData.date_entry || '',
            id_position: employeeData.id_position || '',
            isactive: employeeData.isactive ?? true, // Utilisez nullish coalescing pour les booléens
            id_unity: employeeData.id_unity || ''
          });
          if (employeeData.id_unity) {
            await getPositions(employeeData.id_unity);
          }
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };

      fetchEmployee();
    }
  }, [employeeId]);

  // Load unities once when the component mounts
  useEffect(() => {
    getUnities();
  }, []);

  const handlePositionChange = (event) => {
    const positionId = event.target.value;
    setEmployee((prevState) => ({ ...prevState, id_position: positionId }));
  };

  const handleUnityChange = (event) => {
    const unityId = event.target.value;
    setEmployee((prevState) => ({ ...prevState, id_unity: unityId, id_position: '' }));
    getPositions(unityId);
  };

  const handleChange = (e) => {
    setEmployee((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axis.put(`/employee/update/${employeeId}`, employee);
      console.log('Employee mis à jour avec succès');
      onClose(); // Close the modal after updating
    } catch (err) {
      console.error('Error updating employee:', err);
      console.log("Une erreur s'est produit durant la modification de l'employé.");
    }
  };

  const handleModalOpen = () => setIsVisible(true);
  const handleModalClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 500); // Delay close for transition
  };

  useEffect(() => {
    if (open) handleModalOpen();
    else handleModalClose();
  }, [open]);

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box component="form" onSubmit={handleSubmit} sx={style(isSmallScreen, isVisible)}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Modifier Employé
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Typography>Nom:</Typography>
            <TextField name="name" placeholder="Nom de l'employé" value={employee.name || ''} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Typography>Prénom:</Typography>
            <TextField name="firstname" placeholder="Prénom de l'employé" value={employee.firstname} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Typography>Date d'entrée:</Typography>
            <TextField
              name="date_entry"
              type="date"
              placeholder="Date d'entrée"
              value={employee.date_entry}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Typography>Unité:</Typography>
            <Select
              value={employee.id_unity || ''}
              onChange={handleUnityChange}
              fullWidth
            >
              {unities.map((unity) => (
                <MenuItem key={unity.id} value={unity.id}>
                  {unity.title}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}
          <Grid item xs={12}>
            <Typography>Poste:</Typography>
            <Select value={employee.id_position || ''} onChange={handlePositionChange} fullWidth>
              {positions.map((position) => (
                <MenuItem key={position.id_position} value={position.id_position}>
                  {position.title}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="success" type="submit" sx={{ mr: 2 }}>
            Sauvegarder
          </Button>
          <Button variant="outlined" color="error" onClick={handleModalClose}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
