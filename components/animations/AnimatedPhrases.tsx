import { useEffect, useState } from 'react';

type PhraseAnimationType = 
  | 'fade' 
  | 'slideFromLeft' 
  | 'slideFromRight' 
  | 'blur' 
  | 'zoom'
  | 'flip';

interface AnimatedPhrasesProps {
  phrases: string[];
  animationType?: PhraseAnimationType;
  delay?: number;
  duration?: number;
  interval?: number;
  className?: string;
}

export default function AnimatedPhrases({
  phrases = [],
  animationType = 'blur',
  delay = 0.5,
  duration = 1,
  interval = 3,
  className = ""
}: AnimatedPhrasesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar la frase actual
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, delay * 1000);

    // Cambiar a la siguiente frase
    const changeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, duration * 1000);
    }, interval * 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(changeTimer);
    };
  }, [currentIndex, phrases.length, delay, duration, interval]);

  const getPhraseStyle = () => {
    // Estilos base
    const baseStyle = {
      transition: `all ${duration}s ease-out`,
      willChange: 'transform, opacity, filter',
      display: 'inline-block'
    };

    
    // Estilos visibles
    if (visible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        filter: 'blur(0)'
      };
    }

    // Estilos iniciales según tipo de animación
    switch (animationType) {
      case 'fade': return { ...baseStyle, opacity: 0 };
      case 'slideFromLeft': return { ...baseStyle, opacity: 0, transform: 'translateX(-50px)' };
      case 'slideFromRight': return { ...baseStyle, opacity: 0, transform: 'translateX(50px)' };
      case 'blur': return { ...baseStyle, opacity: 1, filter: 'blur(5px)' };
      case 'zoom': return { ...baseStyle, opacity: 0, transform: 'scale(1)' };
      default: return { ...baseStyle, opacity: 0 };
    }
  };

  if (phrases.length === 0) return null;

  return (
    <>
      <div className={`animated-phrases ${className}`}>
        <div style={getPhraseStyle()}>
          {phrases[currentIndex]}
        </div>
      </div>

      <style jsx>{`
        .animated-phrases {
          display: inline-block;
          text-align: center;
          font-size: clamp(2rem, 3vw, 2.5rem);
          font-weight: 800;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
}