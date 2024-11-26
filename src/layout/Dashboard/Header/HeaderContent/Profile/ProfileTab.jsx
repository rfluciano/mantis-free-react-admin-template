import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from 'contexts/contextProvider';

// Material-UI components
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Icons
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import { UnorderedListOutlined } from '@ant-design/icons';

export default function ProfileTab({ handleClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useStateContext(); // Retrieve user context

  // Determine basePath for navigation based on user role
  const basePath = user?.discriminator === 'unitychief' ? '' : '/admin';

 // Retrieve context

  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    if (path) {
      navigate(path);
    }
    if (handleClose) {
      handleClose(event); // Close the Popper
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0, `${basePath}/profile/edit`)}
      >
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Modifier profil" />
      </ListItemButton>

      <ListItemButton
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1, `${basePath}/profile`)}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Voir profil" />
      </ListItemButton>

      <ListItemButton
        selected={selectedIndex === 2}
        onClick={(event) => handleListItemClick(event, 2, `${basePath}/history`)}
      >
        <ListItemIcon>
          <UnorderedListOutlined />
        </ListItemIcon>
        <ListItemText primary="Historique" />
      </ListItemButton>

      <ListItemButton
        selected={selectedIndex === 3}
        onClick={(event) => {
          logout();
          handleClose(event); // Close the Popper after logging out
        }}
      >
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Se déconnecter" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleClose: PropTypes.func.isRequired,
};
