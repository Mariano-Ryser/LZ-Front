import { useEffect, useCallback, useRef, useState } from 'react';
import Skeleton from '../components/Skeleton';
import useNotiData from '../services/useNoti';

export default function Home({ limit = 5 }) {
  const { data: notis, loading, likeItem, loadMore, hasMore } = useNotiData('notis', limit);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNotiElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    console.log("Datos obtenidos:", notis);
  }, [notis]);

  return ( 
    <>
      <div className="cyber-notis-container">
        {notis.map((noti, index) => (
          <div 
            key={noti._id} 
            className={`cyber-noti ${index % 2 === 0 ? 'neon-blue' : 'neon-pink'}`}
            ref={index === notis.length - 1 ? lastNotiElementRef : null}
          >
            <div className="cyber-noti-grid"></div>
            <h1 className="cyber-noti-title">{noti.titulo}</h1>
            <p className="cyber-noti-text">{noti.text}</p>
            <div className="cyber-noti-footer">
              <button 
                className="cyber-like-button" 
                onClick={() => likeItem(noti._id)}
              >
                <span className="cyber-heart">❤️</span>
                <span className="cyber-likes">{noti.likes}</span>
                <span className="cyber-pulse"></span>
              </button>
            </div>
         
          </div>
        ))}
        
        {loading && (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="cyber-noti-skeleton">
              <Skeleton width="100%" height="25rem" />
              <div className="cyber-skeleton-glow"></div>
            </div>
          ))
        )}
      </div> 

      <style jsx>{`
        :root {
          --neon-blue: rgba(10, 175, 255, 0.8);
          --neon-pink: rgba(255, 10, 175, 0.8);
          --cyber-dark: rgba(10, 15, 25, 0.95);
          --cyber-border: 1px solid rgba(10, 175, 255, 0.3);
          --cyber-glow-blue: 0 0 15px rgba(10, 175, 255, 0.5);
          --cyber-glow-pink: 0 0 15px rgba(255, 10, 175, 0.5);
        }
        
        .cyber-notis-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
          display: grid;
          gap: 1.5rem;
        }
        
        .cyber-noti {
          position: relative;
          padding: 2rem;
          border-radius: 5px;
          background: var(--cyber-dark);
          box-shadow: var(--cyber-glow-blue);
          border: var(--cyber-border);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .cyber-noti.neon-pink {
          box-shadow: var(--cyber-glow-pink);
          border-color: rgba(255, 10, 175, 0.3);
        }
        
        .cyber-noti:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 25px rgba(10, 175, 255, 0.8);
        }
        
        .cyber-noti.neon-pink:hover {
          box-shadow: 0 0 25px rgba(255, 10, 175, 0.8);
        }
        
        .cyber-noti-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(10, 173, 255, 0.65) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 153, 86, 0.58) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.15;
        }
        
        .cyber-noti.neon-pink .cyber-noti-grid {
          background-image: 
            linear-gradient(rgba(196, 207, 40, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12, 145, 185, 0.64) 1px, transparent 1px);
        }
        
        .cyber-noti-title {
          font-family: 'Courier New', monospace;
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          color: rgba(10, 175, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
        }
        
        .cyber-noti.neon-pink .cyber-noti-title {
          color: rgba(255, 10, 175, 0.9);
        }
        
        .cyber-noti-text {
          font-family: 'Courier New', monospace;
          color: rgba(200, 220, 255, 0.9);
          line-height: 1.6;
          margin: 1.5rem 0;
          white-space: pre-line;
          font-size: 2rem;
        }
        
        .cyber-noti-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
        
        .cyber-like-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .cyber-heart {
          font-size: 1.4rem;
          color: rgba(255, 50, 50, 0.8);
          transition: all 0.3s ease;
        }
        
        .cyber-likes {
          font-family: 'Courier New', monospace;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.4rem;
        }
        
        .cyber-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: rgba(255, 50, 50, 0.3);
          transform: scale(0);
          opacity: 0;
        }
        
        .cyber-like-button:hover .cyber-heart {
          transform: scale(1.2);
        }
        
        .cyber-like-button:active .cyber-heart {
          transform: scale(0.9);
        }
        
        .cyber-like-button:active .cyber-pulse {
          animation: like-pulse 0.5s ease-out;
        }
        
        @keyframes like-pulse {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        
  
        
        .cyber-noti.neon-pink .cyber-corner {
          border-color: var(--neon-pink);
        }
        
        .cyber-noti:hover .cyber-corner {
          width: 25px;
          height: 25px;
          opacity: 1;
        }
        
        .cyber-noti-skeleton {
          position: relative;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .cyber-skeleton-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(10, 175, 255, 0.1),
            transparent
          );
          animation: skeleton-glow 1.5s infinite;
        }
        
        @keyframes skeleton-glow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @media (max-width: 768px) {
          .cyber-notis-container {
            padding: 0rem;
            gap: 1rem;
          }
          
          .cyber-noti {
            padding: 0.5rem;
          }
          
          .cyber-noti-title {
            font-size: 1.2rem;
          }
          
          .cyber-noti-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}