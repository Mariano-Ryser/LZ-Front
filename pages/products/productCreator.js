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
          <h2 className="modal-title">NUEVO PRODUCTO</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="NOMBRE"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              className="form-input"
              type="number"
              name="price"
              placeholder="PRECIO"
              value={product.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="input-group">
            <input
              className="form-input"
              type="text"
              name="category"
              placeholder="CATEGORÍA"
              value={product.category}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              className="form-input"
              type="text"
              name="supplier"
              placeholder="PROVEEDOR"
              value={product.supplier}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              className="form-input"
              type="text"
              name="lugarDeVenta"
              placeholder="LUGAR DE VENTA"
              value={product.lugarDeVenta}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              className="form-input"
              type="text"
              name="marca"
              placeholder="MARCA"
              value={product.marca}
              onChange={handleChange}
            />
          </div>

          <div className="input-group file-input-group">
            <label className="file-label">
              <span>Seleccionar imagen</span>
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
              <div className="error-icon">⚠</div>
              {error}
            </div>
          )}

          <button 
            className="submit-button" 
            onClick={createProduct}
            disabled={loading}
          >
            {loading ? 'PROCESANDO...' : 'CREAR PRODUCTO'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .modal-title {
          color: #000;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        
        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .input-group {
          width: 100%;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          color: #000;
          background-color: #fff;
          transition: border-color 0.15s ease-in-out;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .file-input-group {
          margin-top: 8px;
        }
        
        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 15px;
          background-color:rgb(46, 50, 53);
          border: 1px dashed #ced4da;
          border-radius: 4px;
          cursor: pointer;
          color: #495057;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .file-label:hover {
          background-color:rgb(45, 126, 79);
        }
        
        .file-input {
          display: none;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          font-size: 14px;
          margin-top: 8px;
        }
        
        .error-icon {
          margin-right: 8px;
          font-size: 16px;
        }
        
        .submit-button {
          width: 100%;
          padding: 12px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover {
          background-color: #0069d9;
        }
        
        .submit-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .modal-overlay {
            padding: 10px;
          }
          
          .modal-container {
            max-width: 100%;
          }
          
          .modal-header {
            padding: 12px 15px;
          }
          
          .modal-title {
            font-size: 16px;
          }
          
          .modal-body {
            padding: 15px;
          }
          
          .form-input {
            padding: 10px 12px;
            font-size: 13px;
          }
          
          .submit-button {
            padding: 10px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCreator;