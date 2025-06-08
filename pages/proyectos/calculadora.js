import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ScientificCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState('DEG'); // DEG, RAD, GRAD

  useEffect(() => {
    // Efecto de neón al iniciar
    const timer = setTimeout(() => {
      document.querySelector('.calculator').classList.add('neon-effect');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (value) => {
    setInput(prev => prev + value);
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const clearAll = () => {
    setInput('');
    setResult('');
    setHistory([]);
  };

  const backspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const calculateResult = () => {
    try {
      let expression = input;
      
      // Reemplazar funciones trigonométricas según el modo de ángulo
      if (angleMode === 'DEG') {
        expression = expression.replace(/sin\(/g, 'Math.sin(Math.PI/180*');
        expression = expression.replace(/cos\(/g, 'Math.cos(Math.PI/180*');
        expression = expression.replace(/tan\(/g, 'Math.tan(Math.PI/180*');
      } else if (angleMode === 'GRAD') {
        expression = expression.replace(/sin\(/g, 'Math.sin(Math.PI/200*');
        expression = expression.replace(/cos\(/g, 'Math.cos(Math.PI/200*');
        expression = expression.replace(/tan\(/g, 'Math.tan(Math.PI/200*');
      } else {
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
      }
      
      // Reemplazar otras funciones matemáticas
      expression = expression.replace(/ln\(/g, 'Math.log(');
      expression = expression.replace(/log\(/g, 'Math.log10(');
      expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
      expression = expression.replace(/π/g, 'Math.PI');
      expression = expression.replace(/e/g, 'Math.E');
      expression = expression.replace(/\^/g, '**');
      
      // Evaluar expresión segura
      const calculatedResult = Function(`'use strict'; return (${expression})`)();
      
      setResult(calculatedResult);
      setHistory(prev => [...prev, { expression: input, result: calculatedResult }]);
    } catch (error) {
      setResult('Error');
    }
  };

  const memoryAdd = () => {
    if (result) {
      setMemory(prev => prev + parseFloat(result));
    }
  };

  const memorySubtract = () => {
    if (result) {
      setMemory(prev => prev - parseFloat(result));
    }
  };

  const memoryRecall = () => {
    setInput(prev => prev + memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const toggleAngleMode = () => {
    setAngleMode(prev => 
      prev === 'DEG' ? 'RAD' : 
      prev === 'RAD' ? 'GRAD' : 'DEG'
    );
  };

  const addToInput = (value) => {
    setInput(prev => prev + value);
  };

  return (
    <>
    
      <div className={`container ${theme}`}>
        <h1 className="title">ZeepCalc<span className="version">0.1</span></h1>
        
        <div className="controls">
          <button 
            className={`mode-toggle ${isScientific ? 'active' : ''}`}
            onClick={() => setIsScientific(!isScientific)}
          >
            {isScientific ? 'Standard' : 'Scientific'}
          </button>
          
          <button 
            className={`angle-mode ${angleMode}`}
            onClick={toggleAngleMode}
          >
            {angleMode}
          </button>
          
          <div className="theme-switcher">
            <button className="theme-btn dark" onClick={() => setTheme('dark')}>Dark</button>
            <button className="theme-btn light" onClick={() => setTheme('light')}>Light</button>
            <button className="theme-btn cyber" onClick={() => setTheme('cyber')}>Cyber</button>
          </div>
        </div>
        
        <div className={`calculator ${theme}`}>
          <div className="display">
            <div className="input">{input}</div>
            <div className="result">{result}</div>
            <div className="memory">MEM: {memory}</div>
          </div>
          
          <div className="buttons">
            {/* Fila 1 */}
            <button className="func" onClick={clearAll}>AC</button>
            <button className="func" onClick={backspace}>⌫</button>
            <button className="func" onClick={() => addToInput('(')}>(</button>
            <button className="func" onClick={() => addToInput(')')}>)</button>
            <button className="func" onClick={() => addToInput('^')}>x^y</button>
            
            {/* Fila 2 */}
            <button className="mem" onClick={memoryRecall}>MR</button>
            <button className="mem" onClick={memoryAdd}>M+</button>
            <button className="mem" onClick={memorySubtract}>M-</button>
            <button className="mem" onClick={memoryClear}>MC</button>
            <button className="op" onClick={() => addToInput('/')}>÷</button>
            
            {/* Fila 3 */}
            <button onClick={() => handleClick('7')}>7</button>
            <button onClick={() => handleClick('8')}>8</button>
            <button onClick={() => handleClick('9')}>9</button>
            <button className="op" onClick={() => addToInput('*')}>×</button>
            <button className="sci" onClick={() => addToInput('sqrt(')}>√</button>
            
            {/* Fila 4 */}
            <button onClick={() => handleClick('4')}>4</button>
            <button onClick={() => handleClick('5')}>5</button>
            <button onClick={() => handleClick('6')}>6</button>
            <button className="op" onClick={() => addToInput('-')}>-</button>
            <button className="sci" onClick={() => addToInput('sin(')}>sin</button>
            
            {/* Fila 5 */}
            <button onClick={() => handleClick('1')}>1</button>
            <button onClick={() => handleClick('2')}>2</button>
            <button onClick={() => handleClick('3')}>3</button>
            <button className="op" onClick={() => addToInput('+')}>+</button>
            <button className="sci" onClick={() => addToInput('cos(')}>cos</button>
            
            {/* Fila 6 */}
            <button onClick={() => handleClick('0')}>0</button>
            <button onClick={() => addToInput('.')}>.</button>
            <button onClick={() => addToInput('π')}>π</button>
            <button className="equals" onClick={calculateResult}>=</button>
            <button className="sci" onClick={() => addToInput('tan(')}>tan</button>
            
            {/* Fila científica (solo visible en modo científico) */}
            {isScientific && (
              <>
                <button className="sci" onClick={() => addToInput('log(')}>log</button>
                <button className="sci" onClick={() => addToInput('ln(')}>ln</button>
                <button className="sci" onClick={() => addToInput('Math.E')}>e</button>
                <button className="sci" onClick={() => addToInput('!')}>!</button>
                <button className="sci" onClick={() => addToInput('Math.PI')}>π</button>
              </>
            )}
          </div>
        </div>
        
        {history.length > 0 && (
          <div className="history">
            <h3>Calculation History</h3>
            <ul>
              {history.slice().reverse().map((item, index) => (
                <li key={index}>
                  <span className="expression">{item.expression}</span> = 
                  <span className="result">{item.result}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <style jsx>{`
         
          .container {
            margin-bottom: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            transition: all 0.3s ease;
          }
          
          .container.dark {
            color: #e0e0e0;
          }
          
          .container.light {
            color: #333;
          }
          
          .container.cyber {
            background: #0f0f1a;
            color: #0ff;
          }
          
          .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-align: center;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 2px;
            position: relative;
          }
          
          .version {
            font-size: 0.8rem;
            position: absolute;
            top: -10px;
            right: -40px;
            color: #888;
          }
          
          .controls {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 500px;
            margin-bottom: 1rem;
          }
          
          .mode-toggle, .angle-mode, .theme-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          
          .mode-toggle {
            background: #444;
            color: white;
          }
          
          .mode-toggle.active {
            background: #1caf55;
          }
          
          .angle-mode {
            background: #333;
            color: white;
            min-width: 60px;
          }
          
          .angle-mode.DEG {
            background: #1a5fb4;
          }
          
          .angle-mode.RAD {
            background: #c64600;
          }
          
          .angle-mode.GRAD {
            
            background: #5e35b1;
          }
          
          .theme-switcher {
            display: flex;
            gap: 5px;
          }
          
          .theme-btn {
            padding: 8px;
          }
          
          .theme-btn.dark {
            background: #333;
            color: white;
          }
          
          .theme-btn.light {
            
            background: #ddd;
            color: #333;
          }
          
          .theme-btn.cyber {
            background: #0f0;
            color: #000;
          }
          
          .calculator {
            background: #1e1e1e;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            padding: 20px;
            width: 100%;
            max-width: 500px;
            transition: all 0.3s ease;
            border: 1px solid #333;
            position: relative;
            overflow: hidden;
            
          }
          
          .calculator.light {
            background: #f0f0f0;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
          }
          
          .calculator.cyber {
            background: #0a0a12;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
            border: 1px solid #0ff;
          }
          
          .calculator::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            z-index: -1;
            background: linear-gradient(45deg, #ff00cc, #3333ff, #00ffcc, #ffcc00);
            background-size: 400%;
            border-radius: 15px;
            opacity: 0;
            transition: 0.5s;
          }
          
          .calculator.neon-effect::before {
            animation: animate 8s linear infinite;
            opacity: 0.3;
          }
          
          @keyframes animate {
            0% { background-position: 0 0; }
            50% { background-position: 300% 0; }
            100% { background-position: 0 0; }
          }
          
          .display {
            background: #252525;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: right;
            font-family: 'Courier New', monospace;
            
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px solid #333;
          }
          
          .calculator.light .display {
            background: #e0e0e0;
            border: 1px solid #ccc;
          }
          
          .calculator.cyber .display {
            background: #0d0d15;
            border: 1px solid #0ff;
          }
          
          .input {
            font-size: 1.5rem;
            color: #aaa;
            min-height: 30px;
            word-wrap: break-word;
          }
          
          .calculator.light .input {
            color: #666;
          }
          
          .calculator.cyber .input {
            color: #0ff;
          }
          
          .result {
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            min-height: 50px;
            word-wrap: break-word;
          }
          
          .calculator.light .result {
            color: #333;
          }
          
          .calculator.cyber .result {
            color: #f0f;
            text-shadow: 0 0 5px #f0f;
          }
          
          .memory {
            font-size: 0.9rem;
            color: #888;
            margin-top: 5px;
          }
          
          .buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap: 10px;
            
          }
          
          button {
            padding: 15px;
            font-size: 1.2rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: bold;
            position: relative;
            overflow: hidden;
            color:black;
          }
          
          .calculator.light button {
            background: #e0e0e0;
            color: #333;
          }
          
          .calculator.cyber button {
            background: #1a1a2e;
            color: #0ff;
            border: 1px solid #0ff;
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          
          button:active {
            transform: translateY(0);
          }
          
          button.func {
            background: #444;
            color: white;
          }
          
          .calculator.light button.func {
            background: #bbb;
            color: #333;
          }
          
          .calculator.cyber button.func {
            background: #2a2a4a;
            color: #f0f;
          }
          
          button.op {
            background: #ff9500;
            color: white;
          }
          
          .calculator.cyber button.op {
            background: #f0f;
            color: #000;
          }
          
          button.equals {
            background: #1caf55;
            color: white;
            grid-column: span 1;
          }
          
          .calculator.cyber button.equals {
            background: #0f0;
            color: #000;
          }
          
          button.mem {
            background: #5e35b1;
            color: white;
          }
          
          button.sci {
            background: #007aff;
            color: white;
          }
          
          .calculator.cyber button.sci {
            background: #00f;
            color: white;
          }
          
          .history {
            margin-top: 30px;
            width: 100%;
            max-width: 500px;
            background: rgba(30, 30, 30, 0.7);
            border-radius: 10px;
            padding: 15px;
            max-height: 200px;
            overflow-y: auto;
          }
          
          .calculator.light .history {
            background: rgba(240, 240, 240, 0.9);
          }
          
          .calculator.cyber .history {
            background: rgba(10, 10, 18, 0.9);
            border: 1px solid #0ff;
          }
          
          .history h3 {
            margin-top: 0;
            color: #1caf55;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
          }
          
          .calculator.light .history h3 {
            color: #1a5fb4;
            border-bottom: 1px solid #ddd;
          }
          
          .calculator.cyber .history h3 {
            color: #0f0;
            border-bottom: 1px solid #0ff;
          }
          
          .history ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .history li {
            padding: 5px 0;
            border-bottom: 1px solid #333;
          }
          
          .calculator.light .history li {
            border-bottom: 1px solid #ddd;
          }
          
          .calculator.cyber .history li {
            border-bottom: 1px solid #0ff;
          }
          
          .history .expression {
            color: #aaa;
            margin-right: 10px;
          }
          
          .calculator.light .history .expression {
            color: #666;
          }
          
          .calculator.cyber .history .expression {
            color: #0ff;
          }
          
          .history .result {
            color: #1caf55;
            font-weight: bold;
          }
          
          .calculator.light .history .result {
            color: #1a5fb4;
          }
          
          .calculator.cyber .history .result {
            color: #f0f;
          }
          
          @media (max-width: 600px) {
  .buttons {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  button {
    padding: 12px;
    font-size: 1rem;
  }
  
  /* Ocultar algunos botones científicos en móvil */
  .sci:not(.always-visible) {
    display: none;
  }
  
  /* Asegurar que los botones esenciales sean visibles */
  button:nth-child(-n+20) {
    display: block;
  }
  
  /* Ajustar el contenedor */
  .calculator {
    padding: 15px;
    width: 90%;
  }
  
  /* Ajustar display */
  .display {
    min-height: 80px;
    padding: 10px;
  }
  
  .input {
    font-size: 1.2rem;
  }
  
  .result {
    font-size: 2rem;
  }
  
  /* Reorganizar controles superiores */
  .controls {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .mode-toggle, .angle-mode {
    flex: 1;
    min-width: 100px;
  }
  
  .theme-switcher {
    width: 100%;
    justify-content: space-between;
  }
  
  .theme-btn {
    flex: 1;
  }
}
        `}</style>
      </div>
    </>
  );
}