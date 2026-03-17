import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Box,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs, { type Dayjs } from 'dayjs';
import { createMessage, updateMessage } from '@/services/messages.service';
import { useConnections } from '@/hooks/useConnections';
import { useContacts } from '@/hooks/useContacts';
import { useNotify } from '@/hooks/useNotify';
import { useAuth } from '@/contexts/AuthContext';
import type { Message } from '@/types';

const schema = z.object({
    connectionId: z.string().min(1, 'Selecione uma conexão'),
    contactIds: z.array(z.string()).min(1, 'Selecione pelo menos um contato'),
    content: z.string().min(1, 'Conteúdo obrigatório'),
    scheduledAt: z.custom<Dayjs>((val) => val != null && dayjs.isDayjs(val) && val.isValid(), {
        message: 'Data obrigatória',
    }),
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    message: Message | null;
    defaultConnectionId?: string;
    onClose: () => void;
}

const MessageFormModal = ({ open, message, defaultConnectionId, onClose }: Props): JSX.Element => {
    const { user } = useAuth();
    const { connections } = useConnections();
    const { notifySuccess, notifyError } = useNotify();
    const [loading, setLoading] = useState(false);
    const isEditing = !!message;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<FormData, unknown, FormData>({
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
        } else {
            reset({
                connectionId: defaultConnectionId ?? '',
                contactIds: [],
                content: '',
                scheduledAt: undefined,
            });
        }
    }, [message, defaultConnectionId, reset]);

    const onSubmit = async (data: FormData): Promise<void> => {
        if (!data.scheduledAt) return;
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
            } else {
                await createMessage(user!.uid, payload);
                notifySuccess('Mensagem criada com sucesso!');
            }
            onClose();
        } catch {
            notifyError('Erro ao salvar mensagem. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const contactOptions = contacts.map((c) => ({ id: c.id, label: `${c.name} — ${c.phone}` }));

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Editar Mensagem' : 'Nova Mensagem'}</DialogTitle>
            <DialogContent>
                <Box className="flex flex-col gap-4 pt-1">
                    <FormControl fullWidth error={!!errors.connectionId} disabled={isEditing}>
                        <InputLabel>Conexão</InputLabel>
                        <Controller
                            name="connectionId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Conexão">
                                    {connections.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.connectionId && (
                            <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                                {errors.connectionId.message}
                            </Box>
                        )}
                    </FormControl>

                    <Controller
                        name="contactIds"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                options={contactOptions}
                                getOptionLabel={(o) => o.label}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={contactOptions.filter((o) => field.value.includes(o.id))}
                                onChange={(_, selected) => field.onChange(selected.map((s) => s.id))}
                                disabled={!selectedConnectionId}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Contatos"
                                        error={!!errors.contactIds}
                                        helperText={errors.contactIds?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <TextField
                        label="Conteúdo"
                        fullWidth
                        multiline
                        rows={4}
                        {...register('content')}
                        error={!!errors.content}
                        helperText={errors.content?.message}
                    />

                    <Controller
                        name="scheduledAt"
                        control={control}
                        render={({ field }) => (
                            <DateTimePicker
                                label="Agendar para"
                                value={field.value}
                                onChange={field.onChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.scheduledAt,
                                        helperText: errors.scheduledAt?.message,
                                    },
                                }}
                            />
                        )}
                    />
                </Box>
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

export default MessageFormModal;
