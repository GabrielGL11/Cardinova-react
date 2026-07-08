import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

export function RegistroPaciente() {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        cedula: '',
        correo: '',
        password: '',
        confirmar: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistro = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        // 1. Crear el objeto del nuevo usuario
        const nuevoPaciente = {
            idUsuario: Date.now(),
            nombre: `${formData.nombres} ${formData.apellidos}`, // Concatenamos para que coincida con tu lógica de Login
            cedula: formData.cedula,
            correo: formData.correo,
            contrasena: formData.password, // Asegúrate de usar 'contrasena' para que coincida con tu Login.tsx
            rol: 'paciente'
        };

        // 2. Obtener usuarios actuales de localStorage (o inicializar array vacío)
        const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
        
        // 3. Agregar el nuevo y guardar
        usuariosGuardados.push(nuevoPaciente);
        localStorage.setItem('usuarios_app', JSON.stringify(usuariosGuardados));

        alert('Cuenta creada exitosamente');
        navigate('/login');
    };

    return (
        <section className="producto1">
            <div className="etiqueta">
                <span><i className="fa-solid fa-user-plus"></i> REGISTRO DE PACIENTE</span>
            </div>
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

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" required 
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

                    <label htmlFor="confirmar">Confirmar contraseña:</label>
                    <input type="password" id="confirmar" required 
                        value={formData.confirmar} onChange={(e) => setFormData({...formData, confirmar: e.target.value})} />

                    <button type="submit" className="botones boton-registro boton-completo">Crear cuenta</button>
                    
                    <p className="texto-centro">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
                </fieldset>
            </form>
        </section>
    );
}