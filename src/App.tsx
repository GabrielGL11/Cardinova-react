import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FormularioCita } from './components/FormularioCita';
import { MisRegistros } from './components/MisRegistros'; 
import { type Cita } from './lib/tipos';
import './App.css'; 

function App() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  const agregarCita = (nuevaCita: Cita) => {
    setCitas([...citas, nuevaCita]);
  };

  const actualizarEstado = (id: string, nuevoEstado: 'Programada' | 'Cancelada' | 'Completada') => {
    setCitas(citas.map(c => c.idCita === id ? { ...c, estado: nuevoEstado } : c));
  };

  const manejarEdicion = (cita: Cita) => {
    setCitaEditando(cita);
  };

  const guardarEdicion = () => {
    if (citaEditando) {
      setCitas(citas.map(c => c.idCita === citaEditando.idCita ? citaEditando : c));
      setCitaEditando(null);
    }
  };

  const manejarVerDetalles = (cita: Cita) => {
    const nombrePaciente = cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : "No disponible";
    const nombreMedico = cita.medico?.nombre || "No disponible";
    const especialidad = cita.medico?.especialidad || "No disponible";
    const hospital = cita.medico?.hospital || "No disponible";

    alert(`Detalles de la cita:\nPaciente: ${nombrePaciente}\nMédico: ${nombreMedico}\nEspecialidad: ${especialidad}\nHospital: ${hospital}\nMotivo: ${cita.motivo}`);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<h1>Bienvenido a Cardinova</h1>} />
            <Route path="/agendamiento" element={<FormularioCita onGuardar={agregarCita} />} />
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
                <p>Paciente: {citaEditando.paciente?.nombre} {citaEditando.paciente?.apellido}</p>
                
                <div className="grupo-selector">
                    <label htmlFor="editFecha">Fecha:</label>
                    <input id="editFecha" type="date" value={citaEditando.fecha} onChange={(e) => setCitaEditando({...citaEditando, fecha: e.target.value})} />
                </div>
                
                <div className="grupo-selector">
                    <label htmlFor="editHora">Hora:</label>
                    <input id="editHora" type="time" value={citaEditando.hora} onChange={(e) => setCitaEditando({...citaEditando, hora: e.target.value})} />
                </div>

                <div className="contenedor-botones">
                    <button className="boton-registro" onClick={guardarEdicion}>Guardar Cambios</button>
                    <button className="boton-registro" onClick={() => setCitaEditando(null)}>Cancelar</button>
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