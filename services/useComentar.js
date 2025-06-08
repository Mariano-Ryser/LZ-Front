


import { useState, useEffect } from 'react';

const useAdminData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Función para obtener datos
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}`);
      if (!response.ok) throw new Error('Error al obtener los datos');
      const result = await response.json();
      setData(result.comentars || result); // Ajusta según la respuesta de tu API
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // Función para eliminar un comentario
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el comentario');
      fetchData(); // Refrescar la lista después de eliminar
    } catch (err) {
      setError(err.message);
    }
  };
  // Función para agregar un like
  const likeItem = async (id) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}/${id}/like`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Error al agregar like');
      fetchData(); // Refrescar la lista después de agregar like
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, deleteItem, likeItem };
};

export default useAdminData;