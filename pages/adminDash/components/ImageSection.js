// components/admin/ImageSection.js
import { useState } from 'react';
import { useImages } from '../../../services/useImages';

const ImageSection = () => {
  const { images, loading, error, deleteImage, likeImage } = useImages();
  const [isCollapsed, setIsCollapsed] = useState(true); // Estado para colapsar/expandir

  if (loading) return <p>Cargando imágenes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        Gestión de Imágenes {isCollapsed ? '▶' : '▼'}
      </h2>

      {!isCollapsed && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Likes</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image._id}>
                  <td>
                    <img src={image.imageUrl} alt={image.publicId} className="image" />
                  </td>
                  <td>{image.likes}</td>
                  <td>{image.comments.length}</td>
                  <td>
                    <button onClick={() => likeImage(image._id)}>Like</button>
                    <button onClick={() => deleteImage(image._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        h2 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #0070f3;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        th, td {
          padding: 8px;
          border: 1px solid #ccc;
          text-align: left;
        }

        th {
          background-color: #333;
          color: #fff;
        }

        .image {
          width: 80px; /* Tamaño más pequeño para las imágenes */
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        button {
          margin-right: 5px;
          padding: 5px 10px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        button:hover {
          background-color: #005bb5;
        }

        /* Estilos para móviles */
        @media (max-width: 768px) {
          h2 {
            font-size: 1.2rem;
          }

          table {
            font-size: 0.8rem;
          }

          th, td {
            padding: 6px;
          }

          .image {
            width: 60px; /* Tamaño más pequeño para móviles */
            height: 60px;
          }

          button {
            padding: 4px 8px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageSection;