import React from 'react';
import Link from 'next/link';

const Icons = () => {
  const icons = [
    { img: "js.png", link: "" },
    { img: "alien.png", link: "" },
    { img: "visual.gif", link: "" },
    { img: "html.gif", link: "" },
    { img: "bichoWhite.png", link: "" },
    { img: "github.png", link: "" },
    { img: "css.gif", link: "" },
    { img: "discord.png", link: "" },
    { img: "email.png", link: "" },
    { img: "mooon.gif", link: "" },
    { img: "git.png", link: "" },
    { img: "earth.gif", link: "" },
    { img: "linkedin.png", link: "" },
    { img: "Alienverde.gif", link: "/" },
    { img: "googleLogo.png", link: "" },
    { img: "paint3d.png", link: "" },
    { img: "linux.png", link: "" },
    { img: "drag2.png", link: "" },
    { img: "window.png", link: "" },
    { img: "php.png", link: "" },
    { img: "twiter.png", link: "" },
    { img: "terminal.png", link: "" },
    { img: "snake.png", link: "" },
    { img: "champi.png", link: "" },
    { img: "tic1.png", link: "" },
    { img: "phone.png", link: "" },
    { img: "goldFish.png", link: "" },
    { img: "pizza.png", link: "" },
    { img: "next.png", link: "" },
    { img: "obs.png", link: "" },
    { img: "PacYellow.png", link: "" },
    { img: "vue.png", link: "" },
    { img: "g.gif", link: "" },
    { img: "node.png", link: "" },
  ];

  return (
    <>
     
      
        <div className="boxIcons" >

     
  
          {icons.map((item,index) => (
            <div key={index}
              //  onClick={()=>{topo()}}
               className="icon"
               style={{backgroundImage: `url('/img/${item.img}')`}}
               role="img"
               aria-label={item.img.replace(/\.[^/.]+$/, '')} 
                >
          

            </div>


         ))}
        </div>

        <style jsx>{`
   
          .boxIcons{
            max-width: 1000px;
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(7px);
  border-radius: 10px;
  width: 100%;
  margin: auto;
  display: grid;
  overflow: hidden;
  gap: 0.5rem; 
  grid-auto-rows: 6rem;
  grid-auto-columns: repeat(auto-fill, minmax(0.2rem, 4fr));
  grid-template-columns: repeat(12,1fr);
  padding-top: 1.4rem;
  padding-bottom: 22px;
}

.icon{
display: inline-block;
background-size: contain;
background-position: center;
background-repeat: no-repeat;
height: 90px;
width: 90px;
grid-column: span 2;
filter: blur(0.4px);
margin: auto;
transition:0.3s 
}
.icon:hover{
cursor: pointer;
transform: scale(105%) rotateZ(1.5deg);
filter: blur(0.0px); 
}

@media (max-width:600px){ 
.boxIcons{
width: 100%;
margin: auto;
margin-top: 0.7rem;
display: grid;
overflow: hidden;
gap: 1rem; 
grid-auto-rows: 4.2rem;
grid-auto-columns: repeat(auto-fill, minmax(0.2rem, 5fr));
padding-top: 0.5rem;
padding-bottom: 12px;
}
.icon{
display: inline-block;
background-size: contain;
background-position: center;
background-repeat: no-repeat;
height: 70px;
width: 70px;
grid-column: span 3;
filter: blur(0.4px);
margin: auto;
transition:0.3s 
}

.icon:hover{
cursor: pointer;
transform: scale(105%) rotateZ(1.5deg);
filter: blur(0.0px); 
}}
         
           `}</style>
        
  </>
  )
}

export default Icons