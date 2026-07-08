import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

// Componente funcional para el registro de nuevos pacientes. Implementa persistencia local mediante localStorage y validación de contraseñas.
export function RegistroPaciente() {
    // Estado inicial del formulario: gestiona los campos de entrada como un objeto único para facilitar la actualización.
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        cedula: '',
        correo: '',
        password: '',
        confirmar: ''
    });

    const [error, setError] = useState('');
    // Estado booleano para alternar el atributo 'type' (text/password) simultáneamente en ambos campos.
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Manejador de eventos para el envío del formulario. Ejecuta validaciones de integridad de datos y persiste el nuevo usuario en localStorage.
    const handleRegistro = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación: comparativa directa para asegurar coincidencia de contraseñas.
        if (formData.password !== formData.confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const nuevoPaciente = {
            idUsuario: Date.now(),
            nombre: `${formData.nombres} ${formData.apellidos}`,
            cedula: formData.cedula,
            correo: formData.correo,
            contrasena: formData.password,
            rol: 'paciente'
        };

        // Acceso al API de almacenamiento del navegador para persistencia de datos.
        const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
        usuariosGuardados.push(nuevoPaciente);
        localStorage.setItem('usuarios_app', JSON.stringify(usuariosGuardados));

        alert('Cuenta creada exitosamente');
        navigate('/login');
    };

    return (
        <section className="producto1">
            <div className="etiqueta"><span><i className="fa-solid fa-user-plus"></i> REGISTRO DE PACIENTE</span></div>
            <h2>Crea tu cuenta</h2>

            <form className="formulario1 centrado" onSubmit={handleRegistro}>
                <fieldset>
                    <legend>Datos Personales</legend>
                    {error && <p className="mensaje-error">{error}</p>}

                    <div className="grid-container">
                        <div>
                            <label htmlFor="nombres">Nombres:</label>
                            <input type="text" id="nombres" required 
                                value={formData.nombres} onChange={(e) => setFormData({...formData, nombres: e.target.value})} />
                        </div>
                        <div>
                            <label htmlFor="apellidos">Apellidos:</label>
                            <input type="text" id="apellidos" required 
                                value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} />
                        </div>
                    </div>

                    <label htmlFor="cedula">Cédula de identidad:</label>
                    <input type="text" id="cedula" maxLength={10} required 
                        value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} />

                    <label htmlFor="correo">Correo electrónico:</label>
                    <input type="email" id="correo" required 
                        value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} />

                    {/* Contraseña: Contenedor con clase 'input-password' para aplicar estilos consistentes (fondo/bordes) */}
                    <label htmlFor="password">Contraseña:</label>
                    <div className="input-password">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            required 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
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

                    {/* Confirmación: Se utiliza el mismo contenedor 'input-password' para heredar el diseño visual del primer input */}
                    <label htmlFor="confirmar">Confirmar contraseña:</label>
                    <div className="input-password">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="confirmar" 
                            required 
                            value={formData.confirmar} 
                            onChange={(e) => setFormData({...formData, confirmar: e.target.value})} 
                        />
                    </div>

                    <button type="submit" className="botones boton-registro boton-completo">Crear cuenta</button>
                    
                    <p className="texto-centro">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
                </fieldset>
            </form>
        </section>
    );
}