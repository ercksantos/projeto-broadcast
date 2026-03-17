import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToContacts } from '@/services/contacts.service';
export const useContacts = (connectionId) => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!user || !connectionId) {
            setContacts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const unsubscribe = subscribeToContacts(user.uid, connectionId, (data) => {
            setContacts(data);
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });
        return unsubscribe;
    }, [user, connectionId]);
    return { contacts, loading, error };
};
