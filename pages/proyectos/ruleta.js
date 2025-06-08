import { useState, useRef, useEffect } from 'react';
import withAdminAuth from "../../components/auth/withAdminAuth"

function Ruleta() {
  const numerosRuleta = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];
  const combinaciones = {
    c1: [0, 3, 7, 12, 15, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    c2: [1, 2, 4, 5, 6, 9, 10, 13, 14, 16, 17, 20, 22, 23, 24, 29, 31, 33, 35],
    c3: [1, 2, 5, 6, 8, 11, 13, 16, 17, 23, 25, 26, 27, 28, 29, 30, 32, 34, 35, 36],
    c4: [0, 1, 2, 3, 4, 5, 9, 12, 13, 14, 15, 16, 17, 19, 21, 26, 28, 30, 32, 35],
    c5: [0, 3, 4, 8, 9, 10, 11, 12, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
    c6: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 24, 27, 30, 33, 36],
  };
  const [seleccionados, setSeleccionados] = useState(new Set());
  const [lanzando, setLanzando] = useState(false);
  const [numeroGanador, setNumeroGanador] = useState(null);
  const pelotaRef = useRef(null);
  const anguloRef = useRef(0);
  const velocidadRef = useRef(0);
  const animacionIdRef = useRef(null);

  const getColor = (numero) => {
    if (numero === 0) return 'green';
    if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(numero)) {
      return 'red';
    }
    return 'black';
  };

  const toggleSeleccion = (numero) => {
    const nuevosSeleccionados = new Set(seleccionados);
    if (nuevosSeleccionados.has(numero)) {
      nuevosSeleccionados.delete(numero);
    } else {
      nuevosSeleccionados.add(numero);
    }
    setSeleccionados(nuevosSeleccionados);
  };

  const seleccionarCombinacion = (combinacion) => {
    const nuevosSeleccionados = new Set(combinacion);
    setSeleccionados(nuevosSeleccionados);
  };

  const animarPelota = (timestamp) => {
    if (velocidadRef.current < 0.1) {
      setLanzando(false);
      calcularNumeroGanador();
      return;
    }

    anguloRef.current = (anguloRef.current + velocidadRef.current) % 360;

    if (pelotaRef.current) {
      pelotaRef.current.style.transform = `rotate(${anguloRef.current}deg) translate(180px) rotate(-${anguloRef.current}deg)`;
    }

       //VELOVELO
    velocidadRef.current *= 0.99;
    animacionIdRef.current = requestAnimationFrame(animarPelota);
  };

  const calcularNumeroGanador = () => {
    const anguloFinal = anguloRef.current % 360;
    const indiceGanador = Math.floor((anguloFinal / 360) * numerosRuleta.length);
    const numeroGanador = numerosRuleta[indiceGanador];
    setNumeroGanador(numeroGanador);
  };

  const lanzarPelota = () => {
    if (lanzando) return;

    if (animacionIdRef.current) {
      cancelAnimationFrame(animacionIdRef.current);
    }

    velocidadRef.current = Math.random() * 18 + 5;
    setLanzando(true);
    setNumeroGanador(null);

    animacionIdRef.current = requestAnimationFrame(animarPelota);
  };

  const reiniciarPelota = () => {
    if (animacionIdRef.current) {
      cancelAnimationFrame(animacionIdRef.current);
    }

    anguloRef.current = 0;
    velocidadRef.current = 0;
    setLanzando(false);
    setNumeroGanador(null);

    if (pelotaRef.current) {
      pelotaRef.current.style.transform = `rotate(0deg) translate(180px) rotate(0deg)`;
    }
  };

  useEffect(() => {
    return () => {
      if (animacionIdRef.current) {
        cancelAnimationFrame(animacionIdRef.current);
      }
    };
  }, []);

  const ordenMesa = [
    [0],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  ];

  return (
    <div className="ruleta-container">
      <h1>Ruleta</h1>

      <div className="combinaciones">
        {Object.keys(combinaciones).map((key) => (
          <button
            key={key}
            className="boton-combinacion"
            onClick={() => seleccionarCombinacion(combinaciones[key])}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="ruleta-circular">
        {numerosRuleta.map((numero, index) => {
          const angulo = (360 / numerosRuleta.length) * index; // Ángulo de cada número
          const color = getColor(numero);
          const estaSeleccionado = seleccionados.has(numero);

          return (
            <div
              key={index}
              className="numero"
              style={{
                transform: `rotate(${angulo}deg) translate(180px) rotate(-${angulo}deg)`,
                backgroundColor: color,
                boxShadow: estaSeleccionado ? `0 0 10px 5px yellow` : 'none',
                width: '30px',
                height: '30px',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transformOrigin: 'center',
              }}
              onClick={() => toggleSeleccion(numero)}
            >
              {numero}
            </div>
          );
        })}

        <div
          ref={pelotaRef}
          className="pelota"
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            transform: 'translate(180px)',
            transformOrigin: 'center',
            transition: 'transform 0.001s linear', // Transición suave
          }}
        ></div>

        <p className="counterNumero">
          <span className="counter">({seleccionados.size})</span>
        </p>

        <button
          className="boton-lanzar"
          onClick={lanzarPelota}
          disabled={lanzando}
        >
          {lanzando ? 'En juego...' : 'Lanzar'}
        </button>

        <button
          className="boton-reiniciar"
          onClick={reiniciarPelota}
          disabled={lanzando}
        >
          Reiniciar
        </button>
      </div>

  

      <div className="seleccionados">
        <ul>
          {Array.from(seleccionados).map((numero) => (
            <li
              key={numero}
              style={{ backgroundColor: getColor(numero) }}
            >
              {numero}
            </li>
          ))}
        </ul>
      </div>

      <div className="mesa-ruleta">
        <h2>Mesa de Ruleta</h2>
        <div className="mesa-container">
          <div className="fila-mesa">
            <div
              className="numero-mesa"
              style={{
                backgroundColor: getColor(0),
                boxShadow: seleccionados.has(0) ? `0 0 15px 5px yellow` : 'none',
                opacity: seleccionados.has(0) ? 1 : 0.4,
              }}
              onClick={() => toggleSeleccion(0)}
            >
              0
            </div>
          </div>

          <div className="columnas-mesa">
            {ordenMesa.slice(1).map((columna, colIndex) => (
              <div key={colIndex} className="columna-mesa">
                {columna.map((numero) => {
                  const estaSeleccionado = seleccionados.has(numero);
                  const color = getColor(numero);
                  const colorApagado = estaSeleccionado ? color : `rgba(${color === 'red' ? '128, 0, 0' : '0, 0, 0'}, 0.5)`;

                  return (
                    <div
                      key={numero}
                      className="numero-mesa"
                      style={{
                        backgroundColor: colorApagado,
                        boxShadow: estaSeleccionado ? `0 0 15px 5px yellow` : 'none',
                        opacity: estaSeleccionado ? 1 : 0.4,
                      }}
                      onClick={() => toggleSeleccion(numero)}
                    >
                      {numero}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ruleta-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          font-family: Arial, sans-serif;
        }

        .combinaciones {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .boton-combinacion {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 5px;
          flex: 1 1 calc(25% - 10px);
          box-sizing: border-box;
          text-align: center;
        }

        .boton-combinacion:hover {
          background-color: #5a6268;
        }

        .ruleta-circular {
          position: relative;
          width: 400px; /* Aumentamos el tamaño de la ruleta */
          height: 400px; /* Aumentamos el tamaño de la ruleta */
          border: 26px solid #333;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .numero {
          position: absolute;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }

        .numero:hover {
          box-shadow: 0 0 10px 3px rgba(255, 255, 0, 0.7);
        }

        .pelota {
          transition: transform 0.001s linear; /* Transición suave */
        }

        .boton-lanzar {
          position: absolute;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
        }

        .boton-lanzar:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .boton-reiniciar {
          bottom: 90px;
          position: absolute;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
        }

        .boton-reiniciar:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .seleccionados {
          margin-top: 20px;
          text-align: center;
        }

        .seleccionados ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .seleccionados li {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          color: white;
        }

        .mesa-ruleta {
          margin-top: 0px;
          text-align: center;
        }

        .mesa-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0px;
        }

        .fila-mesa {
          display: flex;
          justify-content: center;
        }

        .columnas-mesa {
          display: flex;
          gap: 10px;
        }

        .columna-mesa {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .numero-mesa {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 5px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .numero-mesa:hover {
          opacity: 1;
        }

        .resultado {
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #28a745;
        }

        .counterNumero {
          position: absolute;
          top: 2.4rem;
          bottom: 0;
          color: white;
          font-size: 30px;
        }
      `}</style>
    </div>
  );
}

export default withAdminAuth(Ruleta);
