import { TablaCitas } from './TablaCitas';
import { type Cita } from '../lib/tipos';

interface PropsRegistros {
    citas: Cita[];
    onEliminar: (id: string) => void;
    onEditarFecha: (id: string, nuevaFecha: string) => void;
}

export const MisRegistros = ({ citas, onEliminar, onEditarFecha }: PropsRegistros) => {
    return (
        <div className="contenedor-registros">
            <h2>Mis Registros de Citas</h2>
            <TablaCitas 
                citas={citas} 
                onEliminar={onEliminar} 
                onEditarFecha={onEditarFecha} 
            />
        </div>
    );
};