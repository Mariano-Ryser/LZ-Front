// components/admin/AdminSection.js
import useAdminData from '../../../services/useComentar';
import { useState } from 'react';
const ComentarSection = () => {
  const { data, loading, error, deleteItem, likeItem } = useAdminData('comentars');

  const [isCollapsed, setIsCollapsed] = useState(true); // Estado para colapsar/expandir el panel
  const [expandedText, setExpandedText] = useState(null);
  
  if (loading) return <p>Cargando comentarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        Gestión de Comentarios {isCollapsed ? '▶' : '▼'}
      </h2>

      {!isCollapsed && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Texto</th>
                <th>Likes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((comentar) => (
                <tr key={comentar._id}>
                  <td className="ellipsis">{comentar.titulo}</td>
                  <td className="ellipsis">{comentar.author}</td>
                  <td className={expandedText === comentar._id ? '' : 'ellipsis'} onClick={() => setExpandedText(expandedText === comentar._id ? null : comentar._id)}>{comentar.text}</td>
                  <td>{comentar.likes}</td>
                  <td>
                    <button onClick={() => deleteItem(comentar._id)}>Eliminar</button>
                    <button onClick={() => likeItem(comentar._id)}>Like</button>
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
          transition: 0.4s; /* Agrega una transición suave */
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

        .ellipsis {
          white-space: nowrap; /* Evita que el texto se divida en varias líneas */
          overflow: hidden; /* Oculta el contenido que se desborda */
          text-overflow: ellipsis; /* Muestra puntos suspensivos (...) */
          max-width: 150px; /* Limita el ancho de la celda */
          
        }
      

        button {
          margin-right: 5px;
          margin-bottom: 5px;
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

          .ellipsis {
            max-width: 100px; /* Ajusta el ancho para móviles */
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

export default ComentarSection;