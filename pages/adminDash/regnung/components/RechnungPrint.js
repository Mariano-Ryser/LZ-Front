import React, { useRef } from "react";

export default function RechnungPrint({ sale, onClose }) {
  // ✅ Seguridad total en SSR — evita undefined
  const safeSale = sale || {};
  const items = safeSale.items || [];
  const subtotal = safeSale.subtotal || 0;
  const total = safeSale.total || 0;
  const tax = safeSale.tax || 0;

  const taxRate = subtotal > 0 ? tax / subtotal : 0.1;

  const printRef = useRef();

  const handlePrint = () => {
    if (typeof window === "undefined") return;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Rechnung ${safeSale.lieferschein || ""}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 35px;
              color: #333;
              background: #fff;
            }

            .invoice-box {
              max-width: 900px;
              margin: auto;
              padding: 40px;
              border: 1px solid #dcdcdc;
              border-radius: 10px;
              background: #fafafa;
            }

            .logo {
              text-align: center;
              margin-bottom: 25px;
            }

            .logo img {
              max-height: 80px;
            }

            h1 {
              font-size: 32px;
              font-weight: 600;
              text-align: center;
              color: #222;
              margin-bottom: 25px;
            }

            .details {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
              margin-bottom: 25px;
            }

            .details div {
              padding: 10px 15px;
              background: #f3f3f3;
              border: 1px solid #dbdbdb;
              border-radius: 6px;
              font-size: 15px;
            }

            .header {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 25px;
              padding: 22px;
              margin-bottom: 28px;
              background: #f7f7f7;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
            }

            .issuer, .client {
              flex: 1;
              min-width: 260px;
            }

            h3 {
              margin-bottom: 10px;
              font-size: 17px;
              font-weight: 600;
              color: #333;
            }

            p {
              margin: 4px 0;
              font-size: 15px;
              color: #444;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 14.5px;
              background: white;
            }

            th {
              background: #ececec;
              padding: 12px;
              border: 1px solid #d0d0d0;
              font-weight: 600;
              color: #333;
            }

            td {
              padding: 12px;
              border: 1px solid #dedede;
            }

            tr:nth-child(even) td {
              background: #f7f7f7;
            }

            .totals {
              max-width: 320px;
              margin-left: auto;
              margin-top: 10px;
              font-size: 15px;
              border-top: 2px solid #000;
              padding-top: 15px;
            }

            .totals div {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
            }

            .total {
              font-size: 18px;
              font-weight: 700;
              margin-top: 10px;
            }

            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 13px;
              color: #666;
              line-height: 1.5;
            }

            @media (max-width: 768px) {
              .header {
                flex-direction: column;
              }
              .issuer, .client {
                width: 100%;
              }
              table, th, td {
                font-size: 13px;
                padding: 8px;
              }
              .totals {
                width: 100%;
              }
            }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div ref={printRef} className="invoice-box">
          <div className="logo">
            <img src="../img/logo-lager.png" alt="Firmenlogo" />
          </div>

          <h1>Rechnung</h1>

          <div className="details">
            <div><strong>Lieferschein-Nr.:</strong> {safeSale.lieferschein || "-"}</div>
            <div><strong>Datum:</strong> {safeSale.createdAt ? new Date(safeSale.createdAt).toLocaleDateString("de-DE") : "-"}</div>
            <div><strong>Status:</strong> {safeSale.status || "-"}</div>
          </div>

          <div className="header">
            <div className="issuer">
              <h3>Aussteller:</h3>
              <p>Meine Firma GmbH</p>
              <p>Musterstraße 123, 8000 Zürich</p>
              <p>UID: CHE-123.456.789</p>
              <p>Tel: +41 44 123 4567</p>
              <p>Email: kontakt@firma.com</p>
            </div>

            <div className="client">
              <h3>Kunde:</h3>
              <p>{safeSale.clientSnapshot?.name || "-"}</p>
              {safeSale.clientSnapshot?.email && <p>Email: {safeSale.clientSnapshot.email}</p>}
              {safeSale.clientSnapshot?.phone && <p>Tel: {safeSale.clientSnapshot.phone}</p>}
              {safeSale.clientSnapshot?.address && <p>{safeSale.clientSnapshot.address}</p>}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Artikel</th>
                <th>Menge</th>
                <th>Einzelpreis (€)</th>
                <th>MwSt (€)</th>
                <th>Gesamt (€)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const lineTax = (item?.lineTotal || 0) * taxRate;
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item?.artikelName || "-"}</td>
                    <td>{item?.quantity || 0}</td>
                    <td>{(item?.unitPrice || 0).toFixed(2)}</td>
                    <td>{lineTax.toFixed(2)}</td>
                    <td>{(item?.lineTotal || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="totals">
            <div><span>Zwischensumme:</span><span>{subtotal.toFixed(2)} €</span></div>
            <div><span>MwSt ({(taxRate * 100).toFixed(0)}%):</span><span>{tax.toFixed(2)} €</span></div>
            <div className="total"><span>Gesamt:</span><span>{total.toFixed(2)} €</span></div>
          </div>

          <div className="footer">
            <p>Vielen Dank für Ihren Einkauf. Bitte begleichen Sie die Rechnung innerhalb von 30 Tagen.</p>
            <p>Diese Rechnung wird elektronisch ausgestellt und benötigt keine Unterschrift.</p>
          </div>
        </div>

        <button className="print-btn" onClick={handlePrint}>Drucken</button>
      </div>

      {/* ✅ CSS DEL COMPONENTE */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 15px;
          z-index: 1000;
        }

        .modal {
          background: #ffffff;
          width: 900px;
          max-width: 100%;
          max-height: 95vh;
          overflow-y: auto;
          padding: 35px 30px;
          border-radius: 14px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          position: relative;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #f1f1f1;
          border: none;
          font-size: 20px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          color: #555;
        }

        .print-btn {
          display: block;
          margin: 25px auto 0;
          padding: 12px 30px;
          background: #0d6efd;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .modal {
            padding: 25px 18px;
          }
          .print-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
