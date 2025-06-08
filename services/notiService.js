// services/notiService.js
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Obtener todas las notificaciones
export const fetchNotis = async () => {
  try {
    const response = await fetch(`${baseURL}/notis`);
    const data = await response.json();
    return data.notis;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};
// Dar like a una notificación
export const likeNoti = async (_id) => {
  try {
    const response = await fetch(`${baseURL}/notis/${_id}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Error al dar like');
    }
    const data = await response.json();
    return data.noti;
  } catch (error) {
    console.error('Error al dar like:', error);
    throw error;
  }
};


// Crear una nueva notificación
export const createNoti = async (noti) => {
  try {
    const response = await fetch(`${baseURL}/notis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noti),
      credentials: 'include', // ⬅️ Asegura que se envíen cookies de autenticación
    });

    if (!response.ok) {
      throw new Error('Error al crear notificación');
    }

    const data = await response.json();
    return data.noti;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

// Eliminar una notificación
export const deleteNoti = async (_id) => {
  try {
    const response = await fetch(`${baseURL}/notis/${_id}`, {
      method: 'DELETE',
      credentials: 'include', // ⬅️ Asegura que se envíen cookies de autenticación
    });

    if (!response.ok) {
      throw new Error('Error al eliminar notificación');
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    throw error;
  }
};