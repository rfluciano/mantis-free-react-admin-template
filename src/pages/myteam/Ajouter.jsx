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

export default function AjouterRessource() {
  const { user } = useStateContext(); // Get user from context
  const [positions, setPositions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [employeeData, setEmployeeData] = useState({
    name: '',
    firstname: '',
    date_entry: '',
    id_position: '',
    isequipped: false,
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchPositions = async () => {
    try {
      const positionResponse = await axis.get('/position');
      setPositions(positionResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPositions();
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
    const value = field === 'isequipped' ? event.target.checked : event.target.value;
    setEmployeeData({ ...employeeData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...employeeData,
        id_superior: user.matricule, // Dynamically set id_superior
      };

      await axis.post('/employee/new', payload);
      console.log('Employé ajouté avec succès');
      handleClose();
    } catch (error) {
      console.error(error);
      console.log('Erreur lors de l\'ajout de l\'employé');
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Ajouter un employé
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Ajouter un employé
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Nom:</Typography>
              <TextField
                fullWidth
                value={employeeData.name}
                onChange={handleChange('name')}
                placeholder="Nom de l'employé"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Prénom:</Typography>
              <TextField
                fullWidth
                value={employeeData.firstname}
                onChange={handleChange('firstname')}
                placeholder="Prénom de l'employé"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Poste:</Typography>
              <Select
                fullWidth
                value={employeeData.id_position || ''}
                onChange={handleChange('id_position')}
              >
                {positions.map((position) => (
                  <MenuItem key={position.id_position} value={position.id_position}>
                    {position.id_position} - {position.title}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography>Date d'embauche:</Typography>
              <TextField
                fullWidth
                type="date"
                value={employeeData.date_entry || ''}
                onChange={handleChange('date_entry')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          {/* Buttons */}
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
