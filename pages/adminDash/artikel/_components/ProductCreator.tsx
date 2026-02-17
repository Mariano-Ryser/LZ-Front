import { useState, useEffect } from "react";

interface Product {
  artikelName?: string;
  lagerPlatz?: string;
  artikelNumber?: string;
  description?: string;
  stock?: number;
  price?: number;
  imagen?: string | File | null;
}

interface ProductCreatorProps {
  product?: Product;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  createProduct: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
}

export const ProductCreator: React.FC<ProductCreatorProps> = ({
  product = {},
  handleChange,
  createProduct,
  loading,
  error,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    artikelName: "",
    lagerPlatz: "",
    artikelNumber: "",
    description: "",
    stock: 0,
    price: 0,
    imagen: null as File | null,
  });

  // Sincronizar con el product del hook
  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        artikelName: product.artikelName ?? "",
        lagerPlatz: product.lagerPlatz ?? "",
        artikelNumber: product.artikelNumber ?? "",
        description: product.description ?? "",
        stock: product.stock ?? 0,
        price: product.price ?? 0,
      }));
    }
  }, [product]);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Actualizar estado local
    setFormData(prev => ({ ...prev, imagen: file }));
    
    // Llamar a handleChange con el evento original
    handleChange(e);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Actualizar estado local
    if (type === "number") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === "" ? "" : value // Mantener como string temporalmente
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // También llamar al handleChange del hook para mantener sincronizado
    handleChange(e);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Permitir campo vacío, solo números positivos, y el punto decimal para precios
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Actualizar estado local
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Crear un evento sintético para handleChange
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: name,
          value: value,
          type: 'number'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
    }
  };

  const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>, fieldName: string) => {
    const value = e.target.value;
    
    let finalValue = value;
    
    // Si está vacío o es solo un punto, poner 0
    if (value === '' || value === '.') {
      finalValue = "0";
    } else if (value.endsWith('.')) {
      // Si termina en punto, agregar .00 para precios
      finalValue = value + '00';
    }
    
    // Solo actualizar si el valor cambió
    if (finalValue !== value) {
      setFormData(prev => ({ ...prev, [fieldName]: finalValue }));
      
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: fieldName,
          value: finalValue,
          type: 'number'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createProduct(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Neuer Artikel</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-section">
              {/* Artikel Name */}
              <div className="form-group">
                <label>Artikel Name *</label>
                <input
                  type="text"
                  name="artikelName"
                  value={formData.artikelName}
                  placeholder="Artikel Name eingeben"
                  onChange={handleInputChange}
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
                    value={formData.lagerPlatz}
                    placeholder="A-12"
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>Artikelnummer</label>
                  <input
                    type="text"
                    name="artikelNumber"
                    value={formData.artikelNumber}
                    placeholder="345-AB"
                    onChange={handleInputChange}
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
                    value={formData.stock}
                    onChange={handleNumberChange}
                    onBlur={(e) => handleNumberBlur(e, 'stock')}
                    disabled={isSubmitting}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Preis (CHF)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    onBlur={(e) => handleNumberBlur(e, 'price')}
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
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Produktbeschreibung..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Bild</label>
                <div className="file-upload-section">
                  <label className="file-label">
                    <span>📷 Bild auswählen</span>
                    <input
                      type="file"
                      name="imagen"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      disabled={isSubmitting}
                    />
                  </label>
                  
                  {imagePreview && (
                    <div className="image-preview">
                      <img 
                        src={imagePreview} 
                        alt="Vorschau" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions - DENTRO del form */}
          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <button 
              className="btn btn-save" 
              type="submit"
              disabled={isSubmitting || !formData.artikelName.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner small"></div>
                  Erstellen...
                </>
              ) : (
                "Artikel Erstellen"
              )}
            </button>
          </div>
        </form>
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
          padding: 20px;
        }

        .modal {
          background: white;
          width: 95%;
          max-width: 600px;
          max-height: 85vh;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
        }

        /* Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
          flex-shrink: 0;
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
          max-height: calc(85vh - 140px);
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

        .image-preview {
          display: flex;
          justify-content: center;
        }

        .preview-image {
          max-width: 200px;
          max-height: 200px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
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
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
          flex-shrink: 0;
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

        .btn-save {
          background: #28a745;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background: #218838;
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

        /* Scrollbar personalizado */
        .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
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
            max-height: calc(95vh - 140px);
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
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

          .preview-image {
            max-width: 150px;
            max-height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCreator;