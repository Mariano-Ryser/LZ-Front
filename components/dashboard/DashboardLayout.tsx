
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./DashboardLayout.module.css";
import { useState} from "react";
import LogoutButton from "../ui/LogoutButton";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/adminDash", label: "Inicio" },
    { path: "/adminDash/artikel", label: "Artikel suche" },
    { path: "/adminDash/clients", label: "Clients" },
    { path: "/adminDash/map", label: "Map" },
    { path: "/adminDash/verkaufteArtikel", label: "Verkaufte Artikel" },
    { path: "/adminDash/regnung", label: "Rechnungen" },
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

           <LogoutButton />
              
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
