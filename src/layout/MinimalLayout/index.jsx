import { useStateContext } from 'contexts/contextProvider';
import { Outlet, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout() {
  const { token, user } = useStateContext(); // Get token from context
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const navigate = useNavigate();
  const discriminator = user ? user.discriminator : null;


  useEffect(() => {
    if (token) {
      if (discriminator =="unitychief") {
        navigate('/')
      }else if (!discriminator){
        navigate('/login');
      }
      if (discriminator =="admin") {
        navigate('/admin')
      }else if (!discriminator){
        navigate('/');
      }
    }

    

    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL, token, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}
