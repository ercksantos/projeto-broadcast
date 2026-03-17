import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createContact, updateContact } from '@/services/contacts.service';
import { useNotify } from '@/hooks/useNotify';
const schema = z.object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    phone: z.string().min(1, 'Telefone obrigatório'),
});
const ContactFormModal = ({ open, contact, clientId, connectionId, onClose, }) => {
    const [loading, setLoading] = useState(false);
    const isEditing = !!contact;
    const { notifySuccess, notifyError } = useNotify();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        reset({ name: contact?.name ?? '', phone: contact?.phone ?? '' });
    }, [contact, reset]);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditing) {
                await updateContact(contact.id, data);
                notifySuccess('Contato atualizado com sucesso!');
            }
            else {
                await createContact(clientId, connectionId, data);
                notifySuccess('Contato criado com sucesso!');
            }
            onClose();
        }
        catch {
            notifyError('Erro ao salvar contato. Tente novamente.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "xs", fullWidth: true, children: [_jsx(DialogTitle, { children: isEditing ? 'Editar Contato' : 'Novo Contato' }), _jsxs(DialogContent, { className: "flex flex-col gap-2", children: [_jsx(TextField, { label: "Nome", fullWidth: true, autoFocus: true, margin: "dense", ...register('name'), error: !!errors.name, helperText: errors.name?.message }), _jsx(TextField, { label: "Telefone", fullWidth: true, margin: "dense", ...register('phone'), error: !!errors.phone, helperText: errors.phone?.message })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: loading, children: "Cancelar" }), _jsx(Button, { variant: "contained", onClick: handleSubmit(onSubmit), disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : null, children: loading ? 'Salvando...' : 'Salvar' })] })] }));
};
export default ContactFormModal;
