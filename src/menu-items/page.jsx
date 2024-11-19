// assets
import { LoginOutlined, ProfileOutlined, PullRequestOutlined,MailOutlined,SendOutlined, UserOutlined, ClusterOutlined, DesktopOutlined } from '@ant-design/icons';  
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DashboardOutlinedIcon from '@mui/icons-material/Dashboard';  // ou DashboardOutlinedIcon
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTree';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const icons = {
  MailOutlined,
  SendOutlined,
  BusinessCenterIcon,
  ClusterOutlined,
  DashboardOutlinedIcon,
  WorkOutlineIcon,
  PullRequestOutlined,
  UserOutlined,
  LoginOutlined,
  ProfileOutlined,
  DesktopOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Employé et requête',
  type: 'group',
  children: [
    {
      id: 'request',
      title: 'Requêtes',
      type: 'item',
        url: '/admin/request',
      icon: icons.PullRequestOutlined,
      target: false,
      breadcrumbs: false,
      // children: [
      //   {
      //     id: 'received',
      //     title: 'Requêtes Reçues',
      //     type: 'item',
      //     url: '/admin/request/received',
      //     icon: icons.MailOutlined,
      //     breadcrumbs: false
      //   },
      //   {
      //     id: 'sent',
      //     title: 'Requêtes Envoyées',
      //     type: 'item',
      //     url: '/admin/request/sent',
      //     icon: icons.SendOutlined,
      //     breadcrumbs: false
      //   }
      // ]
    },
    {
      id: 'user',
      title: 'Utilisateurs',
      type: 'item',
      url: '/admin/user',
      icon: icons.UserOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'employee',
      title: 'Employés',
      type: 'item',
      url: '/admin/employee',
      icon: icons.WorkOutlineIcon,
      target: false,
      breadcrumbs: false

    },
    {
      id: 'unity',
      title: 'Unités',
      type: 'item',
      url: '/admin/unity',
      icon: icons.ClusterOutlined,
      target: false,
      breadcrumbs: false

    },
    {
      id: 'position',
      title: 'Postes',
      type: 'item',
      url: '/admin/position',
      icon: icons.DesktopOutlined,
      target: false,
      breadcrumbs: false

    }
  ]
};

export default pages;
