import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToContacts } from '@/services/contacts.service';
import type { Contact } from '@/types';

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

export const useContacts = (connectionId: string): UseContactsReturn => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToContacts(
      user.uid,
      connectionId,
      (data) => {
        setContacts(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user, connectionId]);

  return { contacts, loading, error };
};
