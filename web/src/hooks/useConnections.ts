import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToConnections } from '@/services/connections.service';
import type { Connection } from '@/types';

interface UseConnectionsReturn {
  connections: Connection[];
  loading: boolean;
  error: string | null;
}

export const useConnections = (): UseConnectionsReturn => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToConnections(
      user.uid,
      (data) => {
        setConnections(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { connections, loading, error };
};
