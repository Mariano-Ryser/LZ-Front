import Link from "next/link"
import Image from "next/image"

export default function About() {
  return (
    <>
      <div className="cyber-about-container">
        <div className="cyber-about-content">
          <div className="cyber-logo-container">
        
                     <img
    src="/img/stern.png"
    alt="Logo"
    className="logo"
    style={{ width: '10rem', height: '10.5rem', cursor: 'pointer' }}
  />
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
       .logo {
          height: 10.5rem;
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .cyber-about-container {
          position: relative;
          min-height: 80vh;
          max-width:900px;
          margin:auto;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        
        .cyber-about-content {
          position: relative;
          padding: 1rem;
          border-radius: 5px;
          backdrop-filter: blur(10px);
        
        }
        
        .cyber-logo-container {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 0rem;
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