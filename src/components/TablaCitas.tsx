import { type Cita } from '../lib/tipos';
import '../styles/TablaCitas.css';

interface Props {
    citas: Cita[];
    onEliminar?: (id: string) => void;
    onEditarFecha?: (id: string, nuevaFecha: string) => void; 
}

export const TablaCitas = ({ citas, onEliminar, onEditarFecha }: Props) => {
    return (
        <div className="tabla-contenedor">
            <h3>📋 Mis Registros</h3>
            
            {citas.length === 0 ? (
                <p>No tienes citas programadas.</p>
            ) : (
                <table className="tabla-citas">
                    <thead>
                        <tr className="encabezado-tabla">
                            <th className="celda-tabla">Fecha</th>
                            <th className="celda-tabla">Hora</th>
                            <th className="celda-tabla">Tipo</th>
                            <th className="celda-tabla">Estado</th>
                            <th className="celda-tabla texto-centrado">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita, index) => (
                            <tr key={cita.idCita || index} className="fila-tabla">
                                <td className="celda-tabla">
                                    {onEditarFecha ? (
                                        <input 
                                            type="date" 
                                            defaultValue={cita.fecha}
                                            onChange={(e) => onEditarFecha(cita.idCita!, e.target.value)}
                                            className="input-fecha-tabla"
                                            aria-label="Cambiar fecha de la cita"
                                        />
                                    ) : (
                                        cita.fecha
                                    )}
                                </td>
                                <td className="celda-tabla">{cita.hora}</td>
                                <td className="celda-tabla">{cita.tipoAtencion}</td>
                                <td className="celda-tabla">
                                    <span className="badge-estado">{cita.estado || 'Programada'}</span>
                                </td>
                                <td className="celda-tabla texto-centrado">
                                    {onEliminar && cita.idCita && (
                                        <button 
                                            type="button" 
                                            className="boton-eliminar"
                                            onClick={() => onEliminar(cita.idCita!)}
                                            aria-label="Eliminar cita"
                                            title="Eliminar cita"
                                        >
                                            <i className="fa-solid fa-trash" aria-hidden="true"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};