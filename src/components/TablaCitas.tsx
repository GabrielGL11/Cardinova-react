import { type Cita } from '../lib/tipos';
import '../styles/TablaCitas.css';

interface Props {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;    
    onVerDetalles: (cita: Cita) => void; 
}

export const TablaCitas = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: Props) => {
    return (
        <div className="tabla-contenedor">
            <h3>📋 Mis Registros</h3>
            
            {citas.length === 0 ? (
                <p>No tienes citas programadas.</p>
            ) : (
                <table className="tabla-citas">
                    <thead>
                        <tr className="encabezado-tabla">
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th className="texto-centrado">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita) => (
                            <tr key={cita.idCita} className="fila-tabla">
                                <td>{cita.fecha}</td>
                                <td>{cita.hora}</td>
                                <td>{cita.tipoAtencion}</td>
                                <td>
                                    <span className={`badge-estado ${cita.estado?.toLowerCase()}`}>
                                        {cita.estado}
                                    </span>
                                </td>
                                <td className="texto-centrado">
                                    <div className="grupo-botones-accion">
                                        <button type="button" onClick={() => onVerDetalles(cita)} title="Ver detalles">👁️</button>
                                        {cita.estado === 'Programada' ? (
                                            <>
                                                <button type="button" onClick={() => onCambiarEstado(cita.idCita!, 'Completada')} title="Marcar como realizada">✅</button>
                                                <button type="button" onClick={() => onEditar(cita)} title="Editar cita">✏️</button>
                                                <button type="button" onClick={() => onCambiarEstado(cita.idCita!, 'Cancelada')} title="Cancelar cita">❌</button>
                                            </>
                                        ) : (
                                            <span>Finalizado</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};