import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../components/auth/AuthProvider';
import NoticiasUploader from './noticiasUploader';
import NoticiasList from './NoticiasList';

export default function NoticiasPage() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isAuthenticated } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNoticias = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/noticias?page=${pageNum}&limit=12`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener noticias');
      }
      
      setNoticias(data.noticias);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleSubmitNoticia = async (formData) => {
    try {
      const response = await fetch(`${baseURL}/noticias`, {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data.message || data.error || 
                           (typeof data === 'string' ? data : 'Error al crear la noticia');
        throw new Error(errorMessage);
      }
  
      setSuccessMessage('Noticia creada exitosamente!');
      setShowModal(false);
      await fetchNoticias();
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Hubo un error al crear la noticia');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const eliminarNoticia = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    try {
      const response = await fetch(`${baseURL}/noticias/${id}`, {
        method: 'DELETE'
      });
      

      const data = await response.json();  
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar noticia');
      }

      setSuccessMessage('Noticia eliminada con éxito!');
      await fetchNoticias(page);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al eliminar noticia');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchNoticias(newPage);
  };

  if (loading && noticias.length === 0) {
    return <div className="loading">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="noticias-page">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isAuthenticated && (
        <button 
          className='uploader-noticias-button'
          onClick={() => setShowModal(true)}
        >
          <span className="l">+</span>
        </button>
      )}

      {showModal && (
        <NoticiasUploader 
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitNoticia}
        />
      )}

      <h1 className="page-title">Últimas Noticias</h1>
      
      <NoticiasList 
        noticias={noticias} 
        isAuthenticated={isAuthenticated}
        eliminarNoticia={eliminarNoticia}
      />
      
      {noticias.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
          >
            Anterior
          </button>
          
          <span>Página {page} de {totalPages}</span>
          
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      
      <style jsx>{`
        .noticias-page {
          padding: 0rem;
          max-width: 1200px;
          margin: 0 auto;
          color:white;
        }
        
        .page-title {
          text-align: center;
          margin: 0.6rem 0;
          font-size: 2.5rem;
          color:white;
        }
        
        .success-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4CAF50;
          color: white;
          padding: 15px;
          border-radius: 4px;
          z-index: 1000;
          animation: fadeInOut 3s ease-in-out;
        }
        
        .error-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #f44336;
          color: white;
          padding: 15px;
          border-radius: 4px;
          z-index: 1000;
          animation: fadeInOut 3s ease-in-out;
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .uploader-noticias-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: rgba(17, 211, 10, 0.58);
          border-radius: 50%;
          height: 50px;
          width: 50px;
          border: none;
          color: white;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 100;
        }
        
        .uploader-noticias-button:hover {
          background-color: rgb(17, 211, 10);
          transform: scale(1.1);
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .pagination button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .pagination button:disabled {
          cursor: not-allowed;
        }
        
        .pagination button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 1.8rem;
          }
          
          .uploader-noticias-button {
            height: 40px;
            width: 40px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}