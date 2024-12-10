import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, Input, Select, MenuItem, Grid, TextField } from '@mui/material';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';

const style = (isSmallScreen, isVisible) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: isVisible ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)',
  width: isSmallScreen ? '50%' : '40%',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  transition: 'transform 0.5s ease, opacity 0.5s ease',
  opacity: isVisible ? 1 : 0
});

export default function Validate({ requestId, open, onClose }) {
  const {user, messageSuccess } = useStateContext();
  const matricule = user.matricule
  const [validation, setValidation] = useState({
    id_request: requestId,
    delivery_date:'',
    id_validator: matricule
    });
  const [isVisible, setIsVisible] = useState(false);
  const isSmallScreen = window.innerWidth <= 600;

  const handleChange = (e) => {
    setValidation((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axis.put(`/validation/validate/${requestId}`, validation);
      console.log('Requête validée avec succès');
      onClose();
      messageSuccess("La requête a été validé avec succès") // Close the modal after updating
    } catch (err) {
      console.error('Error updating employee:', err);
      console.log("Une erreur s'est produit durant la validation dela requête.");
    }
  };

  const handleModalOpen = () => setIsVisible(true);
  const handleModalClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 500);
  };

  useEffect(() => {
    if (open) handleModalOpen();
    else handleModalClose();
  }, [open]);

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box component="form" onSubmit={handleSubmit} sx={style(isSmallScreen, isVisible)}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Valider la requête
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Typography>Veuillez insérer une date de livraision:</Typography>
            <TextField name="delivery_date" type="date" placeholder="Veuillez insérer une date de livraision" value={validation.delivery_date || ''} onChange={handleChange} fullWidth />
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
