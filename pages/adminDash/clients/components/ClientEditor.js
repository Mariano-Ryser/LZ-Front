import { useState, useEffect } from "react";

export default function ClientEditor({ client, onClose, onUpdated, updateClient }) {
  const [form, setForm] = useState({ 
    name: "", 
    vorname: "", 
    email: "", 
    adresse: "", 
    phone: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        vorname: client.vorname || "",
        email: client.email || "",
        adresse: client.adresse || "",
        phone: client.phone || ""
      });
    }
  }, [client]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await updateClient(client._id, form);
      if (res.success) {
        onUpdated();
        onClose();
      } else {
        setError(res.message || "Error al actualizar cliente");
      }
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Cliente bearbeiten</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="vorname"
            value={form.vorname}
            onChange={handleChange}
            placeholder="Vorname"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="adresse"
            value={form.adresse}
            onChange={handleChange}
            placeholder="Adresse"
          />
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon"
          />
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Speichern..." : "Speichern"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Abbrechen
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
          padding: 24px;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .modal h2 { 
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }
        form input {
          width: 100%;
          margin-bottom: 16px;
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
        .buttons { 
          display: flex; 
          gap: 12px; 
          justify-content: flex-end;
          flex-wrap: wrap;
          margin-top: 20px;
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
            padding: 20px;
            margin: 10px;
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