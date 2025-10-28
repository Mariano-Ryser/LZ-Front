import { useState } from "react";
import { useRouter } from "next/navigation";

const URI = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${URI}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        
        // Disparar un evento personalizado para notificar al navbar
        window.dispatchEvent(new Event("storage"));
        
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        setError(data.mensaje || "Error en login");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Iniciar sesión</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Email"
          required
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Password"
          required
          disabled={loading}
        />
        <button
          className="button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Login"}
        </button>
        <p className="redirect">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="link">
            Registrate acá
          </a>
        </p>
      </form>
      <style jsx>{`
  
 .container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: 'Inter', Arial, sans-serif;
}

.form {
  border: solid 1px #d1d5db;
  background: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.title {
  margin: 0 0 1rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.input {
  color:white;
  background-color: rgba(0, 0, 0, 1);
  padding: 1rem;
  border: 1px solid #dce3f0;
  border-radius: 10px;
  font-size: 1.05rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px rgb(0, 0, 0) inset !important;
  -webkit-text-fill-color: #fff !important;
  transition: background-color 5000s ease-in-out 0s;
}

.button {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.button:hover:not(:disabled) {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}

.button:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.redirect {
  font-size: 0.95rem;
  text-align: center;
  color: #475569;
}

.link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

`}</style>
    </div>
  );
}