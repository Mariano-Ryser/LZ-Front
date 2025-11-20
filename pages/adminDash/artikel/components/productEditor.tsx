import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../../components/auth/AuthProvider';

export const ProductEditor = ({ 
  product, 
  handleChange, 
  updateProduct,
  deleteProductImage,
  deleteProduct,
  loading, 
  error,
  onClose 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { isAuthenticated } = useContext(AuthContext);

  const [localProduct, setLocalProduct] = useState(() => ({
    ...product,
  })); 

  useEffect(() => {
    if (product.imagen && typeof product.imagen === 'string') {
      setImagePreview(product.imagen);
    }
  }, [product.imagen]);

  const handleLocalChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files?.[0]) {
      const file = files[0];
      setLocalProduct(prev => ({
        ...prev,
        imagen: file
      }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLocalProduct(prev => ({
        ...prev,
        [name]: value 
      }));
    }
    
    handleChange(e);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await updateProduct(e, localProduct);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async () => {
    if (confirm("Möchten Sie das Bild wirklich löschen?")) {
      await deleteProductImage(localProduct._id);
      setLocalProduct(prev => ({ ...prev, imagen: "" }));
      setImagePreview(null);
    }
  };

  const handleDeleteProduct = async () => {
    await deleteProduct(product._id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Artikel bearbeiten</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Image Preview */}
          {imagePreview && (
            <div className="image-section">
              <img 
                src={imagePreview} 
                alt={localProduct.artikelName} 
                className="product-image"
              />
            </div>
          )}

          <div className="form-section">
            {/* Artikel Name */}
            <div className="form-group">
              <label>Artikel Name</label>
              <input
                type="text"
                name="artikelName"
                placeholder="Artikel Name"
                value={localProduct.artikelName || ''}
                onChange={handleLocalChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Lagerplatz & Artikel Number */}
            <div className="form-row">
              <div className="form-group">
                <label>Lagerplatz</label>
                <input
                  type="text"
                  name="lagerPlatz"
                  placeholder="Lagerplatz"
                  value={localProduct.lagerPlatz || ''}
                  onChange={handleLocalChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Artikelnummer</label>
                <input
                  type="text"
                  name="artikelNumber"
                  placeholder="Artikelnummer"
                  value={localProduct.artikelNumber || ''}
                  onChange={handleLocalChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Stock & Price */}
            <div className="form-row">
              <div className="form-group">
                <label>Bestand</label>
                <input
                  type="number"
                  name="stock"
                  // 
                  value={localProduct.stock ?? 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleLocalChange({ ...e, target: { ...e.target, value: '' } });
                    } else {
                      const numValue = Number(value);
                      if (numValue >= 0) {
                        handleLocalChange(e);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      handleLocalChange({ ...e, target: { ...e.target, value: 0 } });
                    }
                  }}
                  disabled={isSubmitting}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Preis (€)</label>
                <input
                  type="number"
                  name="price"
                  value={localProduct.price ?? 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleLocalChange({ ...e, target: { ...e.target, value: '' } });
                    } else {
                      const numValue = Number(value);
                      if (numValue >= 0) {
                        handleLocalChange(e);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      handleLocalChange({ ...e, target: { ...e.target, value: 0 } });
                    }
                  }}
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Beschreibung</label>
              <textarea
                name="description"
                placeholder="Beschreibung"
                value={localProduct.description || ''}
                onChange={handleLocalChange}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            {/* Image Upload - Only for authenticated users */}
            {isAuthenticated && (  
              <div className="form-group">
                <label>Bild ändern</label>
                <div className="file-upload-section">
                  <label className="file-label">
                    <span>📷 Neues Bild auswählen</span>
                    <input 
                      type="file" 
                      name="imagen" 
                      onChange={handleLocalChange}
                      accept="image/*"
                      className="file-input"
                      disabled={isSubmitting}
                    />
                  </label>
                  
                  {localProduct.imagen && (
                    <button
                      type="button"
                      className="btn btn-delete-image"
                      onClick={handleDeleteImage}
                      disabled={isSubmitting}
                    >
                      🗑️ Bild löschen
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Only for authenticated users */}
        {isAuthenticated && (
          <div className="modal-footer">
            <button 
              className="btn btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <div className="action-buttons">
              <button 
                className="btn btn-update"
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Speichern...
                  </>
                ) : (
                  "Änderungen speichern"
                )}
              </button>
              
              <button 
                className="btn btn-delete"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                Artikel löschen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop confirm-modal">
          <div className="modal confirm-dialog">
            <div className="modal-header">
              <h3>Artikel löschen</h3>
            </div>
            <div className="modal-body">
              <p>Sind Sie sicher, dass Sie diesen Artikel löschen möchten?</p>
              <p className="warning-text">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-cancel" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Abbrechen
              </button>
              <button 
                className="btn btn-delete" 
                onClick={handleDeleteProduct}
              >
                Löschen bestätigen
              </button>
            </div>
          </div>
        </div>
      )}

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

        .confirm-modal {
          z-index: 2000;
        }

        .modal {
          background: white;
          width: 95%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
        }

        .confirm-dialog {
          max-width: 400px;
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

        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
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

        .confirm-dialog .modal-body {
          text-align: center;
        }

        .warning-text {
          color: #dc3545;
          font-weight: 500;
        }

        .image-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .product-image {
          max-width: 300px;
          max-height: 300px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

        .form-group input,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.95rem;
          background: white;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }

        /* File Upload */
        .file-upload-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          background: #f8f9fa;
          border: 2px dashed #ced4da;
          border-radius: 4px;
          cursor: pointer;
          color: #495057;
          font-weight: 500;
          transition: all 0.2s;
        }

        .file-label:hover:not(:has(.file-input:disabled)) {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .file-input {
          display: none;
        }

        .file-label:has(.file-input:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Error Message */
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          font-size: 0.9rem;
        }

        .error-icon {
          font-size: 1.1rem;
        }

        /* Footer */
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 120px;
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

        .btn-update {
          background: #28a745;
          color: white;
        }

        .btn-update:hover:not(:disabled) {
          background: #218838;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover:not(:disabled) {
          background: #c82333;
        }

        .btn-delete-image {
          background: #ffc107;
          color: #212529;
          min-width: auto;
        }

        .btn-delete-image:hover:not(:disabled) {
          background: #e0a800;
        }

        /* Loading Spinner */
        .loading-spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid currentColor;
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

          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .modal-footer {
            flex-direction: column;
            gap: 12px;
          }

          .action-buttons {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .product-image {
            max-width: 200px;
            max-height: 200px;
          }
        }

        @media (max-width: 480px) {
          .modal-header h2 {
            font-size: 1.1rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 8px 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductEditor;