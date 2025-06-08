//se usa del componente admin

import { useState, useEffect, useCallback } from 'react';
import {
  fetchImages as fetchImagesService,
  likeImage as likeImageService,
  addComment as addCommentService,
  likeComment as likeCommentService,
  deleteImage as deleteImageService,
} from './imageService';

//FIN 

export const useImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// Obtener todas las imágenes
  const loadImages = useCallback(async () => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(true);
    setError(null);
    try {
      const images = await fetchImagesService();
      setImages(images);
    } catch (error) {
      setError(error.message || 'Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  }, []);

// Dar like a una imagen
  const likeImage = async (id) => {
    try {
      await likeImageService(id);
      await loadImages(); // Refresca la galería con el nuevo conteo de likes
    } catch (error) {
      setError(error.message || 'Error al dar like a la imagen');
    }
  };

// Agregar un comentario a una imagen
  const addComment = async (id, text) => {
    try {
      await addCommentService(id, text);
      await loadImages(); // Recarga los comentarios
    } catch (error) {
      setError(error.message || 'Error al agregar comentario');
    }
  };

// Dar like a un comentario
  const likeComment = async (imageId, commentId) => {
    try {
      await likeCommentService(imageId, commentId);
      setImages((prevImages) =>
        prevImages.map((img) => {
          if (img._id === imageId) {
            return {
              ...img,
              comments: img.comments.map((comm) =>
                comm._id === commentId ? { ...comm, likes: (comm.likes || 0) + 1 } : comm
              ),
            };
          }
          return img;
        })
      );
    } catch (error) {
      setError(error.message || 'Error al dar like al comentario');
    }
  };

// Eliminar una imagen
  const deleteImage = async (id) => {
    try {
      await deleteImageService(id);
      await loadImages(); // Refresca la galería de imágenes
    } catch (error) {
      setError(error.message || 'Error al eliminar la imagen');
    }
  };

// Cargar imágenes al montar el componente
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    loading,
    error,
    likeImage,
    addComment,
    likeComment,
    deleteImage,
  };
};