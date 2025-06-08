import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthProvider';

export default function NoticiaDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isAuthenticated } = useContext(AuthContext);
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/noticias/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener la noticia');
        }
        
        setNoticia(data.noticia);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

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

      router.push('/noticias');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al eliminar noticia');
    }
  };

  if (loading) {
    return <div className="loading">Cargando noticia...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!noticia) {
    return <div className="not-found">Noticia no encontrada</div>;
  }

  return (
    <div className="noticia-detalle">
      <article className="noticia">
        {isAuthenticated && (
          <button 
            className="eliminar-noticia-button"
            onClick={() => eliminarNoticia(noticia._id)}
          >
            <span className="eliminar-icon">×</span>
          </button>
        )}
        
        <header>
          <h1 className="titulo">{noticia.titulo}</h1>
          <div className="meta-info">
            <span className="autor">Por: {noticia.autor}</span>
            <span className="fecha">Publicado: {noticia.fecha}</span>
            <span className="hora">{noticia.hora}</span>
          </div>
          <p className="descripcion">{noticia.descripcion}</p>
        </header>
        
        {noticia.imagen && (
          <div className="imagen-container">
            <img 
              src={noticia.imagen} 
              alt={noticia.titulo}
              className="imagen-noticia"
            />
            <p className="pie-imagen">Fuente: {noticia.fuente}</p>
          </div>
        )}
        
        <div className="contenido-noticia">
          {noticia.secciones?.map((seccion, index) => (
            <div key={index}>
              {seccion.subtitulo && <h2 className="subtitulo">{seccion.subtitulo}</h2>}
              {seccion.contenido && <p>{seccion.contenido}</p>}
            </div>
          ))}
        </div>      
        
        <footer className="noticia-footer">
          <p className="fuente">Fuente: {noticia.fuente}</p>
          <p className="actualizacion">Última actualización: {noticia.actualizacion}</p>
        </footer>
      </article>
      
      <style jsx>{`
        .noticia-detalle {
          max-width: 800px;
          margin: 0rem auto;
        }
        
        .noticia {
          display: grid;
          gap: 1.5rem;
          padding: 0rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .titulo {
          font-size: 2rem;
          margin-bottom: 0.6rem;
          margin-top: 0.4rem;
          color:white;
        }
        
        .meta-info {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color:white;
        }
        
        .descripcion {
          font-size: 1.1rem;
          color:white;
          line-height: 1.6;
        }
        
        .imagen-container {
          margin-top: 0rem;
          margin-bottom: 0rem;
        }
        
        .imagen-noticia {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }
        
        .pie-imagen {
          font-size: 0.8rem;
          text-align: center;
          margin-top: 0.5rem;
          color:white;
        }
        
        .contenido-noticia {
          display: grid;
          gap: 1.5rem;
        }
        
        .contenido-noticia p {
          color:white;
          line-height: 1.6;
          margin: 0rem 0;
        }
        
        .subtitulo {
          font-size: 1.5rem;
          margin: 0.2rem 0 0.5rem;
          color:white;
        }
        
        .noticia-footer {
          margin-top: 0.2rem;
          padding-top: 1rem;
          font-size: 0.85rem;
          color:white;
        }
        
        .eliminar-noticia-button {
          position: absolute;
          top: 100px;
          right: 20px;
          background-color: rgba(211, 17, 10, 0.58);
          border-radius: 50%;
          height: 30px;
          width: 30px;
          border: none;
          color: white;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .eliminar-noticia-button:hover {
          background-color: rgb(211, 17, 10);
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .noticia-detalle {
            padding: 0rem;
          }
          
          .noticia {
            padding: 0.3rem;
          }
          
          .titulo {
            font-size: 1.5rem;
          }
          
          .meta-info {
            flex-direction: column;
            gap: 0.3rem;
          }
          
          .subtitulo {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}