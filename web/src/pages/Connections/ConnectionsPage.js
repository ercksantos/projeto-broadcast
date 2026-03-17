import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Card, CardContent, CardActions, Grid, IconButton, Skeleton, Tooltip, Typography, } from '@mui/material';
import { Add, Edit, Delete, Hub } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { deleteConnection } from '@/services/connections.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import ConnectionFormModal from './ConnectionFormModal';
const ConnectionsPage = () => {
    const { user } = useAuth();
    const { connections, loading } = useConnections();
    const { notifySuccess, notifyError } = useNotify();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleEdit = (connection) => {
        setEditing(connection);
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
            await deleteConnection(deleteTarget.id);
            notifySuccess('Conexão excluída com sucesso!');
            setDeleteTarget(null);
        }
        catch {
            notifyError('Erro ao excluir conexão. Tente novamente.');
        }
        finally {
            setDeleting(false);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { className: "flex items-center justify-between mb-6", children: [_jsx(Typography, { variant: "h5", children: "Conex\u00F5es" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => setModalOpen(true), children: _jsx(Box, { component: "span", sx: { display: { xs: 'none', sm: 'inline' } }, children: "Nova Conex\u00E3o" }) })] }), loading ? (_jsx(Grid, { container: true, spacing: 2, children: [1, 2, 3].map((i) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Skeleton, { variant: "rounded", height: 120 }) }, i))) })) : connections.length === 0 ? (_jsxs(Box, { className: "text-center py-16", children: [_jsx(Hub, { sx: { fontSize: 48, color: 'text.disabled' } }), _jsx(Typography, { variant: "h6", color: "text.secondary", className: "mt-2", children: "Nenhuma conex\u00E3o encontrada" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Clique em \"Nova Conex\u00E3o\" para come\u00E7ar" })] })) : (_jsx(Grid, { container: true, spacing: 2, children: connections.map((connection) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsxs(Card, { variant: "outlined", children: [_jsx(CardContent, { children: _jsx(Typography, { variant: "h6", noWrap: true, children: connection.name }) }), _jsxs(CardActions, { sx: { justifyContent: 'flex-end' }, children: [_jsx(Tooltip, { title: "Editar", children: _jsx(IconButton, { size: "small", onClick: () => handleEdit(connection), children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Excluir", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(connection), children: _jsx(Delete, { fontSize: "small" }) }) })] })] }) }, connection.id))) })), _jsx(ConnectionFormModal, { open: modalOpen, connection: editing, clientId: user?.uid ?? '', onClose: handleCloseModal }), _jsx(ConfirmDeleteDialog, { open: !!deleteTarget, title: "Excluir Conex\u00E3o", description: `Tem certeza que deseja excluir a conexão "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`, loading: deleting, onConfirm: handleConfirmDelete, onCancel: () => setDeleteTarget(null) })] }));
};
export default ConnectionsPage;
