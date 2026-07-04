import { Link } from 'react-router-dom';
import '../styles/Layout.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="contenedor-volver">
                <Link to="/" className="botones">⬅ Volver al inicio</Link>
            </div>

            {/* Agrupamos los iconos en un contenedor para controlarlos mejor */}
            <div className="redes">
                <a href="https://github.com/usuario" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.uleam.edu.ec/" target="_blank" rel="noopener noreferrer" aria-label="Sitio web">
                    <i className="fa-solid fa-globe"></i>
                </a>
                <a href="mailto:correo@uleam.edu.ec" aria-label="Email">
                    <i className="fa-solid fa-envelope"></i>
                </a>
            </div>

            <p>&copy; 2026 · Cardinova · ULEAM · Hecho con React</p>
        </footer>
    );
};