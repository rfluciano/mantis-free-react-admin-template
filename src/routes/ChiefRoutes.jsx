import { lazy } from 'react';

// Project imports
import Loadable from 'components/Loadable';
import ChiefLayout from 'layout/Chief';
import Employee from 'pages/employee';
import History from 'pages/history';
import Notification from 'pages/notification';
import User from 'pages/user';
import Resource from 'pages/resource';
import Unity from 'pages/unity';
import Position from 'pages/position';
import Profile from 'pages/profile';
import RequestPage from 'pages/request';
import MyTeam from 'pages/myteam';
import ChiefDashboard from 'pages/chiefdashboard';
import MyResources from 'pages/resource/myresources';
import Resources from 'pages/resource';
import AvailableResource from 'pages/resource/AvailableResource';
import Receive from 'pages/request/Receive';
import Sent from 'pages/request/Sent';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// ==============================|| MAIN ROUTING ||============================== //

const ChiefRoutes = {
  path: '/',
  element: <ChiefLayout />,
  children: [
    {
      index: true, // This sets ChiefDashboard as the default for '/'
      element: <ChiefDashboard />
    },
    {
      path: 'myteam',
      element: <MyTeam />
    },
    {
      path: 'dashboard',
      element: <ChiefDashboard />
    },
    {
      path: 'employee',
      element: <Employee />
    },
    {
      path: 'history',
      element: <History />
    },
    {
      path: 'notification',
      element: <Notification />
    },
    {
      path: 'user',
      element: <User />
    },
    {
      path: 'resource',
      element: <Resource />
    },
    {
      path: 'unity',
      element: <Unity />
    },
    {
      path: 'position',
      element: <Position />
    },
    {
      path: 'request',
      element: <RequestPage />
    },
    {
      path: '/request/received',
      element: <Receive />
    },
    {
      path: '/request/sent',
      element: <Sent />
    },
    {
      path: '/resource/myresources',
      element: <MyResources />
    },
    {
      path: '/resource/availableResources',
      element: <AvailableResource />
    },
    {
      path: '/resource',
      element: <Resources />
    },
    {
      path:'/profile',
      element:<Profile/>
    },

  ]
};

export default ChiefRoutes;
