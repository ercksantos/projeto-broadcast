import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createConnection, updateConnection } from '@/services/connections.service';
import { useNotify } from '@/hooks/useNotify';
import type { Connection } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  connection: Connection | null;
  clientId: string;
  onClose: () => void;
}

const ConnectionFormModal = ({ open, connection, clientId, onClose }: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!connection;
  const { notifySuccess, notifyError } = useNotify();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ name: connection?.name ?? '' });
  }, [connection, reset]);

  const onSubmit = async ({ name }: FormData): Promise<void> => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateConnection(connection.id, name);
        notifySuccess('Conexão atualizada com sucesso!');
      } else {
        await createConnection(clientId, name);
        notifySuccess('Conexão criada com sucesso!');
      }
      onClose();
    } catch {
      notifyError('Erro ao salvar conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Conexão' : 'Nova Conexão'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          fullWidth
          autoFocus
          margin="dense"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionFormModal;
