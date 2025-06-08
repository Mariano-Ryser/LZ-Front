import { useState, useEffect } from 'react';
import useNotiData from '../../services/useNoti';

function Noti({ limit = 100 }) {
  const current = new Date();
  const datee = `${current.getDate()} / ${current.getMonth() + 1} / ${current.getFullYear()}`;

  const { data: notis, loading, error, createItem, fetchData, likeItem } = useNotiData('notis', limit);
  const [noti, setNoti] = useState({ titulo: '', text: '' });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorM, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoti((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!noti.titulo.trim() || !noti.text.trim()) {
      setError('Por favor, completa todos los campos.');
      setIsSubmitting(false);
      return;
    }

    try {
      await createItem(noti);
      setNoti({ titulo: '', text: '' });
      setSuccessMessage('Noticia creada con éxito!');
      setError(null);
      setTimeout(() => setSuccessMessage(null), 2100);
    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cyber-container">
      <form className="cyber-form" onSubmit={handleSubmit}>
        <div className="cyber-header">
          <p className="cyber-date">{datee}</p>
          <div className="cyber-grid"></div>
        </div>

        <input
          placeholder="TÍTULO"
          className="cyber-input"
          name="titulo"
          value={noti.titulo}
          onChange={handleChange}
        />

        <textarea
          placeholder="ESCRIBE TU NOTICIA..."
          className="cyber-textarea"
          name="text"
          value={noti.text}
          onChange={handleChange}
        />

        <button className="cyber-button" type="submit" disabled={isSubmitting}>
          <span className="cyber-button-text">
            {isSubmitting ? 'PROCESANDO...' : 'TRANSMITIR'}
          </span>
          <span className="cyber-button-glow"></span>
        </button>

        {successMessage && (
          <div className="cyber-alert success">
            <div className="cyber-alert-icon">✓</div>
            {successMessage}
          </div>
        )}
        {errorM && (
          <div className="cyber-alert error">
            <div className="cyber-alert-icon">⚠</div>
            {errorM}
          </div>
        )}
      </form>

      <div className="cyber-news-container">
        {loading ? (
          <div className="cyber-loading">
            <div className="cyber-loading-bar"></div>
            <div className="cyber-loading-text">CARGANDO TRANSMISIONES...</div>
          </div>
        ) : (
          notis.map(({ _id, titulo, text, likes }) => (
            <div key={_id} className="cyber-news-card">
              <div className="cyber-news-header">
                <h2 className="cyber-news-title">{titulo}</h2>
                <div className="cyber-news-corner"></div>
              </div>
              <p className="cyber-news-text">{text}</p>
              <div className="cyber-news-footer">
                <button 
                  className="cyber-like-button" 
                  onClick={() => likeItem(_id)}
                >
                  <span className="cyber-heart">❤</span>
                  <span className="cyber-likes">{likes}</span>
                  <span className="cyber-pulse"></span>
                </button>
              </div>
              <div className="cyber-news-grid"></div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        :root {
          --neon-blue: rgba(10, 175, 255, 0.8);
          --neon-pink: rgba(255, 10, 175, 0.8);
          --cyber-dark: rgba(10, 15, 25, 0.95);
          --cyber-border: 1px solid rgba(10, 175, 255, 0.3);
          --cyber-glow: 0 0 15px rgba(10, 175, 255, 0.5);
        }
        
        .cyber-container {
          max-width: 800px;
          margin: 0 auto;
          background: var(--cyber-dark);
          font-family: 'Courier New', monospace;
        }
        
        .cyber-form {
          position: relative;
          padding-bottom: 2rem;
        }
        
        .cyber-header {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .cyber-date {
          text-align: right;
          color: rgba(10, 175, 255, 0.7);
          font-size: 0.9rem;
          margin: 0;
        }
        
        .cyber-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(26, 129, 180, 0.42) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27, 150, 211, 0.27) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.2;
          z-index: -1;
        }
        
        .cyber-input, .cyber-textarea {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1.5rem;
          background: rgba(0, 10, 20, 0.7);
          border: var(--cyber-border);
          border-radius: 3px;
          color: rgba(10, 175, 255, 0.9);
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }
        
        .cyber-input::placeholder, .cyber-textarea::placeholder {
          color: rgba(10, 175, 255, 0.5);
        }
        
        .cyber-input:focus, .cyber-textarea:focus {
          outline: none;
          border-color: rgba(10, 175, 255, 0.7);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.5);
        }
        
        .cyber-textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .cyber-button {
          position: relative;
          width: 100%;
          padding: 1rem;
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
        
        .cyber-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .cyber-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(10, 80, 120, 0.8), rgba(10, 50, 90, 0.9));
          box-shadow: 0 0 20px rgba(10, 175, 255, 0.7);
        }
        
        .cyber-button-text {
          position: relative;
          z-index: 2;
        }
        
        .cyber-button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.5s ease;
        }
        
        .cyber-button:hover:not(:disabled) .cyber-button-glow {
          left: 100%;
        }
        
        .cyber-alert {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          margin-top: 1.5rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          animation: fade-in 0.5s ease;
        }
        
        .cyber-alert-icon {
          font-size: 1.2rem;
        }
        
        .cyber-alert.success {
          background: rgba(50, 255, 50, 0.2);
          border: 1px solid rgba(50, 255, 50, 0.5);
          color: #4dff4d;
        }
        
        .cyber-alert.error {
          background: rgba(255, 50, 50, 0.2);
          border: 1px solid rgba(255, 50, 50, 0.5);
          color: #ff4d4d;
        }
        
        .cyber-news-container {
          display: grid;
          gap: 2rem;
        }
        
        .cyber-news-card {
          
          position: relative;
          padding: 1rem;
          border: var(--cyber-border);
          border-radius: 5px;
          box-shadow: var(--cyber-glow);
          transition: all 0.3s ease;
          overflow: hidden;
          background-image: 
            linear-gradient(rgba(24, 219, 233, 0.53) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 92, 163, 0.95) 1px, transparent 1px);
        }
        
        .cyber-news-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.8);
        }
        
        .cyber-news-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .cyber-news-title {
          margin: 0;
          color: rgba(10, 175, 255, 0.9);
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .cyber-news-corner {
          width: 30px;
          height: 30px;
          border-top: 2px solid var(--neon-blue);
          border-right: 2px solid var(--neon-blue);
          opacity: 0.7;
        }
        
        .cyber-news-text {
          margin: 1.5rem 0;
          color: rgba(200, 220, 255, 0.9);
          line-height: 1.6;
          white-space: pre-line;
        }
        
        .cyber-news-footer {
          display: flex;
          justify-content: flex-end;
        }
        
        .cyber-like-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .cyber-heart {
          font-size: 1.2rem;
          color: rgba(255, 50, 50, 0.8);
          transition: all 0.3s ease;
        }
        
        .cyber-likes {
          font-family: 'Courier New', monospace;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .cyber-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: rgba(255, 50, 50, 0.3);
          transform: scale(0);
          opacity: 0;
        }
        
        .cyber-like-button:hover .cyber-heart {
          transform: scale(1.2);
        }
        
        .cyber-like-button:active .cyber-heart {
          transform: scale(0.9);
        }
        
        .cyber-like-button:active .cyber-pulse {
          animation: like-pulse 0.5s ease-out;
        }
        
        .cyber-news-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(10, 175, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 175, 255, 0.05) 1px, transparent 1px);
          background-size: 15px 15px;
          opacity: 0.15;
          pointer-events: none;
        }
        
        .cyber-loading {
          padding: 2rem;
          text-align: center;
        }
        
        .cyber-loading-bar {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
          animation: loading 1.5s infinite;
          margin-bottom: 1rem;
        }
        
        .cyber-loading-text {
          color: rgba(10, 175, 255, 0.7);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes like-pulse {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes loading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @media (max-width: 768px) {
          .cyber-container {
          }
          
          .cyber-form {
            padding-bottom: 1.5rem;
          }
          
          .cyber-news-card {
          }
          
          .cyber-news-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Noti;