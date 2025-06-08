import { useEffect, useState } from 'react';
// import Image from "next/image"

function Datee(){
  const current = new Date();
 const datee = `${current.getDate()} / ${current.getMonth()+1} / ${current.getFullYear()}`;
  const timee = `${current.getHours()}:${current.getMinutes()}`;



  return (
    <>
    
    <p className='date'> {datee}</p>
    <p className='time'> {timee}</p>
   
    



    <style jsx>{`



@media (max-width: 600px) {
    
}
       
         `}</style>
  </>
  
  )
}

export default Datee
