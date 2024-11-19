import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse'; // For collapse effect

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    if (menuItem.type === 'collapse' && menuItem.children) {
      // Render a collapse menu for items with children
      return (
        <Box key={menuItem.id}>
          <NavItem item={menuItem} level={1} /> {/* Render main item */}
          <Collapse in={drawerOpen} timeout="auto" unmountOnExit> {/* Toggle visibility */}
            <List component="div" disablePadding>
              {menuItem.children.map((childItem) => (
                <NavItem key={childItem.id} item={childItem} level={2} />
              ))}
            </List>
          </Collapse>
        </Box>
      );
    } else if (menuItem.type === 'item') {
      // Render a regular menu item
      return <NavItem key={menuItem.id} item={menuItem} level={1} />;
    } else {
      // Fallback in case of an unrecognized type
      return (
        <Typography key={menuItem.id} variant="h6" color="error" align="center">
          Fix - Group Collapse or Items
        </Typography>
      );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = {
  item: PropTypes.object.isRequired,
};
