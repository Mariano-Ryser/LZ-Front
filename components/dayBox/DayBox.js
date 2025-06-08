import { useEffect, useState } from 'react';

const DayColorSquare = () => {
  const [color, setColor] = useState('red');

  useEffect(() => {
    // Obtener el día actual de la semana (0 es domingo, 6 es sábado)
    const dayOfWeek = new Date().getDay();

    // Definir los colores para cada día de la semana
    const dayColors = {
      0: 'red',     // Domingo
      1: 'blue',    // Lunes
      2: 'green',   // Martes
      3: 'yellow',  // Miércoles
      4: 'purple',  // Jueves
      5: 'orange',  // Viernes
      6: 'pink',    // Sábado
    };

    // Cambiar el estado del color basado en el día de la semana
    setColor(dayColors[dayOfWeek]);
  }, []); // Solo se ejecuta al montar el componente

  return (
    <div>
      <div className="square">
        
      </div>
      <style jsx>{`
        .square {
         display:none;
        }

        @media (max-width: 600px) {
            .square {
            display: block;
          width: 90px;
          height: 38px;
          position: absolute;
          top: 17px;
          left: 20px;
          background-color: ${color};
        }
}
      `}</style>
    </div>
  );
};

export default DayColorSquare;