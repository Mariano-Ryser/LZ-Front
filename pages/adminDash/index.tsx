// pages/adminDash/index.js 
import Link from 'next/link';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useState, useContext } from 'react';

export default function AdminDash() {
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

 //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE!
 //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE! //CUANDO SE ABREEEEE!

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Panel Admin</h2>
        </div>
       
        <nav className="sidebar-nav">
   
          
         

     

        </nav>
  
        <button onClick={logout} className="logout-button">
          <span>Logout</span>
        </button>

     
      </div>
      
      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h1 className="content-title">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'comments' && 'Gestión de Comentarios'}
            {activeTab === 'notifications' && 'Notificaciones'}
            {activeTab === 'media' && 'Multimedia'}
          </h1>
        </div>
        
        <div className="content-body">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">



        




            </div>
          )}
          
   
        </div>
      </div>
      
      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 90vh;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        
        /* Sidebar Styles */
        .admin-sidebar {
          backdrop-filter: blur(10px);
          border-right: 2px solid rgba(0, 0, 0, 0.34);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
        }
         
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        
        .sidebar-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
      
        
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0 1rem;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 0.95rem;
        }
        
    
        
     
        
        .nav-icon {
          font-size: 1.1rem;
        }
        
        .logout-button {
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 1rem;
          margin: 1rem;
          border-radius: 6px;
          background: rgba(255, 50, 50, 0.8);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
           color:rgb(255, 255, 255);
        }
        
        .logout-button:hover {
          background: rgba(212, 20, 20, 0.68);
        }
        
        /* Main Content Styles */
        .admin-content {
          flex: 1;
          padding: 2rem;
       }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .content-title {
          font-size: 1.8rem;
          font-weight: 600;
        }
        
        .stats-bar {
          display: flex;
          gap: 1rem;
        }
        
     
        
        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
       
       
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .admin-dashboard {
            flex-direction: column;
          }
          
          .admin-sidebar {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            padding:0px;
            gap: 0.5rem;
          }
          
          .sidebar-header {
            display: none;
          }
          
          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            flex: none;
            gap: 0.3rem;
          }
          
          .nav-item {
            padding: 0.5rem;
            font-size: 0;
          }
          
          .nav-item span:first-child {
            font-size: 1.1rem;
          }
          
          .logout-button {
            position:absolute;
            right:0.7rem;
            margin: 0;
            font-size: 0;
            padding: 0.5rem;
          }
          
          .logout-button span:first-child {
            font-size: 1rem;
          }
          
          .admin-content {
            padding: 0.4rem;
          }
          
          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .stats-bar {
            width: 100%;
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .grid-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}