import { type Cita } from '../lib/tipos';
import '../styles/TablaCitas.css';

interface Props {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;
    onVerDetalles: (cita: Cita) => void;
}
// -- COMPONENTE TABLACITAS --
// Renderiza el listado de citas en formato tabla y gestiona las acciones de cada fila
export const TablaCitas = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: Props) => {
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
                                <button type="button" className="btn-accion" onClick={() => onVerDetalles(cita)} title="Ver detalles">👁️</button>
                                {cita.estado === 'Programada' ? (
                                    <>
                                        <button type="button" className="btn-accion" onClick={() => onCambiarEstado(cita.idCita!, 'Completada')} title="Completar">✅</button>
                                        <button type="button" className="btn-accion" onClick={() => onEditar(cita)} title="Editar">✏️</button>
                                        <button type="button" className="btn-accion" onClick={() => onCambiarEstado(cita.idCita!, 'Cancelada')} title="Cancelar">❌</button>
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