import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { CitasProvider } from './context/CitasContext'; 
import { AuthProvider } from './context/AuthContext';
import { AppContent } from './AppContent';
import './App.css'; 

// -- COMPONENTE APP --
// Punto de entrada de la arquitectura: configura los proveedores de estado global,
// el sistema de navegación y la estructura general (Layout) que envuelve a la aplicación.
function App() {
  return (
    // Proveedor de Autenticación: gestiona el estado de sesión global
    <AuthProvider>
      {/* Proveedor del contexto: inyecta el estado global (citas, médicos) a toda la aplicación */}
      <CitasProvider>
        {/* Router: gestiona el historial de navegación y la sincronización de URLs */}
        <Router>
          <div className="app-container">
            
            {/* Header/Navegación: elemento estructural externo a las rutas */}
            <Navbar />
            
            {/* Contenido Principal: donde se renderizan las rutas dinámicas y la lógica de negocio */}
            <main className="contenido-principal">
              <AppContent />
            </main>
            
            {/* Footer: elemento estructural inferior fijo */}
            <Footer />
            
          </div>
        </Router>
      </CitasProvider>
    </AuthProvider>
  );
}

export default App;