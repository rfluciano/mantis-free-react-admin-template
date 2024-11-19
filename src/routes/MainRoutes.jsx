import { lazy, useEffect } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';
import Employee from 'pages/employee';
import History from 'pages/history';
import Notification from 'pages/notification';
import User from 'pages/user';
import Resource from 'pages/resource';
import Unity from 'pages/unity';
import Position from 'pages/position';
import Profile from 'pages/profile';
import RequestPage from 'pages/request';
import { useNavigate } from 'react-router';
import { useStateContext } from 'contexts/contextProvider';
import Recieve from 'pages/request/Receive';
import Sent from 'pages/request/Sent';
import Myresources from 'pages/resource/myresources';
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

const MainRoutes = {
  path: '/admin',
  element: <Dashboard />,
  children: [
    {
      path: '/admin/dashboard',
      element: <DashboardDefault />
    },
    {
      path: '/admin',
      element: <DashboardDefault />
    },
    {
      path: '/admin/employee',
      element: <Employee/>
    },
    {
      path: '/admin/history',
      element: <History/>
    },
    {
      path: '/admin/notification',
      element:<Notification/>
    },
    {
      path:'/admin/user',
      element:<User/>
    },
    {
      path:'/admin/resource',
      element:<Resource/>
    },
    {
      path:'/admin/unity',
      element:<Unity/>
    },
    {
      path:'/admin/position',
      element:<Position/>
    },
    {
      path:'/admin/request',
      element:<RequestPage/>
    },
    {
      path:'/admin/profile',
      element:<Profile/>
    },
    {
      path: '/admin/request/received',
      element: <Recieve />
    },
    {
      path: '/admin/request/sent',
      element: <Sent />
    },
    {
      path: '/admin/resource/myresources',
      element: <Myresources />
    },
    {
      path: '/admin/resource/allresources',
      element: <Resource />
    }
  ]
};

export default MainRoutes;
