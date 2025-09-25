import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';

type TextAnimationType = 
  | 'fade' 
  | 'slideRight' 
  | 'slideLeft' 
  | 'slideUp' 
  | 'slideDown' 
  | 'zoom' 
  | 'bounce'
  | 'blur';

interface AnimatedTextProps {
  text: string;
  animationType?: TextAnimationType;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export default function AnimatedText({
  text = "",
  animationType = 'fade',
  delay = 0.05,
  duration = 0.6,
  stagger = 0.03,
  className = ""
}: AnimatedTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleChars < text.length) {
        setVisibleChars(prev => prev + 1);
      }
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [visibleChars, text.length, delay]);

  const getCharStyle = (index: number): CSSProperties => {
    const isVisible = index < visibleChars;
    
    // Estilos base
    const baseStyle: CSSProperties = {
      display: 'inline-block',
      transition: `all ${duration}s cubic-bezier(0.19, 1.3, 0.22, 1)`,
      transitionDelay: `${index * stagger}s`,
      willChange: 'transform, opacity, filter'
    };

    // Estilos visibles
    if (isVisible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translate(0) scale(1) rotate(0deg)',
        filter: 'blur(0)'
      };
    }

    // Estilos iniciales según tipo de animación
    switch (animationType) {
      case 'fade': return { ...baseStyle, opacity: 0 };
      case 'slideRight': return { ...baseStyle, opacity: 0, transform: 'translateX(20px)' };
      case 'slideLeft': return { ...baseStyle, opacity: 0, transform: 'translateX(-20px)' };
      case 'slideUp': return { ...baseStyle, opacity: 0, transform: 'translateY(20px)' };
      case 'slideDown': return { ...baseStyle, opacity: 0, transform: 'translateY(-20px)' };
      case 'zoom': return { ...baseStyle, opacity: 0, transform: 'scale(0.5)' };
      case 'bounce': return { ...baseStyle, opacity: 0, transform: 'translateY(30px)' };
      case 'blur': return { ...baseStyle, opacity: 1, filter: 'blur(4px)' };
      default: return { ...baseStyle, opacity: 0 };
    }
  };

  return (
    <>
      <span className={`animated-text ${className}`}>
        {text.split('').map((char, index) => (
          <span key={index} style={getCharStyle(index)}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>

      <style jsx>{`
        .animated-text {
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          display: inline-block;
          line-height: 1.0;
          font-size: clamp(2.8rem, 4vw, 5rem);
          font-weight: 700;
          margin-bottom: 0rem;
        }
      `}</style>
    </>
  );
}