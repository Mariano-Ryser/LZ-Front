import { useState, useRef } from 'react';

export default function NoticiasUploader({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    descripcion: '',
    fuente: '',
    secciones: [
      { subtitulo: '', contenido: '' }
    ]
  });
  
  const fileInputRef = useRef(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const handleSeccionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSecciones = [...formData.secciones];
    updatedSecciones[index][name] = value;
    setFormData(prev => ({ ...prev, secciones: updatedSecciones }));
  };

  const addSeccion = () => {
    setFormData(prev => ({
      ...prev,
      secciones: [...prev.secciones, { subtitulo: '', contenido: '' }]
    }));
  };

  const removeSeccion = (index) => {
    if (formData.secciones.length > 1) {
      const updatedSecciones = formData.secciones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, secciones: updatedSecciones }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('autor', formData.autor);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('fuente', formData.fuente);
      formDataToSend.append('secciones', JSON.stringify(formData.secciones));
      
      if (imagenFile) {
        formDataToSend.append('imagen', imagenFile);
      }

      await onSubmit(formDataToSend);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Hubo un error al crear la noticia');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (

    <>
    <div className={"modalOverlay"}>
      <div className={"modalContent"}>
        <button className={"closeButton"} onClick={onClose}>×</button>
        <h2>Crear Nueva Noticia</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={"formGroup"}>
            <label>Título*</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              />
          </div>

          <div className={"formGroup"}>
            <label>Autor*</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              />
          </div>

          <div className={"formGroup"}>
            <label>Descripción*</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              />
          </div>

          <div className={"formGroup"}>
        <label>Imagen*</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          // required
        />
      </div>

          <div className={"formGroup"}>
            <label>Fuente*</label>
            <input
              type="text"
              name="fuente"
              value={formData.fuente}
              onChange={handleChange}
              required
              />
          </div>

          <h3>Secciones de la Noticia</h3>
          {formData.secciones.map((seccion, index) => (
            <div key={index} className={"seccionContainer"}>
              <div className={"formGroup"}>
                <label>Subtítulo {index > 0 ? '(Opcional)' : '*'}</label>
                <input
                  type="text"
                  name="subtitulo"
                  value={seccion.subtitulo}
                  onChange={(e) => handleSeccionChange(index, e)}
                //no es obligatorio
                  />
              </div>

              <div className={"formGroup"}>
                <label>Contenido {index > 0 ? '(Opcional)' : '*'}</label>
                <textarea
                  name="contenido"
                  value={seccion.contenido}
                  onChange={(e) => handleSeccionChange(index, e)}
                  //no es obligatorio
                  />
              </div>

              {index > 0 && (
                <button
                type="button"
                className={"removeButton"}
                onClick={() => removeSeccion(index)}
                >
                  Eliminar Sección
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={"addButton"}
            onClick={addSeccion}
            >
            + Añadir otra sección
          </button>

          <div className={"formActions"}>
            <button type="button" className={"cancelButton"} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={"submitButton"}>
            {isSubmitting ? 'Publicando...' : 'Publicar Noticia'}
            </button>
          </div>
        </form>
      </div>
     
    </div>
    <style jsx>{`
      .form-error {
          color: #ff6b6b;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 4px;
        }
      .modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.66);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modalContent {
  background-color:rgb(13, 93, 129);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.formGroup {
  margin-bottom: 1rem;
}

.formGroup label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.formGroup input,
.formGroup textarea {
  color:black;
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
}

.formGroup textarea {
  min-height: 100px;
  resize: vertical;
}

.seccionContainer {
  padding: 1rem;
  margin-bottom: 1rem;
}

.addButton {
  background-color:rgb(16, 26, 15);
  border: 1px dashed #ccc;
  padding: 0.5rem 1rem;
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;
}

.addButton:hover {
  background-color:rgb(15, 63, 5);
}

.removeButton {
  background-color:rgb(180, 1, 28);
  border: 1px solid #ffcdd2;
  color:rgb(255, 255, 255);
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.removeButton:hover {
  background-color:rgb(165, 6, 22);
}

.formActions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancelButton {
  background-color:rgb(175, 5, 5);
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancelButton:hover {
  background-color:rgb(230, 7, 7);
}

.submitButton {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.submitButton:hover {
  background-color: #388e3c;
}
      `}</style>
            </>
  );
}

