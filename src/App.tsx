import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FormularioCita } from './components/FormularioCita';
import { MisRegistros } from './components/MisRegistros'; 
import { type Cita } from './lib/tipos';
import './App.css'; 

import medicosData from './data/medicos.json';
import pacientesData from './data/pacientes.json';
import citasIniciales from './data/citas.json';

// -- COMPONENTE APP --
// Punto de entrada principal que orquestra la navegación, el estado global de las citas y la gestión de modales
function App() {
  // 1. Estado Reactivo: Carga inicial de datos crudos
  const [citasRaw, setCitasRaw] = useState<any[]>([]);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  // 2. Carga inicial: useEffect(fn, [])
  // Se ejecuta una sola vez al montar el componente para poblar el estado inicial
  useEffect(() => {
    setCitasRaw(citasIniciales);
  }, []);

  // 3. Valor derivado: useMemo(f, [x])
  // Calcula la unión de datos solo cuando citasRaw cambia, optimizando el rendimiento
  const citas = useMemo(() => {
    return citasRaw.map(c => ({
      ...c,
      medico: medicosData.find(m => m.idMedico === c.idMedico),
      paciente: pacientesData.find(p => p.idPaciente === c.idPaciente)
    })) as Cita[];
  }, [citasRaw]);

  // -- LÓGICA DE VALIDACIÓN: DÍAS HÁBILES --
  // Verifica si el día de la semana de la fecha seleccionada está entre los días disponibles del médico
  const esDiaValido = (fechaSeleccionada: string, cita: Cita) => {
    if (!cita.medico) return false;
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return cita.medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
  };

  // -- LÓGICA DE HORARIOS: DISPONIBILIDAD --
  // Filtra los horarios bloqueando los que ya tienen cita (Programada o Completada)
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

  // -- MANEJADORES DE ESTADO (CRUD) --
  const agregarCita = (nuevaCita: Cita) => setCitasRaw([...citasRaw, nuevaCita]);

  const actualizarEstado = (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => {
    setCitasRaw(citasRaw.map(c => c.idCita === id ? { ...c, estado: nuevoEstado } : c));
  };

  // -- LÓGICA DE EDICIÓN --
  const manejarEdicion = (cita: Cita) => setCitaEditando(cita);

  const guardarEdicion = () => {
    if (citaEditando) {
      if (!citaEditando.fecha || !citaEditando.hora) {
        alert("Por favor, seleccione una fecha y hora válidas.");
        return;
      }
      setCitasRaw(citasRaw.map(c => c.idCita === citaEditando.idCita ? citaEditando : c));
      setCitaEditando(null);
    }
  };

  // -- LÓGICA DE DETALLES --
  // Muestra ventana informativa con datos de la cita seleccionada
  const manejarVerDetalles = (cita: Cita) => {
    const paciente = cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : "No disponible";
    const ciudad = cita.medico?.ciudad || "No especificada";
    const hospital = cita.medico?.hospital || "No especificado";

    alert(
      `Detalles de la cita:\nPaciente: ${paciente}\nMédico: ${cita.medico?.nombre || "N/A"}\n` +
      `Especialidad: ${cita.medico?.especialidad || "N/A"}\nCiudad: ${ciudad}\n` +
      `Hospital: ${hospital}\nEstado: ${cita.estado}\nMotivo: ${cita.motivo}`
    );
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="contenido-principal">
          {/* -- RUTAS DE NAVEGACIÓN -- */}
          <Routes>
            <Route path="/" element={<h1>Bienvenido a Cardinova</h1>} />
            
            {/* -- COMPONENTE FORMULARIOCITA -- */}
            {/* Gestiona el proceso de agendamiento médico mediante un flujo de 3 pasos (Selección, Detalles y Datos del Paciente) */}
            <Route path="/agendamiento" element={
                <>
                    {/* Paso 1: Selección de Especialidad, Ciudad, Hospital y Médico */}
                    {/* Paso 2: Elección de fecha y hora basada en disponibilidad */}
                    {/* Paso 3: Ingreso de datos del paciente y motivo de consulta */}
                    <FormularioCita onGuardar={agregarCita} citas={citas} />
                </>
            } />
            
            <Route path="/mis-registros" element={
                <MisRegistros 
                    citas={citas} 
                    onCambiarEstado={actualizarEstado}
                    onEditar={manejarEdicion}
                    onVerDetalles={manejarVerDetalles}
                />
            } />
          </Routes>
          
          {/* -- MODAL DE EDICIÓN -- */}
          {citaEditando && (
            <div className="modal-overlay">
              <div className="modal-contenido">
                <h3>Editar Cita</h3>
                {/* Aviso de días de atención */}
                <div className="aviso-dias">
                  El médico atiende: <strong>{citaEditando.medico?.diasDisponibles.join(", ")}</strong>
                </div>
                {/* Selector de fecha */}
                <div className="grupo-selector">
                    <label htmlFor="editFecha">Fecha:</label>
                    <input id="editFecha" type="date" value={citaEditando.fecha} 
                        onChange={(e) => {
                            const nuevaFecha = e.target.value;
                            if (esDiaValido(nuevaFecha, citaEditando)) {
                                setCitaEditando({...citaEditando, fecha: nuevaFecha, hora: ''});
                            } else {
                                alert("Día no válido para este médico.");
                            }
                        }} />
                </div>

                {/* Selector de hora */}
                <div className="grupo-selector">
                    <label htmlFor="editHora">Hora:</label>
                    <select id="editHora" value={citaEditando.hora} 
                        onChange={(e) => setCitaEditando({...citaEditando, hora: e.target.value})}>
                        <option value="">Seleccione una hora</option>
                        {getHorariosDisponibles(citaEditando).map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                {/* Botones de acción del modal */}
                <div className="contenedor-botones">
                    <button type="button" className="boton-registro" onClick={guardarEdicion}>Guardar Cambios</button>
                    <button type="button" className="boton-registro" onClick={() => setCitaEditando(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;