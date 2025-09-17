import { useState } from "react";

export const ProductCreator = ({ 
  product = {}, 
  handleChange, 
  createProduct, 
  loading, 
  error,
  onClose 
}) => {

    // Normalizamos el estado para que nunca sean undefined
  const safeProduct = {
    artikelName: product.artikelName || "",
    lagerPlatz: product.lagerPlatz || "",
    artikelNumber: product.artikelNumber || "",
    description: product.description || "",
    imagen: product.imagen || null
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* HEADER */}
        <div className="modal-header">
          <h2>➕ Nuevo Producto</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <form onSubmit={createProduct} className="form">
            
            <div className="input-group">
              <label>Nombre del artículo</label>
              <input
                type="text"
                name="artikelName"
                placeholder="Ej: Taladro Bosch"
                value={safeProduct.artikelName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Lugar en almacén</label>
                <input
                  type="text"
                  name="lagerPlatz"
                  placeholder="Ej: A-12"
                  value={safeProduct.lagerPlatz}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Número de artículo</label>
                <input
                  type="text"
                  name="artikelNumber"
                  placeholder="Ej: 345-AB"
                  value={safeProduct.artikelNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Descripción</label>
              <textarea
                name="description"
                placeholder="Escribe una breve descripción..."
                value={safeProduct.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="input-group file-upload">
              <label className="file-label">
                📷 Subir imagen
                <input 
                  type="file" 
                  name="imagen" 
                  onChange={handleChange} 
                  accept="image/*"
                  className="file-input"
                />
              </label>
            </div>

            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? '⏳ Creando...' : '✅ Crear Producto'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        /* Container */
        .modal-container {
          width: 100%;
          max-width: 520px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: #111827;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #111827;
        }

        /* Body */
        .modal-body {
          padding: 1.5rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Inputs */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
        }

        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
          outline: none;
        }

        textarea {
          resize: none;
        }

        /* File upload */
        .file-label {
          display: block;
          padding: 1rem;
          border: 2px dashed #9ca3af;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #374151;
          transition: border-color 0.2s, background 0.2s;
        }

        .file-label:hover {
          border-color: #2563eb;
          background: #f9fafb;
        }

        .file-input {
          display: none;
        }

        /* Input row (dos columnas) */
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Error */
        .error-message {
          padding: 0.75rem;
          border-radius: 8px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.9rem;
        }

        /* Submit button */
        .submit-button {
          padding: 0.85rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: #2563eb;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .submit-button:hover:not(:disabled) {
          background: #1e40af;
        }

        .submit-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ProductCreator;
