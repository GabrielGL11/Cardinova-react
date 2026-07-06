import { createContext, useState, type ReactNode, useMemo } from 'react';
import citasIniciales from '../data/citas.json';
import medicosData from '../data/medicos.json';
import pacientesData from '../data/pacientes.json';
import { type Cita } from '../lib/tipos';

interface CitasContextType {
    citas: Cita[];
    agregarCita: (nuevaCita: Cita) => void;
    actualizarCita: (citaActualizada: Cita) => void;
    citaEditando: Cita | null;
    setCitaEditando: (cita: Cita | null) => void;
}

export const CitasContext = createContext<CitasContextType | undefined>(undefined);

// -- COMPONENTE CITASPROVIDER --
// Gestiona el estado global de las citas, integrando datos de pacientes y médicos mediante una capa de procesamiento en memoria
export const CitasProvider = ({ children }: { children: ReactNode }) => {
    // Inicializamos el estado leyendo desde localStorage. Si no hay nada guardado, usamos citasIniciales
    const [citasRaw, setCitasRaw] = useState<any[]>(() => {
        const guardadas = localStorage.getItem('citas_agendadas');
        return guardadas ? JSON.parse(guardadas) : citasIniciales;
    });
    
    const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

    // Procesa las citas crudas para poblar objetos relacionados (médico y paciente) garantizando integridad de datos
    const citas = useMemo(() => {
        return citasRaw.map(c => ({
            ...c,
            // Vincula el objeto médico completo para facilitar el acceso en la UI
            medico: medicosData.find(m => m.idMedico === c.idMedico),
            // Lógica: busca en pacientesData, si no existe, construye el objeto desde los campos de la cita (persistencia dinámica)
            paciente: pacientesData.find(p => p.idPaciente === c.idPaciente) ||
                        (c.nombrePaciente ? { 
                            idPaciente: c.idPaciente, 
                            nombre: c.nombrePaciente,
                            apellido: c.apellidoPaciente || '' 
                        } : undefined)
        })) as Cita[];
    }, [citasRaw]);

    // Registra una nueva cita en el estado crudo y actualiza localStorage para persistencia
    const agregarCita = (nuevaCita: Cita) => {
        const nuevasCitas = [...citasRaw, nuevaCita];
        setCitasRaw(nuevasCitas);
        localStorage.setItem('citas_agendadas', JSON.stringify(nuevasCitas));
    };
    
    // Actualiza una cita existente y sincroniza con localStorage
    const actualizarCita = (citaActualizada: Cita) => {
        const nuevasCitas = citasRaw.map(c => c.idCita === citaActualizada.idCita ? citaActualizada : c);
        setCitasRaw(nuevasCitas);
        localStorage.setItem('citas_agendadas', JSON.stringify(nuevasCitas));
    };

    return (
        <CitasContext.Provider value={{ citas, agregarCita, actualizarCita, citaEditando, setCitaEditando }}>
            {children}
        </CitasContext.Provider>
    );
};