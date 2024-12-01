import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, Grid, TextField, MenuItem, CircularProgress } from '@mui/material';
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

export default function Modify({ requestId, open, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [request, setRequest] = useState({
    id_request: '',
    id_resource: '',
    id_receiver: '',
    id_beneficiary: '',
    delivery_date: '',
    status: '',
  });

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSmallScreen = window.innerWidth <= 600;

  // Fetch initial data
  useEffect(() => {
    if (requestId) {
      const fetchRequestData = async () => {
        try {
          const [requestResponse, usersResponse, employeesResponse] = await Promise.all([
            axis.get(`/request/${requestId}`),
            axis.get('/users'),
            axis.get('/employee'),
          ]);

          const requestData = requestResponse.data || {};
          setRequest({
            id_request: requestId,
            id_resource: requestData.resource?.matricule || '',
            id_receiver: requestData.receiver?.matricule || '',
            id_beneficiary: requestData.beneficiary?.matricule || '',
            delivery_date: requestData.validation?.delivery_date || '',
            status: requestData.validation?.status || '',
          });

          setUsers(usersResponse.data || []);
          setEmployees(employeesResponse.data || []);
          setResources(requestResponse.data.resources || []); // Ajout des ressources si nécessaire
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRequestData();
    }
  }, [requestId]);

  const handleChange = (field) => (event) => {
    setRequest((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedRequest = {
        id_request: request.id_request,
        id_resource: request.id_resource,
        id_receiver: request.id_receiver,
        id_beneficiary: request.id_beneficiary,
        delivery_date: request.delivery_date,
        status: request.status,
      };
      await axis.put(`/request/update/${requestId}`, updatedRequest);
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error updating request:', error);
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

  if (loading) {
    return (
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={{ ...style(isSmallScreen, true), textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Chargement...</Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style(isSmallScreen, isVisible)}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Modifier la requête
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>ID Ressource :</Typography>
            <TextField
              select
              value={request.id_resource}
              onChange={handleChange('id_resource')}
              fullWidth
            >
              {resources.map((resource) => (
                <MenuItem key={resource.id} value={resource.id}>
                  {resource.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography>Receveur :</Typography>
            <TextField
              select
              value={request.id_receiver}
              onChange={handleChange('id_receiver')}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography>Bénéficiaire :</Typography>
            <TextField
              select
              value={request.id_beneficiary}
              onChange={handleChange('id_beneficiary')}
              fullWidth
            >
              {employees.map((employee) => (
                <MenuItem key={employee.employeeId} value={employee.employeeId}>
                  {`${employee.matricule} - ${employee.name}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography>Date de livraison :</Typography>
            <TextField
              type="date"
              value={request.delivery_date}
              onChange={handleChange('delivery_date')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Statut :</Typography>
            <TextField
              value={request.status}
              onChange={handleChange('status')}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enregistrer
          </Button>
          <Button variant="outlined" color="error" onClick={handleModalClose} sx={{ ml: 2 }}>
            Fermer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
