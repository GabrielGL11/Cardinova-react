import { useState } from 'react';
import { TablaCitas } from './TablaCitas';
import { type Cita } from '../lib/tipos';

interface Props {
    citas: Cita[];
    onCambiarEstado: (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => void;
    onEditar: (cita: Cita) => void;
    onVerDetalles: (cita: Cita) => void;
}

// -- COMPONENTE MISREGISTROS --
// Gestiona la visualización del historial de citas, incluyendo la lógica de filtrado por especialidad
export const MisRegistros = ({ citas, onCambiarEstado, onEditar, onVerDetalles }: Props) => {
    // Estado para controlar la especialidad seleccionada en el filtro
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todos");

    // Extrae dinámicamente las especialidades únicas de los médicos presentes en las citas
    const especialidades = [
        "Todos", 
        ...Array.from(new Set(citas.map(c => c.medico?.especialidad).filter(Boolean)))
    ];

    // Calcula la lista de citas a mostrar basada en el filtro seleccionado
    const citasFiltradas = filtroEspecialidad === "Todos" 
        ? citas 
        : citas.filter(c => c.medico?.especialidad === filtroEspecialidad);

    return (
        <div className="contenedor-registros">
            <h2>Mis Registros</h2>
            {/* Sección del control de filtro */}
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

            {/* Tabla que recibe las citas ya filtradas */}
            <TablaCitas 
                citas={citasFiltradas} 
                onCambiarEstado={onCambiarEstado}
                onEditar={onEditar}
                onVerDetalles={onVerDetalles}
            />
        </div>
    );
};