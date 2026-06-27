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

  const agregarCita = (nuevaCita: Cita) => {
    setCitas([...citas, nuevaCita]);
  };

  const eliminarCita = (id: string) => {
    setCitas(citas.filter(c => c.idCita !== id));
  };

  const actualizarFecha = (id: string, nuevaFecha: string) => {
    setCitas(citas.map(c => c.idCita === id ? { ...c, fecha: nuevaFecha } : c));
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
                    onEliminar={eliminarCita} 
                    onEditarFecha={actualizarFecha} 
                />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;