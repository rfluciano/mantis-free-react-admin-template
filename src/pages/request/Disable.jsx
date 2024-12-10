import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, CircularProgress } from '@mui/material';
import axis from 'axis';
import { useStateContext } from 'contexts/contextProvider';

const style = (isSmallScreen) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isSmallScreen ? '90%' : '40%',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
});

export default function Disable({ requestId, open, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const { messageError, messageSuccess } = useStateContext();
  const isSmallScreen = window.innerWidth <= 600;

  // Fetch request data
  useEffect(() => {
    if (open && requestId) {
      setLoading(true);
      axis
        .get(`/request/${requestId}`)
        .then((response) => {
          const fetchedStatus = response?.data?.validation?.status || '';
          if (fetchedStatus === 'Approved') {
            messageError('Une requête approuvée ne peut être annulée');
            onClose();
          if (fetchedStatus === 'Rejected'){
            messageError('Une requête rejetée ne peut être annulée');
            onClose();
          }
          } else {
            setStatus(fetchedStatus);
            setIsVisible(true); // Open modal only if status is not approved
          }
        })
        .catch((err) => {
          console.error('Error fetching request:', err);
          messageError('Erreur lors de la récupération de la requête.');
          onClose();
        })
        .finally(() => setLoading(false));
    }
  }, [open, requestId, messageError, onClose]);

  const handleDelete = async () => {
    try {
      await axis.delete(`/request/delete/${requestId}`);
      messageSuccess('Requête supprimée avec succès');
      onClose(); // Close modal after deletion
    } catch (err) {
      console.error('Error deleting request:', err);
      messageError('Erreur lors de la suppression de la requête');
    }
  };

  const handleModalClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 500); // Delay close for transition
  };

  return (
    <Modal open={isVisible} onClose={handleModalClose}>
      <Box sx={style(isSmallScreen)}>
        {loading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography>Chargement...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
              Annuler la Requête
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Statut actuel de la requête : <strong>{status || 'Inconnu'}</strong>
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                sx={{ mr: 2 }}
              >
                Supprimer
              </Button>
              <Button variant="outlined" onClick={handleModalClose}>
                Annuler
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
