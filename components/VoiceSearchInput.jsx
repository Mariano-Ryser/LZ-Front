import { useEffect, useRef, useState } from "react";

export default function VoiceSearchInput({
  value,
  onChange,
  placeholder = "Buscar artículo…",
}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("es-ES");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let texto = event.results[0][0].transcript;
      texto = texto
        .trim()
        .replace(/[.,;:!?]+$/g, "")
        .replace(/\s{2,}/g, " ");

      onChange(texto);
    };

    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, [lang, onChange]);

  const startListening = () => {
    if (!recognitionRef.current || listening) return;
    recognitionRef.current.start();
  };

  return (
    <div className="voice-wrapper">
      <div className={`search-box ${listening ? "listening" : ""}`}>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />

        {supported && (
          <button
            className="mic-btn"
            onClick={startListening}
            aria-label="Buscar por voz"
          >
            <MicIcon active={listening} />
          </button>
        )}
      </div>

      <div className="options">
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="es-ES">ES</option>
          <option value="de-DE">DE</option>
          <option value="en-US">EN</option>
          <option value="fr-FR">FR</option>
          <option value="it-IT">IT</option>
        </select>

        {!supported && (
          <span className="warning">🎙️ Voz no soportada</span>
        )}
      </div>

      <style jsx>{`
        .voice-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #fff;
          border: 2px solid #d0e6ff;
          border-radius: 12px;
          padding: 6px 10px;
          transition: border 0.2s ease;
        }

        .search-box.listening {
          border-color: #e63946;
        }

        input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 18px;
          padding: 12px;
        }

        .mic-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
        }

        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #555;
        }

        select {
          border-radius: 6px;
          padding: 4px 6px;
        }

        .warning {
          color: #999;
        }

        @media (max-width: 480px) {
          input {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

/* ===== ICONO SVG PROFESIONAL ===== */

function MicIcon({ active }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#e63946" : "#111"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
