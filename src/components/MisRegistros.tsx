import { useState, useContext } from 'react';
import { TablaCitas } from './TablaCitas';
import { CitasContext } from '../context/CitasContext'; 
import { useAuth, type UserData } from '../context/AuthContext'; 
import medicos from '../data/medicos.json';
import '../styles/TablaCitas.css';

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
    // Nuevo estado local para el filtrado por día de atención (exclusivo para médicos)
    const [filtroDia, setFiltroDia] = useState("Todos");

    // Buscamos al médico actual en el JSON para obtener sus días de disponibilidad
    const medicoLogueado = medicos.find((m) => String(m.cedula).trim() === String(usuarioActual?.cedula).trim());

    // Lógica de filtrado Estricta:
    // 1. Médicos ven: Sus propias citas (por ID) O citas antiguas (sin idMedico claro o para todos).
    // 2. Pacientes ven ÚNICAMENTE citas donde el 'creadoPor' coincida con su ID.
    const citasUsuario = citas.filter((cita) => {
        if (!usuarioActual) return false;

        // Si el usuario es médico:
        if (userRole === 'medico') {
            // Permitimos ver si la cita no tiene médico asignado o si el id coincide
            const esCitaPropia = String(cita.idMedico).trim() === String(medicoLogueado?.idMedico).trim();
            const esCitaSinMedico = !cita.idMedico;
            
            return esCitaPropia || esCitaSinMedico;
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

    // Lógica avanzada de filtrado: 
    // - Paciente: Filtra por especialidad.
    // - Médico: Filtra por el día de la semana de la cita (usando índices para evitar errores de idioma).
    const diaAMap: { [key: string]: number } = { 
        'lunes': 1, 'martes': 2, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sabado': 6, 'domingo': 0 
    };

    const citasFiltradas = citasUsuario.filter((c) => {
        if (userRole === 'paciente') {
            return filtroEspecialidad === "Todos" || c.medico?.especialidad === filtroEspecialidad;
        }
        if (userRole === 'medico' && filtroDia !== "Todos") {
            const fechaObj = new Date(c.fecha);
            // Usamos getUTCDay para evitar desplazamientos por zona horaria
            const diaSemanaCita = fechaObj.getUTCDay(); 
            const diaSeleccionadoIndex = diaAMap[filtroDia.toLowerCase()];
            return diaSemanaCita === diaSeleccionadoIndex;
        }
        return true;
    });

    // -- LÓGICA DE ORDENAMIENTO POR FECHA --
    // Ordena las citas de forma cronológica (ascendente: de la más antigua a la más reciente)
    // Se utiliza el spread operator [...citasFiltradas] para no modificar el array original y cumplir con la inmutabilidad de React.
    const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

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
            
            {/* Sección de filtros dinámica según el rol */}
            <div className="filtro-container">
                {userRole === 'medico' ? (
                    <>
                        <div className="aviso-disponibilidad">
                            El médico atiende: <strong>{medicoLogueado?.diasDisponibles?.join(", ")}</strong>
                        </div>
                        <label htmlFor="filtroDia">Filtrar por día: </label>
                        <select id="filtroDia" value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}>
                            <option value="Todos">Todos</option>
                            {medicoLogueado?.diasDisponibles?.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <label htmlFor="filtroEspecialidad">Filtrar por Especialidad: </label>
                        <select id="filtroEspecialidad" value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)}>
                            {especialidades.map(esp => (<option key={esp} value={esp}>{esp}</option>))}
                        </select>
                    </>
                )}
            </div>

            {/* TablaCitas: componente presentacional que renderiza las instancias filtradas y ordenadas */}
            <TablaCitas 
                citas={citasOrdenadas} 
                onCambiarEstado={handleCambiarEstado}
                // Conexión con el flujo de edición: inyecta la cita seleccionada al contexto de edición global
                onEditar={(cita) => setCitaEditando(cita)}
                onVerDetalles={(cita) => console.log(cita)}            
            />
        </div>
    );
};