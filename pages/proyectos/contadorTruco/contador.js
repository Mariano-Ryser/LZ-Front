import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image"

export default function TrucoCounter() {
  const [pointsPlayer1, setPointsPlayer1] = useState(0);
  const [pointsPlayer2, setPointsPlayer2] = useState(0);
  const maxPoints = 18; // Total de puntos para ganar

  // Función para sumar puntos
  const handleAddPoint = (player) => {
    if (player === 'player1' && pointsPlayer1 < maxPoints) {
      setPointsPlayer1(pointsPlayer1 + 1);
    } else if (player === 'player2' && pointsPlayer2 < maxPoints) {
      setPointsPlayer2(pointsPlayer2 + 1);
    }
  };

  // Función para restar puntos (revertir)
  const handleSubtractPoint = (player) => {
    if (player === 'player1' && pointsPlayer1 > 0) {
      setPointsPlayer1(pointsPlayer1 - 1);
    } else if (player === 'player2' && pointsPlayer2 > 0) {
      setPointsPlayer2(pointsPlayer2 - 1);
    }
  };

  // Función para renderizar los puntos en bloques de 3 palitos o un triángulo
    const renderPoints = (points) => {
    const fullRowsBeforeBuenas = Math.min(3, Math.floor(points / 3)); // Cantidad de filas completas antes de las Buenas (3 palitos por fila)
    const remainingPointsBeforeBuenas = points < 9 ? points % 3 : 0; // Palitos sobrantes en las "Malas"
    const pointsInBuenas = points > 9 ? points - 9 : 0; // Puntos en las Buenas
    const fullRowsInBuenas = Math.floor(pointsInBuenas / 3); // Filas completas en Buenas
    const remainingPointsInBuenas = pointsInBuenas % 3; // Palitos sobrantes en las Buenas
      
    const renderRow = (fullRows, remainingPoints) => (
      <>
        {[...Array(fullRows)].map((_, index) => (
          <div key={index} className="row">
            <Image alt='Burger-Icon' src={'/img/triangulo.png'} height={70} width={70}></Image>
          </div>
        ))}
        {remainingPoints > 0 && (
          <p className="row">
            {'| '.repeat(remainingPoints)}
          </p>
        )}
      </>
    );

    return (
      <div>
        {/* Renderizar puntos en las "Malas" */}
        {renderRow(fullRowsBeforeBuenas, remainingPointsBeforeBuenas)}

        {/* Renderizar división de Buenas si tiene más de 9 puntos */}
        {points >= 9 && <div className="divider">--------</div>}

        {/* Renderizar puntos en las "Buenas" */}
        {renderRow(fullRowsInBuenas, remainingPointsInBuenas)}
      </div>
    );
  };

  // Comprobar si hay un ganador
  const checkWinner = () => {
    if (pointsPlayer1 >= maxPoints) return 'Player 1';
    if (pointsPlayer2 >= maxPoints) return 'Player 2';
    return null;
  };

  const winner = checkWinner();

  return (
      <div className="container">
<Link href="/proyectos/contadorTruco/contador2"><li>Ir a 30 Puntos </li></Link>
<Image alt='Burger-Icon' src={'/img/triangulo.png'} height={30} width={30}></Image>
      <div className="players">
        <div className="player">
          <div className="buttons">
            <button onClick={() => handleAddPoint('player1')}>+</button>
            <button onClick={() => handleSubtractPoint('player1')}>- </button>
          </div>
          <p>Nosotros</p>
          {renderPoints(pointsPlayer1)}
        </div>

        <div className="player">
          <div className="buttons">
            <button onClick={() => handleAddPoint('player2')}>+</button>
            <button onClick={() => handleSubtractPoint('player2')}>-</button>
          </div>
          <p>Ellos</p>
          {renderPoints(pointsPlayer2)}
        </div>
      </div>

      {winner && 
      <div>
         <h2 className="winner"> 
          {/* <Image alt='Burger-Icon' src={'/img/zulma.png'} height={200} width={230}></Image>  */}
          <p>Ganaste rey</p>
          </h2>
        </div>
      }

      <style jsx>{`
     p{margin:5px}
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 110vh;
        }
        .players {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }

        .player {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .row {
          margin-bottom:5rem;
          padding: 10rem;
        }
        .divider {
          font-size: 20px;
          color: #ff5722;
          margin-top: 0px;
          margin-bottom: 0px;
        }
        .winner {
          font-size: 30px;
          color: black;
          margin-top: 20px;
        }
        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 0px;
        }
        button {
          background-color: green;
          color: white;
          padding: 10px 20px;
          font-size: 18px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.1s ease;
        }
        button:hover {
          background-color: #45a049;
        }
        button:active {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
