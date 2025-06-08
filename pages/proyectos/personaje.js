import { useState, useEffect } from 'react'
import Link from 'next/link'

function Personaje() {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const initialState = {
        name: '',
        surname: '',
        edad: 0,
        email: '',
        city: '',
        description: '',
    }

    const [personaje, setPersonaje] = useState(initialState)
    const [personajes, setPersonajes] = useState([])
    const [isDeleting, setIsDeleting] = useState(false)

    const handleChange = (e) => {
        const inputValue = e.target.value
        const inputName = e.target.name
        setPersonaje({
            ...personaje,
            [inputName]: inputName === 'edad' ? parseInt(inputValue) || 0 : inputValue,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${baseURL}/personajes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personaje)
            })
            
            if (!res.ok) throw new Error('Error al crear personaje')
            
            const data = await res.json()
            setPersonaje(initialState)
            setPersonajes([data.personaje, ...personajes])
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const handleDelete = async (id) => {
        setIsDeleting(true)
        try {
            const res = await fetch(`${baseURL}/personajes/${id}`, {
                method: 'DELETE'
            })
            
            if (!res.ok) throw new Error('Error al eliminar personaje')
            
            setPersonajes(personajes.filter(p => p._id !== id))
        } catch (error) {
            console.error("Error al eliminar:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const fetchPersonajes = async () => {
        try {
            const res = await fetch(`${baseURL}/personajes`)
            if (!res.ok) throw new Error('Error al obtener personajes')
            
            const data = await res.json()
            // Asegurándonos que siempre sea un array
            setPersonajes(data.personajes || [])
        } catch (error) {
            console.error("Error fetching personajes:", error)
            setPersonajes([]) // En caso de error, establecemos un array vacío
        }
    }

    useEffect(() => {
        fetchPersonajes()
    }, [])

    return (
        <div className="retro-container">
            <h1 className="retro-title">📼 Personaje Manager 1.0 📼</h1>
            
            <div className="retro-grid">
                {/* Formulario */}
                <div className="retro-form-container">
                    <form className="retro-form" onSubmit={handleSubmit}>
                        <h2 className="retro-form-title">➕ Nuevo Personaje</h2>
                        
                        <div className="retro-input-group">
                            <label className="retro-label">Nombre</label>
                            <input
                                className="retro-input"
                                type="text"
                                name="name"
                                value={personaje.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="retro-input-group">
                            <label className="retro-label">Apellido</label>
                            <input
                                className="retro-input"
                                type="text"
                                name="surname"
                                value={personaje.surname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="retro-input-group">
                            <label className="retro-label">Email</label>
                            <input
                                className="retro-input"
                                type="email"
                                name="email"
                                value={personaje.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="retro-input-group">
                            <label className="retro-label">Ciudad</label>
                            <input
                                className="retro-input"
                                type="text"
                                name="city"
                                value={personaje.city}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="retro-input-group">
                            <label className="retro-label">Descripción</label>
                            <textarea
                                className="retro-textarea"
                                name="description"
                                value={personaje.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                        
                        <button type="submit" className="retro-button create-button">
                            Crear Personaje
                        </button>
                    </form>
                </div>
                
                {/* Lista de Personajes */}
                <div className="retro-list-container">
                <h2 className="retro-list-title">🎯 Personajes ({(personajes || []).length})</h2>
                    
                    {(personajes || []).length === 0 ? (
                        <p className="retro-empty">No hay personajes creados</p>
                         ) : (
                        <div className="retro-list">
                            {personajes.map(({_id, name, surname, email, city, description}) => (
                                <div key={_id} className="retro-card">
                                    <div className="retro-card-header">
                                        <h3 className="retro-card-title">{name} {surname}</h3>
                                        <button
                                            onClick={() => handleDelete(_id)}
                                            disabled={isDeleting}
                                            className="retro-button delete-button"
                                        >
                                            {isDeleting ? '⌛' : '🗑️'}
                                        </button>
                                    </div>
                                    
                                    <div className="retro-card-body">
                                        <p className="retro-card-text"><span className="retro-card-label">📧 Email:</span> {email}</p>
                                        <p className="retro-card-text"><span className="retro-card-label">🏙️ Ciudad:</span> {city}</p>
                                        {description && (
                                            <p className="retro-card-text">
                                                <span className="retro-card-label">📝 Descripción:</span> {description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                /* Estilo retro general */
                :root {
                    --retro-primary: #ff00ff;
                    --retro-secondary: #00ffff;
                    --retro-bg: #121212;
                    --retro-card-bg: #1a1a1a;
                    --retro-text: #e0e0e0;
                    --retro-accent: #ffff00;
                    --retro-border: 2px solid var(--retro-primary);
                }
                
                body {
                    background-color: var(--retro-bg);
                    color: var(--retro-text);
                    font-family: 'Courier New', monospace;
                    margin: 0;
                    padding: 0;
                }
                
                .retro-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .retro-title {
                    text-align: center;
                    color: var(--retro-primary);
                    text-shadow: 2px 2px 0 var(--retro-secondary);
                    font-size: 2.5rem;
                    margin-bottom: 30px;
                    border-bottom: var(--retro-border);
                    padding-bottom: 10px;
                }
                
                .retro-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 20px;
                }
                
                /* Estilo del formulario */
                .retro-form-container {
                    background-color: var(--retro-card-bg);
                    border: var(--retro-border);
                    padding: 20px;
                    box-shadow: 5px 5px 0 var(--retro-secondary);
                }
                
                .retro-form-title {
                    color: var(--retro-primary);
                    margin-top: 0;
                    font-size: 1.5rem;
                }
                
                .retro-input-group {
                    margin-bottom: 15px;
                }
                
                .retro-label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--retro-secondary);
                    font-weight: bold;
                }
                
                .retro-input, .retro-textarea {
                    width: 100%;
                    padding: 8px;
                    background-color: #2a2a2a;
                    border: 1px solid var(--retro-primary);
                    color: var(--retro-text);
                    font-family: 'Courier New', monospace;
                }
                
                .retro-textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                
                /* Estilo de botones */
                .retro-button {
                    background-color:rgb(46, 240, 7);
                    padding: 10px 15px;
                    border: none;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    transition: all 0.3s;
                    margin-top: 10px;
                }
                
                .create-button {
                    color: black;
                }
                
                .create-button:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 3px 3px 0 var(--retro-secondary);
                }
                
                .delete-button {
                    background-color: #ff0000;
                    color: white;
                }
                
                .delete-button:hover {
                    background-color: #ff5555;
                }
                
                .delete-button:disabled {
                    background-color: #555555;
                    cursor: not-allowed;
                }
                
                /* Estilo de la lista de personajes */
                .retro-list-container {
                    background-color: var(--retro-card-bg);
                    border: var(--retro-border);
                    padding: 20px;
                    box-shadow: 5px 5px 0 var(--retro-secondary);
                }
                
                .retro-list-title {
                    color: var(--retro-primary);
                    margin-top: 0;
                    font-size: 1.5rem;
                    border-bottom: 1px solid var(--retro-primary);
                    padding-bottom: 10px;
                }
                
                .retro-empty {
                    text-align: center;
                    color: var(--retro-secondary);
                    font-style: italic;
                }
                
                .retro-list {
                    display: grid;
                    gap: 15px;
                }
                
                /* Estilo de las tarjetas de personajes */
                .retro-card {
                    background-color: #2a2a2a;
                    border: 1px solid var(--retro-secondary);
                    padding: 15px;
                    position: relative;
                }
                
                .retro-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    border-bottom: 1px solid var(--retro-primary);
                    padding-bottom: 5px;
                }
                
                .retro-card-title {
                    margin: 0;
                    color: var(--retro-primary);
                }
                
                .retro-card-body {
                    padding: 5px 0;
                }
                
                .retro-card-text {
                    margin: 5px 0;
                }
                
                .retro-card-label {
                    color: var(--retro-secondary);
                    font-weight: bold;
                }
              
                /* Efectos hover para las tarjetas */
                .retro-card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 3px 3px 0 var(--retro-primary);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .retro-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .retro-title {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default Personaje