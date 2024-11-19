import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input, Select, MenuItem } from '@mui/material';
import axis from 'axis';

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

export default function Modify({ employeeId, open, onClose }) {
  const [positions, setPositions] = useState([]);
  const [unities, setUnities] = useState([]);
  const [employee, setEmployee] = useState({
    name: '',
    firstname: '',
    date_entry: '',
    id_position: '',
    isactive: true,
    id_unity: '',
  });

  // Fetch positions by unity
  const getPositions = async (id_unity = null) => {
    try {
      const response = await axis.get(id_unity ? `/unity/getposition/${id_unity}` : '/position');
      setPositions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all unities
  const getUnities = async () => {
    try {
      const response = await axis.get("/unity");
      setUnities(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch employee data by ID
  useEffect(() => {
    if (employeeId) {
      const fetchEmployee = async () => {
        try {
          const response = await axis.get(`/employee/${employeeId}`);
          const employeeData = response.data;
          setEmployee({
            ...employeeData,
            id_position: employeeData.id_position || '',
            id_unity: employeeData.id_unity || '',
          });

          // Load positions for the employee's unity
          if (employeeData.id_unity) {
            await getPositions(employeeData.id_unity);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };
      fetchEmployee();
    }
  }, [employeeId]);

  // Load unities only once when the component mounts
  useEffect(() => {
    getUnities();
  }, []);

  const handlePositionChange = (event) => {
    const positionId = event.target.value;
    setEmployee((prevState) => ({ ...prevState, id_position: positionId }));
  };

  const handleUnityChange = (event) => {
    const unityId = event.target.value;
    setEmployee((prevState) => ({ ...prevState, id_unity: unityId, id_position: '' }));
    getPositions(unityId);
  };

  const handleChange = (e) => {
    setEmployee((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axis.put(`/employee/update/${employee.id_employee}`, employee);
      onClose(); // Close the modal after updating
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit} sx={style}>
        <Typography variant="h3">Modifier employé</Typography>

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
          value={employee.id_unity || ''}
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
          value={employee.id_position || ''}
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
  );
}
