import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UserInfo() {
    const [usuario, setUsuario] = useState<any>(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const data = localStorage.getItem('usuarioLogueado');
        if (data) setUsuario(JSON.parse(data));
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('usuarioLogueado');
        logout();
        navigate('/login');
    };

    if (!usuario) return null; // Si no hay usuario, este componente desaparece

    return (
        <div className="user-info-nav">
            <span>Usuario: <strong>{usuario.nombre}</strong> | Rol: <strong>{usuario.rol}</strong></span>
            <button onClick={cerrarSesion} className="btn-cerrar-sesion">Cerrar Sesión</button>
        </div>
    );
}