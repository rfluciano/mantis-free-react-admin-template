import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../../../contexts/contextProvider'; // Adjust the path to your context

export function handleLogout() {
  const { setUser,logout, setToken } = useStateContext(); // Context hooks
  const navigate = useNavigate(); // Hook used properly

  return () => {
    logout();
    navigate('/login'); // Properly redirect
  };
}
