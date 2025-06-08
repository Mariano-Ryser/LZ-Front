// services/imageService.js
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Obtener todas las imágenes

export const fetchImages = async () => {
  try {
    const response = await fetch(`${baseURL}/images`);
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    throw error;
  }
};

// Dar like a una imagen START!
export const likeImage = async (id) => {
  try {
    const response = await fetch(`${baseURL}/images/${id}/like`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Error al dar like a la imagen');
    }
  } catch (error) {
    console.error('Error al dar like:', error);
    throw error;
  }
};

// Agregar un comentario a una imagen
export const addComment = async (id, text) => {
  try {
    const response = await fetch(`${baseURL}/images/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Error al agregar comentario');
    }
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    throw error;
  }
};

// Dar like a un comentario
export const likeComment = async (imageId, commentId) => {
  try {
    const response = await fetch(`${baseURL}/images/${imageId}/comment/${commentId}/like`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Error al dar like al comentario');
    }
  } catch (error) {
    console.error('Error al dar like al comentario:', error);
    throw error;
  }
};

// Eliminar una imagen
export const deleteImage = async (id) => {
  try {
    const response = await fetch(`${baseURL}/images/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen');
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
};

