import { useState, useContext } from 'react';
import { TablaCitas } from './TablaCitas';
import { CitasContext } from './CitasContext'; // Importamos el contexto

// -- COMPONENTE MISREGISTROS --
// Gestiona la visualización del historial de citas, incluyendo la lógica de filtrado por especialidad
export const MisRegistros = () => {
    // Obtenemos los datos y funciones desde el contexto
    const context = useContext(CitasContext);
    if (!context) return null;
    
    // Extraemos setCitaEditando para controlar el modal de edición
    const { citas, actualizarCita, setCitaEditando } = context;

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

    // Mapeo necesario para mantener compatibilidad con tu TablaCitas:
    const handleCambiarEstado = (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => {
        const cita = citas.find(c => c.idCita === id);
        if (cita) actualizarCita({ ...cita, estado: nuevoEstado });
    };

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
                onCambiarEstado={handleCambiarEstado}
                // AQUÍ CONECTAMOS LA EDICIÓN: al hacer clic, guardamos la cita en el contexto
                onEditar={(cita) => setCitaEditando(cita)}
                onVerDetalles={(cita) => console.log(cita)}            />
        </div>
    );
};