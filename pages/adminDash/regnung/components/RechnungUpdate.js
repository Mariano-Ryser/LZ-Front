import React, { useState, useEffect } from "react";
import { useSales } from "../../../../hooks/useSales";
import { useClients } from "../../../../hooks/useClients";
import { useProduct } from "../../../../hooks/useProducts";

export default function RechnungUpdate({ sale, onClose, onSaved }) {
  const { updateSale, loading } = useSales();
  const { clients } = useClients();
  const { products } = useProduct();

  const [editableSale, setEditableSale] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!editableSale) {
    return (
      <div className="modal-backdrop">
        <div className="modal loading-modal">
          <div className="loading-spinner"></div>
          <p>Lade Rechnungsdaten...</p>
        </div>
      </div>
    );
  }

  const addLine = () => {
    setEditableSale(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", artikelName: "", quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeLine = idx => {
    if (editableSale.items.length <= 1) {
      alert("Mindestens ein Artikel ist erforderlich");
      return;
    }
    
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
  if (isSubmitting) return;
  
  setIsSubmitting(true);

  try {
    if (!editableSale.client?._id && !editableSale.clientSnapshot?._id) {
      alert("Bitte wählen Sie einen Kunden aus");
      return;
    }

    if (editableSale.items.some(i => !i.productId)) {
      alert("Bitte wählen Sie alle Artikel aus");
      return;
    }

    if (editableSale.items.some(i => i.quantity <= 0)) {
      alert("Die Menge muss größer als 0 sein");
      return;
    }

    if (editableSale.items.some(i => i.unitPrice < 0)) {
      alert("Der Preis darf nicht negativ sein");
      return;
    }

    const payload = {
      clientId: editableSale.client?._id || editableSale.clientSnapshot?._id,
      status: editableSale.status,
      items: editableSale.items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
      // ✅ NUEVO: Incluir el porcentaje de impuesto
      tax: 10 // 10% IVA
    };
    
    const res = await updateSale(editableSale._id, payload);
    if (res.success) {
      if (onSaved) onSaved();
    } else {
      alert("Fehler beim Speichern: " + (res.message || "Unbekannter Fehler"));
    }
  } catch (err) {
    alert("Fehler beim Speichern: " + err.message);
  } finally {
    setIsSubmitting(false);
  }
};
  const subtotal = editableSale.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = Number((subtotal * 0.10).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Rechnung bearbeiten</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Kunde & Status */}
          <div className="form-section">
            <div className="form-group">
              <label>Kunde</label>
              <select
                value={editableSale.client?._id || editableSale.clientSnapshot?._id || ""}
                onChange={e => {
                  const c = clients.find(cl => cl._id === e.target.value);
                  setEditableSale(prev => ({ ...prev, client: c }));
                }}
                disabled={isSubmitting}
              >
                <option value="">-- Kunde auswählen --</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={editableSale.status}
                onChange={e => setEditableSale(prev => ({ ...prev, status: e.target.value }))}
                disabled={isSubmitting}
              >
                <option value="paid">Bezahlt</option>
                <option value="pending">Ausstehend</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>
          </div>

          {/* Artikel Table */}
          <div className="table-section">
            <h3>Artikel ({editableSale.items.length})</h3>
            
            <div className="table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Artikel</th>
                    <th>Menge</th>
                    <th>Einzelpreis (CHF)</th>
                    <th>Gesamt (CHF)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {editableSale.items.map((item, idx) => (
                    <tr key={idx} className={isSubmitting ? "row-disabled" : ""}>
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
                          disabled={isSubmitting}
                        >
                          <option value="">-- Artikel auswählen --</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.artikelName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateLine(idx, { quantity: Math.max(1, Number(e.target.value)) })}
                          disabled={isSubmitting}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={e => updateLine(idx, { unitPrice: Math.max(0, Number(e.target.value)) })}
                          disabled={isSubmitting}
                        />
                      </td>
                      <td className="total-column">
                        {(item.quantity * item.unitPrice).toFixed(2)} CHF
                      </td>
                      <td className="actions-column">
                        <button 
                          onClick={() => removeLine(idx)}
                          disabled={editableSale.items.length <= 1 || isSubmitting}
                          className="remove-btn"
                          title="Artikel entfernen"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              className="add-btn" 
              onClick={addLine}
              disabled={isSubmitting}
            >
              + Artikel hinzufügen
            </button>
          </div>

          {/* Totals */}
          <div className="totals-section">
            <div className="total-row">
              <span>Zwischensumme:</span>
              <span>{subtotal.toFixed(2)} CHF</span>
            </div>
            <div className="total-row">
              <span>10% MwSt.:</span>
              <span>{taxAmount.toFixed(2)} CHF</span>
            </div>
            <div className="total-row grand-total">
              <span>Gesamtsumme:</span>
              <span>{total.toFixed(2)} CHF</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button 
            className="btn btn-cancel" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Abbrechen
          </button>
          <button 
            className="btn btn-save" 
            onClick={handleSave} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner small"></div>
                Speichern...
              </>
            ) : (
              "Änderungen speichern"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          
        }

        .modal {
          
          background: white;
          width: 95%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
        }

        .loading-modal {
          padding: 40px;
          text-align: center;
          justify-content: center;
          align-items: center;
        }

        /* Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          color: #666;
        }

        .close-btn:hover:not(:disabled) {
          background: #e9ecef;
          color: #333;
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Body */
        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        /* Form Section */
        .form-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .form-group select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.95rem;
          background: white;
        }

        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-group select:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }

        /* Table Section */
        .table-section h3 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }

        .table-container {
          overflow-x: auto;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .items-table th {
          background: #f8f9fa;
          padding: 12px 8px;
          font-weight: 600;
          color: #495057;
          font-size: 0.85rem;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }

        .items-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #f1f3f4;
        }

        .items-table tr:last-child td {
          border-bottom: none;
        }

        .items-table tr.row-disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .items-table select,
        .items-table input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
          background: white;
        }

        .items-table select:focus,
        .items-table input:focus {
          outline: none;
          border-color: #007bff;
        }

        .items-table select:disabled,
        .items-table input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .total-column {
          font-weight: 600;
          color: #333;
        }

        .actions-column {
          width: 50px;
          text-align: center;
        }

        .remove-btn {
          background: #dc3545;
          border: none;
          border-radius: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 12px;
        }

        .remove-btn:hover:not(:disabled) {
          background: #c82333;
        }

        .remove-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #6c757d;
        }

        /* Add Button */
        .add-btn {
          background: #28a745;
          border: none;
          border-radius: 4px;
          padding: 10px 16px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
        }

        .add-btn:hover:not(:disabled) {
          background: #218838;
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #6c757d;
        }

        /* Totals */
        .totals-section {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 4px;
          margin-top: 20px;
          border: 1px solid #e9ecef;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 0.95rem;
        }

        .total-row:not(.grand-total) {
          color: #6c757d;
        }

        .grand-total {
          font-weight: 700;
          font-size: 1.05rem;
          color: #333;
          border-top: 1px solid #dee2e6;
          margin-top: 8px;
          padding-top: 10px;
        }

        /* Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: white;
          color: #6c757d;
          border: 1px solid #6c757d;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f8f9fa;
        }

        .btn-save {
          background: #007bff;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background: #0056b3;
        }

        /* Loading Spinner */
        .loading-spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner.small {
          width: 16px;
          height: 16px;
        }

        .loading-spinner:not(.small) {
          width: 30px;
          height: 30px;
          margin: 0 auto 12px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-backdrop {
            padding: 10px;
          }

          .modal {
            max-height: 95vh;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .form-section {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .table-container {
            margin-bottom: 8px;
          }

          .items-table th,
          .items-table td {
            padding: 10px 6px;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .modal-header h2 {
            font-size: 1.1rem;
          }

          .items-table {
            min-width: 500px;
          }

          .items-table select,
          .items-table input {
            padding: 4px 6px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}