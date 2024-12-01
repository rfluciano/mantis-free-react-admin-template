import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, Grid, TextField } from '@mui/material';
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
  opacity: isVisible ? 1 : 0,
});

export default function ViewRequest({ requestId, open, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [request, setRequest] = useState({
    resourceLabel: '',
    requesterName: '',
    receiverName: '',
    deliveryDate: '',
    status: '',
  });

  const isSmallScreen = window.innerWidth <= 600;

  // Fetch request data by ID
  useEffect(() => {
    if (requestId) {
      const fetchRequest = async () => {
        try {
          const response = await axis.get(`/request/${requestId}`);
          const requestData = response.data || {};
          setRequest({
            resourceLabel: requestData.resource?.label || '',
            requesterName: requestData.requester?.username || '',
            requesterMatricule: requestData.requester?.matricule || '',
            beneficiaryName: requestData.beneficiary?.name || '',
            beneficiaryFisrtname: requestData.beneficiary?.firstname || '',
            beneficiaryMatricule: requestData.beneficiary?.matricule || '',
            receiverName: requestData.receiver?.username || '',
            receiverMatricule: requestData.receiver?.matricule || '',
            deliveryDate: requestData.validation?.delivery_date || '',
            status: requestData.validation?.status || '',

          });
        } catch (error) {
          console.error('Error fetching request data:', error);
        }
      };

      fetchRequest();
    }
  }, [requestId]);

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
      <Box sx={style(isSmallScreen, isVisible)}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Détails de la requête
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Ressource :</Typography>
            <TextField value={request.resourceLabel} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Typography>Soliciteur :</Typography>
            <TextField value={`${request.requesterMatricule} - ${request.requesterName} `  }  fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Typography>Destinataire :</Typography>
            <TextField value={`${request.receiverMatricule} - ${request.receiverName} `  } fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Typography>Bénéficiare :</Typography>
            <TextField value={`${request.beneficiaryMatricule} - ${request.beneficiaryName} - ${request.beneficiaryName} `  } fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Typography>Date de livraison :</Typography>
            <TextField value={request.deliveryDate} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Typography>Status :</Typography>
            <TextField value={request.status} fullWidth disabled />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="error" onClick={handleModalClose}>
            Fermer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
