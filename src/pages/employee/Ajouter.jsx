import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input, Select, MenuItem } from '@mui/material';
import axis from 'axis';
import { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function Ajouter() {
  const [positions, setPositions] = useState([]);
  const [unities, setUnities] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedUnity, setSelectedUnity] = useState('');
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState({
    name: '',
    firstname: '',
    date_entry: '',
    id_position: '',
    status: "active"
  });

  const getPositions = async (id_unity = null) => {
    try {
      const response = await axis.get(id_unity ? `/unity/getposition/${id_unity}` : '/position');
      setPositions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUnities = async () => {
    try {
      const response = await axis.get("/unity");
      setUnities(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUnities();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePositionChange = (event) => {
    const positionId = event.target.value;
    setSelectedPosition(positionId);
    setEmployee({ ...employee, id_position: positionId });
  };

  const handleUnityChange = (event) => {
    const unityId = event.target.value;
    setSelectedUnity(unityId);
    setEmployee({ ...employee, id_unity: unityId });
    getPositions(unityId); // Filter positions by the selected unity
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const NewEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axis.post("/employee/new", {
        ...employee,
      });
      console.log(response.data);
    } catch (err) {
      messageError(err.response.data);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal open={open} onClose={handleClose}>
        <Box component="form" onSubmit={NewEmployee} sx={style}>
          <Typography variant="h3">Ajouter employé</Typography>

          <Typography sx={{ mt: 2 }}>Nom:</Typography>
          <Input
            name="name"
            placeholder="Nom de l'employé"
            value={employee.name}
            onChange={handleChange}
            fullWidth
          />

          <Typography sx={{ mt: 2 }}>Prénom:</Typography>
          <Input
            name="firstname"
            placeholder="Prénom de l'employé"
            value={employee.firstname}
            onChange={handleChange}
            fullWidth
          />

          <Typography sx={{ mt: 2 }}>Date d'entrée:</Typography>
          <Input
            name="date_entry"
            placeholder="Date d'entrée"
            value={employee.date_entry}
            onChange={handleChange}
            fullWidth
          />

          <Typography sx={{ mt: 2 }}>Unité:</Typography>
          <Select
            value={selectedUnity}
            onChange={handleUnityChange}
            fullWidth
          >
            {unities.map((unity) => (
              <MenuItem key={unity.id} value={unity.id}>
                {unity.title}
              </MenuItem>
            ))}
          </Select>

          <Typography sx={{ mt: 2 }}>Poste:</Typography>
          <Select
            value={selectedPosition}
            onChange={handlePositionChange}
            fullWidth
          >
            {positions.map((position) => (
              <MenuItem key={position.id_position} value={position.id_position}>
                {position.title}
              </MenuItem>
            ))}
          </Select>

          <Button type="submit" sx={{ mt: 3 }} fullWidth>
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
