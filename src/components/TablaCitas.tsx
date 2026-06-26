import { type Cita } from '../lib/tipos';
import '../styles/TablaCitas.css';

interface Props {
    citas: Cita[];
    onEliminar?: (id: string) => void;
}

export const TablaCitas = ({ citas, onEliminar }: Props) => {
    return (
        <div className="tabla-contenedor">
            <h3>📋 Citas Registradas</h3>
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
                        {citas.map((cita) => (
                            <tr key={cita.idCita || Math.random()} className="fila-tabla">
                                <td className="celda-tabla">{cita.fecha}</td>
                                <td className="celda-tabla">{cita.hora}</td>
                                <td className="celda-tabla">{cita.tipoAtencion}</td>
                                <td className="celda-tabla">
                                    <span className="badge-estado">{cita.estado || 'Programada'}</span>
                                </td>
                                <td className="celda-tabla texto-centrado">
                                    {onEliminar && cita.idCita && (
                                        <button 
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