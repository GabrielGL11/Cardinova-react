import { TablaCitas } from './TablaCitas';
import { type Cita } from '../lib/tipos';

interface PropsRegistros {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;
    onVerDetalles: (cita: Cita) => void;
}

export const MisRegistros = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: PropsRegistros) => {
    return (
        <div className="contenedor-registros">
            <h2>Mis Registros de Citas</h2>
            <TablaCitas 
                citas={citas} 
                onCambiarEstado={onCambiarEstado}
                onEditar={onEditar}
                onVerDetalles={onVerDetalles}
            />
        </div>
    );
};