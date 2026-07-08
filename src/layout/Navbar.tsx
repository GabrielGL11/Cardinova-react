import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserInfo } from './UserInfo';
import { useAuth } from '../context/AuthContext'; 
import '../styles/Layout.css';

/**
 * Navbar principal.
 * Muestra enlaces dinámicamente según el estado de autenticación y el rol del usuario (Paciente o Médico).
 */
export const Navbar = () => {
    // Consumo del estado global para determinar el acceso y el rol
    const { isLoggedIn, userRole } = useAuth();
    
    // Estado para gestionar el mensaje de aviso centralizado (modal)
    const [mensajeAviso, setMensajeAviso] = useState<string | null>(null);

    return (
        <header>
            {/* CAPA DE AVISO (MODAL CENTRAL): Se muestra solo cuando mensajeAviso tiene contenido */}
            {mensajeAviso && (
                <div className="overlay-aviso" onClick={() => setMensajeAviso(null)}>
                    <div className="caja-aviso">
                        <h2>⚠️ Atención</h2>
                        <p>{mensajeAviso}</p>
                        <button onClick={() => setMensajeAviso(null)}>Aceptar</button>
                    </div>
                </div>
            )}

            <nav className="navbar" aria-label="Navegación principal">
                <Link to="/" className="nav-logo">Cardinova</Link>
                
                {/* Renderizado condicional: El componente de perfil de usuario solo se monta si la sesión está activa */}
                {isLoggedIn && <UserInfo />}

                <div className="nav-links">
                    <ul>
                        {/* 1. SECCIÓN PÚBLICA GENERAL: Siempre disponible */}
                        <li><Link to="/">Inicio</Link></li>
                        
                        {/* Renderizado condicional: Solo mostrar opción de login si el usuario es un visitante (no autenticado) */}
                        {!isLoggedIn && <li><Link to="/login">Iniciar Sesión</Link></li>}

                        {/* 2. MÓDULO PACIENTE: Visible para todos, con validaciones de acceso mediante modal */}
                        <li>
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                if (!isLoggedIn) {
                                    setMensajeAviso("Acceso denegado: Primero debe iniciar sesión.");
                                } else if (userRole === 'medico') {
                                    setMensajeAviso("Esta pestaña es solo para pacientes.");
                                } else {
                                    window.location.href = "/paciente/agendamiento";
                                }
                            }}>Agendar Cita</Link>
                        </li>

                        {/* [MODIFICADO] Se oculta "Mis Registros" para el médico para evitar redundancia con "Mis Pacientes" */}
                        {userRole !== 'medico' && (
                            <li>
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    if (!isLoggedIn) {
                                        setMensajeAviso("No hay registros. Por favor, inicie sesión para ver sus registros.");
                                    } else {
                                        window.location.href = "/paciente/mis-registros";
                                    }
                                }}>Mis Registros</Link>
                            </li>
                        )}

                        {/* 3. MÓDULO MÉDICO: Visible solo para médicos autenticados */}
                        {isLoggedIn && userRole === 'medico' && (
                            <li><Link to="/medico/mis-registros">Mis Pacientes</Link></li>
                        )}

                        {/* 4. RECURSOS Y AYUDA: Enlaces generales permanentes para acceso a documentación y herramientas */}
                        <li><Link to="/cita">Cita Médica</Link></li>
                        <li><Link to="/recomendacion">Recomendaciones</Link></li>
                        <li><Link to="/sugerencias">Sugerencias</Link></li>
                        <li><Link to="/administracion">Panel Administrativo</Link></li>
                        <li><Link to="/equipo">Equipo</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};