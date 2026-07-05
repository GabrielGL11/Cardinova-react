import { Link } from 'react-router-dom';
import { UserInfo } from './UserInfo';
import { useAuth } from '../context/AuthContext'; 
import '../styles/Layout.css';

export const Navbar = () => {
    // Obtenemos el estado directamente del contexto global
    // Al ser un contexto, cuando cambia, el Navbar se renderiza solo automáticamente
    const { isLoggedIn } = useAuth();


    return (
        <header>
            <nav className="navbar" aria-label="Navegación principal">
                <Link to="/" className="nav-logo">Cardinova</Link>
                
                {/* UserInfo se muestra solo si el contexto confirma que hay usuario */}
                {isLoggedIn && <UserInfo />}

                <div className="nav-links">
                    <ul>
                        {/* Solo mostramos Iniciar Sesión si NO hay usuario (vía contexto) */}
                        {!isLoggedIn && (
                            <li><Link to="/login">Iniciar Sesión</Link></li>
                        )}
                        
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/agendamiento">Agendar Cita</Link></li>
                        <li><Link to="/mis-registros">Mis Registros</Link></li>
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