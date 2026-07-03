import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CitasContext, CitasProvider } from './components/CitasContext'; 
import { FormularioCita } from './components/FormularioCita';
import { MisRegistros } from './components/MisRegistros'; 
import DetalleCita from './components/DetalleCita';
import { type Cita } from './lib/tipos';
import './App.css'; 

// -- COMPONENTE APPCONTENT --
// Actúa como el consumidor principal del contexto y orquestador de las vistas, 
// gestionando la lógica de negocio transversal como la disponibilidad horaria y edición de registros.
function AppContent() {
  const context = useContext(CitasContext);
  if (!context) return null;
  const { citas, agregarCita, actualizarCita, citaEditando, setCitaEditando } = context;

  // -- LÓGICA DE VALIDACIÓN: DÍAS HÁBILES --
  // Verifica si la fecha seleccionada cae dentro de los días de atención configurados para el médico asignado
  const esDiaValido = (fechaSeleccionada: string, cita: Cita) => {
    if (!cita.medico) return false;
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return cita.medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
  };

  // -- LÓGICA DE HORARIOS: DISPONIBILIDAD --
  // Filtra el catálogo de horas del médico, excluyendo aquellas ya ocupadas por citas activas en el estado global
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
        alert("Por favor, seleccione una fecha y hora válidas.");
        return;
      }
      actualizarCita(citaEditando);
      setCitaEditando(null);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="contenido-principal">
        {/* Definición de rutas de navegación: vincula paths URL con componentes específicos */}
        <Routes>
          <Route path="/" element={<h1>Bienvenido a Cardinova</h1>} />
          <Route path="/agendamiento" element={<FormularioCita onGuardar={agregarCita} citas={citas} />} />
          <Route path="/mis-registros/:id" element={<DetalleCita />} />
          <Route path="/mis-registros" element={<MisRegistros />} />
        </Routes>
        
        {/* Modal de edición: renderizado condicional cuando se activa la edición de una cita existente */}
        {citaEditando && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h3>Editar Cita</h3>
              
              <div className="aviso-dias">
                El médico atiende: <strong>{citaEditando.medico?.diasDisponibles.join(", ")}</strong>
              </div>

              <div className="grupo-selector">
                {/* Agregamos htmlFor que coincida con el id del input */}
                <label htmlFor="fechaCita">Fecha:</label>
                <input id="fechaCita" type="date" value={citaEditando.fecha} onChange={(e) => {
                  const nuevaFecha = e.target.value;
                  if (esDiaValido(nuevaFecha, citaEditando)) {
                    setCitaEditando({...citaEditando, fecha: nuevaFecha, hora: ''});
                  } else {
                    alert("Día no válido para este médico.");
                  }
                }} />
              </div>

              <div className="grupo-selector">
                {/* Agregamos htmlFor que coincida con el id del select */}
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
      </main>
      <Footer />
    </div>
  );
}

// -- COMPONENTE APP --
// Punto de entrada de la aplicación: envuelve el árbol de componentes con el Provider y el Router
function App() {
  return (
    <CitasProvider>
      <Router>
        <AppContent />
      </Router>
    </CitasProvider>
  );
}

export default App;