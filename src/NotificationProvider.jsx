import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

// Create a context for notifications
const NotificationContext = createContext();

// Provide the context
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('e4d3c6e50ccac1b2b8f0', {
      cluster: 'mt1',
    });

    // Subscribe to the channel
    const channel = pusher.subscribe('my-channel');

    // Listen for events and update the state
    channel.bind('my-event', (data) => {
      console.log('Received event data:', data);
      setNotification(data); // Update the notification state
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
