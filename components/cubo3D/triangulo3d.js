import React, { useState, useEffect } from 'react';

export default function Triangulo3D() {
  const [isHovered, setIsHovered] = useState(false);
  const [glowColor, setGlowColor] = useState('#0af');
  const [rotationSpeed, setRotationSpeed] = useState(12);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      const hue = Math.floor(Math.random() * 360);
      setGlowColor(`hsla(${hue}, 100%, 50%, 0.5)`);
    }, 3500);
    
    return () => clearInterval(colorInterval);
  }, []);

  const handleHover = () => {
    setIsHovered(!isHovered);
    setRotationSpeed(isHovered ? 12 : 6);
  };

  return (
    <>
      <div className='pyramid-container'
           onMouseEnter={handleHover}
           onMouseLeave={handleHover}>
        <div className='pyramid-wrapper'>
          <div className={`pyramid ${isHovered ? 'hovered' : ''}`}>
            <div className='base base-face'></div>
            <div className='side side1'></div>
            <div className='side side2'></div>
            <div className='side side3'></div>
          </div>
          <div className='holographic-aura' style={{ background: glowColor }}></div>
          <div className='energy-beam'></div>
          <div className='floating-dots'></div>
        </div>
      </div>
   
      <style jsx>{`
        .pyramid-container {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          cursor: pointer;
        }
        
        .pyramid-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          transform-style: preserve-3d;
        }
        
        .pyramid {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: spin ${rotationSpeed}s linear infinite;
          transition: all 0.4s ease;
        }
        
        @keyframes spin {
          0% { transform: rotateX(0) rotateY(0); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        .base-face, .side {
          position: absolute;
          opacity: 0.85;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
          transition: all 0.4s ease;
          backface-visibility: visible;
        }
        
        .base-face {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(149, 29, 245, 0.7), 
            rgba(221, 26, 141, 0.5));
          transform: rotateX(90deg) translateZ(40px);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        .side {
          width: 100%;
          height: 100%;
          clip-path: polygon(50% 0%, 0% 100%, 50% 100%);
        }
        
        .side1 {
          background: linear-gradient(135deg, 
            rgba(10, 175, 255, 0.8), 
            rgba(100, 255, 255, 0.4));
          transform: rotateY(0deg) translateZ(-20px) rotateX(30deg);
        }
        
        .side2 {
          background: linear-gradient(135deg, 
            rgba(255, 175, 10, 0.8), 
            rgba(255, 255, 100, 0.4));
          transform: rotateY(120deg) translateZ(-20px) rotateX(30deg);
        }
        
        .side3 {
          background: linear-gradient(135deg, 
            rgba(175, 10, 255, 0.8), 
            rgba(255, 100, 255, 0.4));
          transform: rotateY(240deg) translateZ(-20px) rotateX(30deg);
        }
        
        .holographic-aura {
          position: absolute;
          top: -25px;
          left: -25px;
          right: -25px;
          bottom: -25px;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(15px);
          animation: pulse 4s infinite alternate;
          z-index: -1;
          transition: all 1.5s ease;
        }
        
        .energy-beam {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 60px;
          background: linear-gradient(
            to top,
            transparent,
            ${glowColor},
            transparent
          );
          animation: beam-flicker 2s infinite alternate;
          z-index: -2;
        }
        
        .floating-dots {
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          background-image: 
            radial-gradient(circle at 20% 30%, ${glowColor} 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, ${glowColor} 1px, transparent 1px),
            radial-gradient(circle at 50% 20%, ${glowColor} 1px, transparent 1px);
          background-size: 50px 50px;
          animation: dots-float 15s infinite linear;
          opacity: 0.6;
          z-index: -3;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.2; }
          100% { transform: scale(1.2); opacity: 0.4; }
        }
        
        @keyframes beam-flicker {
          0%, 100% { opacity: 0.8; height: 60px; }
          50% { opacity: 0.3; height: 40px; }
        }
        
        @keyframes dots-float {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 100px 100px, -100px -100px, 50px -50px; }
        }
        
        .pyramid.hovered {
          animation-play-state: paused;
          transform: scale(1.1);
        }
        
        .pyramid.hovered .base-face,
        .pyramid.hovered .side {
          opacity: 1;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.6);
        }
        
        @media (max-width: 600px) {
          .pyramid-wrapper {
            width: 60px;
            height: 60px;
          }
          
          .base-face {
            transform: rotateX(90deg) translateZ(30px);
          }
          
          .side1, .side2, .side3 {
            transform-origin: 50% 0%;
          }
        }
      `}</style>
    </>
  )
}