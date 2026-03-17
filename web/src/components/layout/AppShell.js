import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Tooltip, Divider, } from '@mui/material';
import { Hub, Contacts, Send, Menu, Logout } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/services/auth.service';
import { useMessageDispatcher } from '@/hooks/useMessageDispatcher';
const DRAWER_WIDTH = 240;
const NAV_ITEMS = [
    { label: 'Conexões', path: '/conexoes', icon: _jsx(Hub, {}) },
    { label: 'Contatos', path: '/contatos', icon: _jsx(Contacts, {}) },
    { label: 'Mensagens', path: '/mensagens', icon: _jsx(Send, {}) },
];
const AppShell = () => {
    useMessageDispatcher(); // dispatcher roda enquanto o usuário está logado
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };
    const drawerContent = (_jsxs(Box, { className: "flex flex-col h-full", children: [_jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", fontWeight: 700, children: "\uD83D\uDCE1 Broadcast" }) }), _jsx(Divider, {}), _jsx(List, { sx: { flex: 1 }, children: NAV_ITEMS.map(({ label, path, icon }) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { selected: location.pathname === path, onClick: () => {
                            navigate(path);
                            setMobileOpen(false);
                        }, children: [_jsx(ListItemIcon, { children: icon }), _jsx(ListItemText, { primary: label })] }) }, path))) }), _jsx(Divider, {}), _jsxs(Box, { className: "flex items-center justify-between px-2 py-1", children: [_jsx(Typography, { variant: "caption", noWrap: true, sx: { maxWidth: 160 }, children: user?.displayName || user?.email }), _jsx(Tooltip, { title: "Sair", children: _jsx(IconButton, { size: "small", onClick: handleLogout, children: _jsx(Logout, { fontSize: "small" }) }) })] })] }));
    return (_jsxs(Box, { className: "flex", children: [_jsx(AppBar, { position: "fixed", sx: { display: { sm: 'none' }, zIndex: (t) => t.zIndex.drawer + 1 }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", edge: "start", onClick: () => setMobileOpen(true), children: _jsx(Menu, {}) }), _jsx(Typography, { variant: "h6", children: "\uD83D\uDCE1 Broadcast" })] }) }), _jsx(Drawer, { variant: "permanent", sx: {
                    display: { xs: 'none', sm: 'block' },
                    width: DRAWER_WIDTH,
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                }, open: true, children: drawerContent }), _jsx(Drawer, { variant: "temporary", open: mobileOpen, onClose: () => setMobileOpen(false), sx: {
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
                }, children: drawerContent }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    mt: { xs: 8, sm: 0 },
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }, children: _jsx(Outlet, {}) })] }));
};
export default AppShell;
