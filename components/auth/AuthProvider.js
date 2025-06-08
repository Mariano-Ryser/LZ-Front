import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';  //router.push! 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const router = useRouter();

  // Verificación de sesión
  const checkSession = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/check-session`, {
        method: 'GET',
        credentials: 'include', // 🔥 Asegura que se envíen cookies
      });

      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    }
  };

  
  // Función de login
  const login = () => {
    setIsAuthenticated(true); // Cambia el estado a autenticado
    router.push('/adminDash'); // Redirige al panel de administración is AUTHENTICATED!!!!
  };
  useEffect(() => {    //PRIMER PASO DE LLAMADA
    console.log("Verificando sesion....")
    checkSession();    //CORRE CHECKSESSION()    
  }, []);
  
  // Función de logout
  const logout = async () => {
    await fetch(`${baseURL}/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setIsAuthenticated(false);
    // router.push('/adminDash');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


