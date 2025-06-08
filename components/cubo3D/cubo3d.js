import React, { useEffect, useState } from 'react';

export default function Cubo3D() {
  const [isHovered, setIsHovered] = useState(false);
  const [glowColor, setGlowColor] = useState('#0af');
  const [rotationSpeed, setRotationSpeed] = useState(15);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setGlowColor(`hsl(${Math.random() * 360}, 100%, 50%)`);
    }, 3000);
    
    return () => clearInterval(colorInterval);
  }, []);

  const handleHover = () => {
    // setIsHovered(!isHovered);
    // setRotationSpeed(isHovered ? 20 : 20);
  };

  return (
    <>
      <div className='cube-container'
           onMouseEnter={handleHover}
           onMouseLeave={handleHover}
           >
        <div className='cube-wrapper'>
          <div className='cube'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`face face${i+1}`}></div>
            ))}
          </div>
          <div className='holographic-aura' style={{ '--glow-color': glowColor }}></div>
          <div className='particles'></div>
        </div>
      </div>
   
      <style jsx>{`
        :root {
          --glow-color: #0af;
        }
        
        .cube-container {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          cursor: pointer;
        }
        
        .cube-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
          transform-style: preserve-3d;
        }
        
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin ${rotationSpeed}s linear infinite;
          transition: all 0.5s ease;
        }
        
        @keyframes spin {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
        }
        
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.9;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.2);
          transition: all 0.5s ease;
          transform-origin: center;
        }
        
        /* Animaciones individuales para cada cara */
        .face1 {
          background: linear-gradient(135deg, rgba(10, 175, 255, 0.8), rgba(100, 255, 255, 0.4));
          transform: translateZ(70px);
          animation: face1-anim 9s infinite ease-in-out;
        }
        
        @keyframes face1-anim {
          0%, 100% { transform: translateZ(30px) rotate(0); }
          25% { transform: translateZ(65px) rotate(15deg); }
          50% { transform: translateZ(30px) rotate(820deg); }
          75% { transform: translateZ(45px) rotate(-15deg); }
        }
        
        .face2 {
          background: linear-gradient(135deg, rgba(255, 10, 173, 0.62), rgba(255, 100, 255, 0.4));
          transform: translateZ(-30px) rotateY(180deg);
          animation: face2-anim 9s infinite ease-in-out;
        }
        
        @keyframes face2-anim {
          0%, 100% { transform: translateZ(-30px) rotateY(180deg) scale(1); }


          33% { transform: translateZ(-125px) rotateY(180deg) scale(0.9); }  
          66% { transform: translateZ(-23px) rotateY(180deg) scale(1.1); }
        }
        
        .face3 {
          background: linear-gradient(135deg, rgba(175, 255, 10, 0.8), rgba(255, 255, 100, 0.4));
          transform: translateX(-30px) rotateY(-90deg);
          animation: face3-anim 11s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        
        @keyframes face3-anim {


          0%, 100% { transform: translateX(-340px) rotateY(-90deg); }
          50% { transform: translateX(-45px) rotateY(-90deg) translateY(10px); }
        }
        
        .face4 {
          background: linear-gradient(135deg, rgba(255, 173, 10, 0.84), rgba(255, 255, 100, 0.4));
          transform: translateX(30px) rotateY(90deg);
          animation: face4-anim 4s infinite ease-in-out;
        }
        
        @keyframes face4-anim {
          0%, 100% { transform: translateX(30px) rotateY(90deg); }
          25% { transform: translateX(45px) rotateY(90deg) rotateZ(90deg); }
          50% { transform: translateX(90px) rotateY(90deg) rotateZ(0); }
          75% { transform: translateX(15px) rotateY(90deg) rotateZ(-10deg); }
        }
        
        .face5 {
          background: linear-gradient(135deg, rgba(10, 255, 175, 0.8), rgba(100, 255, 255, 0.4));
          transform: translateY(-30px) rotateX(90deg);
          animation: face5-anim 5s infinite ease-in-out;
        }
        
        @keyframes face5-anim {
          0%, 100% { transform: translateY(-30px) rotateX(90deg); }
          50% { transform: translateY(-95px) rotateX(90deg) rotateZ(15deg); }
        }
        
        .face6 {
          background: linear-gradient(135deg, rgba(175, 10, 255, 0.8), rgba(255, 100, 255, 0.4));
          transform: translateY(30px) rotateX(-90deg);
          animation: face6-anim 1.5s infinite cubic-bezier(0.785, 0.135, 0.15, 0.86);
        }
        
        @keyframes face6-anim {
          0%, 100% { transform: translateY(30px) rotateX(-90deg); }
          25% { transform: translateY(45px) rotateX(-90deg) skewX(10deg); }
          75% { transform: translateY(15px) rotateX(-90deg) skewX(-10deg); }
        }
        
        .holographic-aura {
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--glow-color), transparent 50%);
          opacity: 0.3;
          filter: blur(10px);
          animation: pulse 3s infinite alternate;
          z-index: -1;
          transition: all 1s ease;
        }
        
        .particles {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background-image: 
            radial-gradient(circle at 20% 30%, rgb(140, 241, 8) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(255, 230, 10, 0.8) 1px, transparent 1px),
            radial-gradient(circle at 50% 20%, rgba(11, 224, 224, 0.8) 1px, transparent 1px);
          background-size: 100% 100%;
          animation: particles-move 11s infinite linear;
          opacity: 0.5;
          z-index: -2;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.2; }
          100% { transform: scale(1.1); opacity: 0.4; }
        }
        
        @keyframes particles-move {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 100px 100px, -100px -100px, 50px -50px; }
        }
        
        .cube:hover {
        }
        
        .cube:hover .face {
          opacity: 1;
          box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.5);
     
        }
        
        @media (max-width: 600px) {
          .cube-wrapper {
            width: 50px;
            height: 50px;
          }
          
          .face1 { transform: translateZ(25px); }
          .face2 { transform: translateZ(-25px) rotateY(180deg); }
          .face3 { transform: translateX(-25px) rotateY(-90deg); }
          .face4 { transform: translateX(25px) rotateY(90deg); }
          .face5 { transform: translateY(-25px) rotateX(90deg); }
          .face6 { transform: translateY(25px) rotateX(-90deg); }
        }
      `}</style>
    </>
  )
}