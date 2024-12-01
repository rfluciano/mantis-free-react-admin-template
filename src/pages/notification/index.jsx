import React, { useEffect, useState, useRef } from 'react';
import axis from 'axis';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Badge,
  Paper,
  Button,
} from '@mui/material';
import { useStateContext } from 'contexts/contextProvider';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import useNotification from 'antd/es/notification/useNotification';

export default function Notification() {
  const { user, messageSuccess } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const containerRef = useRef(null);
  const notification = useNotification();
  useEffect(() => {
    if (notification?.model === 'Request' ||
       notification?.model === 'Validation' ||
         notification?.model === 'Employee') {
      switch (notification.action) {
        case 'created':
        case 'modified':
        case 'deleted':
        case 'rejected':
        case 'aborted':
        case 'validated':
          fetchNotifications();  // Call without the searchTerm to see all users
          break;
        default:
          console.warn('Unhandled action:', notification.action);
      }
    }
  }, [notification]);

  const fetchNotifications = async () => {
    try {
      const response = await axis.get(`/notifications/${user.matricule}`);
      const sortedNotifications = response.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      // Group notifications by date
      const grouped = sortedNotifications.reduce((acc, notification) => {
        const date = new Date(notification.created_at).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(notification);
        return acc;
      }, {});
      setNotifications(sortedNotifications);
      setGroupedNotifications(grouped);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      messageSuccess('Error fetching notifications', 'error');
    }
  };


  

  // Fetch notifications
  useEffect(() => {
    

    fetchNotifications();
  }, [user.matricule, messageSuccess]);

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axis.put(`/notifications/mark-all-as-read`, { matricule: user.matricule });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      messageSuccess('All notifications marked as read', 'success');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      messageSuccess('Error marking notifications as read', 'error');
    }
  };

  // Helper to format the date
  const formatDate = (date) => {
    const today = new Date().toLocaleDateString();
    return date === today ? "Aujourd'hui" : date;
  };

  // Helper to format the time
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Notifications</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Badge badgeContent={notifications.filter((n) => !n.is_read).length} color="primary">
            <BellOutlined />
          </Badge> */}
          <Button
            startIcon={<CheckCircleOutlined />}
            variant="contained"
            color="success"
            onClick={markAllAsRead}
            sx={{ ml: 2 }}
          >
            Marquer tout comme lu
          </Button>
        </Box>
      </Box>

      {/* Notifications List */}
      <Paper
        ref={containerRef}
        sx={{
          height:"81vh",
          maxHeight: '81vh',
          overflowY: 'auto',
          p: 2,
          borderRadius: 2,
          
          boxShadow: '1 1 1 1',
        }}
      >
<List>
  {Object.entries(groupedNotifications)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, notifications]) => (
      <Box key={`group-${date}`} sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          ------------------ {formatDate(date)} ------------------
        </Typography>

        {notifications.map((notification, index) => (
          <React.Fragment key={`${notification.id}-${index}`}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: notification.is_read ? 'grey.100' : 'primary.lighter',
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>📧</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.message}
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    {formatTime(notification.created_at)} -{' '}
                    <span style={{ color: notification.is_read ? 'green' : 'red' }}>
                      {notification.is_read ? 'Lu' : 'Non lu'}
                    </span>
                  </Typography>
                }
              />
            </ListItem>
            <Divider key={`divider-${notification.id}`} variant="inset" component="li" />
          </React.Fragment>
        ))}
      </Box>
    ))}
</List>

      </Paper>
    </Box>
  );
}
