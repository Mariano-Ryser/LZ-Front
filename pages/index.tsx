import { useEffect, useState } from 'react';
import Skeleton from '../components/Skeleton';
import useNotiData from '../services/useNoti';

export default function Home() {


  return ( 
    <>
      <div className="test">
    
         </div>
      
     
<style jsx>{`
      .test{
       height:80px;
       width: 80px;
       background-color:red;
       transition:0.2s ;
      }
       .test:hover{
       background-color:blue
       }
      `}</style>
    </>
  );
}