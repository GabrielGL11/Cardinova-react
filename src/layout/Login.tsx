import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes añadir tu lógica de autenticación
    console.log("Iniciando sesión con:", email, password);
    navigate('/mis-registros'); // Redirección tras login
    };

    return (
    <section className="producto1">
        <div className="etiqueta">
        <span>
            <i className="fa-solid fa-user"></i> INICIAR SESIÓN
        </span>
        </div>
        <h2>Accede a tu cuenta</h2>

        <form id="formLogin" className="formulario1 centrado" onSubmit={handleLogin}>
        <fieldset>
            <legend>Iniciar sesión</legend>
            
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
                aria-label="Mostrar u ocultar contraseña"
            >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            </div>

            <button type="submit" className="botones">Ingresar</button>
            
            <p className="texto-centro">
            ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
            </p>
        </fieldset>
        </form>

        <div className="volver-container">
        <button className="botones" onClick={() => navigate('/')}>⬅ Volver al inicio</button>
        </div>
    </section>
    );
}