import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import Test5 from '../cubo3D/cubo3d';

import { AuthContext  } from '../auth/AuthProvider';

export default function NavRespon() {
  const [isOpen, setIsOpen] = useState(false);
  const [bgColor, setBgColor] = useState('url(/img/a0.jpg)');
  const [letterColor, setLetterColor] = useState('rgb(24, 24, 24)');
  const [hoverItem, setHoverItem] = useState(null);
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  const bgColors = ['url(/img/bBack.jpg)', 'url(/img/a1.png)', 'url(/img/a0.jpg)'];
  const letterColors = [
    'rgb(251, 255, 34)', // Amarillo
    'rgb(255, 255, 255)', // Blanco
    'rgb(124, 252, 0)', // Verde
    'rgb(0, 0, 0)', // Negro
  ];

  const changeBgColor = () => {
    const currentIndex = bgColors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % bgColors.length;
    const newColor = bgColors[nextIndex];
    setBgColor(newColor);
    document.documentElement.style.setProperty('--bg-color', newColor);
  };

  const changeLetterColor = () => {
    const currentIndex = letterColors.indexOf(letterColor);
    const nextIndex = (currentIndex + 1) % letterColors.length;
    const newColor = letterColors[nextIndex];
    setLetterColor(newColor);
    document.documentElement.style.setProperty('--letter-color', newColor);
  };

  const openList = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }; 

  const closeAsideOnLinkClick = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <nav className="nav">
        <div className="img">
          <Link href="/home">
            <h1 className="logo"></h1>
          </Link>
        </div>

        <div id="burger" className={`burger ${isOpen ? 'active' : ''}`} onClick={openList}>
          <Image
            alt="Burger-Icon"
            src="/img/oja.png"
            height={90}
            width={95}
            className="burger-icon"
          />
          <div className="holographic-effect"></div>
        </div>
      </nav>

      <aside
        style={{
          transform: isOpen ? 'translateY(0%)' : 'translateY(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
        id="aside"
        className="asideBar"
      > 
        <div className="holographic-grid"></div>
        <div className="scanlines"></div>
        
        <ul className="ul">
          <Test5 />
          {[
            { href: "/comentarBox", text: "ComentarBox" },
            { href: "/images", text: "Images" },
            { href: "/noticias", text: "Noticias" },
            { href: "/notis", text: "Notas" },
            { href: "/products", text: "Products" },
            { href: "/proyectos/icons", text: "Icons" },
            { href: "/proyectos/DayCard", text: "Deutsch" },
            { href: "/proyectos/personaje", text: "CreateChar" },
            { href: "/proyectos/hb/hb", text: "HB" },
            { href: "/proyectos/ruleta", text: "Ruleta" },
            { href: "/proyectos/lager/lager", text: "Lager" },
            { href: "/adminDash", text: "ADMIN" },
            
          ].map((item, index) => (
            <Link href={item.href} key={index}>
              <li 
                onClick={closeAsideOnLinkClick}
                onMouseEnter={() => setHoverItem(index)}
                onMouseLeave={() => setHoverItem(null)}
                className={hoverItem === index ? 'hovered' : ''}
              >
                <span className="link-text">{item.text}</span>
                <span className="link-arrow">➔</span>
              </li>
            </Link>
          ))}
          <br></br>
        </ul>
      </aside>

      {isAuthenticated && (
  <button 
    className='buttonLoggout'
    onClick={logout}
  >
    <span className="logout-icon">X</span>
  </button>
)}

      <style jsx>{`
        :root {
          --neon-primary: #0af;
          --neon-secondary: #f0a;
          --hologram-opacity: 0.7;
          --transition-speed: 0.3s;
        }
        
        .buttonLoggout {
          font-size: 1.5rem;
          bottom: 35px;
          z-index: 2;
          position: fixed;
          left: 20px;
          background-color: rgba(24, 201, 142, 0.37);
          border-radius: 50%;
          box-shadow: 0 0 10px 2px #0af,
                      0 0 20px 5px rgba(77, 201, 24, 0.6);
          height: 40px;
          width: 40px;
          border: 1px solid rgba(250, 235, 215, 0);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .buttonLoggout:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px 2px #0af,
                      0 0 30px 5px rgba(77, 201, 24, 0.6);      
        }
        .logout-icon {
          transform: translateY(-1px);
        }
        .nav {
          position: fixed;
          bottom: 4rem;
          right: 1rem;
          width: 8rem;
          display: flex;
          align-items: center;
          z-index: 6;
        }
        .burger {
          position: absolute;
          bottom: 5rem;
          top: -1.6rem;
          transform: scale(1);
          transition: transform 0.2s ease;
          cursor: pointer;
          filter: drop-shadow(0 0 5px rgba(10, 175, 255, 0.7));
          z-index: 6;
        }
        
        .burger.active {
          filter: drop-shadow(0 0 10px rgba(255, 10, 175, 0.9));
          z-index: 6;
        }
        
        .burger-icon {
          transition: all var(--transition-speed) ease;
          position: relative;
          z-index: 6;
        }
        
        .burger:hover .burger-icon {
          filter: brightness(1.2);
        }
        
        .burger:active {
          transform: scale(0.95);
        }
        
        .holographic-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            rgba(10, 175, 255, 0.3) 0%,
            rgba(255, 10, 175, 0.3) 50%,
            rgba(10, 175, 255, 0.3) 100%
          );
          border-radius: 50%;
          opacity: 0;
          animation: hologram-pulse 3s infinite;
          z-index: 1;
        }
        
        .burger:hover .holographic-effect {
          opacity: 0.7;
        }

        .asideBar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          backdrop-filter: blur(12px) brightness(0.8);
          background: rgba(10, 20, 30, 0.85);
          overflow-y: scroll;
          transform: translateY(-100%);
          opacity: 0;
          transition: 
            transform var(--transition-speed) ease-in-out,
            opacity var(--transition-speed) ease;
          z-index: 5;
          padding-top: 1.1rem;
          text-align: center;
          pointer-events: none;
        }
        
        .asideBar::-webkit-scrollbar {
          width: 0.4rem;
          background: transparent;
        }
        
        .asideBar::-webkit-scrollbar-thumb {
          background: linear-gradient(var(--neon-primary), var(--neon-secondary));
          border-radius: 10px;
        }
        
        .holographic-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(10, 175, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 175, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: -1;
        }
        
        .scanlines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 95%,
            rgba(10, 175, 255, 0.05) 96%
          );
          background-size: 100% 4px;
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: -1;
        }

        .ul {
          max-width: 56rem;
          margin: 0 auto;
          padding: 2rem 0;
          list-style-type: none;
          position: relative;
        }
        
        li {
          font-size: 1.6rem;
          line-height: 1.9rem;
          margin: 1.5rem auto;
          padding: 1rem 2rem;
          cursor: pointer;
          color: white;
          position: relative;
          max-width: 80%;
          border-radius: 4px;
          transition: all var(--transition-speed) ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(10, 175, 255, 0.3);
          background: rgba(0, 20, 40, 0.5);
          backdrop-filter: blur(5px);
        }
        
        li:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(10, 175, 255, 0.2),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        li:hover {
          background: rgba(10, 50, 80, 0.6);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.5);
          transform: translateX(10px);
        }
        
        li.hovered {
          background: rgba(10, 50, 80, 0.6);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.5);
          transform: translateX(10px);
        }
        
        li:hover:before {
          transform: translateX(100%);
        }
        
        .link-text {
          text-shadow: 0 0 5px rgba(10, 175, 255, 0.7);
        }
        
        .link-arrow {
          opacity: 0;
          transform: translateX(-10px);
          transition: all var(--transition-speed) ease;
          color: var(--neon-primary);
        }
        
        li:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 600px) {
          .nav {
            bottom: 2.9rem;
            right: 0.1rem;
            width: 10rem;
          }
          
          .burger {
            right: 1.5rem;
            top: -2.2rem;
            animation: alien alternate 1s 1;
          }
          
          @keyframes alien {
            1% {
              right: -10.3rem;
            }
            100% {
              right: 1.7rem;
            }
          }
          
          .asideBar {
            backdrop-filter: blur(20px) brightness(0.7);
          }
          
          li {
            font-size: 1.4rem;
            padding: 0.5rem 1rem;
          line-height: 1.9rem;
          margin: 1rem auto;
          cursor: pointer;
          color: white;
          position: relative;
          max-width: 90%;
          border-radius: 1px;
          transition: all var(--transition-speed) ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(10, 175, 255, 0.3);
          background: rgba(0, 34, 40, 0.5);
          backdrop-filter: blur(5px);
          }
        }
        
        @keyframes hologram-pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </>
  );
}