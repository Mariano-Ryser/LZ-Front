// useClients.js
import { useState, useEffect } from 'react';
import { 
  getClients, 
  createClientAPI,
  updateClientAPI,
  deleteClientAPI
} from '../services/clientService';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);        // solo para fetch principal
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // Obtener lista completa
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data.clients || data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al iniciar y cuando refreshTrigger cambia
  useEffect(() => { 
    fetchClients(); 
  }, [refreshTrigger]);   // ← IMPORTANTE

  /** CREAR CLIENTE */
  const createClient = async (client) => {
    try {
      const res = await createClientAPI(client);
      if (!res.ok) throw new Error(res.message || "Error al crear cliente");

      // No mutamos lista manualmente → dejamos que refresh recargue TODO
      setRefreshTrigger(t => t + 1);

      return { success: true, client: res.client };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /** EDITAR CLIENTE */
  const editClient = async (id, clientData) => {
    try {
      const res = await updateClientAPI(id, clientData);
      if (!res.ok) throw new Error(res.message || "Error al actualizar cliente");

      setRefreshTrigger(t => t + 1);

      return { success: true, client: res.client };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /** ELIMINAR CLIENTE */
  const deleteClient = async (id) => {
    try {
      const res = await deleteClientAPI(id);
      if (!res.ok) throw new Error(res.message || "Error al eliminar cliente");

      setRefreshTrigger(t => t + 1);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    editClient,
    deleteClient,
    refreshTrigger
  };
}
