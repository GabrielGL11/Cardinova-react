import { useState } from 'react';
import { type Medico, type Cita, type Paciente } from '../lib/tipos';
import { obtenerEspecialidades, obtenerCiudades, obtenerHospitales, obtenerMedicosFiltrados } from '../lib/utilidades';
import { SelectorPaso } from './SelectorPaso';
import { TarjetaMedico } from './TarjetaMedico';
import '../styles/FormularioCita.css';
import pacientesData from '../data/pacientes.json';

interface PropsFormulario {
    onGuardar: (cita: Cita) => void;
    citas: Cita[];
}

// -- COMPONENTE FORMULARIOCITA --
// Gestiona el proceso de agendamiento médico mediante un flujo de 3 pasos (Selección, Detalles y Datos del Paciente)
export const FormularioCita = ({ onGuardar, citas }: PropsFormulario) => {
    const [esp, setEsp] = useState('');
    const [ciu, setCiu] = useState('');
    const [hosp, setHosp] = useState('');
    const [medico, setMedico] = useState<Medico | null>(null);
    const [paso, setPaso] = useState(1);

    // Estados para los datos de la cita y el paciente
    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoAtencion, setTipoAtencion] = useState<'Presencial' | 'Virtual'>('Presencial');
    const [paciente, setPaciente] = useState<Paciente>({
        idPaciente: '', cedula: '', nombre: '', apellido: '', email: '', telefono: ''
    });

    // Obtiene la lista de médicos basándose en los filtros aplicados
    const medicosDisponibles = obtenerMedicosFiltrados(esp, ciu, hosp);

    // Valida si la fecha seleccionada corresponde a un día de atención del médico
    const esDiaValido = (fechaSeleccionada: string) => {
        if (!medico) return false;
        
        const [year, month, day] = fechaSeleccionada.split('-').map(Number);
        const fechaObj = new Date(year, month - 1, day);
        
        const dia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
        
        const normalizar = (texto: string) => 
            texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            
        return medico.diasDisponibles.some(d => normalizar(d) === normalizar(dia));
    };

    // Filtra los horarios que ya están ocupados por otras citas activas
    const horariosDisponibles = medico?.horarios.filter(h => 
        !citas.some(c => c.idMedico === medico.idMedico && c.fecha === fecha && c.hora === h && c.estado !== 'Cancelada')
    ) || [];

    // Busca si el paciente ya existe en los registros mediante su número de cédula
    const handleBuscarPaciente = (cedula: string) => {
        const encontrado = pacientesData.find(p => p.cedula === cedula);
        setPaciente(encontrado ? { ...encontrado } : { idPaciente: Date.now().toString(), cedula, nombre: '', apellido: '', email: '', telefono: '' });
    };

    // Valida datos, verifica duplicados y registra la nueva cita
    const handleGuardar = () => {
        if (!paciente.cedula) return alert("La cédula es obligatoria.");
        const emailValido = paciente.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paciente.email);
        const telefonoValido = paciente.telefono === '' || /^\d{10}$/.test(paciente.telefono);
        
        if (!emailValido) return alert("Email no válido.");
        if (!telefonoValido) return alert("El teléfono debe tener 10 dígitos.");
        if (paciente.email === '' && paciente.telefono === '') return alert("Ingrese email o teléfono.");
        if (!paciente.nombre || !paciente.apellido) return alert("El nombre y apellido del paciente son obligatorios.");

        const citaDuplicada = citas.find(c => 
            c.idMedico === medico?.idMedico && 
            c.fecha === fecha && 
            c.hora === hora && 
            c.estado !== 'Cancelada'
        );

        if (citaDuplicada) {
            alert("¡Error! Ya existe una cita programada para este médico en este horario.");
            return;
        }

        if (medico && fecha && hora) {
            onGuardar({ ... {idCita: Date.now().toString(), idMedico: medico.idMedico, idPaciente: paciente.idPaciente, fecha, hora, motivo, tipoAtencion, estado: 'Programada', medico, paciente, nombrePaciente: paciente.nombre, apellidoPaciente: paciente.apellido} });
            alert("Cita registrada con éxito");
            setPaso(1);
            setMotivo('');
            setFecha('');
            setHora('');
            setMedico(null);
            setPaciente({
                idPaciente: '',
                cedula: '',
                nombre: '',
                apellido: '',
                email: '',
                telefono: ''
            });
            setEsp('');
            setCiu('');
            setHosp('');
        } else {
            alert("Complete todos los campos obligatorios.");
        }
    };

    return (
        <div className="contenedor-formulario">
            <h1>Agendamiento Médico</h1>
            {/* Paso 1: Selección de Especialidad, Ciudad, Hospital y Médico */}
            {paso === 1 && (
                <>
                    <SelectorPaso label="Especialidad" opciones={obtenerEspecialidades()} valor={esp} onChange={(v) => { setEsp(v); setCiu(''); setHosp(''); setMedico(null); }} />
                    {esp && <SelectorPaso label="Ciudad" opciones={obtenerCiudades(esp)} valor={ciu} onChange={(v) => { setCiu(v); setHosp(''); setMedico(null); }} />}
                    {ciu && <SelectorPaso label="Hospital" opciones={obtenerHospitales(esp, ciu)} valor={hosp} onChange={(v) => { setHosp(v); setMedico(null); }} />}
                    {hosp && <SelectorPaso label="Médico" opciones={medicosDisponibles.map(m => m.nombre)} valor={medico?.nombre || ''} onChange={(n) => setMedico(medicosDisponibles.find(m => m.nombre === n) || null)} />}
                    {medico && (
                        <div className="tarjeta-medico">
                            <TarjetaMedico medico={medico} />
                            <button type="button" className="boton-continuar-paso1" onClick={() => setPaso(2)}>Continuar</button>
                        </div>
                    )}
                </>
            )}
            
            {/* Paso 2: Selección de Fecha, Hora, Tipo de atención y motivo */}
            {paso === 2 && (
                <>
                    <h3>Detalles de la Cita</h3>
                    {medico && <p className="aviso-dias">El médico atiende: <strong>{medico.diasDisponibles.join(', ')}</strong></p>}
                    
                    <input type="date" aria-label="Seleccione fecha" value={fecha} onChange={(e) => {
                        const val = e.target.value;
                        if(esDiaValido(val)) setFecha(val);
                        else { alert("Fecha no válida. El médico no atiende ese día."); setFecha(''); }
                    }} />
                    
                    {fecha && (
                        <select aria-label="Seleccione hora" value={hora} onChange={(e) => setHora(e.target.value)}>
                            <option value="">Seleccione hora</option>
                            {horariosDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    )}

                    <div className="grupo-tipo-cita">
                        <label>Modalidad:</label>
                        <div className="radio-group-container">
                            <label className="radio-item"><input type="radio" value="Presencial" checked={tipoAtencion === 'Presencial'} onChange={(e) => setTipoAtencion(e.target.value as 'Presencial' | 'Virtual')} /> Presencial</label>
                            <label className="radio-item"><input type="radio" value="Virtual" checked={tipoAtencion === 'Virtual'} onChange={(e) => setTipoAtencion(e.target.value as 'Presencial' | 'Virtual')} /> Virtual</label>
                        </div>
                    </div>

                    <textarea aria-label="Motivo" placeholder="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                    
                    <div className="grupo-botones">
                        <button type="button" className="boton-volver" onClick={() => setPaso(1)}>Atrás</button>
                        <button type="button" className="boton-registro" onClick={() => fecha && hora ? setPaso(3) : alert("Complete fecha y hora")}>Siguiente</button>
                    </div>
                </>
            )}

            {/* Paso 3: Registro de datos personales del paciente */}
            {paso === 3 && (
                <>
                    <h3>Datos del Paciente</h3>
                    <input type="text" placeholder="Cédula" value={paciente.cedula} onChange={(e) => handleBuscarPaciente(e.target.value)} required/>
                    <input type="text" placeholder="Nombre" value={paciente.nombre} onChange={(e) => setPaciente({...paciente, nombre: e.target.value})} required />
                    <input type="text" placeholder="Apellido" value={paciente.apellido} onChange={(e) => setPaciente({...paciente, apellido: e.target.value})} required />
                    <input type="email" placeholder="Email" value={paciente.email} onChange={(e) => setPaciente({...paciente, email: e.target.value})} />
                    <input type="tel" placeholder="Teléfono" value={paciente.telefono} onChange={(e) => setPaciente({...paciente, telefono: e.target.value})} />
                    
                    <div className="grupo-botones">
                        <button type="button" className="boton-volver" onClick={() => setPaso(2)}>Atrás</button>
                        <button type="button" className="boton-registro" onClick={handleGuardar}>Finalizar Registro</button>
                    </div>
                </>
            )}
        </div>
    );
};