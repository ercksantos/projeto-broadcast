import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/services/auth.service';
const schema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});
const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await loginUser(data);
            navigate('/conexoes');
        }
        catch {
            setError('E-mail ou senha incorretos.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { className: "min-h-screen flex items-center justify-center bg-gray-100 p-4", children: _jsx(Card, { className: "w-full max-w-md", children: _jsxs(CardContent, { className: "p-8", children: [_jsx(Typography, { variant: "h5", align: "center", gutterBottom: true, children: "\uD83D\uDCE1 Broadcast" }), _jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", className: "mb-6", children: "Entre na sua conta" }), error && (_jsx(Alert, { severity: "error", className: "mb-4", children: error })), _jsxs(Box, { component: "form", onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsx(TextField, { label: "E-mail", type: "email", fullWidth: true, ...register('email'), error: !!errors.email, helperText: errors.email?.message }), _jsx(TextField, { label: "Senha", type: "password", fullWidth: true, ...register('password'), error: !!errors.password, helperText: errors.password?.message }), _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, size: "large", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : null, children: loading ? 'Entrando...' : 'Entrar' })] }), _jsxs(Typography, { variant: "body2", align: "center", className: "mt-4", children: ["N\u00E3o tem conta?", ' ', _jsx(Link, { to: "/cadastro", className: "text-blue-600 hover:underline", children: "Cadastre-se" })] })] }) }) }));
};
export default LoginPage;
