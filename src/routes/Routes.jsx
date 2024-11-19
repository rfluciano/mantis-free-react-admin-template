import { lazy } from 'react';
import { Route, Navigate, Routes as RouterRoutes } from 'react-router-dom';

// Project imports
import Loadable from 'components/Loadable';
import ChiefLayout from 'layout/Chief';
import Dashboard from 'layout/Dashboard';
import MinimalLayout from 'layout/MinimalLayout';
import { useStateContext } from 'contexts/contextProvider';
import Login from 'pages/authentication/login';
import Register from 'pages/authentication/register';

// Lazy load pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const Employee = Loadable(lazy(() => import('pages/employee')));
const History = Loadable(lazy(() => import('pages/history')));
const Notification = Loadable(lazy(() => import('pages/notification')));
const User = Loadable(lazy(() => import('pages/user')));
const Resource = Loadable(lazy(() => import('pages/resource')));
const Unity = Loadable(lazy(() => import('pages/unity')));
const Position = Loadable(lazy(() => import('pages/position')));
const Profile = Loadable(lazy(() => import('pages/profile')));
const RequestPage = Loadable(lazy(() => import('pages/request')));

// Role-based route component with layout selection
const RoleBasedRoute = ({ element }) => {
  const { user } = useStateContext();
  const discriminator = user?.discriminator;

  if (!discriminator) return <Navigate to="/login" />;

  const Layout = discriminator === 'chiefunity' ? ChiefLayout
    : discriminator === 'admin' ? Dashboard
    : MinimalLayout;

  return <Layout>{element}</Layout>;
};

// Main routing setup without '/admin' or '/chief' prefixes
const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with role-based layouts */}
      <Route
        path="/dashboard"
        element={<RoleBasedRoute element={<DashboardDefault />} />}
      />
      <Route
        path="/employee"
        element={<RoleBasedRoute element={<Employee />} />}
      />
      <Route
        path="/history"
        element={<RoleBasedRoute element={<History />} />}
      />
      <Route
        path="/notification"
        element={<RoleBasedRoute element={<Notification />} />}
      />
      <Route
        path="/user"
        element={<RoleBasedRoute element={<User />} />}
      />
      <Route
        path="/resource"
        element={<RoleBasedRoute element={<Resource />} />}
      />
      <Route
        path="/unity"
        element={<RoleBasedRoute element={<Unity />} />}
      />
      <Route
        path="/position"
        element={<RoleBasedRoute element={<Position />} />}
      />
      <Route
        path="/request"
        element={<RoleBasedRoute element={<RequestPage />} />}
      />
      <Route
        path="/profile"
        element={<RoleBasedRoute element={<Profile />} />}
      />
    </RouterRoutes>
  );
};

export default Routes;
