import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CitasContext } from '../components/CitasContext'; 

// Muestra la vista de detalle y obtiene el 'id' desde la URL usando Context API.
const DetalleCita = () => {
    // Extracción del parámetro dinámico 'id' definido en la ruta (React Router)
    const { id } = useParams();

    // Suscripción al estado global mediante el hook useContext
    const context = useContext(CitasContext);
    
    // Validación de seguridad del contexto: asegura que el componente esté envuelto por el Provider
    if (!context) {
        throw new Error("DetalleCita debe ser utilizado dentro de un CitasProvider");
    }

    const { citas } = context;

    // Lógica de filtrado de datos basada en el ID capturado de la URL
    const cita = citas.find(c => c.idCita === id);

    // Renderizado condicional: manejo de estado de carga/error cuando el ID no corresponde a ninguna instancia
    if (!cita) {
        return (
            <div className="detalle-container">
                <h2>Cita no encontrada</h2>
                <p>No pudimos encontrar el registro con ID: {id}</p>
            </div>
        );
    }

    // Renderizado de información detallada con acceso a propiedades anidadas del objeto cita
    return (
        <div className="detalle-container">
            <h1>Detalle de la Cita</h1>
            <div className="tarjeta-detalle">
                <p><strong>ID Cita:</strong> {cita.idCita}</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Paciente:</strong> {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : 'Desconocido'}</p>
                <p><strong>Médico:</strong> {cita.medico ? cita.medico.nombre : 'No asignado'}</p>
                <p><strong>Especialidad:</strong> {cita.medico ? cita.medico.especialidad : 'N/A'}</p>
                <p><strong>Motivo:</strong> {cita.motivo}</p>
                <p><strong>Estado:</strong> {cita.estado}</p>
            </div>
        </div>
    );
};

export default DetalleCita;