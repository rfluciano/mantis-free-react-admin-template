// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// Import the image
import logoSpat from './logo-spat.png';

// ==============================|| AUTH BLUR BACKGROUND COMPONENT ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%', // Ensures the image spans the container
        height: '100%', // Ensures the image spans the container
        zIndex: -1,
        bottom: 0,
        left: 0,
        backgroundImage: `url(${logoSpat})`,
        backgroundSize: 'cover', // Ensures the image covers the container
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        filter: 'blur(15px)', // Applies the blur effect
      }}
    />
  );
}
