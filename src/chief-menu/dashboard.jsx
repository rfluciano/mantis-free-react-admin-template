// assets
import DashboardOutlinedIcon from '@mui/icons-material/Dashboard'; 
import {DashboardOutlined as DashboardOutlined2} from '@mui/icons-material';  // ou DashboardOutlinedIcon
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { DashboardOutlined, InboxOutlined, DatabaseOutlined } from '@ant-design/icons';
// icons
const icons = {
  DashboardOutlined2,
  DatabaseOutlined,
  InboxOutlined,
  NotificationsOutlinedIcon,
  DashboardOutlined,
  DashboardOutlinedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Suivis et Ressource',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'resource',
      title: 'Ressources',
      type: 'item',
      // url: '/resource',
      icon: icons.DashboardOutlined2,
      breadcrumbs: false,
      children: [
        {
          id: 'myresources',
          title: 'Mes Ressources',
          type: 'item',
          url: '/resource/myresources',
          icon: icons.InboxOutlined,
          breadcrumbs: false
        }
        ,
        {
          id: 'availableresources',
          title: 'Ressources disponibles',
          type: 'item',
          url: '/resource/availableResources',
          icon: icons.DatabaseOutlined,
          breadcrumbs: false
          
        }
      ]
    },
    {
      id: 'notification',
      title: 'Notifications',
      type: 'item',
      url: '/notification',
      icon: icons.NotificationsOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
