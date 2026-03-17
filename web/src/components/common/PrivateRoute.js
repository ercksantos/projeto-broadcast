import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
const PrivateRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx(Box, { className: "min-h-screen flex items-center justify-center", children: _jsx(CircularProgress, {}) }));
    }
    return user ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login", replace: true });
};
export default PrivateRoute;
