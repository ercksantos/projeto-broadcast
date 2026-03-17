import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, Hub } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { deleteConnection } from '@/services/connections.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import ConnectionFormModal from './ConnectionFormModal';
import type { Connection } from '@/types';

const ConnectionsPage = (): JSX.Element => {
  const { user } = useAuth();
  const { connections, loading } = useConnections();
  const { notifySuccess, notifyError } = useNotify();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Connection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Connection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (connection: Connection): void => {
    setEditing(connection);
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteConnection(deleteTarget.id);
      notifySuccess('Conexão excluída com sucesso!');
      setDeleteTarget(null);
    } catch {
      notifyError('Erro ao excluir conexão. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h5">Conexões</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setModalOpen(true)}>
          Nova Conexão
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      ) : connections.length === 0 ? (
        <Box className="text-center py-16">
          <Hub sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary" className="mt-2">
            Nenhuma conexão encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique em &quot;Nova Conexão&quot; para começar
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {connections.map((connection) => (
            <Grid item xs={12} sm={6} md={4} key={connection.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {connection.name}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleEdit(connection)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(connection)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConnectionFormModal
        open={modalOpen}
        connection={editing}
        clientId={user?.uid ?? ''}
        onClose={handleCloseModal}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Excluir Conexão"
        description={`Tem certeza que deseja excluir a conexão "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default ConnectionsPage;
