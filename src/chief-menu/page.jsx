// assets
import { PullRequestOutlined, TeamOutlined,SendOutlined,MailOutlined } from '@ant-design/icons';

const icons = {
  PullRequestOutlined,
  MailOutlined,
  SendOutlined,
  TeamOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES2 ||============================== //

const pages = {
  id: 'authentication',
  title: 'Employé et requête',
  type: 'group',
  children: [
    {
      id: 'request',
      title: 'Requêtes',
      type: 'item',  // Change to 'collapse' to allow children
      url: '/request',
      icon: icons.PullRequestOutlined,
      breadcrumbs: false,
        children: [
        {
          id: 'received',
          title: 'Requêtes Reçues',
          type: 'item',
          url: '/request/received',
          icon: icons.MailOutlined,
          breadcrumbs: false
        },
        {
          id: 'sent',
          title: 'Requêtes Envoyées',
          type: 'item',
          url: '/request/sent',
          icon: icons.SendOutlined,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'myteam',
      title: 'Mon équipe',
      type: 'item',
      url: '/myteam',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    }
  ]
};

export default pages;
