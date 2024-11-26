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

export default function AjouterUnity() {
  const { user, messageSuccess, messageError } = useStateContext();
  const [unity, setUnity] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [unityData, setunityData] = useState({
    id_parent: null,
    type: '',
    title: '',

  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unityResponse = await axis.get('/unity');
        setUnity(unityResponse.data);
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
    setunityData({ ...unityData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Send the unityData in the POST request
      const response = await axis.post('/unity/new', unityData);
      
      if (response.status === 201) {
        messageSuccess('Unité créée avec succès');
        handleClose();
      } else {
        messageError("Erreur inattendue lors de la création de l'unité");
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error during unit creation:', error);
  
      // Provide better feedback on errors
      if (error.response && error.response.data) {
        messageError(
          error.response.data.message ||
            "Erreur lors de la création de l'unité"
        );
      } else {
        messageError("Erreur réseau ou problème inattendu");
      }
    }
  };
  

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Créer une unité
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Créer une unité
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Titre de l'unité:</Typography>
              <TextField
               fullWidth
               value={unityData.title}
               onChange={handleChange('title')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Type de l'unité:</Typography>
              <Select
                fullWidth
                value={unityData.type}
                onChange={handleChange('type')}
              >
                <MenuItem value={"Direction"}>Direction</MenuItem>
                <MenuItem value={"Département"}>Département</MenuItem>
                <MenuItem value={"Service"}>Service</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Unité Parent:</Typography>
              <Select
                fullWidth
                value={unityData.id_parent}
                onChange={handleChange('id_parent')}
              >
                <MenuItem value={null}>Aucune</MenuItem>
                {unity.map((unity) => (
                  <MenuItem key={unity.id_unity} value={unity.id_unity}>
                    {unity.id_unity} - {unity.type} {unity.title}
                  </MenuItem>
                ))}
              </Select>
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
