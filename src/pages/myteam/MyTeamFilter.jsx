import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

export default function MyTeamFilter({ open, onClose }) {
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
        zIndex: 1300, // Ensure it appears above other elements
      }}
    >
      <Box
        sx={{
          width: '300px',
          height: '500px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3,
          position: 'relative',
          animation: 'slideIn 0.4s ease-out',
          '@keyframes slideIn': {
            '0%': {
              transform: 'translateY(-50%) translateX(100%)',
              opacity: 0,
            },
            '100%': {
              transform: 'translateY(0) translateX(0)',
              opacity: 1,
            },
          },
        }}
      >
        <Typography id="user-filter-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Filtres
        </Typography>
        {/* Add your filter options here */}
        <Typography id="user-filter-description" variant="body2" sx={{ mb: 3 }}>
          Placeholder for filter options.
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={onClose}>
          Appliquer
        </Button>
      </Box>
    </Modal>
  );
}
