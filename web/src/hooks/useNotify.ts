import { useSnackbar } from 'notistack';

interface UseNotifyReturn {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

export const useNotify = (): UseNotifyReturn => {
  const { enqueueSnackbar } = useSnackbar();
  return {
    notifySuccess: (message) => enqueueSnackbar(message, { variant: 'success' }),
    notifyError: (message) => enqueueSnackbar(message, { variant: 'error' }),
  };
};
