import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const AppShell = (): JSX.Element => (
  <Box>
    <Outlet />
  </Box>
);

export default AppShell;
