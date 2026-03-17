import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Card, CardContent, CardActions, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Skeleton, Tooltip, Typography, } from '@mui/material';
import { Add, Edit, Delete, Contacts } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { useContacts } from '@/hooks/useContacts';
import { deleteContact } from '@/services/contacts.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import ContactFormModal from './ContactFormModal';
const ContactsPage = () => {
    const { user } = useAuth();
    const { connections } = useConnections();
    const { notifySuccess, notifyError } = useNotify();
    const [selectedConnectionId, setSelectedConnectionId] = useState('');
    const { contacts, loading } = useContacts(selectedConnectionId);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleEdit = (contact) => {
        setEditing(contact);
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
            await deleteContact(deleteTarget.id);
            notifySuccess('Contato excluído com sucesso!');
            setDeleteTarget(null);
        }
        catch {
            notifyError('Erro ao excluir contato. Tente novamente.');
        }
        finally {
            setDeleting(false);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { className: "flex items-center justify-between mb-6", children: [_jsx(Typography, { variant: "h5", children: "Contatos" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), disabled: !selectedConnectionId, onClick: () => setModalOpen(true), children: _jsx(Box, { component: "span", sx: { display: { xs: 'none', sm: 'inline' } }, children: "Novo Contato" }) })] }), _jsxs(FormControl, { fullWidth: true, sx: { mb: 3 }, children: [_jsx(InputLabel, { children: "Conex\u00E3o" }), _jsx(Select, { value: selectedConnectionId, label: "Conex\u00E3o", onChange: (e) => setSelectedConnectionId(e.target.value), children: connections.map((c) => (_jsx(MenuItem, { value: c.id, children: c.name }, c.id))) })] }), !selectedConnectionId ? (_jsxs(Box, { className: "text-center py-16", children: [_jsx(Contacts, { sx: { fontSize: 48, color: 'text.disabled' } }), _jsx(Typography, { variant: "h6", color: "text.secondary", className: "mt-2", children: "Selecione uma conex\u00E3o" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Escolha uma conex\u00E3o acima para ver seus contatos" })] })) : loading ? (_jsx(Grid, { container: true, spacing: 2, children: [1, 2, 3].map((i) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Skeleton, { variant: "rounded", height: 100 }) }, i))) })) : contacts.length === 0 ? (_jsxs(Box, { className: "text-center py-16", children: [_jsx(Contacts, { sx: { fontSize: 48, color: 'text.disabled' } }), _jsx(Typography, { variant: "h6", color: "text.secondary", className: "mt-2", children: "Nenhum contato encontrado" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Clique em \"Novo Contato\" para come\u00E7ar" })] })) : (_jsx(Grid, { container: true, spacing: 2, children: contacts.map((contact) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsxs(Card, { variant: "outlined", children: [_jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", noWrap: true, children: contact.name }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: contact.phone })] }), _jsxs(CardActions, { sx: { justifyContent: 'flex-end' }, children: [_jsx(Tooltip, { title: "Editar", children: _jsx(IconButton, { size: "small", onClick: () => handleEdit(contact), children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Excluir", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(contact), children: _jsx(Delete, { fontSize: "small" }) }) })] })] }) }, contact.id))) })), _jsx(ContactFormModal, { open: modalOpen, contact: editing, clientId: user?.uid ?? '', connectionId: selectedConnectionId, onClose: handleCloseModal }), _jsx(ConfirmDeleteDialog, { open: !!deleteTarget, title: "Excluir Contato", description: `Tem certeza que deseja excluir o contato "${deleteTarget?.name}"?`, loading: deleting, onConfirm: handleConfirmDelete, onCancel: () => setDeleteTarget(null) })] }));
};
export default ContactsPage;
