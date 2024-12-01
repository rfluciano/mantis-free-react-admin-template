import axis from 'axis';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Create a context
const AuthContext = createContext();

// Create a provider component
export const ContextProvider = ({ children }) => {
  // Initialize user and token with values from localStorage, if available
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const messageSuccess = (msg) => {
    toast.success(msg, { style: { backgroundColor: 'green', color: 'white' } });
  };

  const messageError = (msg) => {
    toast.error(msg, { style: { backgroundColor: 'red', color: 'white' } });
  };

  const messageDanger = (msg) => {
    toast(msg, { style: { backgroundColor: 'orange', color: 'white' } });
  };

  const displayErrors = (errors) => {
    Object.keys(errors).forEach((key) => {
      errors[key].forEach((error) => messageError(error));
    });
  };

  const logout = async () => {
    try {
      const response = await axis.post('/logout', { // Update to backend URL
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach the token
        },
      });
  
      if (response.ok) {
        setUser(null); // Clear user state
        setToken(null); // Clear token state
        messageSuccess('You have been logged out successfully!');
      } else {
        const data = await response.json();
        messageError(data.message || 'Failed to log out. Please try again.');
      }
    } catch (error) {
      messageError('An error occurred during logout. Please try again.');
    }
  };
  
  
  // Update localStorage whenever user or token changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [user, token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        messageSuccess,
        messageDanger,
        messageError,
        displayErrors,
      }}
    >
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the Auth context
export const useStateContext = () => {
  return useContext(AuthContext);
};
