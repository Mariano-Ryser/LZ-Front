import Link from 'next/link';

export default function NoticiasList({ noticias, isAuthenticated, eliminarNoticia }) {
  return (
    <div className="noticias-grid">

      {noticias?.map((noticia) => (
        <article key={noticia._id} className="noticia-card">
          {isAuthenticated && (
            <button 
              className="eliminar-noticia-button"
              onClick={() => eliminarNoticia(noticia._id)}
            >
              <span className="eliminar-icon">×</span>
            </button>
          )}
          
          <Link 
            href={`/noticias/${noticia._id}`}
            className="noticia-link"
            style={{ textDecoration: 'none' }}
          >
            {noticia.imagen && (
              <div className="imagen-container">
                <img 
                  src={noticia.imagen} 
                  alt={noticia.titulo}
                  className="imagen-noticia"
                />
              </div>
            )}
            
            <div className="noticia-content">
              <h2 className="titulo">{noticia.titulo}</h2>
              <p className="descripcion">{noticia.descripcion}</p>
              <div className="meta-info">
                <span className="autor">Por: {noticia.autor}</span>
                <span className="fecha">{noticia.fecha}</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
      
      <style jsx>{`
        .noticias-grid {
          max-width: 65rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0rem;
        }
        
        .noticia-card {
          border:solid none 1px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          
        }
        
        .noticia-card:hover {
          transform: translateY(-5px);
        }
        
        .noticia-link {
          color: inherit;
          display: block;
        }
        
        .imagen-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        
        .imagen-noticia {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .noticia-card:hover .imagen-noticia {
          transform: scale(1.05);
        }
        
        .noticia-content {
          padding: 0.6rem;
        }
        
        .titulo {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: white;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .descripcion {
          color: #white;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .meta-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: white;
        }
        
        .eliminar-noticia-button {
          position: absolute;
          top: 10px;
          right: 10px;
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
          z-index: 10;
        }
        
        .eliminar-noticia-button:hover {
          background-color: rgb(211, 17, 10);
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .noticias-grid {
            grid-template-columns: 1fr;
          }
          
          .imagen-container {
            height: 200px;
          }
          
          .titulo {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}