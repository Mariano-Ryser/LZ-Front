import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image"

const Items = () => {

const images = [
 

  {
  img: "thedevastator.gif",
  categori:"rare",
  link:"/",
  name:"The Devastator",
  dmg: 22,
  endurace: 15 / 100,
  strReq: 120,
  lvlReq: 120,

  },
  {
    img: "blackshadowsw-ord.gif",
    link:"/",
    name:"Black Shadows",
    dmg: 22,
  endurace: 15 / 100,
  strReq: 120,
  lvlReq: 120,
    },
  
  {img: "Ressurectionwand.gif",
   link:"/",
   name:"Ressurection Wand",
   dmg: 3,
  endurace: 15 / 100,
  strReq: 150,
  lvlReq: 120,
 },
 
{img: "bane.png",
   link:"/",
   name:"Banne",
   dmg: 22,
  endurace: 15 / 100,
  strReq: 123,
  lvlReq: 120,
},
{img: "Bastardsword.gif",
   link:"/",
   name:"Bastard Sword",
   dmg: 18,
  endurace: 15 / 100,
  strReq: 10,
  lvlReq: 120,
},
{img: "battleaxe.gif",
   link:"/",
   name:"Battle Axe",
   dmg: 17,
  endurace: 15 / 100,
  strReq: 130,
  lvlReq: 20,
},
{img: "Battlehammer.gif",
   link:"/",
   name:"Battle Hammer",
   dmg: 18,
  endurace: 15 / 100,
  strReq: 20,
  lvlReq: 20,
},
{img: "Zwand.gif",
   link:"/",
   name:"Berserk Magic Wand",
   dmg: 25,
  endurace: 15 / 100,
  strReq: 120,
  lvlReq: 120,
},


{img: "Bbh.gif",
  link:"/",
  name:"Bbh",
  dmg: 22,
  endurace: 15 / 100,
  strReq: 156,
  lvlReq: 100,
},
{img: "Bloodaxe.gif",
  link:"/",
  name:"Blood Axe",
  dmg: 17,
  endurace: 15 / 100,
  strReq: 156,
  lvlReq: 100,
},
{img: "bloodrapier.gif",
  link:"/",
  name:"Blood Rapier",
  dmg: 14,
  endurace: 1010 / 1010,
  strReq: 52,
  lvlReq: 120,
},
{img: "chargewand.gif",
  link:"/",
  name:"Charge Wand",
  dmg: 7,
  endurace: 1010,
  strReq: 15,
  lvlReq: 10,
},
{img: "Dbow.gif",
  link:"/",
  name:"D Bow",
  dmg: 4,
  endurace: 1010,
  strReq: 104,
  lvlReq: 110,
},
{img: "Falchion.png",
  link:"/",
  name:"Falchion",
  dmg: 6,
  endurace: 1010,
  strReq: 72,
  lvlReq: 55,
},
{img: "Giantsword.gif",
  link:"/",
  name:"Giant Sword",
  dmg: 15,
  endurace: 2210,
  strReq: 155,
  lvlReq: 120,
},
]

  return (
    <>
    <Link href="/proyectos/hb/hb"><li>/hb ..</li></Link>
      <div className="gallery"//  style={{height: size}}
         >
          {images.map((image,index) => (

      
            <div key={index}
              //  onClick={()=>{topo()}}
              className="gallery-item"
                >
               <div className='img'
                    style={{backgroundImage: `url('/itemsHB/${image.img}')`}}
               >
               </div>
                 <span className='name'>{image.name}</span> 
               <div className='spanBox'>
                 <span>Dmg: {image.dmg}</span> 
                 <span className='buttonEdit'>+ </span> 
               </div>
               <div className='spanBox'>
                <span>Endu: {image.endurace}</span>
                <span className='buttonEdit'>+ </span> 
                 </div>
                <div className='spanBox'> 
                <span>StrReq: {image.strReq}</span>
                <span className='buttonEdit'>+ </span> 
                 </div>
              <div className='spanBox'> 
                 <span>LvlReq: {image.lvlReq}</span> 
                 <span className='buttonEdit'>+ </span> 
              </div>

            <div className='boxButtons'>
              <button>BUY</button>
              <button>Sell</button>

            </div>

           

            </div>
       

         ))}
        </div>

     

        <style jsx>{`
        .boxButtons{
          margin-top: 0.7rem;
          display: flex;
          justify-content: space-around;
        }
        button{
          height: 1.3rem;
          font-size: 0.6rem;
          align-items: center;
         background-color: rgb(166, 106, 34);
         transition: 0.2s;
         cursor: pointer;
        }
        button:hover{
          background-color: rgb(196, 125, 38);
        }
        .buttonEdit{
          border: none;
          font-size: 1rem;
          padding: 0px;
          text-align: center;
          align-content: center;
          position: absolute;
          right: 2px;
          bottom: 0px;
          width: 1rem;
          height: 1.35rem;
        }
        .spanBox{
          position: relative;
          width: 100%;
        }
        .name{
          color: beige;
        }
        .gallery {
         padding-top: 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 2fr));
          gap: 8px;
          margin: 0 auto;
          max-width: 900px;
        }
        .gallery-item {
          padding-top: 0.3rem;
          padding-bottom: 1rem;
          overflow: hidden;
          border-radius: 8px;
          transition: transform 0.3s ease;
          backdrop-filter: blur(10px);
         

        }
        .gallery-item:hover {
          transform: scale(1.05);
         

        }
        .img {
          
          width: 100%;
          height: 100px;
          display: block;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          transition: 0.3s;
          
        }
        .img:hover {
       
        }
        span{
          border-bottom: dashed 1px bisque;
          padding-left: 0.3rem;
          margin: 3px;
          display: block;
          font-size: 0.8rem;
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 600;
          transition: 0.2s;
        }
       
        span:hover{
          background-color: rgb(74, 74, 74);
          cursor: default;
        
        }
       
      

  @media (max-width:600px){ 

   
  }
  
  
  
         
           `}</style>
        
  </>
  )
}

export default Items