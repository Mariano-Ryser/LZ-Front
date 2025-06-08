import { useEffect, useState } from "react";

const WortesCard = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialState = {
    palabra: "",
    significado: "",
    ejemplo1: "",
    ejemplo2: "",
    ejemplo3: "",
  };
  const [worte, setWorte] = useState(initialState);
  const [wortes, setWortes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [likedWords, setLikedWords] = useState({});

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;
    setWorte({ ...worte, [inputName]: inputValue });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (worte.palabra.trim() === '') {
      setError('Debes indicar una palabra');
      return;
    }
    if (worte.significado.trim() === '') {
      setError('Debes indicar una descripción');
      return;
    }
    if (worte.ejemplo1.trim() === '') {
      setError('Debes escribir un Ejemplo');
      return;
    }

    setSuccessMessage('Worte agregado con éxito!');
    setTimeout(() => setSuccessMessage(null), 2100);
    setError(null)

    fetch(`${baseURL}/wortes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(worte),
    })
      .then((res) => res.json())
      .then(console.log())
      .then((data) => {
        setWorte(initialState);
        const newWortes = [data.worte, ...wortes];
        setWortes(newWortes);
      })
      .then(setTimeout(() => setShowForm(false), 1500))
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  useEffect(() => {
    fetch(`${baseURL}/wortes`)
      .then((res) => res.json())
      .then(({ wortes }) => {
        setWortes(wortes);
        selectWordOfTheDay(wortes);
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  const selectWordOfTheDay = (wortesList) => {
    const dayIndex = new Date().getDate() % wortesList.length;
    setCurrentWord(wortesList[dayIndex]);
  };

  const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wortes.length);
    setCurrentWord(wortes[randomIndex]);
    setFlipped(false);
  };

  // const handleLike = (id) => {
  //   setLikedWords((prevLikedWords) => ({
  //     ...prevLikedWords,
  //     [id]: !prevLikedWords[id],
  //   }));
  // };

  

  if (!currentWord) return <p>Cargando palabra...</p>;

  return (
    <>
      <div >
        <button className="add-button" onClick={() => setShowForm(true)}>+</button>
        <style jsx>{`
          .add-button {
            position: relative;
            top: 1rem;
            left: 3.1rem;
            
            width: 50px;
            height: 2rem;
            width: 2rem;
            border-radius: 10%;
            border: none;
            background-color: rgba(30, 105, 18, 0);
            color: rgba(165, 165, 165, 0.06);
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
          }
          .add-button:hover {
            background-color: darkred;
          }
        `}</style>
      </div>

      {showForm && (
        <div className="overlay">
          <div className="form-container">
            <h2>Neues Worte</h2>
            <form>
              <input type="text" maxLength="45" onChange={handleChange} value={worte.palabra} name="palabra" placeholder="das Wort" />
              <input type="text" maxLength="60" onChange={handleChange} value={worte.significado} name="significado" placeholder="die Bedeutung" />
              <input type="text" maxLength="200" onChange={handleChange} value={worte.ejemplo1} name="ejemplo1" placeholder="Beispiel 1 (erforderlich)" />
              <input type="text" maxLength="200" onChange={handleChange} value={worte.ejemplo2} name="ejemplo2" placeholder="Beispiel 2 (optional)" />
              <input type="text" maxLength="200" onChange={handleChange} value={worte.ejemplo3} name="ejemplo3" placeholder="Beispiel 3 (optional)" />

              <div className="buttons">
                <button type="button" onClick={handleClick}>hinzufügen</button>
                <button type="button" onClick={() => setShowForm(false)}>schließen</button>

                {error && <div className="alert error">{error}</div>}
                {successMessage && <div className="alert success">{successMessage}</div>}
              </div>
            </form>
          </div>
          <style jsx>{`
            input {
              color: black;
              height: 2.5rem;
            }

            .overlay {
              backdrop-filter: blur(19px);
              position: fixed;
              z-index: 1;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
            }

            .form-container {
              margin: 5rem auto;
              padding: 1.5rem;
              border-radius: 10px;
              width: 99%;
              max-width: 30rem;
              height: 34rem;
              text-align: center;
              border: 1px solid #ccc;
            }
            .form-container h2 {
              margin-bottom: 3rem;
            }
            .form-container input {
              width: 100%;
              padding: 8px;
              margin: 5px 0;
              border: 1px solid #ccc;
              border-radius: 5px;
            }

            .buttons {
              margin-top: 10px;
              display: inline-block;
              align-items: space-between;
              justify-content: center;
            }
            .buttons button {
              margin: 0 0.5rem;
              padding: 8px 12px;
              border: none;
              border-radius: 5px;
              background-color: gray;
              color: white;
              cursor: pointer;
            }
            .buttons button:hover {
              background-color: darkgray;
            }
            .alert {
              font-family: Lato;
              margin-top: 1rem;
              padding: 0.5rem;
              border-radius: 5px;
              text-align: center;
            }

            .error {
              height: 4.9rem;
              width: 15rem;
              position: absolute;
              z-index: 999;
              font-family: Lato;
              background-color: rgba(70, 61, 61, 0.94);
              color: rgb(255, 255, 255);
            }

            .success {
              position: absolute;
              z-index: 999;
              font-family: Lato;
              background-color: #d4edda;
              color: #155724;
            }

            .deleted {
              position: absolute;
              z-index: 999;
              font-family: Lato;
              background-color: #cce5ff;
              color: #004085;
            }
          `}</style>
        </div>
      )}

      <div className="container">
        <button className="button" onClick={selectRandomWord}>Anderes</button>

        <div className="card-container">
          <div className={`card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
            <div className="card-face card-front">
              <h3>{currentWord.palabra}</h3>
              <button
                className="likeButton"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(currentWord.id);
                }}
              >
                {/* {likedWords[currentWord.id] ? "❤️" : "🤍"} */}
              </button>
            </div>
            <div className="card-face card-back">
              <h2>{currentWord.significado}</h2>
              <p>{currentWord.ejemplo1}</p>
              <p>{currentWord.ejemplo2}</p>
              <p>{currentWord.ejemplo3}</p>
               
            </div>
          </div>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 2rem;
          }
          .card-container {
            perspective: 1000px;
            width: 100%;
          }
          .card {
            margin: auto;
            width: 27rem;
            min-height: 36rem;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s ease-in-out;
            cursor: pointer;
          }
          .card.flipped {
            transform: rotateY(180deg);
          }
          .card-face {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(72, 73, 75, 0.32);
            position: absolute;
            width: 100%;
            min-height: 180px;
            backface-visibility: hidden;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          .card-front {
            background-color: rgba(211, 228, 241, 0.08);
            color: white;
            font-size: 24px;
            font-weight: bold;
            height: 15rem;
          }
          .card-back {
            background-color: rgba(211, 228, 241, 0.08);
            color: black;
            transform: rotateY(180deg);
          }
          .button {
            margin-bottom: 20px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: rgba(29, 105, 18, 0.75);
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #218838;
          }
          .likeButton {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .card {
              width: 90vw;
              min-height: 50vh;
              margin: 1rem auto;
            }

            .card-front, .card-back {
              padding: 10px;
              font-size: 18px;
            }

            .button {
              width: 80%;
              margin: 10px auto;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default WortesCard;