import { useRef, useState, useEffect } from 'react';
import axis from 'axis';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { useNavigate } from 'react-router';
import { useStateContext } from 'contexts/contextProvider';

// Styles
const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
const actionSX = { mt: '6px', ml: 1, alignSelf: 'flex-start', transform: 'none' };

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user } = useStateContext();
  const basePath = user?.discriminator === 'unitychief' ? '' : '/admin';

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axis.get(`/notifications/${user.matricule}`);
        const sortedNotifications = response.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6); // Keep only the 6 most recent notifications
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [user.matricule]);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const Basy = () => {
    navigate(`${basePath}/notification`).then(handleClose)
    
  }

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notifications.filter((n) => !n.is_read).length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    notifications.some((n) => !n.is_read) && (
                      <Tooltip title="Mark all as read">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={async () => {
                            await axis.put('/notifications/mark-all-as-read');
                            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                          }}
                        >
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&:hover': { bgcolor: 'grey.100' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': actionSX,
                      },
                    }}
                  >
                    {notifications.map((notification) => (
                      <Box key={notification.id}>
                        <ListItemButton
                         onClick={() => navigate(`${basePath}/notification/${notification.id}`)}
                         >
                          <ListItemAvatar>
                            <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                              📧 {/* Default Icon for Notifications */}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                {notification.message}
                              </Typography>
                            }
                            secondary={
                              new Date(notification.created_at).toLocaleDateString() ===
                              new Date().toLocaleDateString()
                                ? "Aujourd'hui"
                                : new Date(notification.created_at).toLocaleDateString()
                            }
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                              {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                      </Box>
                    ))}
                    <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }} onClick={() => Basy()}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            Voir tous
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
