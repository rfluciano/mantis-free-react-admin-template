import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../../../contexts/contextProvider'; // Adjust the path to your context

export function handleLogout() {
  const { setUser, setToken } = useStateContext(); // Context hooks
  const navigate = useNavigate(); // Hook used properly

  return () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Properly redirect
  };
}
