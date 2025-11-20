import { useState, useRef, useEffect } from "react";
import { useClients } from "../../../../hooks/useClients";
import { useProduct } from "../../../../hooks/useProducts";
import { useSales } from "../../../../hooks/useSales";

export default function RechnungCreator({ onDone, refresh }) {
  const { clients } = useClients();
  const { products } = useProduct();
  const { createSale } = useSales();

  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientAutocomplete, setShowClientAutocomplete] = useState(false);
  const [status, setStatus] = useState("paid");
  const [lines, setLines] = useState([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [searches, setSearches] = useState([""]);
  const [showAutocomplete, setShowAutocomplete] = useState([false]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const autocompleteRefs = useRef([]);
  const clientAutocompleteRef = useRef(null);

  // Cerrar autocompletes al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showClientAutocomplete && clientAutocompleteRef.current &&
          !clientAutocompleteRef.current.contains(event.target)) {
        setShowClientAutocomplete(false);
      }

      showAutocomplete.forEach((isOpen, index) => {
        if (isOpen && autocompleteRefs.current[index] &&
            !autocompleteRefs.current[index].contains(event.target)) {
          setShowAutocomplete(prev => prev.map((s, idx) => idx === index ? false : s));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAutocomplete, showClientAutocomplete]);

  const filteredClients = () => {
    const query = clientSearch?.toLowerCase() || "";
    if (!query) return [];
    return clients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query))
    ).slice(0, 8);
  };

  const filteredProducts = (index) => {
    const query = searches[index]?.toLowerCase() || "";
    if (!query) return [];
    return products.filter(p => p.artikelName.toLowerCase().includes(query)).slice(0, 8);
  };

  const addLine = () => {
    setLines(prev => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
    setSearches(prev => [...prev, ""]);
    setShowAutocomplete(prev => [...prev, false]);
    autocompleteRefs.current.push(null);
  };

  const removeLine = (i) => {
    if (lines.length <= 1) {
      alert("Mindestens ein Artikel ist erforderlich");
      return;
    }
    
    setLines(prev => prev.filter((_, idx) => idx !== i));
    setSearches(prev => prev.filter((_, idx) => idx !== i));
    setShowAutocomplete(prev => prev.filter((_, idx) => idx !== i));
    autocompleteRefs.current = autocompleteRefs.current.filter((_, idx) => idx !== i);
  };

  const updateLine = (i, changes) =>
    setLines(prev => prev.map((l, idx) => (idx === i ? { ...l, ...changes } : l)));

  const getSelectedClientName = () => {
    if (!clientId) return "";
    const client = clients.find(c => c._id === clientId);
    return client ? client.name : "";
  };

  const subtotal = Number(lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0).toFixed(2));
  const taxAmount = Number((subtotal * 0.10).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  const submit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (!clientId) {
      alert("Bitte wählen Sie einen Kunden aus");
      setIsSubmitting(false);
      return;
    }
    
    if (lines.some(l => !l.productId)) {
      alert("Bitte wählen Sie alle Artikel aus");
      setIsSubmitting(false);
      return;
    }

    if (lines.some(l => l.quantity <= 0)) {
      alert("Die Menge muss größer als 0 sein");
      setIsSubmitting(false);
      return;
    }

    if (lines.some(l => l.unitPrice < 0)) {
      alert("Der Preis darf nicht negativ sein");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      clientId,
      items: lines.map(l => ({ 
        productId: l.productId, 
        quantity: Number(l.quantity), 
        unitPrice: Number(l.unitPrice) 
      })),
      tax: 10,
      status,
    };

    const res = await createSale(payload);
    if (res.success) {
      if (refresh) await refresh();
      onDone();
    } else {
      alert(res.message || "Fehler beim Erstellen der Rechnung");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Neue Rechnung</h2>
          <button 
            className="close-btn" 
            onClick={onDone}
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
              <div ref={clientAutocompleteRef} className="autocomplete-wrapper">
                <input
                  type="text"
                  placeholder="Kunde suchen..."
                  value={clientSearch || getSelectedClientName()}
                  onChange={e => {
                    setClientSearch(e.target.value);
                    setClientId("");
                    setShowClientAutocomplete(true);
                  }}
                  onFocus={() => setShowClientAutocomplete(true)}
                  disabled={isSubmitting}
                />
                {showClientAutocomplete && filteredClients().length > 0 && (
                  <div className="autocomplete-dropdown">
                    {filteredClients().map(c => (
                      <div 
                        key={c._id} 
                        className="autocomplete-item"
                        onClick={() => {
                          setClientId(c._id);
                          setClientSearch(c.name);
                          setShowClientAutocomplete(false);
                        }}
                      >
                        <span>{c.name}</span>
                        {c.email && <span className="email">({c.email})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)}
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
            <h3>Artikel ({lines.length})</h3>
            
            <div className="table-container">
              <table className="items-table">
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
                    const matches = filteredProducts(i);
                    return (
                      <tr key={i} className={isSubmitting ? "row-disabled" : ""}>
                        <td className="product-cell">
                          <div className="autocomplete-wrapper" ref={el => autocompleteRefs.current[i] = el}>
                            <input
                              type="text"
                              placeholder="Artikel suchen..."
                              value={searches[i]}
                              onChange={e => {
                                const val = e.target.value;
                                setSearches(prev => prev.map((s, idx) => idx === i ? val : s));
                                updateLine(i, { productId: "" });
                                setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? true : s));
                              }}
                              onFocus={() => setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? true : s))}
                              disabled={isSubmitting}
                            />
                            {showAutocomplete[i] && matches.length > 0 && (
                              <div className="autocomplete-dropdown">
                                {matches.map(p => (
                                  <div 
                                    key={p._id}
                                    className="autocomplete-item"
                                    onClick={() => {
                                      updateLine(i, { productId: p._id, unitPrice: p.price });
                                      setSearches(prev => prev.map((s, idx) => idx === i ? p.artikelName : s));
                                      setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? false : s));
                                    }}
                                  >
                                    {p.artikelName} ({p.price} €)
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="quantity-cell">
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={e => {
                              const value = e.target.value;
                              // Permitir campo vacío temporalmente
                              if (value === '') {
                                updateLine(i, { quantity: '' });
                              } else {
                                const numValue = Number(value);
                                if (numValue >= 1) {
                                  updateLine(i, { quantity: numValue });
                                }
                              }
                            }}
                            onBlur={e => {
                              // Si está vacío al salir, poner 1
                              if (e.target.value === '') {
                                updateLine(i, { quantity: 1 });
                              }
                            }}
                            disabled={isSubmitting}
                          />
                        </td>
                        <td className="price-cell">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.unitPrice}
                            onChange={e => {
                              const value = e.target.value;
                              // Permitir campo vacío temporalmente
                              if (value === '') {
                                updateLine(i, { unitPrice: '' });
                              } else {
                                const numValue = Number(value);
                                if (numValue >= 0) {
                                  updateLine(i, { unitPrice: numValue });
                                }
                              }
                            }}
                            onBlur={e => {
                              // Si está vacío al salir, poner 0
                              if (e.target.value === '') {
                                updateLine(i, { unitPrice: 0 });
                              }
                            }}
                            disabled={isSubmitting}
                          />
                        </td>
                        <td className="total-column">
                          {line.quantity && line.unitPrice ? (line.quantity * line.unitPrice).toFixed(2) : '0.00'} €
                        </td>
                        <td className="actions-column">
                          <button 
                            onClick={() => removeLine(i)}
                            disabled={lines.length <= 1 || isSubmitting}
                            className="remove-btn"
                            title="Artikel entfernen"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="total-row">
              <span>10% MwSt.:</span>
              <span>{taxAmount.toFixed(2)} €</span>
            </div>
            <div className="total-row grand-total">
              <span>Gesamtsumme:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button 
            className="btn btn-cancel" 
            onClick={onDone}
            disabled={isSubmitting}
          >
            Abbrechen
          </button>
          <button 
            className="btn btn-save" 
            onClick={submit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner small"></div>
                Speichern...
              </>
            ) : (
              "Rechnung Erstellen"
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

        .autocomplete-wrapper {
          position: relative;
        }

        .form-group input,
        .form-group select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.95rem;
          width: 100%;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }

        /* Autocomplete - FIXED POSITIONING */
        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          max-height: 200px;
          width: 400px;
          overflow-y: auto;
          z-index: 1001; /* Mayor z-index para que esté por encima */
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-top: 2px;
        }

        .autocomplete-item {
          padding: 10px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f1f3f4;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .autocomplete-item:hover {
          background: #007bff;
          color: white;
        }

        .autocomplete-item:last-child {
          border-bottom: none;
        }

        .email {
          color: #6c757d;
          font-size: 0.85rem;
          margin-left: 8px;
        }

        .autocomplete-item:hover .email {
          color: #e0e0e0;
        }

        /* Table Section */
        .table-section h3 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }

        .table-container {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          margin-bottom: 12px;
          position: relative; /* Para el autocomplete */
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
          position: relative; /* Para el autocomplete */
        }

        .items-table tr:last-child td {
          border-bottom: none;
        }

        .items-table tr.row-disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        /* Celdas específicas para mejor control */
        .product-cell {
          position: relative;
          min-width: 200px;
        }

        .quantity-cell,
        .price-cell {
          min-width: 100px;
        }

        .items-table input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
          background: white;
        }

        .items-table input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .items-table input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .total-column {
          font-weight: 600;
          color: #333;
          min-width: 100px;
        }

        .actions-column {
          width: 60px;
          text-align: center;
        }

        .remove-btn {
          background: #dc3545;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 14px;
          transition: all 0.2s;
        }

        .remove-btn:hover:not(:disabled) {
          background: #c82333;
          transform: scale(1.05);
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
          padding: 12px 16px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          transition: all 0.2s;
        }

        .add-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
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
          padding: 8px 0;
          font-size: 0.95rem;
        }

        .total-row:not(.grand-total) {
          color: #6c757d;
        }

        .grand-total {
          font-weight: 700;
          font-size: 1.05rem;
          color: #333;
          border-top: 2px solid #dee2e6;
          margin-top: 8px;
          padding-top: 12px;
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
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
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
          transform: translateY(-1px);
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

          .autocomplete-dropdown {
            z-index: 1002; /* Aún mayor en móviles */
          }
        }

        @media (max-width: 480px) {
          .modal-header h2 {
            font-size: 1.1rem;
          }

          .items-table {
            min-width: 500px;
          }

          .items-table input {
            padding: 6px 8px;
            font-size: 0.85rem;
          }

          .autocomplete-item {
            padding: 8px 10px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}