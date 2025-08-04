export default function MapaAlmacen({ ubicacionActiva }) {
  return (
    <div className="mapa-container">
      <div className="mapa">

        <div className={`estante ${ubicacionActiva === "10A-A01021" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "0%"
          }}>
                  <p>10A-A01021</p>
                </div>
          <div className={`estante ${ubicacionActiva === "10A-A01031" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "5.5%"
          }}>
                  <p>10A-A01031</p>
                </div>
           <div className={`estante ${ubicacionActiva === "10A-A01041" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "11%"
          }}>
                  <p>10A-A01041</p>
        </div>

        <div className={`estante ${ubicacionActiva === "10A-A01051" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "16.5%"
          }}>
              <p> 10A-A01051</p>
            </div>
          <div className={`estante ${ubicacionActiva === "10B-A01021" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "22%"
          }}>
                  <p>10B-A01021</p>
                </div>
        <div className={`estante ${ubicacionActiva === "10B-A01031" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "27.5%"
          }}>
            <p> 10B-A01031</p>
                </div>
        <div className={`estante ${ubicacionActiva === "10B-A01041" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            left: "33%"
          }}>
            <p> 10B-A01041</p> 
        </div>

         
{/* ESTANTERIA 2 */} {/* ESTANTERIA 2 */} {/* ESTANTERIA 2 */} {/* ESTANTERIA 2 */}

        <div className={`estante ${ubicacionActiva === "10A-A01021" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "0%"
          }}>
                  <p>10A-A01021</p>
                </div>
          <div className={`estante ${ubicacionActiva === "10A-A01031" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "5.5%"
          }}>
                  <p>10A-A01031</p>
                </div>
           <div className={`estante ${ubicacionActiva === "10A-A01041" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "11%"
          }}>
                  <p>10A-A01041</p>
        </div>

        <div className={`estante ${ubicacionActiva === "10A-A01051" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "16.5%"
          }}>
              <p> 10A-A01051</p>
            </div>
          <div className={`estante ${ubicacionActiva === "10B-A01021" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "22%"
          }}>
                  <p>10B-A01021</p>
                </div>
        <div className={`estante ${ubicacionActiva === "10B-A01031" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "27.5%"
          }}>
            <p> 10B-A01031</p>
                </div>
        <div className={`estante ${ubicacionActiva === "10B-A01041" ? "activo" : ""}`}  style={{
            width: "5.5%",
            height: "2.1%",
            top: "0%",
            right: "33%"
          }}>
            <p> 10B-A01041</p> 
        </div>
        
    </div>

      <style jsx>{`
        p {
          font-family: 'Courier New', Courier, monospace;
           font-size: 0.5vw; 
          color: #000;;
        } 
          .mapa-container {
            width: 100%;
            max-width: 40rem;
            margin: 0 auto;
            aspect-ratio: 1 / 2; /* o lo que se ajuste a tu plano */
            position: relative;
            height: 80vh;
          }
          .mapa {
            position: relative;
            width: 100%;
            max-width: 40rem;
            height: 100%;
            margin: 0 auto;
            border: 1px solid #ccc;
          }
        .estante {
          position: absolute;
          display: inline-block;
          border: 1px solid #000;
          background-color: #e0e0e0;
          padding: 0rem;
        }
        .estante:hover {
          background-color: #65f704ff;
        }
        .activo {
          background-color: #4caf50;
          color: white;
          font-weight: bold;
          box-shadow: 0 0 10px #4caf50;
        }
      `}</style>
    </div>
  );
}