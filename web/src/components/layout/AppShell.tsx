import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import { Hub, Contacts, Send, Menu, Logout } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/services/auth.service';
import { useMessageDispatcher } from '@/hooks/useMessageDispatcher';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Conexões', path: '/conexoes', icon: <Hub /> },
  { label: 'Contatos', path: '/contatos', icon: <Contacts /> },
  { label: 'Mensagens', path: '/mensagens', icon: <Send /> },
] as const;

const AppShell = (): JSX.Element => {
  useMessageDispatcher(); // dispatcher roda enquanto o usuário está logado

  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logoutUser();
    navigate('/login');
  };

  const drawerContent = (
    <Box className="flex flex-col h-full">
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          📡 Broadcast
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1 }}>
        {NAV_ITEMS.map(({ label, path, icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => {
                navigate(path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box className="flex items-center justify-between px-2 py-1">
        <Typography variant="caption" noWrap sx={{ maxWidth: 160 }}>
          {user?.displayName || user?.email}
        </Typography>
        <Tooltip title="Sair">
          <IconButton size="small" onClick={handleLogout}>
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box className="flex">
      <AppBar position="fixed" sx={{ display: { sm: 'none' }, zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)}>
            <Menu />
          </IconButton>
          <Typography variant="h6">📡 Broadcast</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: 8, sm: 0 },
          ml: { sm: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
