import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useState, useContext } from "react";
import { AuthContext } from "../../components/auth/AuthProvider";

export default function DashboardHome() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [accessKey, setAccessKey] = useState('');
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

const handleLogin = async (e) => {
  e.preventDefault();

  if (!baseURL) {
    console.error("❌ NEXT_PUBLIC_BACKEND_URL no está definida.");
    setError('Error de configuración del sistema. Contacte al desarrollador capo.');
    return;
  }

  try {
    const response = await fetch(`${baseURL}/admin/verify-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: accessKey }),
      credentials: 'include', // Envío y recepción de cookies
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const fallbackText = await response.text(); // Puede ser HTML
      console.error(`❌ Error HTTP ${response.status}:`, fallbackText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = contentType?.includes('application/json')
      ? await response.json()
      : { success: false, message: 'Respuesta inesperada del servidor' };

    if (data.success) {
      login(); // Autenticación exitosa
      setError(''); // Limpiar errores previos
    } else {
      setError(data.message || 'Clave incorrecta');
    }
  } catch (error) {
    console.error('❌ Error en handleLogin:', error.message);
    setError('Error de conexión o formato de respuesta');
  }
};


  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="holographic-effect"></div>
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Kennwort eingeben</p>
             
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="password"
                placeholder=" "
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="login-input"
                required
              />
              <span className="input-highlight"></span>
            </div>
            
            <button type="submit" className="login-button">
              <span>Logger</span>
              <div className="button-border"></div>
            </button>
          </form>
          
          {error && <p className="error-message">{error}</p>}
        </div>

        <style jsx>{`
          .login-container {
            margin-top:4rem;
            display: flex;
            justify-content: center;
            min-height: 50vh;
            padding: 20px;
          }
          
          .login-card {
            position: relative;
            width: 100%;
            max-width: 420px;
            padding: 2.5rem;
            background-color: rgba(197, 231, 255, 1);
            backdrop-filter: blur(10px);
            overflow: hidden;
          }
          
          .holographic-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 7px;
            background: linear-gradient(90deg, transparent, rgba(0, 47, 255, 0.8), transparent);
            animation: hologram 3s infinite;
          }
          
          @keyframes hologram {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .login-title {
            font-size: 2rem;
            font-weight: 600;
            color: black;
            margin-bottom: 0.5rem;
            text-align: center;
           
          }
          
          .login-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            text-align: center;
          }
          
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .input-group {
            position: relative;
          }
          
          .login-input {
            width: 100%;
            padding: 1rem 1rem 0.5rem;
            font-size: 1rem;
            border: none;
            outline: none;
            transition: all 0.3s ease;
          }
          
          .login-input:focus {
            border-bottom: 1px solid rgba(10, 218, 255, 1);
          }
          
          .login-input:focus + .input-label,
          .login-input:not(:placeholder-shown) + .input-label {
            transform: translateY(-1.2rem) scale(0.8);
            color: rgba(10, 218, 255, 1);
          }
          

          .input-highlight {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: rgba(10, 218, 255, 1);
          }
          span{
            color: white;
          }
        
          
          .login-button {
            position: relative;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
             background-color: rgb(3, 23, 202);
            
            
            border: none;
            overflow: hidden;
            margin-top: 1rem;
            transition: background-color 0.2s ease;
          }
  
          .login-button:hover{
           background-color: rgba(5, 58, 231, 0.89);
          }
          
       
  
          
          .error-message {
            color: #ff4d4d;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 1rem;
          }
          
          @media (max-width: 480px) {
            .login-card {
              padding: 1.5rem;
            }
            
            .login-title {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    );
  }


  return (
    <DashboardLayout>
      <h1>Bienvenido al Dashboard</h1>
      <p>Este es el contenido principal.</p>
    </DashboardLayout>
  );
}
