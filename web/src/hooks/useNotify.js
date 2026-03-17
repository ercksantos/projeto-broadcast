import { useSnackbar } from 'notistack';
export const useNotify = () => {
    const { enqueueSnackbar } = useSnackbar();
    return {
        notifySuccess: (message) => enqueueSnackbar(message, { variant: 'success' }),
        notifyError: (message) => enqueueSnackbar(message, { variant: 'error' }),
    };
};
