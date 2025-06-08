
import { useEffect, useState } from "react";

const QuizGame = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Estados
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    pregunta: "",
    opciones: ["", "", "", ""],
    respuestaCorrecta: "",
    categoria: "Ciencia",
    dificultad: "fácil",
  });
  const [mensaje, setMensaje] = useState("");
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [dificultadFiltro, setDificultadFiltro] = useState("Todas");

  // Obtener preguntas al cargar el componente o cambiar filtros
  useEffect(() => {
    const url = `${baseURL}/preguntas?${
      categoriaFiltro !== "Todas" ? `categoria=${categoriaFiltro}&` : ""
    }${dificultadFiltro !== "Todas" ? `dificultad=${dificultadFiltro}` : ""}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPreguntas(data.preguntas);
        seleccionarPreguntaAleatoria(data.preguntas);
      })
      .catch((error) => console.error("Error al obtener preguntas:", error));
  }, [categoriaFiltro, dificultadFiltro]);

  // Seleccionar una pregunta aleatoria
  const seleccionarPreguntaAleatoria = (preguntasList) => {
    if (preguntasList.length > 0) {
      const randomIndex = Math.floor(Math.random() * preguntasList.length);
      setPreguntaActual(preguntasList[randomIndex]);
      setRespuestaSeleccionada(null);
      setRespuestaCorrecta(false);
    } else {
      setPreguntaActual(null); // No hay preguntas con los filtros seleccionados
    }
  };

  // Manejar cambios en el modal de creación
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("opcion")) {
      const index = parseInt(name.split("-")[1], 10);
      const nuevasOpciones = [...nuevaPregunta.opciones];
      nuevasOpciones[index] = value;
      setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
    } else {
      setNuevaPregunta({ ...nuevaPregunta, [name]: value });
    }
  };

  // Enviar nueva pregunta al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !nuevaPregunta.pregunta.trim() ||
      !nuevaPregunta.respuestaCorrecta.trim() ||
      !nuevaPregunta.categoria.trim()
    ) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/preguntas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaPregunta),
      });

      if (response.ok) {
        const data = await response.json();
        setPreguntas([data.pregunta, ...preguntas]);
        setMensaje("Pregunta creada con éxito!");
        setTimeout(() => setMensaje(""), 2000);
        setTimeout(() => setShowModal(false), 2000);
        
        setNuevaPregunta({
          pregunta: "",
          opciones: ["", "", "", ""],
          respuestaCorrecta: "",
          categoria: "Ciencia",
          dificultad: "fácil",
        });
      }
    } catch (error) {
      console.error("Error al crear pregunta:", error);
    }
  };

  // Manejar la selección de una respuesta
  const handleRespuesta = (opcion, index) => {
    setRespuestaSeleccionada(index);
    if (opcion === preguntaActual.respuestaCorrecta) {
      setRespuestaCorrecta(true);
    } else {
      setRespuestaCorrecta(false);
    }
  };

  if (!preguntaActual) return(
  <> 
  <p>No hay preguntas disponibles con los filtros seleccionados.</p>
        {/* Menú de filtrado */}
        <div className="filtros">
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Ciencia">Ciencia</option>
          <option value="Historia">Historia</option>
          <option value="Geografía">Geografía</option>
          <option value="Arte">Arte</option>
          <option value="Deporte">Deporte</option>
          <option value="Literatura">Literatura</option>
          <option value="Entretenimiento">Entretenimiento</option>
        </select>

        <select
          value={dificultadFiltro}
          onChange={(e) => setDificultadFiltro(e.target.value)}
        >
          <option value="Todas">Todas las dificultades</option>
          <option value="fácil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="difícil">Difícil</option>
        </select>
      </div>
  <style jsx>{`
      .filtros {
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          color: black;
        }
        .filtros select {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          color: black;
        }
        `}</style>
  </>
  )

  return (<>

    <div className="quiz-container">
      <h3>Quiz Game</h3>
      <button className="add-button" onClick={() => setShowModal(true)}>
        +
      </button>
      {/* Botón para abrir el modal */}

      {/* Modal para crear preguntas */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Crear Nueva Pregunta</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="pregunta"
                placeholder="Pregunta"
                value={nuevaPregunta.pregunta}
                onChange={handleChange}
              />
              {nuevaPregunta.opciones.map((opcion, index) => (
                <input
                  key={index}
                  type="text"
                  name={`opcion-${index}`}
                  placeholder={`Opción ${index + 1}`}
                  value={opcion}
                  onChange={handleChange}
                />
              ))}
              <input
                type="text"
                name="respuestaCorrecta"
                placeholder="Respuesta Correcta (ej. Opción 1)"
                value={nuevaPregunta.respuestaCorrecta}
                onChange={handleChange}
              />
              <select
                name="categoria"
                value={nuevaPregunta.categoria}
                onChange={handleChange}
              >
                <option value="Ciencia">Ciencia</option>
                <option value="Historia">Historia</option>
                <option value="Geografía">Geografía</option>
                <option value="Arte">Arte</option>
                <option value="Deporte">Deporte</option>
                <option value="Literatura">Literatura</option>
                <option value="Entretenimiento">Entretenimiento</option>
              </select>
              <select
                name="dificultad"
                value={nuevaPregunta.dificultad}
                onChange={handleChange}
              >
                <option value="fácil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="difícil">Difícil</option>
              </select>
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </form>
            <div className="mensaje">
            {mensaje && <p>{mensaje}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Menú de filtrado */}
      <div className="filtros">
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Ciencia">Ciencia</option>
          <option value="Historia">Historia</option>
          <option value="Geografía">Geografía</option>
          <option value="Arte">Arte</option>
          <option value="Deporte">Deporte</option>
          <option value="Literatura">Literatura</option>
          <option value="Entretenimiento">Entretenimiento</option>
        </select>

        <select
          value={dificultadFiltro}
          onChange={(e) => setDificultadFiltro(e.target.value)}
        >
          <option value="Todas">Todas las dificultades</option>
          <option value="fácil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="difícil">Difícil</option>
        </select>
      </div>

      {/* Carta de pregunta */}
      <div className="card">
        <h3>{preguntaActual.pregunta}</h3>
        <div className="opciones">
          {preguntaActual.opciones.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-button ${
                respuestaSeleccionada === index
                  ? opcion === preguntaActual.respuestaCorrecta
                    ? "correcta"
                    : "incorrecta"
                  : ""
              }`}
              onClick={() => handleRespuesta(opcion, index)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* Botón para cambiar de pregunta */}
      <button className="next-button" onClick={() => seleccionarPreguntaAleatoria(preguntas)}>
        Siguiente Pregunta
      </button>

      {/* Estilos */}
      <style jsx>{`
        option {
          color: black; /* Color del texto de las opciones */
        }
        .quiz-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          position: relative;
          
        }
        .add-button {
          position: absolute;
          bottom: 1rem;
          right: 2rem;
          background: linear-gradient(135deg,rgba(10, 219, 38, 0.02),rgba(41, 167, 52, 0.01));
          color: rgba(0, 0, 0, 0.03);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
          transform: scale(1);
        }
          .add-button:hover {
              transform: scale(1.1);
          background-color:rgba(0, 181, 75, 0.07); /* Verde */
        }     
        .modal-overlay {
          z-index: 1;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
         
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          background: linear-gradient(135deg,rgba(5, 5, 5, 0.84),rgba(83, 83, 83, 0.29));
        }
        .modal-content button {
              background: linear-gradient(135deg,rgba(243, 239, 20, 0.88),rgba(255, 251, 38, 0.57));
              color: black;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 5px;
              cursor: pointer;
        } 
        .modal-content button:hover {
          background: linear-gradient(135deg,rgb(219, 247, 62),rgba(255, 251, 38, 0.75));
        }


        .modal-content input,
        .modal-content select {
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          color: black;
        }
        .modal-content button {
          margin-right: 0.5rem;
        }
        .mensaje {
          background-color:rgb(23, 211, 101);
          border-radius: 5px;
          text-align: center;
        }
        .filtros {
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          color: black;
        }
        .filtros select {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          color: black;
        }
        .card {
          background: linear-gradient(135deg,rgba(5, 5, 5, 0.84),rgba(207, 207, 207, 0.29));
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          text-align: center;
        }
        .opciones {
          margin-top: 1rem;
          
        }
        .opcion-button {
          color: black;
          display: block;
          width: 100%;
          margin: 0.5rem 0;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          background-color: white;
          transition: background-color 0.3s ease;
        }
        .opcion-button.correcta {
          background-color: #4caf50; /* Verde */
          color: white;
        }
        .opcion-button.incorrecta {
          background-color: #f44336; /* Rojo */
          color: white;
        }
        .next-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg,rgba(243, 239, 20, 0.88),rgba(255, 251, 38, 0.57));
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: 0.3s ease;
          transform: scale(1);
          
        }
        .next-button:hover {
          background-color:rgb(0, 181, 75);
          transform: scale(1.02);
        }
      `}</style>
    </div>
    </>
  );
};

export default QuizGame;