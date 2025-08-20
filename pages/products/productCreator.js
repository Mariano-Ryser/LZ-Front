import { useState } from 'react';

export const ProductCreator = ({ 
  product = {}, 
  handleChange, 
  createProduct, 
  loading, 
  error,
  onClose 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* HEADER */}
        <div className="modal-header">
          <h2>➕ Neuer Artikel</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <form onSubmit={createProduct} className="form">
            
            <div className="input-group">
              <input
                type="text"
                name="artikelName"
                placeholder="Artikel Name"
                value={product.artikelName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="lagerPlatz"
                placeholder="Lager Platz"
                value={product.lagerPlatz}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="artikelNumber"
                placeholder="Artikel Nummer"
                value={product.artikelNumber}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <textarea
                name="description"
                placeholder="Beschreibung"
                value={product.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="input-group file-upload">
              <label className="file-label">
                📷 Bild hochladen
                <input 
                  type="file" 
                  name="imagen" 
                  onChange={handleChange} 
                  accept="image/*"
                  capture="environment"
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
          max-width: 480px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 35px rgba(0,0,0,0.2);
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
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #111827;
        }

        /* Body */
        .modal-body {
          padding: 1.25rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Inputs */
        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          outline: none;
        }

        textarea {
          resize: none;
        }

        /* File upload */
        .file-label {
          display: block;
          padding: 0.75rem;
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
          background: #f3f4f6;
        }

        .file-input {
          display: none;
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