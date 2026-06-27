import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <header>
            <nav className="navbar" aria-label="Navegación principal">
                <Link to="/" className="nav-logo">Cardinova</Link>
                <div className="nav-links">
                    <ul>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/agendamiento">Agendar Cita</Link></li>
                        <li><Link to="/mis-registros">Mis Registros</Link></li>
                        <li><Link to="/cita">Cita Médica</Link></li>
                        <li><Link to="/recomendacion">Recomendaciones</Link></li>
                        <li><Link to="/sugerencias">Sugerencias</Link></li>
                        <li><Link to="/registro-familiar">Registro Familiar</Link></li>
                        <li><Link to="/administracion">Panel Administrativo</Link></li>
                        <li><Link to="/#equipo">Equipo</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

import '../styles/Layout.css';