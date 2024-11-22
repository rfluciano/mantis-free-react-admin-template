import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input, Select } from '@mui/material';
import axis from 'axis';
import { useEffect } from 'react';
import { useState } from 'react';
import { borderRadius } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  borderRadius:'10px',
  boxShadow: 24,
  p: 4,
};

export default function Ajouter() {
  
  const [position, setPosition] = useState({});
  const [unity, setUnity] = useState({});

  const getpositions = async() => {
    try{
      const response = axis.get("/position");
      setPosition(response.data)
      // console.log(position)
    }catch(err){
      console.log(err)
    }
  } 

  const getunity = async() => {
    try{
      const response = axis.get("/position");
      setUnity(response.data)
      // console.log(unity)
    }catch(err){
      console.log(err)
    }
  } 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   getpositions();
  //   getunity();
  // });
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3">
            Ajouter employé
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Nom:
          </Typography>
          <Input placeholder="Nom de l'employé"/>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Prénom:
          </Typography>
          <Input placeholder="Prénom de l'employé"/>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Poste:
          </Typography>
          <Select value={position}/>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Unité:
          </Typography>
          <Select value={position}/>


        </Box>
      </Modal>
    </div>
  );
}
