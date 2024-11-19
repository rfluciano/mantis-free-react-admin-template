import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../../../contexts/contextProvider'; // Adjust the path to your context

// Function that handles the logout logic
export function handleLogout() {
  const { setUser, setToken } = useStateContext(); // Access context methods
  const navigate = useNavigate();

  // Actual logout process
  return () => {
    // Clear token and user from context (or any other local storage/session storage)
    setToken(null);
    setUser(null);

    // Optionally clear localStorage or sessionStorage if used
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the login page
    navigate('/login');
  };
}

