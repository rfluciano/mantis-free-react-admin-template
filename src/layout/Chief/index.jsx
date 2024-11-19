import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'chief-menu';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useStateContext } from '../../contexts/contextProvider'; // Import context

export default function ChiefLayout() {
  const { token, user } = useStateContext(); // Get token from context
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const navigate = useNavigate();
  const discriminator = user ? user.discriminator : null;

  useEffect(() => {
    if (!token) {
      // Redirect to login if no token is found
      navigate('/login');
    }

    if (discriminator =="admin") {
      navigate('/admin')
    }
    else if (!discriminator){
      navigate('/login');
    }

    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL, token, navigate]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        Chief
        <Outlet />
      </Box>
    </Box>
  );
}