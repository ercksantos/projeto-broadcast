import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteDialog = ({
  open,
  title,
  description,
  loading,
  onConfirm,
  onCancel,
}: Props): JSX.Element => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={onConfirm}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Excluindo...' : 'Excluir'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
