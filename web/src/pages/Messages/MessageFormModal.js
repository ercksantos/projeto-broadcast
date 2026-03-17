import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Autocomplete, Box, } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { createMessage, updateMessage } from '@/services/messages.service';
import { useConnections } from '@/hooks/useConnections';
import { useContacts } from '@/hooks/useContacts';
import { useNotify } from '@/hooks/useNotify';
import { useAuth } from '@/contexts/AuthContext';
const schema = z.object({
    connectionId: z.string().min(1, 'Selecione uma conexão'),
    contactIds: z.array(z.string()).min(1, 'Selecione pelo menos um contato'),
    content: z.string().min(1, 'Conteúdo obrigatório'),
    scheduledAt: z.custom((val) => val != null && dayjs.isDayjs(val) && val.isValid(), {
        message: 'Data obrigatória',
    }),
});
const MessageFormModal = ({ open, message, defaultConnectionId, onClose }) => {
    const { user } = useAuth();
    const { connections } = useConnections();
    const { notifySuccess, notifyError } = useNotify();
    const [loading, setLoading] = useState(false);
    const isEditing = !!message;
    const { register, handleSubmit, reset, watch, control, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { connectionId: '', contactIds: [], content: '', scheduledAt: undefined },
    });
    const selectedConnectionId = watch('connectionId');
    const { contacts } = useContacts(selectedConnectionId);
    useEffect(() => {
        if (message) {
            reset({
                connectionId: message.connectionId,
                contactIds: message.contactIds,
                content: message.content,
                scheduledAt: dayjs(message.scheduledAt.toDate()),
            });
        }
        else {
            reset({
                connectionId: defaultConnectionId ?? '',
                contactIds: [],
                content: '',
                scheduledAt: undefined,
            });
        }
    }, [message, defaultConnectionId, reset]);
    const onSubmit = async (data) => {
        if (!data.scheduledAt)
            return;
        setLoading(true);
        try {
            const payload = {
                connectionId: data.connectionId,
                contactIds: data.contactIds,
                content: data.content,
                scheduledAt: data.scheduledAt.toDate(),
            };
            if (isEditing) {
                await updateMessage(message.id, {
                    contactIds: payload.contactIds,
                    content: payload.content,
                    scheduledAt: payload.scheduledAt,
                });
                notifySuccess('Mensagem atualizada com sucesso!');
            }
            else {
                await createMessage(user.uid, payload);
                notifySuccess('Mensagem criada com sucesso!');
            }
            onClose();
        }
        catch {
            notifyError('Erro ao salvar mensagem. Tente novamente.');
        }
        finally {
            setLoading(false);
        }
    };
    const contactOptions = contacts.map((c) => ({ id: c.id, label: `${c.name} — ${c.phone}` }));
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: isEditing ? 'Editar Mensagem' : 'Nova Mensagem' }), _jsx(DialogContent, { children: _jsxs(Box, { className: "flex flex-col gap-4 pt-1", children: [_jsxs(FormControl, { fullWidth: true, error: !!errors.connectionId, disabled: isEditing, children: [_jsx(InputLabel, { children: "Conex\u00E3o" }), _jsx(Controller, { name: "connectionId", control: control, render: ({ field }) => (_jsx(Select, { ...field, label: "Conex\u00E3o", children: connections.map((c) => (_jsx(MenuItem, { value: c.id, children: c.name }, c.id))) })) }), errors.connectionId && (_jsx(Box, { component: "span", sx: { color: 'error.main', fontSize: '0.75rem', mt: 0.5 }, children: errors.connectionId.message }))] }), _jsx(Controller, { name: "contactIds", control: control, render: ({ field }) => (_jsx(Autocomplete, { multiple: true, options: contactOptions, getOptionLabel: (o) => o.label, isOptionEqualToValue: (o, v) => o.id === v.id, value: contactOptions.filter((o) => field.value.includes(o.id)), onChange: (_, selected) => field.onChange(selected.map((s) => s.id)), disabled: !selectedConnectionId, renderInput: (params) => (_jsx(TextField, { ...params, label: "Contatos", error: !!errors.contactIds, helperText: errors.contactIds?.message })) })) }), _jsx(TextField, { label: "Conte\u00FAdo", fullWidth: true, multiline: true, rows: 4, ...register('content'), error: !!errors.content, helperText: errors.content?.message }), _jsx(Controller, { name: "scheduledAt", control: control, render: ({ field }) => (_jsx(DateTimePicker, { label: "Agendar para", value: field.value, onChange: field.onChange, slotProps: {
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.scheduledAt,
                                        helperText: errors.scheduledAt?.message,
                                    },
                                } })) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: loading, children: "Cancelar" }), _jsx(Button, { variant: "contained", onClick: handleSubmit(onSubmit), disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : null, children: loading ? 'Salvando...' : 'Salvar' })] })] }));
};
export default MessageFormModal;
