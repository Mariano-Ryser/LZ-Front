import { useState } from "react";

export default function MapaAlmacen({ ubicacionActiva, setUbicacionActiva, onSeleccionUbicacion }) {
  // 🔹 Definimos las ubicaciones con coordenadas
  const ubicaciones = [
    
    { id: "10A-A01021", top: "0%", left: "0%" },
    { id: "10A-A01031", top: "0%", left: "5.5%" },
    { id: "10A-A01041", top: "0%", left: "11%" },
    { id: "10A-A01051", top: "0%", left: "16.5%" },
    { id: "10B-A01021", top: "0%", left: "22%" },
    { id: "10B-A01031", top: "0%", left: "27.5%" },
    { id: "10B-A01041", top: "0%", left: "33%" },

    { id: "10A-A01021", top: "10%", left: "0%" },
    { id: "10A-A01031", top: "10%", left: "5.5%" },
    { id: "10A-A01041", top: "10%", left: "11%" },
    { id: "10A-A01051", top: "10%", left: "16.5%" },
    { id: "10B-A01021", top: "10%", left: "22%" },
    { id: "10B-A01031", top: "10%", left: "27.5%" },
    { id: "10B-A01041", top: "10%", left: "33%" },

    { id: "10A-A01021", top: "15%", left: "0%" },
    { id: "10A-A01031", top: "15%", left: "5.5%" },
    { id: "10A-A01041", top: "15%", left: "11%" },
    { id: "10A-A01051", top: "15%", left: "16.5%" },
    { id: "10B-A01021", top: "15%", left: "22%" },
    { id: "10B-A01031", top: "15%", left: "27.5%" },
    { id: "10B-A01041", top: "15%", left: "33%" },

    { id: "10A-A01021", top: "25%", left: "0%" },
    { id: "10A-A01031", top: "25%", left: "5.5%" },
    { id: "10A-A01041", top: "25%", left: "11%" },
    { id: "10A-A01051", top: "25%", left: "16.5%" },
    { id: "10B-A01021", top: "25%", left: "22%" },
    { id: "10B-A01031", top: "25%", left: "27.5%" },
    { id: "10B-A01041", top: "25%", left: "33%" },

    // 🔹 Ejemplo del otro lado (derecha)
    { id: "20A-A01021", top: "0%", right: "0%" },
    { id: "20A-A01031", top: "0%", right: "5.5%" },
    { id: "20A-A01041", top: "0%", right: "11%" },
    { id: "20A-A01051", top: "0%", right: "16.5%" },
    { id: "20B-A01021", top: "0%", right: "22%" },
    { id: "20B-A01031", top: "0%", right: "27.5%" },
    { id: "20B-A01041", top: "0%", right: "33%" },
  
    { id: "30A-A01021", top: "10%", right: "0%" },
    { id: "30A-A01031", top: "10%", right: "5.5%" },
    { id: "30A-A01041", top: "10%", right: "11%" },
    { id: "30A-A01051", top: "10%", right: "16.5%" },
    { id: "30B-A01021", top: "10%", right: "22%" },
    { id: "30B-A01031", top: "10%", right: "27.5%" },
    { id: "30B-A01041", top: "10%", right: "33%" },

    { id: "30A-A02021", top: "15%", right: "0%" },
    { id: "30A-A02031", top: "15%", right: "5.5%" },
    { id: "30A-A02041", top: "15%", right: "11%" },
    { id: "30A-A02051", top: "15%", right: "16.5%" },
    { id: "30B-A02021", top: "15%", right: "22%" },
    { id: "30B-A02031", top: "15%", right: "27.5%" },
    { id: "30B-A02041", top: "15%", right: "33%" },
  ];

  return (
    <div className="mapa-container">
      <div className="mapa">
        {ubicaciones.map((u) => (
          <div
            key={`${u.id}-${u.top}-${u.left || u.right}`} // evita duplicados
            className={`estante ${ubicacionActiva === u.id ? "activo" : ""}`}
            style={{
              width: "5.5%",
              height: "5.1%",
              top: u.top,
              left: u.left,
              right: u.right,
            }}
            onClick={() => {
              setUbicacionActiva(u.id);
              onSeleccionUbicacion?.(u.id); // 👉 dispara callback al Home
            }}
          >
            <p>{u.id}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        p {
          font-family: "Courier New", Courier, monospace;
          font-size: 0.55vw;
          margin: 0;
          pointer-events: none;
        }

        .mapa-container {
          width: 100%;
          max-width: 45rem;
          margin: 0 auto;
          aspect-ratio: 1 / 2; 
          position: relative;
          height: 80vh;
        }

        .mapa {
          position: relative;
          width: 100%;
          height: 100%;
          border: 1px solid #ccc;
          background: #fafafa;
        }
        .estante {
          position: absolute;
          border: 1px solid #888;
          background: linear-gradient(145deg, #f5f5f5, #ddd);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
          background 0.2s ease;
        }
        .estante:hover {
          background: #b3ffb3;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .activo {
          background: #4caf50 !important;
          color: white;
          font-weight: bold;
          box-shadow: 0 0 15px #4caf50;
        }
      `}</style>
    </div>
  );
}
