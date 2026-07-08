import { type Paciente } from '../../lib/tipos';
import pacientesData from '../../data/pacientes.json';

import { toast } from 'sonner';

interface PropsPasoDatos {
    paciente: Paciente;
    setPaciente: React.Dispatch<React.SetStateAction<Paciente>>;
    onAtras: () => void;
    onGuardar: () => void;
}

/**
 * COMPONENTE PASO 3: PASODATOSPACIENTE
 * Búsqueda de paciente: verifica registros existentes o inicializa un nuevo objeto con un ID temporal.
 * Captura de datos personales y confirmación final de la cita.
 */
export const PasoDatosPaciente = ({ paciente, setPaciente, onAtras, onGuardar }: PropsPasoDatos) => {

    const handleActualizarCedula = (cedula: string) => {
        setPaciente(prev => ({ ...prev, cedula }));
    };

    // Nueva función para disparar la búsqueda al terminar de escribir (evento onBlur)
    const buscarPaciente = () => {
        if (!paciente.cedula) return;
        const encontrado = pacientesData.find(p => p.cedula === paciente.cedula);
        if (encontrado) {
            setPaciente({ ...encontrado });
            toast.success("Paciente encontrado");
        } else {
            setPaciente(prev => ({ ...prev, idPaciente: Date.now().toString(), nombre: '', apellido: '' }));
            toast.info("Nuevo paciente");
        }
    };

    return (
        <>
            <h3>Datos del Paciente</h3>
            <input 
                type="text" 
                placeholder="Cédula" 
                value={paciente.cedula} 
                onChange={(e) => handleActualizarCedula(e.target.value)} 
                onBlur={buscarPaciente} 
                required
            />
            <input 
                type="text" 
                placeholder="Nombre" 
                value={paciente.nombre} 
                onChange={(e) => setPaciente({...paciente, nombre: e.target.value})} 
                required 
            />
            <input 
                type="text" 
                placeholder="Apellido" 
                value={paciente.apellido} 
                onChange={(e) => setPaciente({...paciente, apellido: e.target.value})} 
                required 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={paciente.email} 
                onChange={(e) => setPaciente({...paciente, email: e.target.value})} 
                required
            />
            <input 
                type="tel" 
                placeholder="Teléfono" 
                value={paciente.telefono} 
                onChange={(e) => setPaciente({...paciente, telefono: e.target.value})} 
                required
            />
            
            <div className="grupo-botones">
                <button type="button" className="boton-volver" onClick={onAtras}>Atrás</button>
                <button type="button" className="boton-registro" onClick={onGuardar}>Finalizar Registro</button>
            </div>
        </>
    );
};