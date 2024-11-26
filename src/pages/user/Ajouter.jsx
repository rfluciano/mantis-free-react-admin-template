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

export default function AjouterUtilisateur() {
  // const [superiors, setSuperiors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    discriminator: 'admin',
    // id_superior: null,
    matricule: '',
    remember_me: false,
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const Fetchdata = async () => {
      try {
        const employee = await axis.get("/employee");
        setEmployees(employee.data.employees)
        // const response = await axis.get('/user/superiors');
        // setSuperiors(response.data.superiors);
      } catch (err) {
        console.error(err);
      }
    };
    Fetchdata();
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
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setUserData({ ...userData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axis.post('/register', userData);
      messageSuccess('Utilisateur créé avec succès');
      handleClose();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Ajouter un Utilisateur
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Ajouter un Utilisateur
          </Typography>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
              <Typography>Nom d'utilisateur:</Typography>
              <TextField
                fullWidth
                value={userData.username}
                onChange={handleChange('username')}
                placeholder="Nom d'utilisateur"
              />
            </Grid>
            {/* Password */}
            <Grid item xs={12}>
              <Typography>Mot de passe:</Typography>
              <TextField
                fullWidth
                type="password"
                value={userData.password}
                onChange={handleChange('password')}
                placeholder="Mot de passe"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Confirmer mot de passe:</Typography>
              <TextField
                fullWidth
                type="password"
                value={userData.password}
                onChange={handleChange('password')}
                placeholder="Confirmer le mot de passe"
              />
            </Grid>
            {/* Discriminator */}
            <Grid item xs={12} sm={6}>
              <Typography>Rôle :</Typography>
              <Select
                fullWidth
                value={userData.discriminator}
                onChange={handleChange('discriminator')}
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="unitychief">Chef d'unité</MenuItem>
              </Select>
            </Grid>
            {/* Matricule */}
            <Grid item xs={12} sm={6}>
              <Typography>Matricule de l'employé:</Typography>
              <Select
                fullWidth
                value={userData.matricule || ''}
                onChange={handleChange('matricule')}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.matricule} value={employee.matricule}>
                    {employee.matricule} - {employee.name} {employee.firstname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {/* Id Superior */}
            {/* <Grid item xs={12} sm={6}>
              <Typography>Supérieur Hiérarchique:</Typography>
              <Select
                fullWidth
                value={userData.id_superior || ''}
                onChange={handleChange('id_superior')}
              >
                <MenuItem value="">Aucun</MenuItem>
                {superiors.map((superior) => (
                  <MenuItem key={superior.matricule} value={superior.matricule}>
                    {superior.matricule} - {superior.name} {superior.firstname}
                  </MenuItem>
                ))}
              </Select>
            </Grid> */}
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
