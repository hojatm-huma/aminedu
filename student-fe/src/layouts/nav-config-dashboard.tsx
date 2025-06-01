import SchoolIcon from '@mui/icons-material/School';

// ----------------------------------------------------------------------

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'کلاس‌ها',
    path: '/classes',
    icon: <SchoolIcon />,
  },
];
