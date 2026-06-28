import { useState } from 'react';
import { TablaCitas } from './TablaCitas';
import { type Cita } from '../lib/tipos';

interface Props {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;
    onVerDetalles: (cita: Cita) => void;
}

export const MisRegistros = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: Props) => {
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todos");

    const especialidades = [
        "Todos", 
        ...Array.from(new Set(citas.map(c => c.medico?.especialidad).filter(Boolean)))
    ];

    const citasFiltradas = filtroEspecialidad === "Todos" 
        ? citas 
        : citas.filter(c => c.medico?.especialidad === filtroEspecialidad);

    return (
        <div className="contenedor-registros">
            <h2>Mis Registros</h2>
            
            <div className="filtro-container">
                <label htmlFor="filtroEspecialidad">Filtrar por Especialidad: </label>
                <select 
                    id="filtroEspecialidad" 
                    value={filtroEspecialidad} 
                    onChange={(e) => setFiltroEspecialidad(e.target.value)}
                >
                    {especialidades.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                    ))}
                </select>
            </div>

            <TablaCitas 
                citas={citasFiltradas} 
                onCambiarEstado={onCambiarEstado}
                onEditar={onEditar}
                onVerDetalles={onVerDetalles}
            />
        </div>
    );
};