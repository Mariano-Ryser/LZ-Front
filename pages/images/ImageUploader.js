import { useState } from 'react';

export default function ImageUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false); // Estado para mostrar el formulario de subida
  const [keyInput, setKeyInput] = useState(''); // Estado para la clave ingresada

  //AGREGAREMOS OTRO DIA CLAVE CON .ENV
  // NEXT_PUBLIC_UPLOAD_KEY=clave123
  // const correctKey = process.env.NEXT_PUBLIC_UPLOAD_KEY; 

  const correctKey = "321"; // Clave simple escrita en el código

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Función para manejar la carga de la imagen
  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      onUpload(data.image.imageUrl); // Notificar al padre con la nueva imagen
      setModalOpen(false); // Cerrar el modal después de subir la imagen
    } catch (error) {
      console.error(error);
      alert('Error al subir imagen.');
    } finally {
      setLoading(false);
      setFile(null);
      document.querySelector('.file-input').value = null;
    }
  };

  // Función para verificar la clave
  const verifyKey = () => {
    if (keyInput === correctKey) {
      setShowUploadForm(true); // Mostrar el formulario de subida si la clave es correcta
    } else {
      alert('Clave incorrecta');
    }
  };

  const openModal = () => {
    setModalOpen(true);
    setShowUploadForm(false); // Resetear el estado del formulario de subida
    setKeyInput(''); // Limpiar el input de la clave
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowUploadForm(false); // Ocultar el formulario de subida al cerrar el modal
  };

  return (
    <div>
      {/* Botón flotante con "+" */}
      <div className="floating-button" onClick={openModal}>
        +
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              {/* Botón de cierre en el modal */}
              <button onClick={closeModal} className="close-button">
                &times;
              </button>
            </div>

            {/* Mostrar el formulario de subida solo si la clave es correcta */}
            {showUploadForm ? (
              <div className="upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  />
                  
                <button onClick={handleUpload} disabled={loading} className="upload-button">
                  {loading ? 'Subiendo...' : 'Subir Imagen'}
                </button>
              </div>
            ) : (
              <div className="key-form">
                <input
                  type="password"
                  placeholder="Ingresa la clave"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="key-input"
                />
                <button onClick={verifyKey} className="verify-button">
                  Verificar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Botón flotante */
        .floating-button {
          position: fixed;
          top: 6rem;
          right: 30px;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, rgba(47, 167, 36, 0.64), rgba(35, 139, 9, 0.63));
          color: rgb(255, 255, 255);
          font-size: 36px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          z-index: 1000;
          transition: transform 0.3s;
        }

        .floating-button:hover {
          transform: scale(1.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          border: 1px solid rgba(143, 143, 143, 0.23);
          background-color: rgba(24, 24, 24, 0.93);
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 96%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: flex-end;
        }

        .close-button {
          color: white;
          background: none;
          border: none;
          font-size: 30px;
          cursor: pointer;
        }

        /* Estilos del contenedor de la subida */
        .upload-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 2px solid rgba(143, 143, 143, 0.65);
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
        }

        .file-input:hover {
          border: 2px solid rgba(236, 236, 236, 0.65);
          border-radius: 15px;
        }

        .upload-button {
          padding: 12px 20px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .upload-button:hover {
          background: #2980b9;
        }

        .upload-button:disabled {
          background-color: rgb(166, 149, 149);
          cursor: not-allowed;
        }

        /* Estilos para el formulario de clave */
        .key-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .key-input {
          padding: 10px;
          border: 2px solid rgba(143, 143, 143, 0.65);
          border-radius: 10px;
          font-size: 16px;
          width: 100%;
          color: white;
          background: transparent;
        }

        .key-input:focus {
          outline: none;
          border: 2px solid rgba(236, 236, 236, 0.65);
        }

        .verify-button {
          padding: 10px 20px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .verify-button:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
}