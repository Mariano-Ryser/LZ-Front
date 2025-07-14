import Link from "next/link"
import Image from "next/image"

export default function About() {
  return (
    <>
      <div className="cyber-about-container">
        <div className="cyber-about-content">
          <div className="cyber-logo-container">
           <h1>LZ LAGER</h1>
          </div>
          
          <div className="cyber-text-grid">
          <p className="cyber-text">
  Im Labyrinth der Logistik, wo verlorene Artikel zu Legenden werden und Effizienz oft nur ein Gerücht ist, habe ich ein Tool entwickelt, das tatsächlich funktioniert: Eine präzise, blitzschnelle Artikelsuchmaschine für Lagerumgebungen. Keine Geisterpaletten mehr. Keine rätselhaften Regale. Nur Ergebnisse.
</p>

<p className="cyber-text">
  Dies ist nicht einfach nur eine Suchleiste – es ist eine neuronale Verbindung zwischen Lagerchaos und menschlicher Klarheit. Mit Fokus auf Modularität konzipiert, kommuniziert dieses System effizient mit Backend-Services und ist bereit für zukünftige Skalierung, Rückverfolgbarkeit und Performance.
</p>

<p className="cyber-text">
  Entwickelt mit denselben Technologien und Prinzipien wie mein gesamtes Portfolio – Next.JS im Frontend, Azure im Backend und MongoDB als Datenbasis – soll dieses Projekt Lagerprozesse durch intelligente Filterung, reaktionsschnelle UX und minimale kognitive Belastung optimieren.
</p>

<p className="cyber-text">
  Jeder Scan, jede Anfrage, jeder Tastendruck zählt. Ich baue keine Interfaces – ich entwickle Werkzeuge für die Frontlinie. Wer Logistik kennt, weiß: Millisekunden sparen Geld. Sauberer Code bewegt Ware.
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