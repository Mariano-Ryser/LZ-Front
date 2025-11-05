import React, { useState, useEffect } from "react";
import { useSales } from "../../../../hooks/useSales";
import { useClients } from "../../../../hooks/useClients";
import { useProduct } from "../../../../hooks/useProducts";

export default function RechnungUpdate({ sale, onClose, onSaved }) {
  const { updateSale, loading } = useSales();
  const { clients } = useClients();
  const { products } = useProduct();

  const [editableSale, setEditableSale] = useState(null);

  useEffect(() => {
    if (sale) {
      setEditableSale({
        ...sale,
        items: sale.items.map(i => ({
          productId: i.product?._id || i.product,
          artikelName: i.artikelName,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      });
    }
  }, [sale]);

  if (!editableSale) return null;

  const addLine = () => {
    setEditableSale(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", artikelName: "", quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeLine = idx => {
    setEditableSale(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const updateLine = (idx, changes) => {
    setEditableSale(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, ...changes } : item))
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        clientId: editableSale.client?._id || editableSale.clientSnapshot?._id,
        status: editableSale.status,
        items: editableSale.items.map(i => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      };
      const res = await updateSale(editableSale._id, payload);
      if (res.success) {
        alert("Factura actualizada correctamente");
        onClose();
        if (onSaved) onSaved(); // <-- REFRESCA LA LISTA
      } else {
        alert("Error al guardar: " + (res.message || "desconocido"));
      }
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const subtotal = editableSale.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = Number((subtotal * 0.10).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Editar Factura / Rechnung</h2>

        {/* Cliente */}
        <div className="section">
          <label>Cliente</label>
          <select
            value={editableSale.client?._id || editableSale.clientSnapshot?._id || ""}
            onChange={e => {
              const c = clients.find(cl => cl._id === e.target.value);
              setEditableSale(prev => ({ ...prev, client: c }));
            }}
          >
            <option value="">-- Seleccione Cliente --</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="section">
          <label>Status</label>
          <select
            value={editableSale.status}
            onChange={e => setEditableSale(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Tabla de artículos */}
        <table>
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Precio Unitario (€)</th>
              <th>Total (€)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editableSale.items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <select
                    value={item.productId || ""}
                    onChange={e => {
                      const p = products.find(pr => pr._id === e.target.value);
                      updateLine(idx, {
                        productId: p?._id || "",
                        artikelName: p?.artikelName || "",
                        unitPrice: p?.price || 0
                      });
                    }}
                  >
                    <option value="">-- Seleccione Artículo --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.artikelName}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateLine(idx, { quantity: Number(e.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={e => updateLine(idx, { unitPrice: Number(e.target.value) })}
                  />
                </td>
                <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeLine(idx)}>✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-btn" onClick={addLine}>+ Agregar Artículo</button>

        {/* Totales */}
        <div className="totals">
          <div><span>Subtotal:</span><span>{subtotal.toFixed(2)} €</span></div>
          <div><span>IVA (10%):</span><span>{taxAmount.toFixed(2)} €</span></div>
          <div className="total"><span>Total:</span><span>{total.toFixed(2)} €</span></div>
        </div>

        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <style jsx>{`
        .modal-backdrop { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000; }
        .modal { background:white; width:900px; max-width:95%; max-height:90vh; overflow-y:auto; padding:25px; border-radius:10px; position:relative; }
        .close-btn { position:absolute; top:10px; right:10px; font-size:22px; border:none; background:transparent; cursor:pointer; }
        table { width:100%; border-collapse: collapse; margin-top:15px; }
        th, td { border:1px solid #ddd; padding:8px; text-align:left; }
        th { background:#f5f5f5; }
        input, select { width:100%; padding:4px; }
        .add-btn, .save-btn { margin-top:15px; padding:8px 12px; border:none; border-radius:5px; cursor:pointer; }
        .add-btn { background:#007bff; color:white; }
        .save-btn { background:#28a745; color:white; }
        .totals { width:300px; margin-left:auto; margin-top:20px; }
        .totals div { display:flex; justify-content:space-between; }
        .totals .total { font-weight:bold; border-top:2px solid #000; padding-top:5px; }
      `}</style>
    </div>
  );
}
