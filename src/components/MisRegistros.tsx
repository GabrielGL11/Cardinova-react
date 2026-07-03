import { useState, useContext } from 'react';
import { TablaCitas } from './TablaCitas';
import { CitasContext } from './CitasContext'; 

// -- COMPONENTE MISREGISTROS --
// Gestiona la visualización del historial de citas, proporcionando herramientas de filtrado por especialidad
// y la conexión con el estado global para la edición de registros.
export const MisRegistros = () => {
    // Suscripción al estado global para acceder a la lista de citas y funciones de gestión
    const context = useContext(CitasContext);
    if (!context) return null;
    
    // Extracción de las dependencias necesarias del contexto
    const { citas, actualizarCita, setCitaEditando } = context;

    // Estado local para manejar el criterio de filtrado aplicado sobre el conjunto de citas
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todos");

    // Extracción dinámica de especialidades únicas para poblar el selector de filtros
    const especialidades = [
        "Todos", 
        ...Array.from(new Set(citas.map(c => c.medico?.especialidad).filter(Boolean)))
    ];

    // Lógica de filtrado: calcula el subconjunto de citas a renderizar según el estado del filtro
    const citasFiltradas = filtroEspecialidad === "Todos" 
        ? citas 
        : citas.filter(c => c.medico?.especialidad === filtroEspecialidad);

    // Handler para delegar la actualización de estados al contexto global (manteniendo la integridad de los datos)
    const handleCambiarEstado = (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => {
        const cita = citas.find(c => c.idCita === id);
        if (cita) actualizarCita({ ...cita, estado: nuevoEstado });
    };

    return (
        <div className="contenedor-registros">
            <h2>Mis Registros</h2>
            
            {/* Sección de filtros: control para restringir la vista por especialidad médica */}
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

            {/* TablaCitas: componente presentacional que renderiza las instancias filtradas */}
            <TablaCitas 
                citas={citasFiltradas} 
                onCambiarEstado={handleCambiarEstado}
                // Conexión con el flujo de edición: inyecta la cita seleccionada al contexto de edición global
                onEditar={(cita) => setCitaEditando(cita)}
                onVerDetalles={(cita) => console.log(cita)}            
            />
        </div>
    );
};