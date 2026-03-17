import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToMessages } from '@/services/messages.service';
export const useMessages = (connectionId, statusFilter) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!user || !connectionId) {
            setMessages([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const unsubscribe = subscribeToMessages(user.uid, connectionId, statusFilter, (data) => {
            setMessages(data);
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });
        return unsubscribe;
    }, [user, connectionId, statusFilter]);
    return { messages, loading, error };
};
