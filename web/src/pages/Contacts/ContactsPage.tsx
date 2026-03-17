import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, Contacts } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { useContacts } from '@/hooks/useContacts';
import { deleteContact } from '@/services/contacts.service';
import { useNotify } from '@/hooks/useNotify';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import ContactFormModal from './ContactFormModal';
import type { Contact } from '@/types';

const ContactsPage = (): JSX.Element => {
  const { user } = useAuth();
  const { connections } = useConnections();
  const { notifySuccess, notifyError } = useNotify();

  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const { contacts, loading } = useContacts(selectedConnectionId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (contact: Contact): void => {
    setEditing(contact);
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
      await deleteContact(deleteTarget.id);
      notifySuccess('Contato excluído com sucesso!');
      setDeleteTarget(null);
    } catch {
      notifyError('Erro ao excluir contato. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h5">Contatos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={!selectedConnectionId}
          onClick={() => setModalOpen(true)}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Novo Contato
          </Box>
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
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

      {!selectedConnectionId ? (
        <Box className="text-center py-16">
          <Contacts sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary" className="mt-2">
            Selecione uma conexão
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha uma conexão acima para ver seus contatos
          </Typography>
        </Box>
      ) : loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
      ) : contacts.length === 0 ? (
        <Box className="text-center py-16">
          <Contacts sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary" className="mt-2">
            Nenhum contato encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique em &quot;Novo Contato&quot; para começar
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {contacts.map((contact) => (
            <Grid item xs={12} sm={6} md={4} key={contact.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {contact.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.phone}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleEdit(contact)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(contact)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ContactFormModal
        open={modalOpen}
        contact={editing}
        clientId={user?.uid ?? ''}
        connectionId={selectedConnectionId}
        onClose={handleCloseModal}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Excluir Contato"
        description={`Tem certeza que deseja excluir o contato "${deleteTarget?.name}"?`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default ContactsPage;
