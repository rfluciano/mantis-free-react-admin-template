import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { ContextProvider } from 'contexts/contextProvider';
import NotificationProvider from 'NotificationProvider';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
      <NotificationProvider>
        <ContextProvider>
        <RouterProvider router={router} />
        </ContextProvider>
      </NotificationProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
