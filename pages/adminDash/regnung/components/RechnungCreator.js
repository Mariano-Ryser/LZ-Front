import { useState, useRef, useEffect } from "react";
import { useClients } from "../../../../hooks/useClients";
import { useProduct } from "../../../../hooks/useProducts";
import { useSales } from "../../../../hooks/useSales";

export default function RechnungCreator({ onDone, refresh }) {
  const { clients } = useClients();
  const { products } = useProduct();
  const { createSale, loading } = useSales();

  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientAutocomplete, setShowClientAutocomplete] = useState(false);
  const [status, setStatus] = useState("paid");
  const [lines, setLines] = useState([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [searches, setSearches] = useState([""]);
  const [showAutocomplete, setShowAutocomplete] = useState([false]);

  const autocompleteRefs = useRef([]);
  const clientAutocompleteRef = useRef(null);
  const clientInputRef = useRef(null);

  // Cerrar autocompletes al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Clientes
      if (showClientAutocomplete && clientAutocompleteRef.current &&
        !clientAutocompleteRef.current.contains(event.target)) {
        setShowClientAutocomplete(false);
      }

      // Productos
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

  // ==== Helpers Autocomplete Clientes ====
  const filteredClients = () => {
    const query = clientSearch?.toLowerCase() || "";
    if (!query) return [];
    return clients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query))
    ).slice(0, 8);
  };

  // ==== Helpers Autocomplete Productos ====
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

  // Totales
  const subtotal = Number(lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0).toFixed(2));
  const taxAmount = Number((subtotal * 0.10).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  const submit = async () => {
    if (!clientId) return alert("Bitte wählen Sie einen Kunden aus");
    if (lines.some(l => !l.productId)) return alert("Bitte wählen Sie alle Artikel aus");

    const payload = {
      clientId,
      items: lines.map(l => ({ productId: l.productId, quantity: Number(l.quantity), unitPrice: Number(l.unitPrice) })),
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
  };

  return (
    <div className="invoice-box">
      <h2 className="title">Neue Rechnung</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Kunde</label>
          <div ref={clientAutocompleteRef} style={{ position: "relative" }}>
            <input
              ref={clientInputRef}
              className="form-input"
              type="text"
              placeholder="Kunde suchen..."
              value={clientSearch || getSelectedClientName()}
              onChange={e => {
                setClientSearch(e.target.value);
                setClientId("");
                setShowClientAutocomplete(true);
              }}
              onFocus={() => setShowClientAutocomplete(true)}
            />
            {showClientAutocomplete && filteredClients().length > 0 && (
              <ul className="autocomplete-list">
                {filteredClients().map(c => (
                  <li key={c._id} onClick={() => {
                    setClientId(c._id);
                    setClientSearch(c.name);
                    setShowClientAutocomplete(false);
                  }}>
                    <span>{c.name}</span> {c.email && <span style={{ color: "#888" }}>({c.email})</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="form-input">
            <option value="paid">Bezahlt</option>
            <option value="pending">Ausstehend</option>
            <option value="cancelled">Storniert</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
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
              const matches = filteredProducts(i);
              return (
                <tr key={i}>
                  <td style={{ position: "relative" }}>
                    <input
                      className="form-input"
                      type="text"
                      value={searches[i]}
                      placeholder="Artikel suchen..."
                      onChange={e => {
                        const val = e.target.value;
                        setSearches(prev => prev.map((s, idx) => idx === i ? val : s));
                        updateLine(i, { productId: "" });
                        setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? true : s));
                      }}
                      onFocus={() =>
                        setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? true : s))
                      }
                    />
                    {showAutocomplete[i] && matches.length > 0 && (
                      <ul className="autocomplete-list">
                        {matches.map(p => (
                          <li key={p._id} onClick={() => {
                            updateLine(i, { productId: p._id, unitPrice: p.price });
                            setSearches(prev => prev.map((s, idx) => idx === i ? p.artikelName : s));
                            setShowAutocomplete(prev => prev.map((s, idx) => idx === i ? false : s));
                          }}>
                            {p.artikelName} ({p.price} €)
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-input number-input"
                      value={line.quantity}
                      onChange={e => updateLine(i, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="form-input number-input"
                      value={line.unitPrice}
                      onChange={e => updateLine(i, { unitPrice: Number(e.target.value) })}
                    />
                  </td>
                  <td>{(line.quantity * line.unitPrice).toFixed(2)}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeLine(i)}>✖</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="add-btn" onClick={addLine}>+ Zeile hinzufügen</button>

      <div className="totals">
        <div className="line"><span>Zwischensumme:</span><span>{subtotal.toFixed(2)} €</span></div>
        <div className="line"><span>10% MwSt.:</span><span>{taxAmount.toFixed(2)} €</span></div>
        <div className="line total"><span>Gesamt:</span><span>{total.toFixed(2)} €</span></div>
      </div>

      <button className="submit-btn" disabled={loading} onClick={submit}>
        {loading ? "Speichern..." : "Rechnung Erstellen"}
      </button>

      <style jsx>{`
        .invoice-box { background:#fff; padding:30px; max-width:1000px; margin:auto; border-radius:12px; font-family:'Segoe UI', Tahoma, sans-serif; }
        .title { text-align:center; font-size:28px; font-weight:600; margin-bottom:30px; color:#222; }
        .form-grid { display:flex; gap:20px; margin-bottom:20px; flex-wrap: wrap; }
        .form-group { flex:1; min-width:220px; position:relative; }
        label { display:block; font-weight:600; margin-bottom:6px; color:#333; }
        .form-input { width:100%; padding:10px; border-radius:6px; border:1px solid #ccc; background:#fafafa; transition:0.2s; }
        .form-input:focus { outline:none; border-color:#888; background:#fff; }
        .classic-table { width:100%; border-collapse:collapse; margin-bottom:15px; }
        .classic-table th, .classic-table td { padding:12px; font-size:14px; border-bottom:1px solid #eee; }
        .classic-table th { background:#f0f0f0; font-weight:600; }
        .remove-btn { background:#d9534f; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; }
        .remove-btn:hover { background:#b94340; }
        .add-btn { background:#0077ff; color:#fff; border:none; padding:10px 14px; border-radius:6px; cursor:pointer; margin-top:10px; }
        .add-btn:hover { background:#005fcc; }
        .totals { margin-top:25px; padding:20px; border-radius:10px; background:#f8f8f8; max-width:360px; margin-left:auto; font-size:15px; }
        .line { display:flex; justify-content:space-between; padding:6px 0; }
        .total { font-weight:700; font-size:18px; border-top:2px solid #ccc; padding-top:10px; margin-top:10px; }
        .submit-btn { width:100%; padding:14px; font-size:17px; font-weight:600; border-radius:8px; background:#28a745; color:#fff; border:none; cursor:pointer; margin-top:25px; }
        .submit-btn:hover { background:#1f8636; }
        .autocomplete-list { position:absolute; top:100%; left:0; width:100%; max-height:200px; overflow-y:auto; background:#fff; border:1px solid #ccc; border-radius:6px; z-index:999; box-shadow:0 4px 8px rgba(0,0,0,0.15); margin-top:2px; }
        .autocomplete-list li { padding:8px 12px; cursor:pointer; }
        .autocomplete-list li:hover { background:#f0f0f0; }
        @media(max-width:768px){ .invoice-box { padding:20px; } .title { font-size:22px; } .classic-table th,.classic-table td{font-size:13px;padding:8px;} .totals { width:100%; max-width:none; } .submit-btn{font-size:16px;padding:12px;} }
      `}</style>
    </div>
  );
}
