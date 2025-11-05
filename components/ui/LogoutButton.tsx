import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function LogoutButton() {
const { isAuthenticated, login, logout } = useContext(AuthContext);
    return (
       <>
              {isAuthenticated && (
                <button onClick={logout} className="logout-button">
                  <span>Logout</span>
                </button>
              )}
              {!isAuthenticated && (
                <button onClick={login} className="login-button">
                  <span>Login</span>
                </button>
              )}
              <style jsx>{`
                .logout-button{
                    background-color: #e74c3c;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;    
                }
                .login-button { 
                    background-color: #6de73cff;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;    
                }
              `}</style>
            </>
    );
}