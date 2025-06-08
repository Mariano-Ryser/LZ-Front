import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext  } from '../../components/auth/AuthProvider';
import ImageUploader from './ImageUploader';
import Skeleton from '../../components/Skeleton';

export default function Home() {
  const { isAuthenticated} = useContext(AuthContext);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const modalContentRef = useRef(null);

  // Obtener imágenes desde el backend
  const fetchImages = async () => {
    try {
      // Simular un retraso de 3 segundos (3000 ms)
      // await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const response = await fetch(`${baseURL}/images`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };
  // Función para dar like a una imagen
  const handleLike = async (id) => {
    await fetch(`${baseURL}/images/${id}/like`, { method: 'POST' });
    fetchImages(); // Refresca la galería con el nuevo conteo de likes
  };
  // Función para agregar comentarios a las imágenes
  const handleComment = async (e, id) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text) return;
    await fetch(`${baseURL}/images/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    e.target.reset();
    fetchImages(); // Recarga los comentarios
  };

  // Función para dar like a un comentario
  const handleLikeComment = async (imageId, commentId) => {
    try {
      const response = await fetch(`${baseURL}/images/${imageId}/comment/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        setImages((prevImages) =>
          prevImages.map((img) => {
            if (img._id === imageId) {
              return {
                ...img,
                comments: img.comments.map((comm) =>
                  comm._id === commentId ? { ...comm, likes: (comm.likes || 0) + 1 } : comm
                ),
              };
            }
            return img;
          })
        );
      }
    } catch (err) {
      console.error('Error al likear comentario:', err);
    }
  };

  // Carga de imágenes al cargar la página
  useEffect(() => {
    fetchImages();
  }, []);

  // Scroll automático a la imagen seleccionada al abrir el modal
  useEffect(() => {
    if (modalOpen && modalContentRef.current) {
      const targetImage = modalContentRef.current.querySelectorAll('.image-post')[selectedImageIndex];
      if (targetImage) {
        targetImage.scrollIntoView({ block: 'center' }); // Eliminado el behavior: 'smooth'
      }
    }
  }, [modalOpen, selectedImageIndex]);

  // Renderizado de la página
  return (
    <div className="container">
      <h3>Galería de Imágenes</h3>

{isAuthenticated && (
  <ImageUploader
        onUpload={(uploadedImageUrl) => {
          const newImage = { imageUrl: uploadedImageUrl };
          setImages((prev) => [newImage, ...prev]);
        }}
      />
)
}
      

   {/* GALERIA DE IMAGENES */}
<div className="image-grid">
  {loading ? (
    Array.from({ length: 20 }).map((_, index) => (
      
      <Skeleton
       key={index}
        className="custom-skeleton"
         width="100%"
          height="16.5rem" />
    ))
  ) : (
    images.map((image, index) => (
      <div key={index} className="image-container">
        <img
          src={`${image.imageUrl.replace('/upload/', '/upload/c_fill,w_500,h_600/')}`}
          alt={`Imagen ${index}`}
          className="image"
          onClick={() => {
            setSelectedImageIndex(index);
            setModalOpen(true);
          }}
        />
      </div>
    ))
  )}
</div>

      {/* MODAL DE IMAGENES */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" ref={modalContentRef} onClick={(e) => e.stopPropagation()}>
            {/* MAPEO DE IMAGENES */}
       
            {images.map((image, idx) => (
              <div key={idx} className="image-post">
                 <div className='container-foto-name'>
                   <div className='perfilFotoCircular'></div><p className='name'>Mariano Ryser</p> 
                 </div>
                <img
                  src={`${image.imageUrl.replace('/upload/', '/upload/c_fill,w_500,h_600/')}`}
                  className="modal-image"
                />
                <div className="caja-like-coments">
                  <button onClick={() => handleLike(image._id)} className="like-button-img">
                    👍 {image.likes || 0}
                  </button>
                  <form onSubmit={(e) => handleComment(e, image._id)} className="comment-form">
                    <input type="text" name="comment" placeholder="Agrega un comentario..." />
                    <button type="submit">Comentar</button>
                  </form>
                  <div className="comments">
                    {image.comments &&
                      image.comments.slice(-3).map((c, i) => (
                        <div key={i} className="comment">
                          <div className="comment-content">
                            <p>- {c.text}</p>
                            <button
                              className="like-button"
                              onClick={() => handleLikeComment(image._id, c._id)}
                            >
                              🩶 {c.likes || 0}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}

          </div>
          <div className="footer-modal">
              <div className="close-arrow" onClick={() => setModalOpen(false)}>
                ⬅️
              </div>
            </div>
        </div>
      )}

      <style jsx>{`
        img{
          filter: grayscale(100%);
        }
        img:hover{
          filter: grayscale(0);
          cursor: pointer;
           transition: all  0.3s;
        }
        .container{
          max-width:900px;
          margin:auto;
        }
        .container-foto-name{
          display: flex;
           align-items: center;  /* Alinea los elementos verticalmente al centro */
           gap: 10px;  /* Espacio entre la foto de perfil y el nombre */
        }
        .perfilFotoCircular{
           width: 2rem;  /* Ancho de la imagen */
           height: 2rem;  /* Alto de la imagen */
           border-radius: 50%;  /* Hace que sea circular */
           background-image: url('/img/me2.jpg'); /* O puedes usar una imagen aquí */
           background-size: cover;
           background-position: center;
           margin-left:0.8rem;
        }
        .name {
         
        font-size: 0.9rem;
        font-weight: bold;
        margin: 0;  /* Elimina márgenes predeterminados */
         }
       
        .like-button-img {
          padding-left: 1rem;
          background: none;
          border: none;
          color: rgba(224, 224, 224, 0.8);
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .like-button-img:hover {
          transform: scale(1.05);
        }
        .modal-overlay {
         
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          transition: opacity 0.3s ease;
        }
        .modal-content {

          background: #1e1e1e;
          padding-top: 2rem;
          max-height: 100vh;
          overflow-y: auto;
          width: 100%;
          max-width: 56rem;
          position: relative;
          animation: fadeIn 0.3s ease;
          scrollbar-width: thin;
          scrollbar-color: #555 #1e1e1e;
        }
        /* SCROLLBAR ESTILO DARK PARA CHROME */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px) translateX(-100%); }
          to { opacity: 1; transform: translateY(0)translateX(0%);; }
        }
        .footer-modal {
          width: 100%;
          max-width: 56rem;
          position: fixed;
          bottom: 0;
          width: 100%;
          height:4rem;
          padding: 0.47rem;
          background:rgba(0, 0, 0, 0.7);
        }
        .close-arrow {
          position: absolute;
          right: 1.3rem;
          font-size: 2rem;
          cursor: pointer;
          color: #ccc;
          transition: 0.3s;
          z-index: 3000;
        }
        .close-arrow:hover {
          color: white;
          transform: scale(1.1);
        }
        .image-post {
          margin-bottom: 1.5rem;
        }
        .modal-image {
         
          width: 100%;
          margin-top:0.6rem;
        }
        .like-button {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .like-button:hover {
          transform: scale(1.1);
        }
        .comment-form {
          padding-left: 10px;
          margin-top: 5px;
          display: flex;
          gap: 10px;
        }
        .comment-form input {
          flex: 1;
          background: #333;
          color: white;
          padding: 8px;
          border: 1px solid #555;
          border-radius: 5px;
        }
        .comment-form input::placeholder {
          color: rgba(199, 202, 204, 0.68);
          opacity: 1; /* Firefox */
        }
        .comment-form button {
          padding: 8px 16px;
          background-color: #555;
          color: white;
          border: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .comment-form button:hover {
          background-color: #777;
        }

        .comments {
          padding-left: 10px;
          border-radius: 5px;
          margin-top: 10px;
        }
        .comment {
          margin-bottom: 10px;
        }
        .comment-content {
          border:solid 1px rgba(178, 184, 189, 0);
          flex: 1; /* Ocupa todo el espacio disponible */
          margin-right: 10px; /* Espacio entre el texto y el botón de like */
          margin-bottom:5px;
          display: flex;
          padding:0.03rem;
          border-radius:4px;
        }
        .comment p {
          color: #ddd;
          margin: 0;
          font-size: 0.9rem;
        }
        .comment-actions {
          display: flex;
          align-items: center; /* Alinea el botón de like verticalmente */
          justify-content: flex-end; /* Alinea el botón de like a la derecha */
          margin-top: 5px;
          width: 5rem;
        }
        .like-button {
          position:absolute;
          right:2rem;
          background: none;
          border: none;
          color:rgb(206, 206, 206);
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s;
          padding: 0; /* Elimina el padding para mejor alineación */
        }
        .like-button:hover {
          transform: scale(1.1);
        }
        .upload-container {
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .upload-container input {
          margin-bottom: 10px;
        }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 20px;
        }
        .image-container {
          border-radius: 10px;
          overflow: hidden;
        }
        .image-container:hover {
          transform: scale(1.03);
          transition: transform 0.3s;
        }
        .image {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 10px;
          transition: transform 0.3s;
        }
        .image:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}    


//Aqui FINAL!