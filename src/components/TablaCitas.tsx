import { Link } from 'react-router-dom';
import { type Cita } from '../lib/tipos';
import '../styles/TablaCitas.css';
import { useAuth } from '../context/AuthContext';

interface Props {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;
    onVerDetalles: (cita: Cita) => void;
}

// -- COMPONENTE TABLACITAS --
// Componente presentacional encargado de renderizar el listado de citas y delegar las acciones de gestión al componente padre.
export const TablaCitas = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: Props) => {
    // EL HOOK DEBE IR AQUÍ, DENTRO DEL COMPONENTE
    const { userRole } = useAuth();

    return (
        <table className="tabla-citas">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {citas.map((cita) => (
                    <tr key={cita.idCita}>
                        <td>{cita.fecha}</td>
                        <td>{cita.hora}</td>
                        <td>{cita.paciente?.nombre} {cita.paciente?.apellido}</td>
                        <td>{cita.medico?.nombre}</td>
                        <td>{cita.tipoAtencion}</td>
                        <td><span className={`badge-estado ${cita.estado?.toLowerCase()}`}>{cita.estado}</span></td>
                        <td>
                            <div className="contenedor-acciones">
                                {/* Navegación hacia la vista de detalle mediante rutas dinámicas */}
                                <Link 
                                    to={`/${userRole}/mis-registros/${cita.idCita}`}
                                    className="btn-accion" 
                                    title="Ver detalles"
                                    onClick={() => onVerDetalles(cita)}
                                >
                                    👁️
                                </Link>
                                
                                {/* Renderizado condicional de acciones basado en el estado actual de la cita */}
                                {cita.estado === 'Programada' ? (
                                    <>
                                        {/* Completar: Acción exclusiva para el rol médico */}
                                        {userRole === 'medico' && (
                                            <button type="button" className="btn-accion" onClick={() => onCambiarEstado(cita.idCita!, 'Completada')} title="Completar">✅</button>
                                        )}

                                        {/* Editar: Acción exclusiva para el rol paciente */}
                                        {userRole === 'paciente' && (
                                            <button type="button" className="btn-accion" onClick={() => onEditar(cita)} title="Editar">✏️</button>
                                        )}

                                        {/* Cancelar: Acción común para ambos roles */}
                                        <button type="button" className="btn-accion" onClick={() => onCambiarEstado(cita.idCita!, 'Cancelada')} title="❌">❌</button>
                                    </>
                                ) : (
                                    <span className="estado-finalizado">Finalizado</span>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};