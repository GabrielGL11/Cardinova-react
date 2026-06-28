import { useState } from 'react';
import { type Medico, type Cita, type Paciente } from '../lib/tipos';
import { obtenerEspecialidades, obtenerCiudades, obtenerHospitales, obtenerMedicosFiltrados } from '../lib/utilidades';
import { SelectorPaso } from './SelectorPaso';
import { TarjetaMedico } from './TarjetaMedico';
import '../styles/FormularioCita.css';

interface PropsFormulario {
    onGuardar: (cita: Cita) => void;
}

export const FormularioCita = ({ onGuardar }: PropsFormulario) => {
    const [esp, setEsp] = useState('');
    const [ciu, setCiu] = useState('');
    const [hosp, setHosp] = useState('');
    const [medico, setMedico] = useState<Medico | null>(null);
    const [paso, setPaso] = useState(1);

    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoAtencion, setTipoAtencion] = useState<'Presencial' | 'Virtual'>('Presencial');

    const [paciente, setPaciente] = useState<Paciente>({
        idPaciente: Date.now().toString(), cedula: '', nombre: '', apellido: '', email: '', telefono: ''
    });

    const medicosDisponibles = obtenerMedicosFiltrados(esp, ciu, hosp);

    const handleGuardar = () => {
        const contactoValido = paciente.email.trim() !== '' || paciente.telefono.trim() !== '';
        if (medico && motivo && fecha && hora && paciente.cedula && paciente.nombre && contactoValido) {
            onGuardar({
                idCita: Date.now().toString(),
                idMedico: medico.idMedico,
                idPaciente: paciente.idPaciente,
                fecha,
                hora,
                motivo,
                tipoAtencion: tipoAtencion as 'Presencial' | 'Virtual',
                estado: 'Programada',
                medico: medico,
                paciente: paciente
            });
            alert("Cita registrada con éxito");
            setPaso(1); setEsp(''); setCiu(''); setHosp(''); setMedico(null); setMotivo(''); setFecha(''); setHora(''); setTipoAtencion('Presencial');
            setPaciente({ idPaciente: Date.now().toString(), cedula: '', nombre: '', apellido: '', email: '', telefono: '' });
        } else if (!contactoValido) {
            alert("Por favor, ingresa al menos un método de contacto (Email o Teléfono)");
        } else {
            alert("Por favor completa los campos obligatorios del paciente y la cita");
        }
    };

    return (
        <div className="contenedor-formulario">
            <h1>Agendamiento Médico</h1>
            {paso === 1 && (
                <>
                    <SelectorPaso label="Especialidad" opciones={obtenerEspecialidades()} valor={esp} onChange={(v) => { setEsp(v); setCiu(''); setHosp(''); setMedico(null); }} />
                    {esp && <SelectorPaso label="Ciudad" opciones={obtenerCiudades(esp)} valor={ciu} onChange={(v) => { setCiu(v); setHosp(''); setMedico(null); }} />}
                    {ciu && <SelectorPaso label="Hospital" opciones={obtenerHospitales(esp, ciu)} valor={hosp} onChange={(v) => { setHosp(v); setMedico(null); }} />}
                    {hosp && <SelectorPaso label="Médico" opciones={medicosDisponibles.map(m => m.nombre)} valor={medico?.nombre || ''} onChange={(n) => setMedico(medicosDisponibles.find(m => m.nombre === n) || null)} />}
                    {medico && <div className="tarjeta-medico"><TarjetaMedico medico={medico} /><button type="button" className="boton-registro" onClick={() => setPaso(2)}>Continuar</button></div>}
                </>
            )}
            {paso === 2 && (
                <>
                    <h3>Detalles de la Cita</h3>
                    <div className="grupo-selector"><label htmlFor="fechaCita">Fecha:</label><input id="fechaCita" type="date" className="select-estilo" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
                    <div className="grupo-selector"><label htmlFor="horaCita">Hora:</label><input id="horaCita" type="time" className="select-estilo" value={hora} onChange={(e) => setHora(e.target.value)} /></div>
                    <div className="grupo-selector">
                        <label htmlFor="tipo">Tipo de Atención:</label>
                        <select id="tipo" className="select-estilo" value={tipoAtencion} onChange={(e) => setTipoAtencion(e.target.value as 'Presencial' | 'Virtual')}>
                            <option value="Presencial">Presencial</option>
                            <option value="Virtual">Virtual</option>
                        </select>
                    </div>
                    <div className="grupo-selector"><label htmlFor="motivoCita">Motivo:</label><textarea id="motivoCita" className="select-estilo" value={motivo} onChange={(e) => setMotivo(e.target.value)} /></div>
                    <div className="contenedor-botones">
                        <button type="button" className="boton-registro" onClick={() => setPaso(1)}>Volver</button>
                        <button type="button" className="boton-registro" onClick={() => setPaso(3)}>Siguiente: Datos Paciente</button>
                    </div>
                </>
            )}
            {paso === 3 && (
                <>
                    <h3>Datos del Paciente</h3>
                    <div className="grupo-selector"><label htmlFor="cedula">Cédula:</label><input id="cedula" type="text" className="select-estilo" value={paciente.cedula} onChange={(e) => setPaciente({...paciente, cedula: e.target.value})} /></div>
                    <div className="grupo-selector"><label htmlFor="nombre">Nombre:</label><input id="nombre" type="text" className="select-estilo" value={paciente.nombre} onChange={(e) => setPaciente({...paciente, nombre: e.target.value})} /></div>
                    <div className="grupo-selector"><label htmlFor="apellido">Apellido:</label><input id="apellido" type="text" className="select-estilo" value={paciente.apellido} onChange={(e) => setPaciente({...paciente, apellido: e.target.value})} /></div>
                    
                    <div className="grupo-selector"><label htmlFor="email">Email (Opcional):</label><input id="email" type="email" className="select-estilo" value={paciente.email} onChange={(e) => setPaciente({...paciente, email: e.target.value})} /></div>
                    <div className="grupo-selector"><label htmlFor="telefono">Teléfono (Opcional):</label><input id="telefono" type="tel" className="select-estilo" value={paciente.telefono} onChange={(e) => setPaciente({...paciente, telefono: e.target.value})} /></div>

                    <div className="contenedor-botones">
                        <button type="button" className="boton-registro" onClick={() => setPaso(2)}>Volver</button>
                        <button type="button" className="boton-registro" onClick={handleGuardar}>Finalizar Registro</button>
                    </div>
                </>
            )}
        </div>
    );
};