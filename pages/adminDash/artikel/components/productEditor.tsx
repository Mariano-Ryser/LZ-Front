// components/products/productEditor.js
import { useState , useContext, useEffect} from 'react';
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
   

  const { isAuthenticated } = useContext(AuthContext);
   // Verifica si el producto es válido antes de asignar el estado inicial
    const [localProduct, setLocalProduct] = useState(() => ({
      ...product,
    })); 
  
  

  const handleLocalChange = (e) => {
      const { name, value, files } = e.target;
      
      if (name === 'imagen') {
        setLocalProduct(prev => ({
          ...prev,
          imagen: files[0]
        }));
      } else {
        setLocalProduct(prev => ({
          ...prev,
           [name]: value 
        }));
      }
      
      // Pasar el evento al handleChange original si es necesario
      handleChange(e);
  };
  
  const handleUpdate = (e) => {
      e.preventDefault();
      updateProduct(e, localProduct); 
  };
  const [ubicacionActiva, setUbicacionActiva] = useState(null);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
       
          <h2 className="modal-title">EDITAR PRODUCTO</h2>
         
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="product-image-container">
            {localProduct.imagen && typeof localProduct.imagen === 'string' && (
              <img 
                src={localProduct.imagen} 
                alt={localProduct.name} 
                className="product-image-large"
              />
              
            )}
  
          </div>
          <div className="input-group">
            <label>Artikel Name</label>
            <input
              className="form-input"
              type="text"
              name="artikelName"
              placeholder="Artikel Name"
              value={localProduct.artikelName || ''}
              onChange={handleLocalChange}
              required
            />
          </div>


          <div className="input-group">
            <label>lagerPlatz</label>
            <input
              className="form-input"
              type="text"
              name="lagerPlatz"
              placeholder="lagerPlatz"
              value={localProduct.lagerPlatz || ''}
              onChange={handleLocalChange}
            />
          </div>

          <div className="input-group">
            <label>artikelNumber</label>
            <input
              className="form-input"
              type="text"
              name="artikelNumber"
              placeholder="artikelNumber"
              value={localProduct.artikelNumber || ''}
              onChange={handleLocalChange}
            />
          </div>

          <div className="input-group">
            <label>Beschreibung</label>
            <input
              className="form-input"
              type="text"
              name="description"
              placeholder="Beschreibung"
              value={localProduct.description || ''}
              onChange={handleLocalChange}
            />
          </div>


          <div className="input-group file-input-group">
            <label className="file-label">
              <span>Bild ändern</span>
              <input 
                type="file" 
                name="imagen" 
                onChange={handleLocalChange}
                accept="image/*"
                className="file-input"
              />
 
            </label>
          <button
        className="submit-button delete"
        onClick={async () => {
          if (confirm("¿Seguro que quieres eliminar la imagen?")) {
            await deleteProductImage(localProduct._id);
            setLocalProduct(prev => ({ ...prev, imagen: "" }));
          }
        }}
        disabled={loading}
      >
        🗑️ DELETE BILDER
      </button>
            {localProduct.imagen && localProduct.imagen instanceof File && (
  <div className="preview-container">
    <p >Vista previa de la imagen:</p>
    <img 
      src={URL.createObjectURL(localProduct.imagen)} 
      alt="Vista previa" 
      className="preview-image"
    />
  </div>
  
)}
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠</div>
              {error}
            </div>
          )}
    {isAuthenticated && (
     
     
            <div className="button-group">
            <button 
              className="submit-button update"

              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR PRODUCTO'}
            </button>
            
                 

            <button 
              className="submit-button delete"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              ELIMINAR PRODUCTO
            </button>
          </div>
 )}
          {showDeleteConfirm && (
            <div className="delete-confirm-modal">
              <div className="delete-confirm-content">
                <h3>¿Estás seguro de eliminar este producto?</h3>
                <p>Esta acción no se puede deshacer</p>
                <div className="confirm-buttons">
                  <button 
                    className="confirm-button cancel"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="confirm-button delete"
                    onClick={() => {
                      deleteProduct(product._id);
                      onClose();
                    }}
                  >
                    Confirmar Eliminación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
       /* Estilos previsualizacion imagen */
        .preview-container {
        margin-top: 1rem;
        text-align: center;
      }
      .preview-image {
        max-width: 300px; /* Limita el ancho máximo */
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        object-fit: cover;
      }

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
          max-width: 600px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
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
        
        .product-image-container {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }
        
        .product-image-large {
          max-width: 100%;
          max-height: 300px;
          border-radius: 4px;
          object-fit: contain;
        }
        
        .input-group {
          width: 100%;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #495057;
          font-weight: 500;
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
          background-color: #f8f9fa;
          border: 1px dashed #ced4da;
          border-radius: 4px;
          cursor: pointer;
          color: #495057;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .file-label:hover {
          background-color: #e9ecef;
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
        
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        
        .submit-button {
          width: 100%;
          padding: 12px 15px;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button.update {
          background-color: #28a745;
        }
        
        .submit-button.update:hover:not(:disabled) {
          background-color: #218838;
        }
        
        .submit-button.delete {
          background-color: #dc3545;
        }
        
        .submit-button.delete:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        .submit-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        
        .delete-confirm-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        
        .delete-confirm-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
        }
        
        .delete-confirm-content h3 {
          color: #000;
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .delete-confirm-content p {
          color: #6c757d;
          margin-bottom: 20px;
        }
        
        .confirm-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .confirm-button {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .confirm-button.cancel {
          background-color: #6c757d;
          color: white;
          border: none;
        }
        
        .confirm-button.cancel:hover {
          background-color: #5a6268;
        }
        
        .confirm-button.delete {
          background-color: #dc3545;
          color: white;
          border: none;
        }
        
        .confirm-button.delete:hover {
          background-color: #c82333;
        }
        
        @media (max-width: 480px) {
          .modal-container {
            max-height: 95vh;
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
          
          .confirm-buttons {
            flex-direction: column;
          }
          
          .confirm-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductEditor;