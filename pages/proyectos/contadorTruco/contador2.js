import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image"

export default function TrucoCounter() {
  const [pointsPlayer1, setPointsPlayer1] = useState(0);
  const [pointsPlayer2, setPointsPlayer2] = useState(0);
  const maxPoints = 30; // Total de puntos para ganar

  const linea = <Image alt='Burger-Icon' src={'/img/linea.png'} height={30} width={40}></Image>

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

  // Función para renderizar los puntos en bloques de 5 palitos o un triángulo
  const renderPoints = (points) => {
    const pointsBeforeBuenas = Math.min(15, points); // Puntos antes de las Buenas
    const pointsInBuenas = points > 15 ? points - 15 : 0; // Puntos en las Buenas

    const fullTrianglesBeforeBuenas = Math.floor(pointsBeforeBuenas / 5); // Triángulos completos antes de las Buenas
    const remainingPointsBeforeBuenas = pointsBeforeBuenas % 5; // Palitos sobrantes en las "Malas"
    const fullTrianglesInBuenas = Math.floor(pointsInBuenas / 5); // Triángulos completos en las Buenas
    const remainingPointsInBuenas = pointsInBuenas % 5; // Palitos sobrantes en las Buenas

    return (
      <div>
        {/* Renderizar puntos en las "Malas" */}
        {[...Array(fullTrianglesBeforeBuenas)].map((_, index) => (
          <div key={index} className="row">
              <Image
           alt='Burger-Icon' src={'/img/cuadrado.png'}
          height={70} width={90}></Image>
          </div>
        ))}
        {remainingPointsBeforeBuenas > 0 && (
          <div className="row">
            {' | '.repeat(remainingPointsBeforeBuenas)}
          </div>
        )}

        {/* Renderizar división de Buenas si tiene más de 15 puntos */}
        {points >= 15 && <div className="divider">----------</div>}

        {/* Renderizar puntos en las "Buenas" */}
        {[...Array(fullTrianglesInBuenas)].map((_, index) => (
          <div key={index} className="row">
             <Image
           alt='Burger-Icon' src={'/img/cuadrado.png'}
          height={70} width={90}></Image>
          </div>
        ))}
        {remainingPointsInBuenas > 0 && (
          <div className="row">
            {'| '.repeat(remainingPointsInBuenas)}
          </div>
        )}
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
      <Link href="/proyectos/contadorTruco/contador"><li>Ir a 18 Puntos</li></Link>
      <Image
           alt='Burger-Icon' src={'/img/cuadrado.png'}
          height={30} width={40}></Image>

      <div className="players">
        <div className="player">
          <div className="buttons">
            <button onClick={() => handleAddPoint('player1')}>+</button>
            <button onClick={() => handleSubtractPoint('player1')}>-</button>
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

      {winner && <h2 className="winner">
      {/* <Image alt='Burger-Icon' src={'/img/zulma.png'} height={200} width={230}></Image>  */}
      <p>Ganaste rey</p>
      <p>buena suerte</p>
          </h2>}

      <style jsx>{`
      p{margin:5px}
      .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 110vh;
        }

        h1 {
          color: #333;
          margin-bottom: 20px;
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
          
        }

        .divider {
          font-size: 20px;
          color: #ff5722;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .winner {
          font-size: 30px;
          margin-top: 5px;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }

        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          font-size: 18px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #45a049;
        }

        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}