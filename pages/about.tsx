import Link from "next/link"
import Image from "next/image"

export default function About() {
  return (
    <>
      <div className="cyber-about-container">
        <div className="cyber-about-content">
          <div className="cyber-logo-container">
            <Image 
              src="/img/oja.png" 
              alt="Holographic Logo" 
              width={240} 
              height={190} 
              className="cyber-logo"
            />
            <div className="cyber-logo-glow"></div>
          </div>
          
          <div className="cyber-text-grid">
            <p className="cyber-text">
              It started as a virtual curriculum which later transformed into a blog, and then a complete
              server in which I continue testing and working hard to expand my knowledge on the subject.
            </p>
            
            <p className="cyber-text">
              This portfolio is built on Next.JS where my frontend runs, and the backend is deployed
              on Azure, the database interaction is created with NodeJs and Mongo DB.
            </p>
            
            <p className="cyber-text">
              Confident, due to the lack of current development and the scarcity of information available to everyone. 
              Monitoring, updates, careful development. Consistent with my progress. Grateful despite the constant 
              hostility to new ideas and contagious collective impatience.
            </p>
            
            
            <p className="cyber-text">
              If you have any good comments or constructive criticism, they are always helpful to me. 
              so I await your return!
            </p>
          </div>
          
     
        
        </div> 
      </div>

      <style jsx>{`
        .cyber-about-container {
          position: relative;
          min-height: 80vh;
          max-width:900px;
          margin:auto;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        
        .cyber-about-content {
          position: relative;
          padding: 2rem;
          border-radius: 5px;
          backdrop-filter: blur(10px);
        
        }
        
        .cyber-logo-container {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
      
        .cyber-text-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .cyber-text {
          margin: 0;
          color: rgba(200, 220, 255, 0.9);
          font-family: 'Courier New', monospace;
          font-size: 1.7rem;
          line-height: 1.6;
          position: relative;
          padding-left: 1rem;
        }
        
        .cyber-text::before {
          content: ">";
          position: absolute;
          left: 0;
          color: rgba(10, 175, 255, 0.7);
        }
        
        .cyber-social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .cyber-social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: rgba(10, 50, 80, 0.5);
          border: 1px solid rgba(10, 175, 255, 0.3);
          border-radius: 3px;
          color: white;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .cyber-social-link:hover {
          background: rgba(10, 80, 120, 0.7);
          box-shadow: 0 0 15px rgba(10, 175, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .cyber-social-icon {
          color: rgba(10, 175, 255, 0.9);
          font-weight: bold;
        }
        
        .cyber-social-text {
          position: relative;
          z-index: 2;
        }
        
        .cyber-social-link::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: all 0.5s ease;
        }
        
        .cyber-social-link:hover::after {
          left: 100%;
        }
        
        @media (max-width: 768px) {
          .cyber-about-container {
            padding: 0rem;
          }
          
          .cyber-about-content {
            padding: 0rem;
          }
          
          .cyber-text {
            font-size: 1.3rem;
          }
          
          .cyber-social-links {
          }
        }
      `}</style>
    </>
  )
}