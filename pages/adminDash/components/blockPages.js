import { useState, useEffect } from 'react';
import Link from 'next/link';

function BlockPages() {
  const blockeds = [
    {
      id: 1,
      title: "RULETA",
      description: "Herramienta de cálculo con funciones científicas y diseño interactivo",
      url: "/proyectos/ruleta",
    },
    {
      id: 2,
      title: "BUSCADOR DE PALABRAS",
      description: "Ingresar conjunto de letras, y aparecerán palabras",
      url: "/proyectos/buscaPalabra",
    },
    {
      id: 3,
      title: "",
      description: "Creando diseño de nuevas paginas Personal tools! ",
      url: "/proyectos/test",
    },
  ];

  return (
    <>
      {blockeds.map((blocked) => (
        <Link key={blocked.id} href={blocked.url} passHref>
          <div className="grid-card">
            <div>
              <h3>{blocked.title}</h3>
              <p>{blocked.description}</p>
              <span>Go-</span>
            </div>
          </div>
        </Link>
      ))}

      <style jsx>{`
        .grid-card {
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .grid-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
          border-color: rgba(10, 218, 255, 0.3);
        }

        .grid-card h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #0adaff;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .grid-card {
            padding: 1rem;
          }

          .grid-card h3 {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .grid-card {
            padding: 0.8rem;
          }

          .grid-card h3 {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}

export default BlockPages;