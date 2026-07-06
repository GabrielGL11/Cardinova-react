import { useState } from 'react';
import { toast } from 'sonner'; 
import { type Medico, type Cita, type Paciente } from '../lib/tipos';
import { obtenerMedicosFiltrados } from '../lib/utilidades';
import '../styles/FormularioCita.css';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserData } from '../context/AuthContext'; 

// Importación de los componentes modulares
import { PasoFiltroMedico } from './FormularioCita/PasoFiltroMedico';
import { PasoDetallesCita } from './FormularioCita/PasoDetallesCita';
import { PasoDatosPaciente } from './FormularioCita/PasoDatosPaciente';

interface PropsFormulario {
    onGuardar: (cita: Cita) => void;
    citas: Cita[];
    usuarioActual: UserData | null;
}

// -- COMPONENTE FORMULARIOCITA --
export const FormularioCita = ({ onGuardar, citas, usuarioActual }: PropsFormulario) => {
    const navigate = useNavigate();
    const { userRole } = useAuth();
    
    const [esp, setEsp] = useState('');
    const [ciu, setCiu] = useState('');
    const [hosp, setHosp] = useState('');
    const [medico, setMedico] = useState<Medico | null>(null);
    const [paso, setPaso] = useState(1);

    const [motivosSeleccionados, setMotivosSeleccionados] = useState<string[]>([]);
    const [esOtrosActivo, setEsOtrosActivo] = useState(false);
    const [motivoOtros, setMotivoOtros] = useState('');
    
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoAtencion, setTipoAtencion] = useState<'Presencial' | 'Virtual'>('Presencial');
    const [paciente, setPaciente] = useState<Paciente>({
        idPaciente: '', cedula: '', nombre: '', apellido: '', email: '', telefono: ''
    });

    const medicosDisponibles = obtenerMedicosFiltrados(esp, ciu, hosp);

    const esDiaValido = (fechaSeleccionada: string) => {
        if (!medico) return false;
        const [year, month, day] = fechaSeleccionada.split('-').map(Number);
        const fechaObj = new Date(year, month - 1, day);
        const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const normalizar = (texto: string) => 
            texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
    };

    const horariosDisponibles = medico?.horarios.filter(h => 
        !citas.some(c => c.idMedico === medico.idMedico && c.fecha === fecha && c.hora === h && c.estado !== 'Cancelada')
    ) || [];

    const handleGuardar = () => {
        if (!paciente.cedula) { toast.error("Error", { description: "La cédula es obligatoria." }); return; }
        
        const emailValido = paciente.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paciente.email);
        const telefonoValido = paciente.telefono === '' || /^\d{10}$/.test(paciente.telefono);
        
        if (!emailValido) { toast.error("Error", { description: "Email no válido." }); return; }
        if (!telefonoValido) { toast.error("Error", { description: "El teléfono debe tener 10 dígitos." }); return; }
        if (paciente.email === '' && paciente.telefono === '') { toast.warning("Atención", { description: "Ingrese email o teléfono." }); return; }
        if (!paciente.nombre || !paciente.apellido) { toast.error("Error", { description: "El nombre y apellido del paciente son obligatorios." }); return; }
        
        if (motivosSeleccionados.length === 0 && (!esOtrosActivo || !motivoOtros)) { 
            toast.error("Error", { description: "Seleccione un motivo o especifique en Otros." }); return; 
        }
        if (userRole === 'paciente' && !usuarioActual?.id) {
            toast.error("Error de sesión", { description: "No se pudo identificar tu usuario." });
            return;
        }

        const citaDuplicada = citas.some(c => 
            c.idMedico === medico?.idMedico && 
            c.fecha === fecha && 
            c.hora === hora && 
            c.estado !== 'Cancelada'
        );

        if (citaDuplicada) {
            toast.error("Error", { description: "¡Ese horario ya fue reservado!" });
            return;
        }

        if (medico && fecha && hora) {
            const motivoFinal = esOtrosActivo ? `Otros: ${motivoOtros}` : motivosSeleccionados.join(", ");
            
            onGuardar({ 
                idCita: Date.now().toString(), 
                idMedico: medico.idMedico, 
                idPaciente: paciente.idPaciente, 
                fecha, 
                hora, 
                motivo: motivoFinal, 
                tipoAtencion, 
                estado: 'Programada', 
                medico, 
                paciente, 
                nombrePaciente: paciente.nombre, 
                apellidoPaciente: paciente.apellido, 
                creadoPor: usuarioActual?.id 
            });
            
            toast.success("Éxito", { description: "Cita registrada correctamente." });

            // Resetear todos los estados
            setPaso(1);
            setMotivosSeleccionados([]);
            setEsOtrosActivo(false);
            setMotivoOtros('');
            setFecha('');
            setHora('');
            setMedico(null);
            setPaciente({ idPaciente: '', cedula: '', nombre: '', apellido: '', email: '', telefono: '' });
            setEsp(''); setCiu(''); setHosp('');
            
            if (userRole === 'medico') navigate('/medico/mis-registros');
            else navigate('/paciente/mis-registros');
        } else {
            toast.warning("Atención", { description: "Complete todos los campos obligatorios." });
        }
    };

    return (
        <div className="contenedor-formulario">
            <h1>Agendamiento Médico</h1>
            
            {paso === 1 && (
                <PasoFiltroMedico 
                    esp={esp} setEsp={setEsp} ciu={ciu} setCiu={setCiu} hosp={hosp} setHosp={setHosp}
                    medico={medico} setMedico={setMedico} medicosDisponibles={medicosDisponibles}
                    onContinuar={() => setPaso(2)}
                />
            )}

            {paso === 2 && (
                <PasoDetallesCita 
                    medico={medico} fecha={fecha} setFecha={setFecha} hora={hora} setHora={setHora}
                    motivosSeleccionados={motivosSeleccionados} setMotivosSeleccionados={setMotivosSeleccionados}
                    esOtrosActivo={esOtrosActivo} setEsOtrosActivo={setEsOtrosActivo}
                    motivoOtros={motivoOtros} setMotivoOtros={setMotivoOtros}
                    tipoAtencion={tipoAtencion} setTipoAtencion={setTipoAtencion}
                    horariosDisponibles={horariosDisponibles} esDiaValido={esDiaValido}
                    onAtras={() => setPaso(1)} onContinuar={() => setPaso(3)}
                />
            )}
            
            {paso === 3 && (
                <PasoDatosPaciente 
                    paciente={paciente} setPaciente={setPaciente}
                    onAtras={() => setPaso(2)} onGuardar={handleGuardar}
                />
            )}
        </div>
    );
};