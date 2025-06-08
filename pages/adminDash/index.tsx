// pages/adminDash/index.js 
import Link from 'next/link';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useState, useContext } from 'react';
import ComentarSection from './components/ComentarSection';
import NotiSection from './components/NotiSection';
import ImageSection from './components/ImageSection';
import BlockPages from "./components/blockPages"

export default function AdminDash() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [accessKey, setAccessKey] = useState('');
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/admin/verify-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey }),
        credentials: 'include', // 🔥 Asegura que el frontend envíe y reciba cookies
      });

      const data = await response.json();
      if (data.success) {
        login(); // Llamada al contexto para actualizar el estado de autenticación
      } else {
        setError('Clave incorrecta');
      }
    } catch (error) {
      console.error("Detalles del error:", error);  // Imprimir el error completo
      setError('Error de conexión'); //error en rojo en interfaz
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="holographic-effect"></div>
          <h1 className="login-title">Acceso al Panel</h1>
          <p className="login-subtitle">Ingrese sus credenciales de administrador</p>
             
          
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
              <span>Acceder</span>
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
            background: rgba(20, 20, 40, 0.8);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(10, 218, 255, 0.3);
            overflow: hidden;
          }
          
          .holographic-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, transparent, rgba(10, 218, 255, 0.8), transparent);
            animation: hologram 3s infinite;
          }
          
          @keyframes hologram {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .login-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 0.5rem;
            text-align: center;
            background: linear-gradient(90deg, #0adaff, #00ffaa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .login-subtitle {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
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
            border-bottom: 1px solid rgba(10, 218, 255, 0.5);
            background: transparent;
            color: #fff;
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
            transition: width 0.3s ease;
          }
          
          .login-input:focus ~ .input-highlight {
            width: 100%;
          }
          
          .login-button {
            position: relative;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            color: #fff;
            background: transparent;
            border: none;
            cursor: pointer;
            overflow: hidden;
            margin-top: 1rem;
          }
          
          .login-button span {
            position: relative;
            z-index: 2;
          }
          
          .button-border {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 1px solid rgba(10, 218, 255, 0.5);
            border-radius: 4px;
            transition: all 0.3s ease;
          }
          
          .login-button:hover .button-border {
            border-color: rgba(10, 218, 255, 1);
            box-shadow: 0 0 10px rgba(10, 218, 255, 0.5);
          }
          
          .login-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(10, 218, 255, 0.2), transparent);
            transition: all 0.5s ease;
          }
          
          .login-button:hover::before {
            left: 100%;
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
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <span className="nav-icon">💬</span>
            <span>Comentarios</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="nav-icon">🔔</span>
            <span>Notificaciones</span>
          </button>
          
         

          <button 
            className={`nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className="nav-icon">🖼️</span>
            <span>Multimedia</span>
          </button>

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


<BlockPages></BlockPages>
        




            </div>
          )}
          
          {activeTab === 'comments' && <ComentarSection />}
          {activeTab === 'notifications' && <NotiSection />}
          {activeTab === 'media' && <ImageSection />}
        </div>
      </div>
      
      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 90vh;
          color: #fff;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        
        /* Sidebar Styles */
        .admin-sidebar {
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(10, 218, 255, 0.1);
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
          background: linear-gradient(90deg, #0adaff, #00ffaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
        
        .nav-item:hover {
          background: rgba(10, 218, 255, 0.1);
          color: #fff;
        }
        
        .nav-item.active {
          background: rgba(10, 218, 255, 0.2);
          color: #0adaff;
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
          background: rgba(255, 50, 50, 0.1);
          border: none;
          color: rgba(255, 100, 100, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .logout-button:hover {
          background: rgba(255, 50, 50, 0.2);
          color: #ff6464;
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
          background: linear-gradient(90deg, #fff, #0adaff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .stats-bar {
          display: flex;
          gap: 1rem;
        }
        
        .stat-card {
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          border: 1px solid rgba(10, 218, 255, 0.2);
          text-align: center;
          min-width: 80px;
        }
        
        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #0adaff;
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