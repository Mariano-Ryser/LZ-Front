import { useState } from 'react';
import MapaAlmacen from '../components/MapaAlmacen';

export default function Home() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

const articulos = [
  { artikelNumber: '5012395', artikelName: 'Kragenschwimmweste ALTERNA', lagerPlatz: '00G-B08041' },
  { artikelNumber: '1001', artikelName: 'Monitor LG 24"', lagerPlatz: 'Estante A1' },
  { artikelNumber: '1002', artikelName: 'Teclado Mecánico Redragon', lagerPlatz: 'Estante A2' },
  { artikelNumber: '1003', artikelName: 'Mouse Logitech G203', lagerPlatz: 'Estante A3' },
  { artikelNumber: '1004', artikelName: 'Laptop Dell XPS 13', lagerPlatz: 'Estante A4' },
  { artikelNumber: '1005', artikelName: 'Impresora HP LaserJet Pro', lagerPlatz: 'Estante A5' },
  { artikelNumber: '1006', artikelName: 'Router TP-Link Archer C6', lagerPlatz: 'Estante A6' },
  { artikelNumber: '1007', artikelName: 'Auriculares Sony WH-1000XM4', lagerPlatz: 'Estante A7' },
  { artikelNumber: '1008', artikelName: 'Cámara Canon EOS M50', lagerPlatz: 'Estante A8' },
  { artikelNumber: '1009', artikelName: 'Proyector Epson VS250', lagerPlatz: 'Estante A9' },
  { artikelNumber: '1010', artikelName: 'Tablet Samsung Galaxy Tab A8', lagerPlatz: 'Estante A10' },
  { artikelNumber: '2011', artikelName: 'Disco Duro Externo Seagate 1TB', lagerPlatz: 'Estante B1' },
  { artikelNumber: '2012', artikelName: 'Memoria USB Kingston 64GB', lagerPlatz: 'Estante B2' },
  { artikelNumber: '2013', artikelName: 'Batería Portátil Anker 20000mAh', lagerPlatz: 'Estante B3' },
  { artikelNumber: '2014', artikelName: 'Smartwatch Xiaomi Mi Band 7', lagerPlatz: 'Estante B4' },
  { artikelNumber: '2015', artikelName: 'Cargador Inalámbrico Belkin', lagerPlatz: 'Estante B5' },
  { artikelNumber: '2016', artikelName: 'Altavoz JBL Flip 5', lagerPlatz: 'Estante B6' },
  { artikelNumber: '2017', artikelName: 'Panel Solar Portátil EcoFlow', lagerPlatz: 'Estante B7' },
  { artikelNumber: '2018', artikelName: 'Ventilador de Escritorio USB', lagerPlatz: 'Estante B8' },
  { artikelNumber: '2019', artikelName: 'Lámpara LED con Clip', lagerPlatz: 'Estante B9' },
  { artikelNumber: '2020', artikelName: 'Micrófono Blue Yeti', lagerPlatz: 'Estante B10' },
  { artikelNumber: '3021', artikelName: 'Webcam Logitech C920', lagerPlatz: 'Estante C1' },
  { artikelNumber: '3022', artikelName: 'Soporte para Laptop Ajustable', lagerPlatz: 'Estante C2' },
  { artikelNumber: '3023', artikelName: 'Base de Enfriamiento para Laptop', lagerPlatz: 'Estante C3' },
  { artikelNumber: '3024', artikelName: 'Silla Ergonómica de Oficina', lagerPlatz: 'Estante C4' },
  { artikelNumber: '3025', artikelName: 'Escritorio Elevable', lagerPlatz: 'Estante C5' },
  { artikelNumber: '3026', artikelName: 'Organizador de Cables', lagerPlatz: 'Estante C6' },
  { artikelNumber: '3027', artikelName: 'Cinta Doble Cara 3M', lagerPlatz: 'Estante C7' },
  { artikelNumber: '3028', artikelName: 'Kit de Herramientas Electrónicas', lagerPlatz: 'Estante C8' },
  { artikelNumber: '3029', artikelName: 'Cable HDMI 2.1 2m', lagerPlatz: 'Estante C9' },
  { artikelNumber: '3030', artikelName: 'Adaptador USB-C a HDMI', lagerPlatz: 'Estante C10' },
  { artikelNumber: '4031', artikelName: 'Tira LED RGB Wi-Fi', lagerPlatz: 'Estante D1' },
  { artikelNumber: '4032', artikelName: 'Regleta con USB', lagerPlatz: 'Estante D2' },
  { artikelNumber: '4033', artikelName: 'Caja Organizadora Plástica', lagerPlatz: 'Estante D3' },
  { artikelNumber: '4034', artikelName: 'Mouse Pad XXL Antideslizante', lagerPlatz: 'Estante D4' },
  { artikelNumber: '4035', artikelName: 'Cámara de Seguridad Wi-Fi', lagerPlatz: 'Estante D5' },
  { artikelNumber: '4036', artikelName: 'Kit de Alarmas para Casa', lagerPlatz: 'Estante D6' },
  { artikelNumber: '4037', artikelName: 'Sensor de Movimiento PIR', lagerPlatz: 'Estante D7' },
  { artikelNumber: '4038', artikelName: 'Detector de Humo Inteligente', lagerPlatz: 'Estante D8' },
  { artikelNumber: '4039', artikelName: 'Enchufe Inteligente Wi-Fi', lagerPlatz: 'Estante D9' },
  { artikelNumber: '4040', artikelName: 'Bombilla LED Inteligente', lagerPlatz: 'Estante D10' },
  { artikelNumber: '5041', artikelName: 'Filtro de Agua Portátil', lagerPlatz: 'Estante E1' },
  { artikelNumber: '5042', artikelName: 'Cafetera Nespresso Inissia', lagerPlatz: 'Estante E2' },
  { artikelNumber: '5043', artikelName: 'Hervidor Eléctrico de Acero', lagerPlatz: 'Estante E3' },
  { artikelNumber: '5044', artikelName: 'Plancha de Ropa Philips', lagerPlatz: 'Estante E4' },
  { artikelNumber: '5045', artikelName: 'Aspiradora Robot Xiaomi', lagerPlatz: 'Estante E5' },
  { artikelNumber: '5046', artikelName: 'Purificador de Aire Levoit', lagerPlatz: 'Estante E6' },
  { artikelNumber: '5047', artikelName: 'Mini Refrigerador Portátil', lagerPlatz: 'Estante E7' },
  { artikelNumber: '5048', artikelName: 'Humidificador Ultrasónico', lagerPlatz: 'Estante E8' },
  { artikelNumber: '5049', artikelName: 'Cámara Deportiva GoPro Hero 9', lagerPlatz: 'Estante E9' },
  { artikelNumber: '5050', artikelName: 'Estabilizador de Voltaje APC', lagerPlatz: 'Estante E10' },
  { artikelNumber: '6051', artikelName: 'Switch de Red TP-Link 8 Puertos', lagerPlatz: 'Estante F1' },
  { artikelNumber: '6052', artikelName: 'Extensor Wi-Fi Mesh', lagerPlatz: 'Estante F2' },
  { artikelNumber: '6053', artikelName: 'Cargador USB-C para Laptop', lagerPlatz: 'Estante F3' },
  { artikelNumber: '6054', artikelName: 'Hub USB 4 Puertos 3.0', lagerPlatz: 'Estante F4' },
  { artikelNumber: '6055', artikelName: 'Pantalla Portátil 15.6"', lagerPlatz: 'Estante F5' },
  { artikelNumber: '6056', artikelName: 'Soporte de Pared para TV', lagerPlatz: 'Estante F6' },
  { artikelNumber: '6057', artikelName: 'Smartphone Samsung Galaxy A54', lagerPlatz: 'Estante F7' },
  { artikelNumber: '6058', artikelName: 'iPad 10ª Generación', lagerPlatz: 'Estante F8' },
  { artikelNumber: '6059', artikelName: 'Consola PlayStation 5', lagerPlatz: 'Estante F9' },
  { artikelNumber: '6060', artikelName: 'Control DualSense PS5', lagerPlatz: 'Estante F10' },
  { artikelNumber: '7061', artikelName: 'Cable de Red Cat6 5m', lagerPlatz: 'Estante G1' },
  { artikelNumber: '7062', artikelName: 'Pinza Crimpadora RJ45', lagerPlatz: 'Estante G2' },
  { artikelNumber: '7063', artikelName: 'Tester de Cable de Red', lagerPlatz: 'Estante G3' },
  { artikelNumber: '7064', artikelName: 'Base Giratoria para Monitor', lagerPlatz: 'Estante G4' },
  { artikelNumber: '7065', artikelName: 'Kit de Limpieza para Pantallas', lagerPlatz: 'Estante G5' },
  { artikelNumber: '7066', artikelName: 'Luces LED para Videollamadas', lagerPlatz: 'Estante G6' },
  { artikelNumber: '7067', artikelName: 'Cámara Web 4K Aukey', lagerPlatz: 'Estante G7' },

  ];

  const handleBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);

    if (texto.trim() === '') {
      setResultados([]);
      return;
    }

    const filtrados = articulos.filter((articulo) =>
      articulo.artikelNumber.startsWith(texto) ||
      articulo.artikelName.toLowerCase().startsWith(texto)
    );

    setResultados(filtrados);
  };

  const abrirModal = (articulo) => {
    setArticuloSeleccionado(articulo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setArticuloSeleccionado(null);
  };

  return (
    <>
      <div className="container">
        <div className="card">
          <h2>Artikelfinder</h2>
          <input
            type="text"
            placeholder="N° artículo o artikelName"
            value={busqueda}
            onChange={handleBusqueda}
          />

          {resultados.length > 0 && (
            <div className="lista-resultados">
              {resultados.map((art, index) => (
                <div 
                  className="item" 
                  key={index} 
                  onClick={() => abrirModal(art)}
                  style={{cursor: 'pointer'}}
                >
                  <p><strong>A-N°:</strong> {art.artikelNumber}</p>
                  <p><strong>Artikelname:</strong> {art.artikelName}</p>
                  <p><strong>Lagerplatz:</strong> {art.lagerPlatz}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {busqueda && resultados.length === 0 && (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && articuloSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="cerrar" onClick={cerrarModal}>×</button>
            <h3>{articuloSeleccionado.artikelName}</h3>
            <div className="imagen">
              <img src={articuloSeleccionado.imagen} alt={articuloSeleccionado.artikelName} />
            </div>
            <p><strong>A-N°:</strong> {articuloSeleccionado.artikelNumber}</p>
            <p><strong>Lagerplatz:</strong> {articuloSeleccionado.lagerPlatz}</p>
            
          <MapaAlmacen ubicacion={articuloSeleccionado.lagerPlatz} />
          </div>
        </div>
      )}

      <style jsx>{`
        .item {
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 5px;
          transition: background 0.3s ease;
        }
        .item:hover {
        }
        h2 {
          margin: 0 0 15px 0;
        }
        p {
          display: inline;
          font-size: 20px;
          margin: 0 5px 0 0;
        }
        strong {
        }
        .container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .card {
          background-color: rgba(197, 231, 255, 1);
          padding: 30px;
          width: 800px;
          text-align: center;
        }
        input {font-family: inherit;
        font-size: 20px;
          padding: 17px;
          width: 100%;
          margin-bottom: 10px;
          border: 1px solid #ccc;
        }
        .lista-resultados {
          text-align: left;
          
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .modal {
          background: rgba(70, 178, 255, 1);
          border: 1px solid rgba(189, 189, 189, 0.06);
          box-shadow: 10px 10px 25.4px 0.5px rgba(0, 0, 0, 0.07),
          -5px -6px 25.4px 5px rgba(0, 0, 0, 0.07);
          padding: 20px;
          width: 400px;
          position: relative;
          color: white;
          text-align: center;
        }
        .modal .cerrar {
          position: absolute;
          top: 10px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 25px;
          color: white;
          cursor: pointer;
        }
        .imagen {
          margin: 15px 0;
          height: 30rem;
        }
        .imagen img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}