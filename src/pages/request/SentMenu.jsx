import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel'; // Import CancelIcon
import Divider from '@mui/material/Divider';

const ITEM_HEIGHT = 48;

export default function SentMenu({ requestId, onAction }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onAction('view', requestId);
    handleClose();
  };

  const handleModify = () => {
    onAction('modify', requestId);
    handleClose();
  };

  const handleDisable = () => {
    onAction('disable', requestId);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="sent-button"
        aria-controls={open ? 'sent-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="sent-menu"
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
          onClick={handleView}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 255, 0.1)', // Light blue hover
            },
            color: 'black',
          }}
        >
          <VisibilityIcon sx={{ marginRight: 1, width: 18, color: 'darkslategrey' }} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: 'darkgrey',
              height: '60%',
              marginX: 1,
            }}
          />
          Voir info
        </MenuItem>
        <MenuItem
          onClick={handleModify}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)', // Light green hover
            },
            color: 'black',
          }}
        >
          <EditIcon sx={{ marginRight: 1, width: 18, color: 'darkslategrey' }} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: 'darkgrey',
              height: '60%',
              marginX: 1,
            }}
          />
          Modifier
        </MenuItem>
        <MenuItem
          onClick={handleDisable}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red hover
            },
            color: 'black',
          }}
        >
          <CancelIcon sx={{ marginRight: 1, width: 18, color: 'darkslategrey' }} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: 'darkgrey',
              height: '60%',
              marginX: 1,
            }}
          />
          Annuler
        </MenuItem>
      </Menu>
    </div>
  );
}
