import { useState } from 'react';
import { useProduct } from '../services/useProducts';
import MapaAlmacen from '../components/MapaAlmacen';

export default function Home() {
  const { products, loading, error } = useProduct();

  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [ubicacionActiva, setUbicacionActiva] = useState(null);
  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [articulosUbicacion, setArticulosUbicacion] = useState([]);

  const handleBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);

    if (!texto.trim()) {
      setResultados([]);
      return;
    }

    const filtrados = products.filter((articulo) =>
      articulo.artikelNumber?.toLowerCase().startsWith(texto) ||
      articulo.artikelName?.toLowerCase().startsWith(texto)
    );

    setResultados(filtrados);
  };

  const abrirModal = (articulo) => {
    setArticuloSeleccionado(articulo);
    setUbicacionActiva(articulo.lagerPlatz);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setArticuloSeleccionado(null);
    setUbicacionActiva(null);
  };

  const handleSeleccionUbicacion = (idUbicacion) => {
    const articulos = products.filter(p => p.lagerPlatz === idUbicacion);
    setArticulosUbicacion(articulos);
    setModalUbicacionAbierto(true);
  };

  return (
    <>
      <div className="container">
        <div className="card">
          <h2>Artikel </h2>
          <input
            type="text"
            placeholder="N° Articulo o artikelName"
            value={busqueda}
            onChange={handleBusqueda}
          />

          {loading && <p>Cargando artículos...</p>}
          {error && <p>Error al cargar productos.</p>}

          {resultados.length > 0 && (
            <div className="lista-resultados">
              {resultados.map((art, index) => (
                <div
                  className="item"
                  key={art._id || index}
                  onClick={() => abrirModal(art)}
                  style={{ cursor: 'pointer' }}
                >
                  <p><strong>A-N°:</strong> {art.artikelNumber}</p><br />
                  <p><strong>Artikelname:</strong> {art.artikelName}</p><br />
                  <p><strong>Lagerplatz:</strong> {art.lagerPlatz}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {busqueda && resultados.length === 0 && !loading && (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      </div>

      {/* Modal de artículo */}
      {modalAbierto && articuloSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="cerrar" onClick={cerrarModal}>×</button>
            <h3 className='hModal'>{articuloSeleccionado.artikelName}</h3>

            {articuloSeleccionado.imagen && typeof articuloSeleccionado.imagen === 'string' && (
              <img
                src={articuloSeleccionado.imagen}
                alt={articuloSeleccionado.artikelName}
                className="product-image"
              />
            )}

            <p className='pModal'><strong>A-N°:</strong> {articuloSeleccionado.artikelNumber}</p>
            <hr />
            <p className='pModal'><strong>Lagerplatz:</strong> {articuloSeleccionado.lagerPlatz}</p>

            <MapaAlmacen
              ubicacionActiva={ubicacionActiva}
              setUbicacionActiva={setUbicacionActiva}
              onSeleccionUbicacion={handleSeleccionUbicacion}
            />
          </div>
        </div>
      )}

      {/* Modal de ubicación con lista de artículos */}
      {modalUbicacionAbierto && (
        <div className="modal-overlay" onClick={() => setModalUbicacionAbierto(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="cerrar" onClick={() => setModalUbicacionAbierto(false)}>×</button>
            <h3 className='hModal'>Artículos en {ubicacionActiva}</h3>
            {articulosUbicacion.length > 0 ? (
              <ul>
                {articulosUbicacion.map((a, i) => (
                  <li key={i}>
                    <strong>{a.artikelNumber}</strong> - {a.artikelName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay artículos en este Lagerplatz.</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-image {
          border-radius: 5px;
          width: 100%;
          max-width: 300px;
          margin: 1rem auto;
          display: block;
          border: 1px solid #ccc;
          object-fit: cover;
        }
        .item {
          padding: 16px;
          margin-bottom: 5px;
          transition: background 0.3s ease;
        }
        .item:hover {
          background-color: rgba(255, 255, 255, 1);
          transform: scale(1.02);
        }
        h2 {
          margin: 0 0 15px 0;
        }
        p {
          display: inline;
          font-size: 20px;
          margin: 0 5px 0 0;
        }
        .container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .card {
          border-radius: 5px;
          background-color: rgba(245, 245, 245, 1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 800px;
          text-align: center;
        }
        input {
          font-family: inherit;
          font-size: 20px;
          padding: 17px;
          width: 100%;
          margin-bottom: 10px;
          border: 2px solid rgba(178, 223, 255, 1);
          transition: 0.3s;
          border-radius: 10px;
        }
        input:hover {
          border: 2px solid rgba(0, 0, 0, 1);
        }
        .lista-resultados {
          text-align: left;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .modal {
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(189, 189, 189, 0.06);
          box-shadow: 10px 10px 25.4px 0.5px rgba(0, 0, 0, 0.35),
                      -5px -6px 25.4px 5px rgba(0, 0, 0, 0.25);
          padding: 30px;
          margin: 6rem 2rem auto;
          width: 700px;
          position: relative;
          color: black;
          text-align: center;
          border-radius: 2px;
          max-height: 80vh; 
          overflow-y: auto;
        }
        .modal .cerrar {
          position: absolute;
          top: 10px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 35px;
          color: black;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}