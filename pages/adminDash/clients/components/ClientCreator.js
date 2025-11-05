import { useState } from "react";

export default function ClientsCreator({ onClose, onCreated, createClient }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
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
        setForm({ name: "", email: "", phone: "" });
      } else {
        setError(res.message || "Error al crear cliente");
      }
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Nuevo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
          />
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
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
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          min-width: 300px;
          max-width: 400px;
        }
        .modal h2 { margin-bottom: 10px; }
        form input {
          width: 100%;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .buttons { display: flex; gap: 10px; justify-content: flex-end; }
        .buttons button { padding: 8px 12px; }
        .error { color: red; font-size: 0.9em; margin-bottom: 10px; }
      `}</style>
    </div>
  );
}
