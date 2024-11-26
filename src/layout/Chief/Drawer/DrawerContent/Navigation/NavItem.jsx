import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui imports
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// project imports
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';

export default function NavItem({ item, level }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem;

  const handleClick = () => {
    if (item.children) {
      setOpen(!open); // Toggle open state only if the item has children
    } else {
      handlerActiveItem(item.id);
    }
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const { pathname } = useLocation();
  const isChildActive = item.children && item.children.some(child => child.url && matchPath({ path: child.url, end: false }, pathname));
  const isSelected = Boolean(
    (item.url && matchPath({ path: item.url, end: true }, pathname)) || 
    (!isChildActive && openItem === item.id)
  );

  // active menu item on page load
  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
  }, [pathname]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        disabled={item.disabled}
        selected={isSelected}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter'
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: `2px solid ${theme.palette.primary.main}`,
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'primary.lighter'
              }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'transparent'
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'transparent'
              },
              bgcolor: 'transparent'
            }
          })
        }}
        component={item.children ? 'div' : forwardRef((props, ref) => (
          <Link ref={ref} {...props} to={item.url} />
        ))}
      >
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter'
                }
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                })
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontSize: level > 1 ? '13px' : 'inherit' }}>
                {item.title}
              </Typography>
            }
          />
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
        {item.children && (
          <ListItemIcon sx={{ minWidth: 28, color: isSelected ? iconSelectedColor : textColor }}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </ListItemIcon>
        )}
      </ListItemButton>

      {item.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((childItem) => (
              <NavItem
                key={childItem.id}
                item={childItem}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.arrayOf(PropTypes.object),
    chip: PropTypes.shape({
      color: PropTypes.string,
      variant: PropTypes.string,
      size: PropTypes.string,
      label: PropTypes.string,
      avatar: PropTypes.string,
    }),
    external: PropTypes.bool,
    target: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  level: PropTypes.number,
};
