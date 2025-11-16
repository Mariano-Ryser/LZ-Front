import { useState } from "react";

export default function ClientsCreator({ onClose, onCreated, createClient }) {
  const [form, setForm] = useState({ 
    name: "", 
    vorname: "", 
    email: "", 
    adresse: "", 
    phone: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createClient(form);
      if (res.success) {
        onCreated();
        onClose();
        setForm({ name: "", vorname: "", email: "", adresse: "", phone: "" });
      } else {
        setError(res.message || "Fehler beim Erstellen des Kunden");
      }
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Neuer Kunde</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="vorname"
              value={form.vorname}
              onChange={handleChange}
              placeholder="Vorname *"
              required
              disabled={loading}
            />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name *"
              required
              disabled={loading}
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={loading}
              className="full-width"
            />
            <input
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Adresse"
              disabled={loading}
              className="full-width"
            />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Telefon"
              disabled={loading}
              className="full-width"
            />
          </div>
          
          {error && <p className="error">{error}</p>}
          
          <div className="buttons">
            <button type="button" onClick={onClose} disabled={loading}>
              Abbrechen
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Wird erstellt..." : "Kunde erstellen"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal {
          background: white;
          padding: 0;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0 24px;
          margin-bottom: 20px;
        }
        
        .modal h2 { 
          margin: 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }
        
        .close-btn:hover:not(:disabled) {
          background: #f8f9fa;
        }
        
        form {
          padding: 0 24px 24px 24px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        form input {
          width: 100%;
          margin-bottom: 0;
          padding: 12px;
          border-radius: 8px;
          border: 2px solid #e1e5e9;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        
        form input:focus {
          outline: none;
          border-color: #4caf50;
        }
        
        form input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
        
        .buttons { 
          display: flex; 
          gap: 12px; 
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        
        .buttons button { 
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }
        
        .buttons button[type="submit"] {
          background: #4caf50;
          color: white;
        }
        
        .buttons button[type="submit"]:hover:not(:disabled) {
          background: #45a049;
          transform: translateY(-1px);
        }
        
        .buttons button[type="button"] {
          background: #6c757d;
          color: white;
        }
        
        .buttons button[type="button"]:hover:not(:disabled) {
          background: #5a6268;
        }
        
        .buttons button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .error { 
          color: #dc3545; 
          font-size: 0.9em; 
          margin-bottom: 15px;
          padding: 10px;
          background: #f8d7da;
          border-radius: 6px;
          border: 1px solid #f5c6cb;
        }

        @media (max-width: 480px) {
          .modal {
            margin: 10px;
          }
          
          .modal-header {
            padding: 20px 20px 0 20px;
          }
          
          form {
            padding: 0 20px 20px 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .buttons {
            flex-direction: column-reverse;
          }
          
          .buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}