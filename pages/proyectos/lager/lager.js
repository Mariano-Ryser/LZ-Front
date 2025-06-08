import { useState } from 'react';
import Head from 'next/head';

export default function MapaAlmacen() {
  const [pisoActual, setPisoActual] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  // Configuración de cada piso con pasillos y estanterías
  const pisos = {
    1: {
      nombre: "Piso 1 - Recepción",
      layout: [
        ['E', 'E', 'P', 'E', 'E', 'P', 'E', 'E'],
        ['E', 'E', 'P', 'E', 'E', 'P', 'E', 'E'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['E', 'E', 'P', 'E', 'E', 'P', 'E', 'E'],
        ['E', 'E', 'P', 'E', 'E', 'P', 'E', 'E'],
      ],
      anchoPasillo: 2
    },
    2: {
      nombre: "Piso 2 - Almacenamiento",
      layout: [
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['P', 'P', 'P', 'P', 'P', 'P', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
        ['E', 'E', 'P', 'E', 'E', 'E', ],
      ],
      anchoPasillo: 3
    },
    3: {
      nombre: "Piso 3 - Distribución",
      layout: [
        ['E', 'P', 'E', 'P', 'E'],
        ['E', 'P', 'E', 'P', 'E'],
        ['P', 'P', 'P', 'P', 'P'],
        ['E', 'P', 'E', 'P', 'E'],
        ['E', 'P', 'E', 'P', 'E'],
      ],
      anchoPasillo: 1
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>Mapa del Almacén</title>
      </Head>

      <main>
        <div className="header">
          <h1>Mapa del Almacén</h1>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        
        <div className="layout">
          {/* Panel de pisos */}
          <div className="panel-pisos">
            <h2>Pisos</h2>
            <ul className="lista-pisos">
              {[1, 2, 3].map((piso) => (
                <li key={piso}>
                  <button
                    onClick={() => setPisoActual(piso)}
                    className={pisoActual === piso ? 'active' : ''}
                  >
                    Piso {piso}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa del almacén */}
          <div className="panel-mapa">
            <h2>{pisos[pisoActual].nombre}</h2>
            <div className="mapa-container">
              <div className="mapa" style={{ 
                gridTemplateColumns: `repeat(${pisos[pisoActual].layout[0].length}, 1fr)`
              }}>
                {pisos[pisoActual].layout.flatMap((fila, filaIndex) =>
                  fila.map((tipo, colIndex) => {
                    const key = `${filaIndex}-${colIndex}`;
                    if (tipo === 'E') {
                      return (
                        <div 
                          key={key}
                          className="estanteria"
                          title={`Estantería ${filaIndex+1}-${colIndex+1}`}
                        >
                          E{filaIndex+1}-{colIndex+1}
                        </div>
                      );
                    } else {
                      return (
                        <div 
                          key={key}
                          className="pasillo"
                          title="Pasillo"
                        >
                          {filaIndex % 2 === 0 && colIndex % 2 === 0 && (
                            <span className="persona">🚶</span>
                          )}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background-color: #f5f5f5;
          color: #333;
          transition: all 0.3s ease;
        }
        
        .container.dark {
          background-color: #1a202c;
          color: #e2e8f0;
        }
        
        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: inherit;
        }
        
        .dark-mode-toggle {
          background: #4a5568;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .container.dark .dark-mode-toggle {
          background: #e2e8f0;
          color: #2d3748;
        }
        
        .dark-mode-toggle:hover {
          opacity: 0.9;
        }
        
        .layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .layout {
            flex-direction: row;
          }
        }
        
        .panel-pisos {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          width: 100%;
        }
        
        .container.dark .panel-pisos {
          background: #2d3748;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        @media (min-width: 768px) {
          .panel-pisos {
            width: 20%;
            min-width: 200px;
          }
        }
        
        .panel-pisos h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: inherit;
        }
        
        .lista-pisos {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .lista-pisos button {
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          border: none;
          background: #edf2f7;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          color: #4a5568;
        }
        
        .container.dark .lista-pisos button {
          background: #4a5568;
          color: #e2e8f0;
        }
        
        .lista-pisos button:hover {
          background-color: #e2e8f0;
        }
        
        .container.dark .lista-pisos button:hover {
          background-color: #718096;
        }
        
        .lista-pisos button.active {
          background-color: #4299e1;
          color: white;
        }
        
        .container.dark .lista-pisos button.active {
          background-color: #63b3ed;
        }
        
        .panel-mapa {
          width: 100%;
        }
        
        @media (min-width: 768px) {
          .panel-mapa {
            width: 80%;
          }
        }
        
        .panel-mapa h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: inherit;
        }
        
        .mapa-container {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        
        .container.dark .mapa-container {
          background: #2d3748;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .mapa {
          display: grid;
          gap: 4px;
          min-width: fit-content;
        }
        
        .estanteria {
          border: 1px solid #cbd5e0;
          padding: 0.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0.125rem;
          background-color: #ebf8ff;
          min-width: 60px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .container.dark .estanteria {
          border-color: #4a5568;
          background-color: #2c5282;
          color: #ebf8ff;
        }
        
        .estanteria:hover {
          background-color: #bee3f8;
          border-color: #63b3ed;
          transform: scale(1.05);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .container.dark .estanteria:hover {
          background-color: #4299e1;
          border-color: #ebf8ff;
        }
        
        .pasillo {
          background-color: #f7fafc;
          border: 1px dashed #a0aec0;
          min-width: 60px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .container.dark .pasillo {
          background-color: #4a5568;
          border-color: #718096;
        }
        
        .persona {
          font-size: 1.5rem;
          animation: move 2s infinite alternate;
        }
        
        @keyframes move {
          0% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}