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
  Checkbox,
  FormControlLabel,
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
  const { user } = useStateContext();
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ isavailable2, setIsavailable2] = useState(false);

  const [resourceData, setResourceData] = useState({
    id_holder: null,
    id_user_chief: user.matricule,
    label: '',
    discriminator: 'Accès',
    description: '',
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeResponse = await axis.get('/employee');
        setEmployees(employeeResponse.data.employees);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
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
    const value = field === 'isavailable' ? event.target.checked : event.target.value;
    setResourceData({ ...resourceData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axis.post('/resource/new', resourceData);
      console.log('Ressource créée avec succès');
      handleClose();
    } catch (error) {
      console.error(error);
      console.log('Erreur lors de la création de la ressource');
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Ajouter une Ressource
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Ajouter une Ressource
          </Typography>
          <Grid container spacing={2}>
            {/* ID User Chief */}
            <Grid item xs={12} sm={6}>
              <Typography>Responsable (Chef):</Typography>
              <TextField fullWidth value={`${user.matricule} - Moi`} disabled />
            </Grid>
            {/* ID User Holder */}
            <Grid item xs={12} sm={6}>
              <Typography>Bénéficiaire:</Typography>
              <Select
                fullWidth
                value={resourceData.id_holder || ''}
                onChange={handleChange('id_holder')}
              >
                <MenuItem value="">Aucun</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.matricule} value={employee.matricule}>
                    {employee.matricule} - {employee.name} {employee.firstname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {/* Label */}
            <Grid item xs={12}>
              <Typography>Libellé:</Typography>
              <TextField
                fullWidth
                value={resourceData.label}
                onChange={handleChange('label')}
                placeholder="Nom de la ressource"
              />
            </Grid>
            {/* Discriminator */}
            <Grid item xs={12} sm={6}>
              <Typography>Type :</Typography>
              <Select
                fullWidth
                value={resourceData.discriminator}
                onChange={handleChange('discriminator')}
              >
                <MenuItem value="Accès">Accès</MenuItem>
                <MenuItem value="Equipement">Equipement</MenuItem>
              </Select>
            </Grid>
            {/* Is Available */}
            {/* <Grid item xs={12} sm={6}>
            <Typography>Disponible :</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={resourceData.isavailable}
                    onChange={handleChange('isavailable')}
                  />
                }
          
              />
            </Grid> */}
            {/* Description */}
            <Grid item xs={12}>
              <Typography>Description:</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={resourceData.description}
                onChange={handleChange('description')}
                placeholder="Description de la ressource"
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
