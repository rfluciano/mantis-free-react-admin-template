import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input, Select, MenuItem } from '@mui/material';
import axis from 'axis';
import { useEffect, useState } from 'react';
import { useStateContext } from 'contexts/contextProvider';

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
  const [position, setPosition] = useState([]);
  const [unity, setUnity] = useState([]);
  const {messageError, messageSuccess} = useStateContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
    discriminator: "unitychief",
    id_superior: null,
    matricule: "",
    remember_me: false
  });

  const getPositions = async () => {
    try {
      const response = await axis.get("/position");
      setPosition(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUnity = async () => {
    try {
      const response = await axis.get("/unity"); // corrected endpoint if it should be unity
      setUnity(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { displayErrors} = useStateContext();

  useEffect(() => {
    getPositions();
    getUnity();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const NewUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axis.post("/register", user);
      messageSuccess("User created successfully!");
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data) {
        displayErrors(err.response.data);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>Créer un utilisateur</button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h5" component="h2">
            Créer un utilisateur
          </Typography>

          <Typography sx={{ mt: 2 }}>Email:</Typography>
          <Input
            placeholder="Adresse email de l'utilisateur"
            type='email'
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
          />

          <Typography sx={{ mt: 2 }}>Matricule:</Typography>
          <Input
            placeholder="Matricule de l'employé"
            name="matricule"
            value={user.matricule}
            onChange={handleChange}
            fullWidth
          />

          <Typography sx={{ mt: 2 }}>Privilège:</Typography>
          <Select
            name="discriminator"
            value={user.discriminator}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="unitychief">Chef d'unité</MenuItem>
            <MenuItem value="admin">Administrateur</MenuItem>
          </Select>

          <Typography sx={{ mt: 2 }}>Mot de passe:</Typography>
          <Input
            placeholder="********"
            type='password'
            name="password"
            value={user.password}
            onChange={handleChange}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={NewUser}
          >
            Créer un utilisateur
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
