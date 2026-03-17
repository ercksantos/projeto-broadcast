import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '@/services/auth.service';
const schema = z
    .object({
    displayName: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});
const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await registerUser(data);
            navigate('/conexoes');
        }
        catch {
            setError('Não foi possível criar a conta. Tente outro e-mail.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { className: "min-h-screen flex items-center justify-center bg-gray-100 p-4", children: _jsx(Card, { className: "w-full max-w-md", children: _jsxs(CardContent, { className: "p-8", children: [_jsx(Typography, { variant: "h5", align: "center", gutterBottom: true, children: "\uD83D\uDCE1 Broadcast" }), _jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", className: "mb-6", children: "Crie sua conta" }), error && (_jsx(Alert, { severity: "error", className: "mb-4", children: error })), _jsxs(Box, { component: "form", onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsx(TextField, { label: "Nome completo", fullWidth: true, ...register('displayName'), error: !!errors.displayName, helperText: errors.displayName?.message }), _jsx(TextField, { label: "E-mail", type: "email", fullWidth: true, ...register('email'), error: !!errors.email, helperText: errors.email?.message }), _jsx(TextField, { label: "Senha", type: "password", fullWidth: true, ...register('password'), error: !!errors.password, helperText: errors.password?.message }), _jsx(TextField, { label: "Confirmar senha", type: "password", fullWidth: true, ...register('confirmPassword'), error: !!errors.confirmPassword, helperText: errors.confirmPassword?.message }), _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, size: "large", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : null, children: loading ? 'Criando conta...' : 'Criar conta' })] }), _jsxs(Typography, { variant: "body2", align: "center", className: "mt-4", children: ["J\u00E1 tem conta?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "Entrar" })] })] }) }) }));
};
export default RegisterPage;
