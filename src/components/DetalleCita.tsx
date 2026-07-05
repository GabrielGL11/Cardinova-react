import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CitasContext } from '../context/CitasContext'; 
import { useAuth } from '../context/AuthContext';

// -- COMPONENTE DETALLECITA --
// Renderiza la vista de detalle específico de una cita, extrayendo el identificador desde la URL y accediendo al estado global.
const DetalleCita = () => {
    // Extracción del parámetro dinámico 'id' definido en la ruta (React Router) para identificar la cita específica
    const { id } = useParams();
    // Hook de navegación y contexto de autenticación para retorno dinámico al listado según el rol
    const navigate = useNavigate();
    const { userRole } = useAuth();

    // Suscripción al estado global mediante el hook useContext para acceder al conjunto de citas
    const context = useContext(CitasContext);
    
    // Validación de seguridad del contexto: asegura que el componente esté envuelto por el Provider necesario
    if (!context) {
        throw new Error("DetalleCita debe ser utilizado dentro de un CitasProvider");
    }

    const { citas } = context;

    // Lógica de filtrado de datos: busca la instancia coincidente con el ID capturado de la URL
    const cita = citas.find(c => c.idCita === id);

    // Función para manejar el retorno dinámico al listado del usuario logueado
    const volverAtras = () => {
        navigate(`/${userRole}/mis-registros`);
    };

    // Renderizado condicional: manejo de estado de error cuando el ID no corresponde a ninguna instancia existente
    if (!cita) {
        return (
            <div className="detalle-container">
                <h2>Cita no encontrada</h2>
                <p>No pudimos encontrar el registro con ID: {id}</p>
                <button type="button" className="boton-volver" onClick={volverAtras}>← Volver a Mis Registros</button>
            </div>
        );
    }

    // Renderizado de información detallada con acceso seguro a propiedades anidadas (paciente y médico)
    return (
        <div className="detalle-container">
            <h1>Detalle de la Cita</h1>
            <div className="tarjeta-detalle">
                <p><strong>ID Cita:</strong> {cita.idCita}</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                {/* Acceso seguro al objeto paciente con fallback a 'Desconocido' si no existe la referencia */}
                <p><strong>Paciente:</strong> {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : 'Desconocido'}</p>
                {/* Acceso seguro al objeto médico con validación de existencia */}
                <p><strong>Médico:</strong> {cita.medico ? cita.medico.nombre : 'No asignado'}</p>
                <p><strong>Especialidad:</strong> {cita.medico ? cita.medico.especialidad : 'N/A'}</p>
                <p><strong>Motivo:</strong> {cita.motivo}</p>
                <p><strong>Estado:</strong> {cita.estado}</p>
                
                {/* Botón de retorno dinámico */}
                <button type="button" className="boton-volver" onClick={volverAtras}>
                    ← Volver a Mis Registros
                </button>
            </div>
        </div>
    );
};

export default DetalleCita;