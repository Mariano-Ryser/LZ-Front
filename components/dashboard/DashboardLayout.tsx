
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./DashboardLayout.module.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../components/auth/AuthProvider";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
const { isAuthenticated, login, logout } = useContext(AuthContext);

  const menuItems = [
    { path: "/adminDash", label: "Inicio" },
    { path: "/adminDash/artikel", label: "Artikel suche" },
    { path: "/adminDash/map", label: "Map" },
    { path: "/adminDash/profile", label: "Perfil" },
    { path: "/adminDash/settings", label: "Configuración" },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <h2 className={styles.logo}>Mi Panel</h2>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={router.pathname === item.path ? styles.active : ""}
                  onClick={() => setIsOpen(false)} // cerrar al hacer click
                >
                  {item.label}
                </Link>
              </li>
            ))}

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
              
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className={styles.content}>{children}</main>

      {/* Botón Burger */}
      <button
        className={styles.burger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Fondo oscuro cuando el menú está abierto */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  );
}
