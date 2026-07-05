import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- AGREGADO: Importamos el contexto
import usuarios from '../data/autenticidad.json'; 
import '../styles/Layout.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // <--- AGREGADO: Usamos la función de login del contexto

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Buscamos en 'autenticidad.json'
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo === email && u.contrasena === password
        );

        if (usuarioEncontrado) {
            // Guardamos el usuario completo para tener su rol y datos disponibles
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
            
            login(); // <--- AGREGADO: Esto avisa al Navbar que el usuario cambió
            
            console.log("Bienvenido:", usuarioEncontrado.nombre);
            navigate('/mis-registros');
        } else {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <section className="producto1">
            <div className="etiqueta">
                <span><i className="fa-solid fa-user"></i> INICIAR SESIÓN</span>
            </div>
            <h2>Accede a tu cuenta</h2>

            <form id="formLogin" className="formulario1 centrado" onSubmit={handleLogin}>
                <fieldset>
                    <legend>Iniciar sesión</legend>
                    
                    {error && <p className="mensaje-error">{error}</p>}

                    <label htmlFor="email">Correo electrónico:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <label htmlFor="password">Contraseña:</label>
                    <div className="input-password">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button 
                            type="button" 
                            className="toggle-password" 
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    <button type="submit" className="boton-ingresar">Ingresar</button>
                    
                    <p className="texto-centro">
                        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
                    </p>
                </fieldset>
            </form>
        </section>
    );
}