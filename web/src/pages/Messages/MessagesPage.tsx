import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, Send } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useConnections } from '@/hooks/useConnections';
import { useMessages } from '@/hooks/useMessages';
import { deleteMessage } from '@/services/messages.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import MessageFormModal from './MessageFormModal';
import type { Message, MessageStatus } from '@/types';

type FilterValue = MessageStatus | 'all';

const MessagesPage = (): JSX.Element => {
  const { connections } = useConnections();
  const { notifySuccess, notifyError } = useNotify();

  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all');
  const { messages, loading } = useMessages(selectedConnectionId, statusFilter);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (message: Message): void => {
    setEditing(message);
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
      await deleteMessage(deleteTarget.id);
      notifySuccess('Mensagem excluída com sucesso!');
      setDeleteTarget(null);
    } catch {
      notifyError('Erro ao excluir mensagem. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h5">Mensagens</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={!selectedConnectionId}
          onClick={() => setModalOpen(true)}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Nova Mensagem
          </Box>
        </Button>
      </Box>

      <Box className="flex flex-col gap-4 mb-4" sx={{ flexDirection: { sm: 'row' } }}>
        <FormControl fullWidth>
          <InputLabel>Conexão</InputLabel>
          <Select
            value={selectedConnectionId}
            label="Conexão"
            onChange={(e) => setSelectedConnectionId(e.target.value)}
          >
            {connections.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, val) => val && setStatusFilter(val)}
          size="small"
          sx={{ whiteSpace: 'nowrap' }}
        >
          <ToggleButton value="all">Todas</ToggleButton>
          <ToggleButton value="scheduled">Agendadas</ToggleButton>
          <ToggleButton value="sent">Enviadas</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {!selectedConnectionId ? (
        <Box className="text-center py-16">
          <Send sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary" className="mt-2">
            Selecione uma conexão
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha uma conexão acima para ver suas mensagens
          </Typography>
        </Box>
      ) : loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : messages.length === 0 ? (
        <Box className="text-center py-16">
          <Send sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary" className="mt-2">
            Nenhuma mensagem encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique em &quot;Nova Mensagem&quot; para começar
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {messages.map((message) => (
            <Grid item xs={12} sm={6} md={4} key={message.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box className="flex items-center justify-between mb-2">
                    <Chip
                      label={message.status === 'scheduled' ? 'Agendada' : 'Enviada'}
                      color={message.status === 'scheduled' ? 'warning' : 'success'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {message.contactIds.length} contato(s)
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    📅 {dayjs(message.scheduledAt.toDate()).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {message.status === 'scheduled' && (
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEdit(message)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(message)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <MessageFormModal
        open={modalOpen}
        message={editing}
        defaultConnectionId={selectedConnectionId}
        onClose={handleCloseModal}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Excluir Mensagem"
        description="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default MessagesPage;
