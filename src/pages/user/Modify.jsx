import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModifyModal({ open, onClose, id_user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (id_user && open) {
      axios.get(`/api/users/${id_user}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [id_user, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modify-modal-title"
      aria-describedby="modify-modal-description"
    >
      <Box sx={style}>
        <Typography id="modify-modal-title" variant="h6" component="h2">
          Modify User
        </Typography>
        
        {userData ? (
          <>
            <Typography variant="body1">
              Name: {userData.name} {userData.firstname}
            </Typography>
            <Typography variant="body1">
              Position: {userData.position.title}
            </Typography>
            {/* Add more fields as needed */}
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}

        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
}
