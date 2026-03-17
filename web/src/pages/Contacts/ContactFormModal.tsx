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
import { createContact, updateContact } from '@/services/contacts.service';
import { useNotify } from '@/hooks/useNotify';
import type { Contact } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().min(1, 'Telefone obrigatório'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  contact: Contact | null;
  clientId: string;
  connectionId: string;
  onClose: () => void;
}

const ContactFormModal = ({
  open,
  contact,
  clientId,
  connectionId,
  onClose,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!contact;
  const { notifySuccess, notifyError } = useNotify();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ name: contact?.name ?? '', phone: contact?.phone ?? '' });
  }, [contact, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateContact(contact.id, data);
        notifySuccess('Contato atualizado com sucesso!');
      } else {
        await createContact(clientId, connectionId, data);
        notifySuccess('Contato criado com sucesso!');
      }
      onClose();
    } catch {
      notifyError('Erro ao salvar contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <TextField
          label="Nome"
          fullWidth
          autoFocus
          margin="dense"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Telefone"
          fullWidth
          margin="dense"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
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

export default ContactFormModal;
