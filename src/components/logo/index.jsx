import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';

// project import
import Logo from './LogoMain';
import config from 'config';
import { useStateContext } from 'contexts/contextProvider';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => {
  const navigate = useNavigate();
  const { user } = useStateContext(); // Retrieve user or role context to determine the layout
  // console.log('User Discriminator:', user?.discriminator);
  
  // Determine basePath for navigation based on user role
  const basePath = user?.discriminator === 'unitychief' ? '/dashboard' : '/admin/dashboard';
  // console.log(basePath);

  return (
    <ButtonBase 
      disableRipple 
      component={Link} 
      to={to || basePath}  // Use the dynamic basePath if 'to' is not provided
      sx={sx}
    >
      <Stack direction="row" spacing={0} alignItems="center">
        <Logo />
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
