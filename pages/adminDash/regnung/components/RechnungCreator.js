import { useState } from "react";
import { useClients } from "../../../../hooks/useClients";
import { useProduct } from "../../../../hooks/useProducts";
import { useSales } from "../../../../hooks/useSales";

export default function RechnungCreator({ onDone, refresh  }) {
  const { clients } = useClients();
  const { products } = useProduct();
  const { createSale, loading } = useSales();

  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("paid"); // nuevo estado
  const [lines, setLines] = useState([{ productId: "", quantity: 1, unitPrice: 0 }]);

  const addLine = () =>
    setLines(prev => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  const removeLine = i => setLines(prev => prev.filter((_, idx) => idx !== i));
  const updateLine = (i, changes) =>
    setLines(prev => prev.map((l, idx) => (idx === i ? { ...l, ...changes } : l)));

  // cálculo de subtotal, IVA y total con redondeo a 2 decimales
  const subtotal = Number(
    lines.reduce((sum, l) => sum + Number(l.quantity) * Number(l.unitPrice), 0).toFixed(2)
  );
  const taxAmount = Number((subtotal * 0.10).toFixed(2)); // 19% IVA
  const total = Number((subtotal + taxAmount).toFixed(2));

  const submit = async () => {
    const payload = {
      clientId,
      items: lines.map(l => ({
        productId: l.productId,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
      })),
      tax: 10,
      status, // enviamos el status
    };

    const res = await createSale(payload);
    if (res.success) {
      if (refresh) await refresh();   // ✅ refresca la lista REAL del backend
      onDone();
    } else {
      alert(res.message || "Error creando venta");
    }
  };

  return (
    <div className="invoice-box">
      <h2 className="title">Neue Rechnung</h2>

      {/* Cliente */}
      <div className="section">
        <label>Kunde</label>
        <select
          value={clientId}
          onChange={e => setClientId(e.target.value)}
          className="input"
        >
          <option value="">-- Kunde auswählen --</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="section">
        <label>Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input"
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Tabla de líneas */}
      <table className="classic-table">
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Menge</th>
            <th>Einzelpreis (€)</th>
            <th>Gesamt (€)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => {
            const prod = products.find(p => p._id === line.productId);
            return (
              <tr key={i}>
                <td>
                  <select
                    className="input"
                    value={line.productId}
                    onChange={e => {
                      const p = products.find(pr => pr._id === e.target.value);
                      updateLine(i, { productId: e.target.value, unitPrice: p ? p.price : 0 });
                    }}
                  >
                    <option value="">-- Artikel --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.artikelName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={e => updateLine(i, { quantity: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    value={line.unitPrice}
                    onChange={e => updateLine(i, { unitPrice: e.target.value })}
                  />
                </td>
                <td>{(Number(line.quantity) * Number(line.unitPrice)).toFixed(2)}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeLine(i)}>
                    ✖
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="add-btn" onClick={addLine}>
        + Zeile hinzufügen
      </button>

      {/* Totales */}
      <div className="totals">
        <div className="line">
          <span>Zwischensumme:</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="line">
          <span>10% MwSt.:</span>
          <span>{taxAmount.toFixed(2)} €</span>
        </div>
        <div className="line total">
          <span>Gesamt:</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <button className="submit-btn" disabled={loading} onClick={submit}>
        {loading ? "Speichern..." : "Rechnung Erstellen"}
      </button>

      {/* CLASSIC STYLES */}
     <style jsx>{`
  .invoice-box {
    background: #fff;
    padding: 25px;
    max-width: 900px;
    margin: auto;
    font-family: 'Segoe UI', Tahoma, sans-serif;
  }

  .title {
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 25px;
    color: #222;
  }

  /* ==== Secciones ==== */
  .section {
    margin-bottom: 18px;
  }

  label {
    font-weight: 600;
    margin-bottom: 6px;
    display: block;
    font-size: 15px;
    color: #333;
  }

  .input {
    padding: 10px;
    border: 1px solid #bfbfbf;
    border-radius: 6px;
    width: 100%;
    background: #fafafa;
    font-size: 15px;
    transition: 0.2s;
  }

  .input:focus {
    border-color: #888;
    background: #fff;
    outline: none;
  }

  /* ==== Tabla ==== */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  width: 100%;
}

.classic-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;   /* ✅ permite ajustar sin romper */
  background: #fff;
}

.classic-table th,
.classic-table td {
  padding: 10px;
  border-bottom: 1px solid #e3e3e3;
  font-size: 14px;
  white-space: nowrap; /* ✅ evita saltos raros */
}

/* Columnas más controladas */
.classic-table th:nth-child(1),
.classic-table td:nth-child(1) {
  width: 160px; /* Artikel */
}

.classic-table th:nth-child(2),
.classic-table td:nth-child(2) {
  width: 80px; /* Menge */
  text-align: center;
}

.classic-table th:nth-child(3),
.classic-table td:nth-child(3) {
  width: 120px; /* Einzelpreis */
}

.classic-table th:nth-child(4),
.classic-table td:nth-child(4) {
  width: 120px; /* Gesamt */
}

.classic-table th:nth-child(5),
.classic-table td:nth-child(5) {
  width: 60px; /* botones */
  text-align: center;
}

.classic-table th {
  background: #efefef;
  font-weight: 600;
  border-bottom: 2px solid #d4d4d4;
}

/* ✅ Se ve perfecto en móvil: scroll horizontal suave */
.table-wrapper::-webkit-scrollbar {
  height: 7px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f0f0f0;
}

  /* ==== Botones ==== */
  .add-btn {
    margin-top: 10px;
    background: #0077ff;
    color: white;
    padding: 10px 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: 0.2s;
  }

  .add-btn:hover {
    background: #005fcc;
  }

  .remove-btn {
    background: #d9534f;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: 0.2s;
  }

  .remove-btn:hover {
    background: #b94340;
  }

  /* ==== Totales ==== */
  .totals {
    margin-top: 25px;
    padding: 18px;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    background: #f8f8f8;
    max-width: 320px;
    margin-left: auto;
    font-size: 15px;
  }

  .line {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }

  .total {
    font-weight: 700;
    font-size: 18px;
    margin-top: 8px;
    border-top: 2px solid #ccc;
    padding-top: 12px;
  }

  .submit-btn {
    width: 100%;
    margin-top: 25px;
    background: #28a745;
    color: white;
    padding: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 17px;
    font-weight: 600;
    transition: 0.2s;
  }

  .submit-btn:hover {
    background: #1f8636;
  }

  /* ==== Responsivo ==== */
  @media (max-width: 600px) {
    .invoice-box {
      padding: 18px;
      border-radius: 10px;
    }

    .title {
      font-size: 20px;
      margin-bottom: 5px;
      margin-top: 0px;
    }

    .classic-table th,
    .classic-table td {
      font-size: 13px;
      padding: 8px;
    }

    .totals {
      width: 100%;
      max-width: none;
    }

    .submit-btn {
      font-size: 16px;
    }
  }
`}</style>

    </div>
  );
}
