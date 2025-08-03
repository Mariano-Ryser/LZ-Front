import { useState, useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthProvider';
import Map from '../../components/MapaAlmacen';
import { useProduct } from '../../services/useProducts';

export function Mapa() {


  return (
    <div >
     
     
      <Map />

    

      <style jsx>{`


  @media (max-width: 768px) {
   
  }

  @media (max-width: 480px) {
  
  }
`}</style>
    </div>
  );
}

export default Mapa;
