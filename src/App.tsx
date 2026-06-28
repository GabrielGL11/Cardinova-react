import { useState } from 'react';
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

function App() {
  const [citas, setCitas] = useState<Cita[]>(() => {
    return (citasIniciales as any[]).map(c => ({
      ...c,
      medico: medicosData.find(m => m.idMedico === c.idMedico),
      paciente: pacientesData.find(p => p.idPaciente === c.idPaciente)
    })) as Cita[];
  });

  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  const esDiaValido = (fechaSeleccionada: string, cita: Cita) => {
    if (!cita.medico) return false;
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return cita.medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
  };

  const getHorariosDisponibles = (cita: Cita) => {
    if (!cita.medico) return [];
    return cita.medico.horarios.filter(h => 
      !citas.some(c => 
        c.idMedico === cita.idMedico && 
        c.fecha === cita.fecha && 
        c.hora === h && 
        c.idCita !== cita.idCita &&
        c.estado === 'Programada'
      )
    );
  };

  const agregarCita = (nuevaCita: Cita) => setCitas([...citas, nuevaCita]);

  const actualizarEstado = (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => {
    setCitas(citas.map(c => c.idCita === id ? { ...c, estado: nuevoEstado } : c));
  };

  const manejarEdicion = (cita: Cita) => setCitaEditando(cita);

  const guardarEdicion = () => {
    if (citaEditando) {
      setCitas(citas.map(c => c.idCita === citaEditando.idCita ? citaEditando : c));
      setCitaEditando(null);
    }
  };

  const manejarVerDetalles = (cita: Cita) => {
    const paciente = cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : "No disponible";
    const ciudad = cita.medico?.ciudad || "No especificada";
    const hospital = cita.medico?.hospital || "No especificado";

    alert(
      `Detalles de la cita:\n` +
      `Paciente: ${paciente}\n` +
      `Médico: ${cita.medico?.nombre || "N/A"}\n` +
      `Especialidad: ${cita.medico?.especialidad || "N/A"}\n` +
      `Ciudad: ${ciudad}\n` +
      `Hospital: ${hospital}\n` +
      `Estado: ${cita.estado}\n` +
      `Motivo: ${cita.motivo}`
    );
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<h1>Bienvenido a Cardinova</h1>} />
            <Route path="/agendamiento" element={<FormularioCita onGuardar={agregarCita} citas={citas} />} />
            <Route path="/mis-registros" element={
                <MisRegistros 
                    citas={citas} 
                    onCambiarEstado={actualizarEstado}
                    onEditar={manejarEdicion}
                    onVerDetalles={manejarVerDetalles}
                />
            } />
          </Routes>
          
          {citaEditando && (
            <div className="modal-overlay">
              <div className="modal-contenido">
                <h3>Editar Cita</h3>
                
                <div className="grupo-selector">
                    <label htmlFor="editFecha">Fecha:</label>
                    <input 
                        id="editFecha"
                        type="date" 
                        value={citaEditando.fecha} 
                        onChange={(e) => {
                            if (esDiaValido(e.target.value, citaEditando)) {
                                setCitaEditando({...citaEditando, fecha: e.target.value});
                            } else {
                                alert("Día no válido para este médico.");
                            }
                        }} 
                    />
                </div>
                
                <div className="grupo-selector">
                    <label htmlFor="editHora">Hora:</label>
                    <select 
                        id="editHora"
                        value={citaEditando.hora} 
                        onChange={(e) => setCitaEditando({...citaEditando, hora: e.target.value})}
                    >
                        {getHorariosDisponibles(citaEditando).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>

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