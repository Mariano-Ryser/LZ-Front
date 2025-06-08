// components/admin/NotiSection.js
import useNotiData from '../../../services/useNoti';
import { useState } from 'react';


export default function NotiSection({ limit = 100 }){
  const { data, loading, error, deleteItem, likeItem } = useNotiData('notis', limit);
  const [isCollapsed, setIsCollapsed] = useState(true); // Estado para colapsar/expandir

  if (loading) return <p>Cargando notas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        Gestión de Notas {isCollapsed ? '▶' : '▼'}
      </h2>

      {!isCollapsed && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Texto</th>
                <th>Likes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((noti) => (
                <tr key={noti._id}
                >
                  <td className="ellipsis">{noti.titulo}</td>
                  <td className="ellipsis">{noti.text}</td>
                  <td>{noti.likes}</td>
                  <td>
                    <button onClick={() => deleteItem(noti._id)}>Eliminar</button>
                    <button onClick={() => likeItem(noti._id)}>Like</button>
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

        .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
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

          .ellipsis {
            max-width: 100px;
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

