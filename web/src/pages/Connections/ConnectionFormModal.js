import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createConnection, updateConnection } from '@/services/connections.service';
import { useNotify } from '@/hooks/useNotify';
const schema = z.object({
    name: z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
});
const ConnectionFormModal = ({ open, connection, clientId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const isEditing = !!connection;
    const { notifySuccess, notifyError } = useNotify();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        reset({ name: connection?.name ?? '' });
    }, [connection, reset]);
    const onSubmit = async ({ name }) => {
        setLoading(true);
        try {
            if (isEditing) {
                await updateConnection(connection.id, name);
                notifySuccess('Conexão atualizada com sucesso!');
            }
            else {
                await createConnection(clientId, name);
                notifySuccess('Conexão criada com sucesso!');
            }
            onClose();
        }
        catch {
            notifyError('Erro ao salvar conexão. Tente novamente.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "xs", fullWidth: true, children: [_jsx(DialogTitle, { children: isEditing ? 'Editar Conexão' : 'Nova Conexão' }), _jsx(DialogContent, { children: _jsx(TextField, { label: "Nome", fullWidth: true, autoFocus: true, margin: "dense", ...register('name'), error: !!errors.name, helperText: errors.name?.message }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: loading, children: "Cancelar" }), _jsx(Button, { variant: "contained", onClick: handleSubmit(onSubmit), disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : null, children: loading ? 'Salvando...' : 'Salvar' })] })] }));
};
export default ConnectionFormModal;
