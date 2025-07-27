// components/products/productCreator.js
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

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
        <div className="modal-header">
          <h2>Neuer Artikel</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
           <form onSubmit={createProduct}>
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
            <input
              type="text"
              name="description"
              placeholder="Beschreibung"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="file-label">
              <span>Bilder</span>
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
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-container {
          width: 100%;
          max-width: 500px;
          background: white;
          border: 1px solid black;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid black;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        
        .modal-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .input-group {
          width: 100%;
        }
        
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid black;
        }
        
        .file-label {
          display: block;
          padding: 0.5rem;
          border: 1px solid black;
          text-align: center;
          cursor: pointer;
        }
        
        .file-input {
          display: none;
        }
        
        .error-message {
          padding: 0.5rem;
          border: 1px solid black;
          background: #ffebee;
          color: #b71c1c;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #f0f0f0;
          border: 1px solid black;
          cursor: pointer;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #e0e0e0;
        }
        
        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCreator;