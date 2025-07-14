// components/MapaAlmacen.js
export default function MapaAlmacen({ ubicacion }) {
  return (
    <div className="mapa-container">
      <div className="mapa">
        {Array.from({ length: 5 }, (_, fila) => (
          <div className="fila" key={fila}>
            {Array.from({ length: 5 }, (_, col) => {
              const pos = `Estante ${String.fromCharCode(65 + fila)}${col + 1}`;
              const esActual = pos === ubicacion;
              return (
                <div
                  key={pos}
                  className={`celda ${esActual ? 'activo' : ''}`}
                  title={pos}
                >
                  {esActual ? '📦' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mapa-container {
          margin-top: 20px;
        }
        .mapa {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: #f0f0f0;
          padding: 10px;
          border-radius: 10px;
        }
        .fila {
          display: flex;
          gap: 5px;
        }
        .celda {
          width: 40px;
          height: 40px;
          background: #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-size: 20px;
        }
        .celda.activo {
          background: #2196f3;
          color: white;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}