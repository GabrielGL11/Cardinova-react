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

    return (
        <header>
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

                        {/* 2. MÓDULO PACIENTE: Enlaces protegidos por rol (Solo visibles para pacientes autenticados) */}
                        {isLoggedIn && userRole === 'paciente' && (
                            <>
                                <li><Link to="/paciente/agendamiento">Agendar Cita</Link></li>
                                <li><Link to="/paciente/mis-registros">Mis Registros</Link></li>
                            </>
                        )}

                        {/* 3. MÓDULO MÉDICO: Enlaces protegidos por rol (Solo visibles para médicos autenticados) */}
                        {/* [MODIFICADO] Se restringe la visibilidad para que solo el médico vea su panel de gestión */}
                        {isLoggedIn && userRole === 'medico' && (
                            <li><Link to="/medico/mis-registros">Mis Pacientes</Link></li>
                        )}

                        {/* 4. RECURSOS Y AYUDA: Enlaces generales permanentes para acceso a documentación y herramientas */}
                        <li><Link to="/cita">Cita Médica</Link></li>
                        <li><Link to="/recomendacion">Recomendaciones</Link></li>
                        <li><Link to="/sugerencias">Sugerencias</Link></li>
                        <li><Link to="/registro-familiar">Registro Familiar</Link></li>
                        <li><Link to="/administracion">Panel Administrativo</Link></li>
                        <li><Link to="/equipo">Equipo</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};