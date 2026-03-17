import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToMessages } from '@/services/messages.service';
import type { Message, MessageStatus } from '@/types';

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const useMessages = (
  connectionId: string,
  statusFilter: MessageStatus | 'all',
): UseMessagesReturn => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToMessages(
      user.uid,
      connectionId,
      statusFilter,
      (data) => {
        setMessages(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user, connectionId, statusFilter]);

  return { messages, loading, error };
};
