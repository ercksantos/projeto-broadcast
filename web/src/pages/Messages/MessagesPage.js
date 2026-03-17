import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Card, CardContent, CardActions, Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Skeleton, ToggleButton, ToggleButtonGroup, Tooltip, Typography, } from '@mui/material';
import { Add, Edit, Delete, Send } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useConnections } from '@/hooks/useConnections';
import { useMessages } from '@/hooks/useMessages';
import { deleteMessage } from '@/services/messages.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import MessageFormModal from './MessageFormModal';
const MessagesPage = () => {
    const { connections } = useConnections();
    const { notifySuccess, notifyError } = useNotify();
    const [selectedConnectionId, setSelectedConnectionId] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { messages, loading } = useMessages(selectedConnectionId, statusFilter);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleEdit = (message) => {
        setEditing(message);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditing(null);
    };
    const handleConfirmDelete = async () => {
        if (!deleteTarget)
            return;
        setDeleting(true);
        try {
            await deleteMessage(deleteTarget.id);
            notifySuccess('Mensagem excluída com sucesso!');
            setDeleteTarget(null);
        }
        catch {
            notifyError('Erro ao excluir mensagem. Tente novamente.');
        }
        finally {
            setDeleting(false);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { className: "flex items-center justify-between mb-6", children: [_jsx(Typography, { variant: "h5", children: "Mensagens" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), disabled: !selectedConnectionId, onClick: () => setModalOpen(true), children: _jsx(Box, { component: "span", sx: { display: { xs: 'none', sm: 'inline' } }, children: "Nova Mensagem" }) })] }), _jsxs(Box, { className: "flex flex-col gap-4 mb-4", sx: { flexDirection: { sm: 'row' } }, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Conex\u00E3o" }), _jsx(Select, { value: selectedConnectionId, label: "Conex\u00E3o", onChange: (e) => setSelectedConnectionId(e.target.value), children: connections.map((c) => (_jsx(MenuItem, { value: c.id, children: c.name }, c.id))) })] }), _jsxs(ToggleButtonGroup, { value: statusFilter, exclusive: true, onChange: (_, val) => val && setStatusFilter(val), size: "small", sx: { whiteSpace: 'nowrap' }, children: [_jsx(ToggleButton, { value: "all", children: "Todas" }), _jsx(ToggleButton, { value: "scheduled", children: "Agendadas" }), _jsx(ToggleButton, { value: "sent", children: "Enviadas" })] })] }), !selectedConnectionId ? (_jsxs(Box, { className: "text-center py-16", children: [_jsx(Send, { sx: { fontSize: 48, color: 'text.disabled' } }), _jsx(Typography, { variant: "h6", color: "text.secondary", className: "mt-2", children: "Selecione uma conex\u00E3o" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Escolha uma conex\u00E3o acima para ver suas mensagens" })] })) : loading ? (_jsx(Grid, { container: true, spacing: 2, children: [1, 2, 3].map((i) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Skeleton, { variant: "rounded", height: 160 }) }, i))) })) : messages.length === 0 ? (_jsxs(Box, { className: "text-center py-16", children: [_jsx(Send, { sx: { fontSize: 48, color: 'text.disabled' } }), _jsx(Typography, { variant: "h6", color: "text.secondary", className: "mt-2", children: "Nenhuma mensagem encontrada" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Clique em \"Nova Mensagem\" para come\u00E7ar" })] })) : (_jsx(Grid, { container: true, spacing: 2, children: messages.map((message) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsxs(Card, { variant: "outlined", children: [_jsxs(CardContent, { children: [_jsxs(Box, { className: "flex items-center justify-between mb-2", children: [_jsx(Chip, { label: message.status === 'scheduled' ? 'Agendada' : 'Enviada', color: message.status === 'scheduled' ? 'warning' : 'success', size: "small" }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [message.contactIds.length, " contato(s)"] })] }), _jsx(Typography, { variant: "body2", sx: {
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 1,
                                        }, children: message.content }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["\uD83D\uDCC5 ", dayjs(message.scheduledAt.toDate()).format('DD/MM/YYYY HH:mm')] })] }), _jsxs(CardActions, { sx: { justifyContent: 'flex-end' }, children: [message.status === 'scheduled' && (_jsx(Tooltip, { title: "Editar", children: _jsx(IconButton, { size: "small", onClick: () => handleEdit(message), children: _jsx(Edit, { fontSize: "small" }) }) })), _jsx(Tooltip, { title: "Excluir", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(message), children: _jsx(Delete, { fontSize: "small" }) }) })] })] }) }, message.id))) })), _jsx(MessageFormModal, { open: modalOpen, message: editing, defaultConnectionId: selectedConnectionId, onClose: handleCloseModal }), _jsx(ConfirmDeleteDialog, { open: !!deleteTarget, title: "Excluir Mensagem", description: "Tem certeza que deseja excluir esta mensagem? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita.", loading: deleting, onConfirm: handleConfirmDelete, onCancel: () => setDeleteTarget(null) })] }));
};
export default MessagesPage;
