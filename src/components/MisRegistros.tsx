import { useState, useContext } from 'react';
import { TablaCitas } from './TablaCitas';
import { CitasContext } from '../context/CitasContext'; 
import { useAuth, type UserData } from '../context/AuthContext'; // Importamos el hook de autenticación
import medicos from '../data/medicos.json';

// -- COMPONENTE MISREGISTROS --
// Gestiona la visualización del historial de citas, proporcionando herramientas de filtrado por especialidad
// y la conexión con el estado global para la edición de registros.
export const MisRegistros = () => {
    // Suscripción al estado global para acceder a la lista de citas y funciones de gestión
    const context = useContext(CitasContext);
    const { userData, userRole } = useAuth(); // Obtenemos el usuario y rol actual
    const usuarioActual: UserData | null = userData;

    if (!context) return null;
    
    // Extracción de las dependencias necesarias del contexto
    const { citas, actualizarCita, setCitaEditando } = context;

    // Estado local para manejar el criterio de filtrado aplicado sobre el conjunto de citas
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todos");

    // Lógica de filtrado Estricta:
    // 1. Médicos ven todo el historial.
    // 2. Pacientes ven ÚNICAMENTE citas donde el 'creadoPor' coincida con su ID.
    const citasUsuario = citas.filter((cita) => {
        if (!usuarioActual) return false;
        // Si el usuario es médico, ve todo el listado sin restricciones
        if (userRole === 'medico') {
            // Buscamos al médico en tu JSON de médicos usando la cédula
            const medicoLogueado = medicos.find((m) => String(m.cedula).trim() === String(usuarioActual?.cedula).trim());
            
            if (medicoLogueado) {
                return String(cita.idMedico).trim() === String(medicoLogueado.idMedico).trim();
            }
            
            return false; // Si no hay coincidencia, no muestra la cita
        }
        
        // Si el usuario es paciente:
        if (userRole === 'paciente') {
            // OPCIÓN A: Si la cita NO tiene creadoPor (son las 5 antiguas del JSON), 
            // las dejamos pasar para que todos las vean.
            if (!cita.creadoPor) return true;
            // OPCIÓN B: Si la cita SÍ tiene creadoPor, aplicamos la restricción estricta
            return cita.creadoPor === userData?.id;
        }
        
        return false;
    });

    const citasFiltradas = filtroEspecialidad === "Todos" 
        ? citasUsuario 
        : citasUsuario.filter(c => c.medico?.especialidad === filtroEspecialidad);

    // Extracción dinámica de especialidades únicas para poblar el selector de filtros
    const especialidades = [
        "Todos", 
        ...Array.from(new Set(citasUsuario.map(c => c.medico?.especialidad).filter(Boolean)))
    ];

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