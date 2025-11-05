import { useState, useEffect } from 'react';
import { getClients, createClientAPI } from '../services/clientService';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data.clients || data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };
 
  useEffect(() => { fetchClients(); }, []);

  const createClient = async (client) => {
    setLoading(true);
    try {
      const res = await createClientAPI(client);
      setClients(prev => [res.client || res, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally { setLoading(false); }
  };

  return { clients, loading, error, fetchClients, createClient };
}
