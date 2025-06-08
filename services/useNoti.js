import { useState, useEffect, useCallback } from 'react';

const useNotiData = (endpoint, limit) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Agrega esta función al inicio del hook
  const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token || '' // Asegúrate que coincide con lo que espera el middleware
  };
  };

  // Función para obtener Notis con paginación
 const fetchData = useCallback(async (pageToFetch = 1) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/${endpoint}?page=${pageToFetch}&limit=${limit}`);
      if (!response.ok) throw new Error('Error al obtener los datos');
      const result = await response.json();
      
  // Si es la primera página, reemplazamos los datos
  // Si es una página posterior, los agregamos

      setData(prev => pageToFetch === 1 ? result.notis : [...prev, ...result.notis]);
      setHasMore(result.pagination?.hasMore || false);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [baseURL, endpoint]);

  // Cargar más datos
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    await fetchData(nextPage);
    setPage(nextPage);
  }, [page, loading, hasMore, fetchData]);

  // Función para resetear la paginación
  const resetPagination = useCallback(async () => {
    setPage(1);
    await fetchData(1);
  }, [fetchData]);

  // Función para crear una notificación (protegida)
 const createItem = async (noti) => {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noti),
    });
    
    if (response.status === 401) {
      throw new Error('Debes iniciar sesión como administrador');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la notificación');
    }
    fetchData()
    const newNoti = await response.json();
    setData(prev => [newNoti.noti, ...prev]);
    return newNoti;
  } catch (err) {
    setError(err.message);
    throw err; // Re-lanzar para manejar en el componente
  }
 };
 
  // Función para eliminar una notificación (protegida)
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) throw new Error('No autorizado');
      if (!response.ok) throw new Error('Error al eliminar la notificación');
      fetchData()
      // ... resto del código existente
    } catch (err) {
      setError(err.message);
      if (err.message === 'No autorizado') {
        // Redirigir a login o mostrar mensaje
        window.location.href = './adminDash';
      }
    }
  };

  // Función para agregar un like
  const likeItem = async (id) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}/${id}/like`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Error al agregar like');
      const updatedNoti = await response.json();
      setData((prevData) =>
        prevData.map((noti) => (noti._id === id ? updatedNoti.noti : noti))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    hasMore,
    createItem, 
    deleteItem, 
    likeItem, 
    loadMore,
    resetPagination
  };
};

export default useNotiData;