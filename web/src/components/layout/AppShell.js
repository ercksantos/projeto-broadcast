import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
const AppShell = () => (_jsx(Box, { children: _jsx(Outlet, {}) }));
export default AppShell;
