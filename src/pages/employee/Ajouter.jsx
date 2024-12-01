// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import { Input, Select, MenuItem } from '@mui/material';
// import axis from 'axis';
// import { useEffect, useState } from 'react';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '0px solid #000',
//   borderRadius: '10px',
//   boxShadow: 24,
//   p: 4,
// };

// export default function Ajouter() {
//   const [positions, setPositions] = useState([]);
//   const [unities, setUnities] = useState([]);
//   const [selectedPosition, setSelectedPosition] = useState('');
//   const [selectedUnity, setSelectedUnity] = useState('');
//   const [open, setOpen] = useState(false);
//   const [employee, setEmployee] = useState({
//     name: '',
//     firstname: '',
//     date_entry: '',
//     id_position: '',
//     status: "active"
//   });

//   const getPositions = async (id_unity = null) => {
//     try {
//       const response = await axis.get(id_unity ? `/unity/getposition/${id_unity}` : '/position');
//       setPositions(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getUnities = async () => {
//     try {
//       const response = await axis.get("/unity");
//       setUnities(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     getUnities();
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handlePositionChange = (event) => {
//     const positionId = event.target.value;
//     setSelectedPosition(positionId);
//     setEmployee({ ...employee, id_position: positionId });
//   };

//   const handleUnityChange = (event) => {
//     const unityId = event.target.value;
//     setSelectedUnity(unityId);
//     setEmployee({ ...employee, id_unity: unityId });
//     getPositions(unityId); // Filter positions by the selected unity
//   };

//   const handleChange = (e) => {
//     setEmployee({ ...employee, [e.target.name]: e.target.value });
//   };

//   const NewEmployee = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axis.post("/employee/new", {
//         ...employee,
//       });
//       console.log(response.data);
//     } catch (err) {
//       messageError(err.response.data);
//     }
//   };

//   return (
//     <div>
//       <Button onClick={handleOpen}>Open modal</Button>
//       <Modal open={open} onClose={handleClose}>
//         <Box component="form" onSubmit={NewEmployee} sx={style}>
//           <Typography variant="h3">Ajouter employé</Typography>

//           <Typography sx={{ mt: 2 }}>Nom:</Typography>
//           <Input
//             name="name"
//             placeholder="Nom de l'employé"
//             value={employee.name}
//             onChange={handleChange}
//             fullWidth
//           />

//           <Typography sx={{ mt: 2 }}>Prénom:</Typography>
//           <Input
//             name="firstname"
//             placeholder="Prénom de l'employé"
//             value={employee.firstname}
//             onChange={handleChange}
//             fullWidth
//           />

//           <Typography sx={{ mt: 2 }}>Date d'entrée:</Typography>
//           <Input
//             name="date_entry"
//             placeholder="Date d'entrée"
//             value={employee.date_entry}
//             onChange={handleChange}
//             fullWidth
//           />

//           <Typography sx={{ mt: 2 }}>Unité:</Typography>
//           <Select
//             value={selectedUnity}
//             onChange={handleUnityChange}
//             fullWidth
//           >
//             {unities.map((unity) => (
//               <MenuItem key={unity.id} value={unity.id}>
//                 {unity.title}
//               </MenuItem>
//             ))}
//           </Select>

//           <Typography sx={{ mt: 2 }}>Poste:</Typography>
//           <Select
//             value={selectedPosition}
//             onChange={handlePositionChange}
//             fullWidth
//           >
//             {positions.map((position) => (
//               <MenuItem key={position.id_position} value={position.id_position}>
//                 {position.title}
//               </MenuItem>
//             ))}
//           </Select>

//           <Button type="submit" sx={{ mt: 3 }} fullWidth>
//             Submit
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// }
import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Select,
  MenuItem,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axis from 'axis';
import { useEffect, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useStateContext } from 'contexts/contextProvider';
import { DatePicker } from '@mui/lab';

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

export default function AjouterRessource() {
  const { user } = useStateContext();
  const [positions, setPositions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ isavailable2, setIsavailable2] = useState(false);

  const [employeeData, setEmployeeData] = useState({
    name: '',
    firstname: '',
    date_entry: '',
    id_position: '',
    isequipped: false,
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchPositions = async () => {
    try {
      const positionResponse = await axis.get('/position/available');
      setPositions(positionResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 500);
  };

  const handleChange = (field) => (event) => {
    const value = field === 'isavailable' ? event.target.checked : event.target.value;
    setEmployeeData({ ...employeeData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axis.post('/employee/new', employeeData);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Ajouter un employé
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(isSmallScreen, isVisible)}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Ajouter un employé
          </Typography>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <Typography>Nom:</Typography>
              <TextField
                fullWidth
                value={employeeData.name}
                onChange={handleChange('name')}
                placeholder="Nom de l'employé"
              />
            </Grid>
            <Grid item xs={12} >
              <Typography>Prénom:</Typography>
              <TextField
                fullWidth
                value={employeeData.firstname}
                onChange={handleChange('firstname')}
                placeholder="Prénom de l'employé"
              />
            </Grid>
            <Grid item xs={14}>
              <Typography>Poste:</Typography>
              <Select
                fullWidth
                value={employeeData.id_position || ''}
                onChange={handleChange('id_position')}
              >
                {positions.map((position) => (
                  <MenuItem key={position.id_position} value={position.id_position}>
                    {position.id_position} - {position.title}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography>Date d'embauche:</Typography>
              <TextField
                fullWidth
                type="date" // Sets the input type to date
                value={employeeData.date_entry || ''}
                onChange={handleChange('date_entry')}
                InputLabelProps={{
                  shrink: true, // Ensures the label doesn't overlap with the date picker
                }}
              />
            </Grid>
          </Grid>
          {/* Buttons */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ mr: 2 }}
            >
              Sauvegarder
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Annuler
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
