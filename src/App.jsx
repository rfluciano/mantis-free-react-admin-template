import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { ContextProvider } from 'contexts/contextProvider';
import Routes from 'routes/Routes';
import "./echo.js";
// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <ContextProvider>
        <RouterProvider router={router} />
        </ContextProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
