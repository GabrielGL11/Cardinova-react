import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// -- COMPONENTE RAIZ (ENTRY POINT) --
// Este archivo es el responsable de montar la aplicación en el DOM.
// Se mantiene como una capa pura que inicializa la jerarquía de componentes.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)