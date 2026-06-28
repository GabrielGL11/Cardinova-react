import { type Medico } from '../lib/tipos';
import '../styles/FormularioCita.css';

// Muestra un resumen visual de la información del médico seleccionado
export const TarjetaMedico = ({ medico }: { medico: Medico }) => (
    <div className="tarjeta-medico">
        <h4 className="tarjeta-titulo">Médico Seleccionado:</h4>
        <p><strong>Nombre:</strong> {medico.nombre}</p>
        <p><strong>Especialidad:</strong> {medico.especialidad}</p>
        <p><strong>Hospital:</strong> {medico.hospital}</p>
    </div>
);