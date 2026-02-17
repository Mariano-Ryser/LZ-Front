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
                        <span className="client-name">{c.name}</span>
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

          {/* Artikel Section */}
          <div className="table-section">
            <div className="section-header">
              <h3>Artikel ({lines.length})</h3>
            </div>
            
            <div className="items-container">
              {lines.map((line, i) => {
                const matches = filteredProducts(i);
                const lineTotal = line.quantity && line.unitPrice ? (line.quantity * line.unitPrice).toFixed(2) : '0.00';
                
                return (
                  <div key={i} className={`item-card ${isSubmitting ? "row-disabled" : ""}`}>
                    <div className="item-header">
                      <span className="item-number">Artikel {i + 1}</span>
                      <button 
                        onClick={() => removeLine(i)}
                        disabled={lines.length <= 1 || isSubmitting}
                        className="remove-btn"
                        title="Artikel entfernen"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="item-content">
                      <div className="form-group">
                        <label>Artikel</label>
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
                                  {p.artikelName} <span className="product-price">({p.price} CHF)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <div className="form-group">
                          <label>Menge</label>
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={e => {
                              const value = e.target.value;
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
                              if (e.target.value === '') {
                                updateLine(i, { quantity: 1 });
                              }
                            }}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Einzelpreis (CHF)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.unitPrice}
                            onChange={e => {
                              const value = e.target.value;
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
                              if (e.target.value === '') {
                                updateLine(i, { unitPrice: 0 });
                              }
                            }}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="form-group total-group">
                          <label>Gesamt (CHF)</label>
                          <div className="total-display">{lineTotal} CHF</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          padding: 16px;
        }

        .modal {
          background: white;
          width: 100%;
          max-width: 800px;
          max-height: 95vh;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          color: #666;
          transition: all 0.2s;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
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
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .autocomplete-wrapper {
          position: relative;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          width: 100%;
          background: white;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        /* Autocomplete */
        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1001;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          margin-top: 4px;
        }

        .autocomplete-item {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.95rem;
          transition: background-color 0.2s;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .autocomplete-item:hover {
          background: #3b82f6;
          color: white;
        }

        .autocomplete-item:last-child {
          border-bottom: none;
        }

        .client-name {
          font-weight: 500;
        }

        .email {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .autocomplete-item:hover .email,
        .autocomplete-item:hover .product-price {
          color: #e5e7eb;
        }

        .product-price {
          color: #059669;
          font-size: 0.85rem;
          margin-left: 4px;
        }

        /* Table Section - Mobile Cards */
        .table-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }

        .items-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }

        .item-card {
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }

        .item-card.row-disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .item-number {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .remove-btn {
          background: #ef4444;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 14px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .remove-btn:hover:not(:disabled) {
          background: #dc2626;
          transform: scale(1.05);
        }

        .remove-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #6b7280;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .item-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .total-group {
          grid-column: 1 / -1;
        }

        .total-display {
          padding: 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-weight: 600;
          color: #059669;
          text-align: center;
        }

        /* Add Button */
        .add-btn {
          background: #10b981;
          border: none;
          border-radius: 8px;
          padding: 14px 20px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .add-btn:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #6b7280;
        }

        /* Totals */
        .totals-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          font-size: 1rem;
        }

        .total-row:not(.grand-total) {
          color: #6b7280;
        }

        .grand-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: #111827;
          border-top: 2px solid #d1d5db;
          margin-top: 8px;
          padding-top: 16px;
        }

        /* Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f8f9fa;
        }

        .btn {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
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
          color: #6b7280;
          border: 2px solid #d1d5db;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-save {
          background: #3b82f6;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Loading Spinner */
        .loading-spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3b82f6;
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
            padding: 12px;
            align-items: flex-end;
          }

          .modal {
            max-height: 90vh;
            border-radius: 16px 16px 0 0;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-header h2 {
            font-size: 1.2rem;
          }

          .modal-body {
            padding: 20px;
          }

          .form-section {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .item-details {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
            gap: 12px;
          }

          .btn {
            width: 100%;
            min-width: auto;
          }

          .autocomplete-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 50vh;
            border-radius: 16px 16px 0 0;
            margin-top: 0;
            z-index: 1002;
          }
        }

        @media (max-width: 480px) {
          .modal-backdrop {
            padding: 8px;
          }

          .modal-header {
            padding: 14px 16px;
          }

          .modal-body {
            padding: 16px;
          }

          .form-group input,
          .form-group select {
            padding: 14px 12px;
            font-size: 16px; /* Prevent zoom on iOS */
          }

          .item-card {
            padding: 12px;
          }

          .totals-section {
            padding: 16px;
          }

          .total-row {
            font-size: 0.95rem;
          }

          .grand-total {
            font-size: 1.05rem;
          }
        }

        @media (max-width: 320px) {
          .modal-header h2 {
            font-size: 1.1rem;
          }

          .form-group label {
            font-size: 0.85rem;
          }

          .btn {
            padding: 12px 20px;
            font-size: 0.95rem;
          }
        }

        /* Safe area for notched devices */
        @supports(padding: max(0px)) {
          .modal-backdrop {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-bottom: max(16px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}