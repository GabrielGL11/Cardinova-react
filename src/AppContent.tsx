import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner'; 
import { CitasContext } from './context/CitasContext'; 
import { useAuth } from './context/AuthContext';
import { FormularioCita } from './components/FormularioCita';
import { MisRegistros } from './components/MisRegistros'; 
import DetalleCita from './components/DetalleCita';
import { type Cita } from './lib/tipos';
import { Home } from './layout/Home';
import { Login } from './layout/Login';
import { RegistroPaciente } from './layout/RegistroPaciente';

// -- COMPONENTE APPCONTENT --
// Actúa como el consumidor principal del contexto y orquestador de las vistas, 
// gestionando la lógica de negocio transversal como la disponibilidad horaria y edición de registros.
export function AppContent() {
    const context = useContext(CitasContext);
    const { isLoggedIn, userRole, userData } = useAuth(); // Consumo del estado global de autenticación
    
    if (!context) return null;
    const { citas, agregarCita, actualizarCita, citaEditando, setCitaEditando } = context;

    // -- LÓGICA DE VALIDACIÓN: DÍAS HÁBILES --
    const esDiaValido = (fechaSeleccionada: string, cita: Cita) => {
        if (!cita.medico) return false;
        const [year, month, day] = fechaSeleccionada.split('-').map(Number);
        const fechaObj = new Date(year, month - 1, day);
        const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return cita.medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
    };

    // -- LÓGICA DE HORARIOS: DISPONIBILIDAD --
    const getHorariosDisponibles = (cita: Cita) => {
        if (!cita.medico) return [];
        return cita.medico.horarios.filter(h => 
        !citas.some(c => 
            c.idMedico === cita.idMedico && 
            c.fecha === cita.fecha && 
            c.hora === h && 
            c.idCita !== cita.idCita &&
            (c.estado === 'Programada' || c.estado === 'Completada')
            )
        );
    };

    // Ejecuta la persistencia de cambios en el estado global tras validar los campos de la cita en edición
    const guardarEdicion = () => {
        if (citaEditando) {
            if (!citaEditando.fecha || !citaEditando.hora) {
                toast.warning("Atención", { description: "Por favor, seleccione una fecha y hora válidas." });
                return;
            }
            actualizarCita(citaEditando);
            setCitaEditando(null);
            toast.success("Éxito", { description: "Cita actualizada correctamente." });
        }
    };

    return (
        <>
            <Toaster richColors position="top-right" />

            {/* RUTAS DE NAVEGACIÓN: Sistema de rutas jerárquico y protegido según el rol de usuario */}
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<RegistroPaciente />} />

                {/* Rutas Protegidas - PACIENTE */}
                <Route 
                    path="/paciente/agendamiento" 
                    element={isLoggedIn && userRole === 'paciente' ? <FormularioCita onGuardar={agregarCita} citas={citas} usuarioActual={userData}/> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/paciente/mis-registros" 
                    element={isLoggedIn && userRole === 'paciente' ? <MisRegistros /> : <Navigate to="/login" />} 
                />
                {/* RUTA PACIENTE DETALLE */}
                <Route 
                    path="/paciente/mis-registros/:id" 
                    element={isLoggedIn && userRole === 'paciente' ? <DetalleCita /> : <Navigate to="/login" />} 
                />

                {/* Rutas Protegidas - MÉDICO */}
                <Route 
                    path="/medico/mis-registros"
                    element={isLoggedIn && userRole === 'medico' ? <MisRegistros /> : <Navigate to="/login" />}
                />
                {/* RUTA MÉDICO DETALLE */}
                <Route
                    path="/medico/mis-registros/:id"
                    element={isLoggedIn && userRole === 'medico' ? <DetalleCita /> : <Navigate to="/login" />}
                />
            </Routes>
            
            {/* Modal de edición */}
            {citaEditando && (
                <div className="modal-overlay">
                    <div className="modal-contenido">
                        <h3>Editar Cita</h3>
                        
                        <div className="aviso-dias">
                            El médico atiende: <strong>{citaEditando.medico?.diasDisponibles.join(", ")}</strong>
                        </div>

                        <div className="grupo-selector">
                            <label htmlFor="fechaCita">Fecha:</label>
                            <input id="fechaCita" type="date" value={citaEditando.fecha} onChange={(e) => {
                                const nuevaFecha = e.target.value;
                                if (esDiaValido(nuevaFecha, citaEditando)) {
                                    setCitaEditando({...citaEditando, fecha: nuevaFecha, hora: ''});
                                } else {
                                    toast.error("Fecha no válida", { description: "El día seleccionado no es válido para este médico." });
                                }
                            }} />
                        </div>

                        <div className="grupo-selector">
                            <label htmlFor="horaCita">Hora:</label>
                            <select id="horaCita" value={citaEditando.hora} onChange={(e) => setCitaEditando({...citaEditando, hora: e.target.value})}>
                                <option value="">Seleccione una hora</option>
                                {getHorariosDisponibles(citaEditando).map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>

                        <div className="contenedor-botones">
                            <button type="button" className="boton-registro" onClick={guardarEdicion}>Guardar Cambios</button>
                            <button type="button" className="boton-registro" onClick={() => setCitaEditando(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}