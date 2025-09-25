import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';

type WordAnimationType = 
  | 'fade' 
  | 'slide' 
  | 'flip' 
  | 'swing' 
  | 'typewriter'
  | 'blur';

interface AnimatedWordsProps {
  text: string;
  animationType?: WordAnimationType;
  wordDelay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export default function AnimatedWords({
  text = "",
  animationType = 'fade',
  wordDelay = 0.15,
  duration = 0.7,
  stagger = 0.05,
  className = ""
}: AnimatedWordsProps) {
  const words = text.split(' ');
  const [visibleWords, setVisibleWords] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    words.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleWords(prev => [...prev, index]);
        }, index * (wordDelay * 1000))
      );
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [words.length, wordDelay]);

  const getWordStyle = (index: number): CSSProperties => {
    const isVisible = visibleWords.includes(index);
    
    // Estilos base
    const baseStyle: CSSProperties = {
      display: 'inline-block',
      transition: `all ${duration}s cubic-bezier(0.19, 1, 0.22, 1)`,
      transitionDelay: `${index * stagger}s`,
      willChange: 'transform, opacity, filter'
    };

    // Estilos visibles
    if (isVisible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translateY(0) rotate(0deg)',
        filter: 'blur(0)',
        width: 'auto'
      };
    }

    // Estilos iniciales según tipo de animación
    switch (animationType) {
      case 'fade': return { ...baseStyle, opacity: 0 };
      case 'slide': return { ...baseStyle, opacity: 0, transform: 'translateY(30px)' };
      case 'flip': return { ...baseStyle, opacity: 0, transform: 'rotateX(90deg)' };
      case 'swing': return { ...baseStyle, opacity: 0, transform: 'translateY(20px) rotate(15deg)' };
      case 'typewriter': return { 
        ...baseStyle, 
        opacity: 1,
        width: '0px',
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const
      };
      case 'blur': return { ...baseStyle, opacity: 1, filter: 'blur(4px)' };
      default: return { ...baseStyle, opacity: 0 };
    }
  };

  return (
    <>
      <div className={`animated-words ${className}`}>
        {words.map((word, index) => (
          <div key={index} className="word-wrapper">
            <span style={getWordStyle(index)}>
              {word}
            </span>
            {index < words.length - 1 && '\u00A0'}
          </div>
        ))}
      </div>

      <style jsx>{`
        .animated-words {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2em;
          line-height: 1.2;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
        }
        
        .word-wrapper {
          overflow: hidden;
          display: inline-block;
        }
      `}</style>
    </>
  );
}