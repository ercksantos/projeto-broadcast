import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToConnections } from '@/services/connections.service';
export const useConnections = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!user)
            return;
        const unsubscribe = subscribeToConnections(user.uid, (data) => {
            setConnections(data);
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);
    return { connections, loading, error };
};
