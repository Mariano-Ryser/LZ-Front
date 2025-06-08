import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Cronometro = () => {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [lapsos, setLapsos] = useState([]);
  const intervalRef = useRef(null);

  const formatTiempo = (totalSegundos) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const iniciar = () => {
    if (!activo) {
      setPausado(false);
      setActivo(true);
      intervalRef.current = setInterval(() => {
        setSegundos((prevSegundos) => prevSegundos + 1);
      }, 1000);
    } else if (pausado) {
      setPausado(false);
      intervalRef.current = setInterval(() => {
        setSegundos((prevSegundos) => prevSegundos + 1);
      }, 1000);
    }
  };

  const pausar = () => {
    if (activo && !pausado) {
      clearInterval(intervalRef.current);
      setPausado(true);
    }
  };

  const reiniciar = () => {
    clearInterval(intervalRef.current);
    setSegundos(0);
    setActivo(false);
    setPausado(false);
    setLapsos([]);
  };

  const registrarLapso = () => {
    if (activo && !pausado) {
      setLapsos([...lapsos, formatTiempo(segundos)]);
    }
  };

  return (
    <>
   
      <div className="cronometro-futurista">
        <h1>Cronó</h1>
        <div className="tiempo">{formatTiempo(segundos)}</div>
        <div className="botones">
          {!activo || pausado ? (
            <button onClick={iniciar}>Iniciar</button>
          ) : (
            <button onClick={pausar}>Pausar</button>
          )}
          {activo && pausado && (
            <button onClick={iniciar}>Reanudar</button>
          )}
          <button onClick={reiniciar}>Reiniciar</button>
          {activo && !pausado && (
            <button onClick={registrarLapso}>Lapso</button>
          )}
        </div>
        {lapsos.length > 0 && (
          <div className="lapsos">
            <h2>Lapsos</h2>
            <ul>
              {lapsos.map((lapso, index) => (
                <li key={index}>
                  <span>{index + 1}.</span> {lapso}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <style jsx>{`
        .cronometro-futurista {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background-color: #1e272e;
          color: #80cbc4;
          border: 2px solid #80cbc4;
          border-radius: 8px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin-top: 1rem;
        }

        h1 {
          color: #c3e88d;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
        }

        .tiempo {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #f0f8ea;
          font-family: 'Consolas', monospace;
        }

        .botones {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        button {
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          border: 1px solid #80cbc4;
          border-radius: 5px;
          background-color: transparent;
          color: #80cbc4;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-family: inherit;
        }

        button:hover {
          background-color: #80cbc4;
          color: #1e272e;
        }

        .lapsos {
          width: 80%;
          margin-top: 1.5rem;
          padding: 1rem;
          border: 1px solid #80cbc4;
          border-radius: 5px;
          background-color: #2c3847;
        }

        .lapsos h2 {
          color: #c3e88d;
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
        }

        .lapsos ul {
          list-style: none;
          padding: 0;
        }

        .lapsos li {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #80cbc4;
        }

        .lapsos li:last-child {
          border-bottom: none;
        }

        .lapsos li span {
          color: #f0f8ea;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        a {
          color: #80cbc4;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        li {
          list-style: none;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default Cronometro;