import React, { useState, useRef } from 'react';
import Link from 'next/link';

const Music = () => {
  const initialState = (1.3)
  const [gross, setGross] = useState(initialState)

 

  const playSound = (soundFileName) => {
    const audio = new Audio(`/sounds/${soundFileName}`);
    audio.play();
  };
  const playSound2 = (soundFileName) => {
    const audio = new Audio(`/sounds/${soundFileName}`);
    audio.play();
  };
  // REPRODUCIR Y PAUSAR 



  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };
  

 const handleTimeUpdate = () => {
    const audioElement = audioRef.current;
    setCurrentTime(audioElement.currentTime);
  };

  const handleLoadedData = () => {
    const audioElement = audioRef.current;
    setDuration(audioElement.duration);
  };

 
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return (
    <>
  <Link href="/proyectos/hb/hb"><li>cd ..</li></Link>
  <section className='section' style={{ fontSize: `${gross}` + "rem"}}>
     
    <div>
      <h2>Helbreath Sounds</h2>
    </div>
    <div>
      <button className='button5 ' onClick={() => playSound('powerUp.wav')}>Rayo</button>
      <button className='button5 ' onClick={() => playSound('C1.WAV')}>Dagger</button>
      <button className='button5 ' onClick={() => playSound('C2.WAV')}>Sword</button>
      <button className='button5 ' onClick={() => playSound('C3.WAV')}>Bow</button>
      <button className='button5 ' onClick={() => playSound('C5.WAV')}>Hand Punch</button>
      <button className='button5 ' onClick={() => playSound('C6.WAV')}>Dagger Hit</button>
      <button className='button5 ' onClick={() => playSound('C7.WAV')}>Bow Hit</button>
      <button className='button5 ' onClick={() => playSound('C14.WAV')}>M Dead</button>
      <button className='button5 ' onClick={() => playSound('C15.WAV')}>W Dead</button>
      <button className='button5 ' onClick={() => playSound('C16.WAV')}>Cast Magic</button>
      <button className='button5 ' onClick={() => playSound('C17.WAV')}>Faild</button>
      <button className='button5 ' onClick={() => playSound('C19.WAV')}>Pot Chug</button>
      <button className='button5 ' onClick={() => playSound('C20.WAV')}>Pot Chug</button>
      <button className='button5 ' onClick={() => playSound('C21.WAV')}>lvl up M</button>
      <button className='button5 ' onClick={() => playSound('C22.WAV')}>lvl Up W</button>
      <button className='button5 ' onClick={() => playSound('C23.WAV')}>M Crit</button>
      <button className='button5 ' onClick={() => playSound('C24.WAV')}>W Crit</button>
    </div>
 
  

   <h2>Si quieres crear sonidos al estilo Retro, puedo recomendarte una pagina.. en los cuales podras crearlo y descargar el archivo .WAV</h2>
 
   <Link href="https://sfxr.me/"><li>SFXR SOUND CREATOR</li></Link>

    <div>
      <audio 
        ref={audioRef}
       src="/sounds/sonidosDeTruenos.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
      >
      </audio>
       <button onClick={handlePlayPause}>
       {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
   
    <div>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>

    <p>Volver a comenzar, grab and drop. JS
    </p>

    <div>Prototipo Volumen App Web. </div>

  
   
   
  </section>


          <style jsx>{`
          section{
      }
          h1{
            font-size: 1rem;
      }
      button{
        width: 6rem;
        height: 2.3rem;
        margin: 0.2rem;
        cursor: pointer;
        color:black;
      }
      


              

    @media (max-width: 600px) {
            

        
      }   
        `}</style>

  </>
  )
}

export default Music