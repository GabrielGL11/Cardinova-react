import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import usuarios from '../data/autenticidad.json'; 
import '../styles/Layout.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Usamos la función de login del contexto

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Obtenemos los usuarios registrados localmente (nuevos pacientes)
        const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
        
        // 2. Combinamos los usuarios del JSON con los nuevos pacientes de localStorage
        const todosLosUsuarios = [...usuarios, ...usuariosLocal];

        // 3. Buscamos en la lista combinada (JSON + nuevos registros)
        const usuarioEncontrado = todosLosUsuarios.find(
            (u) => u.correo === email && u.contrasena === password
        );

        if (usuarioEncontrado) {
            // Pasamos los datos necesarios al contexto (nombre y rol)
            login({ 
                id: usuarioEncontrado.idUsuario, 
                nombre: usuarioEncontrado.nombre, 
                rol: usuarioEncontrado.rol as 'paciente' | 'medico', 
                cedula: usuarioEncontrado.cedula 
            });
            
            // Redirección dinámica según el rol tras el inicio de sesión
            if (usuarioEncontrado.rol === 'paciente') {
                navigate('/paciente/agendamiento');
            } else {
                navigate('/medico/mis-registros');
            }
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