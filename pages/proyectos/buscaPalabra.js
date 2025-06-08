import { useState } from "react";
import withAdminAuth from "../../components/auth/withAdminAuth";

function CyberWordFinder() {
  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchWords = async () => {
    if (!input) return;
    setLoading(true);
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1000);
    
    try {
      const response = await fetch(`${baseURL}/palabras/buscar?letras=${input}`);
      const data = await response.json();
      setFoundWords(data.palabras || []);
    } catch (error) {
      console.error("Error al buscar palabras:", error);
      setFoundWords([]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWords();
    }
  };

  return (
    <div className="cyber-container">
      <div className="cyber-header">
        <h1 className={`cyber-title ${isGlitching ? 'glitch' : ''}`}>
          <span data-text="■ CYBERWORD FINDER ■">■ CYBERWORD FINDER ■</span>
        </h1>
        <div className="cyber-grid"></div>
      </div>

      <div className="cyber-input-group">
        <div className="cyber-input-wrapper">
          <input
            type="text"
            placeholder="INGRESA LETRAS..."
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="cyber-input"
            maxLength="12"
          />
          <div className="cyber-input-border"></div>
        </div>
        
        <button 
          onClick={fetchWords} 
          className={`cyber-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          <span className="cyber-button-text">
            {loading ? 'ESCANEANDO...' : '■ BUSCAR ■'}
          </span>
          <span className="cyber-button-glitch"></span>
          <span className="cyber-button-tag">R-2023</span>
        </button>
      </div>

      <div className="cyber-results-panel">
        <div className="cyber-stats">
          <div className="cyber-stat">
            <span className="cyber-stat-label">CARACTERES:</span>
            <span className="cyber-stat-value">{input.length || '0'}</span>
          </div>
          <div className="cyber-stat">
            <span className="cyber-stat-label">PALABRAS:</span>
            <span className="cyber-stat-value">{foundWords.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="cyber-loading">
            <div className="cyber-scanline"></div>
            <div className="cyber-loading-text">ESCANEANDO LEXICON...</div>
          </div>
        ) : (
          <div className="cyber-words-grid">
            {foundWords.length > 0 ? (
              foundWords.map((word, index) => (
                <div key={index} className="cyber-word-card">
                  <div className="cyber-word-length">{word.length}</div>
                  <div className="cyber-word-text">{word}</div>
                  <div className="cyber-word-hover">{word}</div>
                </div>
              ))
            ) : (
              <div className="cyber-no-results">
                <span>NO HAY RESULTADOS</span>
                <div className="cyber-error-symbol">✖</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        :root {
          --neon-blue: rgba(10, 175, 255, 0.8);
          --neon-pink: rgba(255, 10, 175, 0.8);
          --neon-green: rgba(0, 255, 100, 0.8);
          --cyber-dark: rgba(10, 15, 25, 0.95);
          --cyber-darker: rgba(5, 10, 15, 0.98);
          --cyber-border: 1px solid rgba(10, 175, 255, 0.3);
          --cyber-glow: 0 0 15px rgba(10, 175, 255, 0.5);
          --cyber-text-glow: 0 0 8px rgba(10, 175, 255, 0.7);
        }

        /* ESTRUCTURA PRINCIPAL */
        .cyber-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0;
          background: var(--cyber-darker);
          border: var(--cyber-border);
          box-shadow: 0 0 30px rgba(10, 175, 255, 0.3);
          font-family: 'Share Tech Mono', monospace, 'Courier New';
          color: white;
          position: relative;
          overflow: hidden;
        }

        /* HEADER CON EFECTO GLITCH */
        .cyber-header {
          position: relative;
          padding: 1.5rem;
          background: linear-gradient(
            to right, 
            rgba(10, 20, 30, 0.9), 
            rgba(15, 25, 40, 0.9)
          );
          border-bottom: var(--cyber-border);
        }

        .cyber-title {
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--neon-blue);
          text-shadow: var(--cyber-text-glow);
          position: relative;
          z-index: 2;
          margin: 0;
          text-align: center;
        }

        .cyber-title.glitch {
          animation: glitch-anim 0.3s infinite;
        }

        .cyber-title span {
          position: relative;
        }

        .cyber-title span::before {
          content: attr(data-text);
          position: absolute;
          left: -2px;
          text-shadow: 2px 0 rgba(255, 0, 0, 0.7);
          background: var(--cyber-darker);
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }

        .cyber-title span::after {
          content: attr(data-text);
          position: absolute;
          left: 2px;
          text-shadow: -2px 0 rgba(0, 255, 255, 0.7);
          background: var(--cyber-darker);
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }

        /* EFECTO GRID DE FONDO */
        .cyber-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(8, 147, 216, 0.51) 1px, transparent 1px),
            linear-gradient(90deg, rgba(19, 143, 46, 0.39) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
          pointer-events: none;
        }

        /* GRUPO DE ENTRADA */
        .cyber-input-group {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* INPUT ESTILIZADO */
        .cyber-input-wrapper {
          position: relative;
        }

        .cyber-input {
          width: 100%;
          padding: 1rem;
          background: rgba(0, 5, 10, 0.7);
          border: none;
          border-radius: 0;
          color: var(--neon-green);
          font-size: 1.2rem;
          text-transform: uppercase;
          text-align: center;
          letter-spacing: 3px;
          outline: none;
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          z-index: 2;
        }

        .cyber-input-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1px solid transparent;
      
          z-index: 1;

        }

        /* BOTÓN CYBERPUNK */
        .cyber-button {
          position: relative;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(
            to right, 
            rgba(10, 50, 80, 0.8), 
            rgba(20, 30, 60, 0.9)
          );
          border: none;
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .cyber-button.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cyber-button-text {
          position: relative;
          z-index: 3;
        }

        .cyber-button-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
       
          opacity: 0;
          z-index: 2;
          transition: all 0.3s ease;
        }

     

        .cyber-button-tag {
          position: absolute;
          right: 5px;
          bottom: 2px;
          font-size: 0.6rem;
          color: var(--neon-blue);
          z-index: 3;
        }

        /* PANEL DE RESULTADOS */
        .cyber-results-panel {
          padding: 1.5rem;
          background: rgba(5, 10, 15, 0.7);
          border-top: var(--cyber-border);
        }

        /* ESTADÍSTICAS */
        .cyber-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .cyber-stat {
          flex: 1;
          padding: 0.8rem;
          background: rgba(10, 20, 30, 0.5);
          border: var(--cyber-border);
          text-align: center;
        }

        .cyber-stat-label {
          display: block;
          font-size: 0.8rem;
          color: var(--neon-blue);
          margin-bottom: 0.3rem;
        }

        .cyber-stat-value {
          font-size: 1.4rem;
          font-weight: bold;
          color: white;
          text-shadow: var(--cyber-text-glow);
        }

        /* ANIMACIÓN DE CARGA */
        .cyber-loading {
          position: relative;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }



        .cyber-loading-text {
          color: var(--neon-blue);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          animation: pulse 1.5s infinite alternate;
        }

        /* GRID DE PALABRAS */
        .cyber-words-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }

        /* TARJETAS DE PALABRAS */
        .cyber-word-card {
          position: relative;
          padding: 1rem;
          background: rgba(10, 30, 50, 0.3);
          border: 1px solid rgba(10, 175, 255, 0.2);
          transition: all 0.3s ease;
          overflow: hidden;
          text-align: center;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .cyber-word-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.4);
          border-color: var(--neon-blue);
        }

        .cyber-word-length {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          background: rgba(10, 175, 255, 0.2);
          border-radius: 50%;
          color: var(--neon-blue);
        }

        .cyber-word-text {
          font-size: 1.2rem;
          text-transform: uppercase;
          color: white;
          position: relative;
          z-index: 2;
        }

        .cyber-word-hover {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(10, 175, 255, 0.1);
          color: var(--neon-blue);
          font-size: 1.4rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

     

        /* SIN RESULTADOS */
        .cyber-no-results {
          grid-column: 1 / -1;
          padding: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(255, 50, 50, 0.7);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .cyber-error-symbol {
          font-size: 2rem;
          animation: flicker 1s infinite alternate;
        }

     

        /* RESPONSIVE PARA MÓVILES */
        @media (max-width: 768px) {
          .cyber-container {
            margin: 0;
            border: none;
            border-radius: 0;
          }

          .cyber-title {
            font-size: 1.4rem;
            letter-spacing: 2px;
          }

          .cyber-input-group {
            padding: 1rem;
          }

          .cyber-input {
            font-size: 1rem;
            padding: 0.8rem;
          }

          .cyber-button {
            padding: 0.8rem;
            font-size: 1rem;
          }

          .cyber-stats {
            flex-direction: column;
          }

          .cyber-stat {
            padding: 0.6rem;
          }

          .cyber-words-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 0.8rem;
          }

          .cyber-word-card {
            min-height: 70px;
            padding: 0.8rem;
          }

          .cyber-word-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .cyber-title {
            font-size: 1.2rem;
          }

          .cyber-words-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 0.6rem;
          }

          .cyber-word-card {
            min-height: 60px;
            padding: 0.6rem;
          }

          .cyber-word-text {
            font-size: 0.9rem;
          }

          .cyber-stat-label {
            font-size: 0.7rem;
          }

          .cyber-stat-value {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default withAdminAuth(CyberWordFinder);