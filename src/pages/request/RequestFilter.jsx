import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem } from '@mui/material';

const statuses = ['En attente', 'Approuvé', 'Rejeté'];

export default function RequestFilter({ open, onClose, onApplyFilters }) {
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onApplyFilters({ status, startDate, endDate });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-filter-title"
      aria-describedby="user-filter-description"
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '10px',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: '300px',
          height: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3,
          position: 'relative',
        }}
      >
        <Typography id="user-filter-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Filtres
        </Typography>
        <TextField
          label="Statut"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date de début"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleApply}>
          Appliquer
        </Button>
      </Box>
    </Modal>
  );
}
