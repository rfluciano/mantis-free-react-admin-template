import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

export default function AllMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleValidate = () => {
    // Placeholder function for deleting
    console.log("Valider option clicked");
    handleClose();
  };

  const handleReject = () => {
    // Placeholder function for deleting
    console.log("Rejeter option clicked");
    handleClose();
  };

  const handleModify = () => {
    // Placeholder function for modifying
    console.log("Modifier option clicked");
    handleClose();
  };

  const handleDelete = () => {
    // Placeholder function for deleting
    console.log("Supprimer option clicked");
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        <MenuItem
          onClick={handleReject}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 250, 0, 0.1)' // Light red hover
            },
            color: 'black'
          }}
        >
          Valider
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 150, 0, 0.1)' // Light red hover
            },
            color: 'black'
          }}
        >
          Rejeter
        </MenuItem>
        <MenuItem
          onClick={handleModify}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 255, 0.1)' // Light blue hover
            },
            color: 'black'
          }}
        >
          Modifier
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)' // Light red hover
            },
            color: 'black'
          }}
        >
          Supprimer
        </MenuItem>
      </Menu>
    </div>
  );
}