import { useEffect, useState } from 'react';

function BoxComentar() {
  const current = new Date();
  const datee = `${current.getDate()} / ${current.getMonth() + 1} / ${current.getFullYear()}`;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialState = {
    titulo: '',
    text: '',
    author: '',
  };

  const [comentar, setComentar] = useState(initialState);
  const [comentars, setComentars] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState(null);
  const [isGlowing, setIsGlowing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComentar({ ...comentar, [name]: value });
  };

  const handleLike = async (_id) => {
    try {
      const response = await fetch(`https://mr-app.azurewebsites.net/api/v1/web1/comentars/${_id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const updatedComentar = await response.json();
        setComentars((prevComentars) =>
          prevComentars.map((comentar) =>
            comentar._id === _id ? updatedComentar.comentario : comentar
          )
        );
      } else {
        console.error('Error al agregar like:', response.statusText);
      }
    } catch (error) {
      console.error('Error al agregar like:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comentar.titulo.trim()) {
      setError('Debes indicar un título');
      return;
    }
    if (!comentar.text.trim()) {
      setError('Debes indicar una descripción');
      return;
    }
    if (!comentar.author.trim()) {
      setError('Debes indicar un autor');
      return;
    }

    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1000);

    try {
      const response = await fetch(`${baseURL}/comentars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comentar),
      });

      if (response.ok) {
        const data = await response.json();
        setComentar(initialState);
        setComentars([data.comentar, ...comentars]);
        setSuccessMessage('Comentario agregado con éxito!');
        setTimeout(() => setSuccessMessage(null), 2100);
        setError(null);
      } else {
        console.error('Error al agregar comentario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  useEffect(() => {
    const fetchComentars = async () => {
      try {
        const response = await fetch(`${baseURL}/comentars`);
        const { comentars } = await response.json();
        setComentars(comentars);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchComentars();
  }, []);

  return (
    <>
      <div className="cyber-container">
        <form className={`cyber-form ${isGlowing ? 'glow-effect' : ''}`} onSubmit={handleSubmit}>
          <div className="cyber-header">
            <p className="cyber-date">{datee}</p>
            <div className="cyber-grid"></div>
          </div>

          <input
            placeholder="Título"
            className="cyber-input"
            maxLength="50"
            type="text"
            name="titulo"
            value={comentar.titulo}
            onChange={handleChange}
          />

          <textarea
            className="cyber-textarea"
            placeholder="Añade un comentario..."
            maxLength="1000"
            name="text"
            value={comentar.text}
            onChange={handleChange}
          />

          <input
            placeholder="Autor"
            className="cyber-input"
            maxLength="30"
            type="text"
            name="author"
            value={comentar.author}
            onChange={handleChange}
          />

          <button type="submit" className="cyber-button">
            <span className="cyber-button-text">ENVIAR</span>
            <span className="cyber-button-glitch"></span>
            <span className="cyber-button-tag">R25</span>
          </button>

          {error && <div className="cyber-alert error">{error}</div>}
          {successMessage && <div className="cyber-alert success">{successMessage}</div>}
          {deletedMessage && <div className="cyber-alert deleted">{deletedMessage}</div>}
        </form>
        
        {/* COMENTARIOS FETCHEADOS */}
        <div className="cyber-comments-container">
          {comentars.map(({ _id, titulo, text, author, likes }) => (
            <div key={_id} className="cyber-comment">
              <div className="cyber-comment-header">
                <h1 className="cyber-comment-title">{titulo}</h1>
                <div className="cyber-comment-likes" onClick={() => handleLike(_id)}>
                  <span className="cyber-heart">❤️</span>
                  <span className="cyber-likes-count">{likes}</span>
                </div>
              </div>
              <p className="cyber-comment-text">{text}</p>
              <span className="cyber-comment-author">Por: {author}</span>
              <div className="cyber-comment-grid"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        :root {
          --neon-blue: rgba(10, 175, 255, 0.8);
          --neon-pink: rgba(255, 10, 175, 0.8);
          --cyber-dark: rgba(10, 15, 25, 0.95);
          --cyber-border: 1px solid rgba(10, 175, 255, 0.3);
          --cyber-glow: 0 0 10px rgba(10, 175, 255, 0.7);
        }
        
        .cyber-container {
          width: 100%;
          max-width: 45rem;
          margin: 0 auto;
          font-family: 'Courier New', monospace;
        }
        
        .cyber-form {
          position: relative;
          margin-bottom: 1.8rem;
          background: var(--cyber-dark);
          border: var(--cyber-border);
          border-radius: 5px;
          box-shadow: var(--cyber-glow);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
     
        .cyber-header {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .cyber-date {
          text-align: right;
          color: rgba(10, 175, 255, 0.7);
          font-size: 1rem;
          margin: 0;
          position: relative;
          z-index: 2;
          background: linear-gradient(
                to right,
                transparent 20%,
                rgba(238, 255, 0, 0.7) 50%, 
                transparent 80%
              );
          background-size: 200% 100%; 
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shine-gold 9s infinite linear;}

        @keyframes shine-gold {
              0% {
                background-position: 100% 50%; 
              }
              100% {
                background-position: -100% 50%; 
              }
            }
        
        .cyber-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(10, 175, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 175, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
        }
        
        .cyber-input, .cyber-textarea {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          background: rgba(0, 10, 20, 0.7);
          border: var(--cyber-border);
          border-radius: 3px;
          color: rgba(10, 175, 255, 0.9);
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .cyber-input:focus, .cyber-textarea:focus {
          outline: none;
          border-color: rgba(10, 175, 255, 0.7);
          box-shadow: 0 0 10px rgba(10, 175, 255, 0.5);
        }
        
        .cyber-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .cyber-button {
          position: relative;
          width: 100%;
          padding: 0.8rem;
          background: linear-gradient(135deg, rgba(10, 50, 80, 0.8), rgba(10, 30, 60, 0.9));
          border: 1px solid rgba(10, 175, 255, 0.5);
          color: white;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .cyber-button:hover {
          background: linear-gradient(135deg, rgba(10, 80, 120, 0.8), rgba(10, 50, 90, 0.9));
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.7);
        }
        
        .cyber-button-text {
          position: relative;
          z-index: 2;
        }
        
        .cyber-button-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 45%, 
            rgba(255, 255, 255, 0.1) 50%, 
            transparent 55%);
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .cyber-button:hover .cyber-button-glitch {
          opacity: 0.7;
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(-5px); }
        }
        
        .cyber-button-tag {
          position: absolute;
          right: 5px;
          bottom: 2px;
          font-size: 0.6rem;
          color: rgba(10, 175, 255, 0.7);
        }
        
        .cyber-alert {
          padding: 0.8rem;
          margin-top: 1rem;
          border-radius: 3px;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          animation: fade-in 0.5s ease;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .cyber-alert.error {
          background: rgba(255, 50, 50, 0.2);
          border: 1px solid rgba(255, 50, 50, 0.5);
          color: #ff4d4d;
        }
        
        .cyber-alert.success {
          background: rgba(50, 255, 50, 0.2);
          border: 1px solid rgba(50, 255, 50, 0.5);
          color: #4dff4d;
        }
        
        .cyber-alert.deleted {
          background: rgba(50, 50, 255, 0.2);
          border: 1px solid rgba(50, 50, 255, 0.5);
          color: #4d4dff;
        }
        
        .cyber-comments-container {
          display: grid;
          gap: 1.5rem;
        }
        
        .cyber-comment {
          border: solid 1px rgba(10, 173, 255, 0.42);
          position: relative;
          padding: 1.5rem;
          background: var(--cyber-dark);
          border-radius: 5px;
          box-shadow: var(--cyber-glow);
          transition: all 0.3s ease;
        }
        
        .cyber-comment:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(134, 173, 192, 0.23);
        }
        
        .cyber-comment-header {
          
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .cyber-comment-title {
          margin: 0;
          color: rgba(10, 175, 255, 0.9);
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .cyber-comment-likes {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cyber-comment-likes:hover {
          transform: scale(1.1);
        }
        
        .cyber-heart {
          color: rgba(255, 50, 50, 0.8);
          font-size: 1rem;
        }
        
        .cyber-likes-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .cyber-comment-text {
          margin: 1rem 0;
          color: rgba(200, 220, 255, 0.9);
          line-height: 1.5;
          white-space: pre-wrap;
        }
        
        .cyber-comment-author {
          display: block;
          text-align: right;
          color: rgba(10, 175, 255, 0.7);
          font-size: 0.8rem;
          font-style: italic;
        }
         
        .cyber-comment-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(28, 125, 173, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24, 120, 168, 0.42) 1px, transparent 1px);
          background-size: 15px 15px;
          opacity: 0.2;
          pointer-events: none;
        }
        
        
        @media (max-width: 768px) {
          .cyber-container {
            padding: 0 0.2rem;
          }
          
          .cyber-form {
            padding: 0rem;
          }
          
          .cyber-comment {
            padding: 1rem;
          }
          
          .cyber-comment-title {
            font-size: 1rem;
          }
          
          .cyber-comment-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}

export default BoxComentar;