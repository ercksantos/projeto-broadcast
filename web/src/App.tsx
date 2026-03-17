import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '@/components/common/PrivateRoute';
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import AppShell from '@/components/layout/AppShell';
import ConnectionsPage from '@/pages/Connections/ConnectionsPage';
import ContactsPage from '@/pages/Contacts/ContactsPage';
import MessagesPage from '@/pages/Messages/MessagesPage';

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/conexoes" replace />} />
          <Route path="/conexoes" element={<ConnectionsPage />} />
          <Route path="/contatos" element={<ContactsPage />} />
          <Route path="/mensagens" element={<MessagesPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
