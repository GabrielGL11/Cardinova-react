import { type Medico } from '../../lib/tipos';
import { toast } from 'sonner';

interface PropsPasoDetalles {
    medico: Medico | null;
    fecha: string;
    setFecha: (f: string) => void;
    hora: string;
    setHora: (h: string) => void;
    motivosSeleccionados: string[];
    setMotivosSeleccionados: (m: string[]) => void;
    esOtrosActivo: boolean;
    setEsOtrosActivo: (b: boolean) => void;
    motivoOtros: string;
    setMotivoOtros: (s: string) => void;
    tipoAtencion: 'Presencial' | 'Virtual';
    setTipoAtencion: (t: 'Presencial' | 'Virtual') => void;
    horariosDisponibles: string[];
    esDiaValido: (f: string) => boolean;
    onAtras: () => void;
    onContinuar: () => void;
}

/**
 * COMPONENTE PASO 2: PASODETALLESCITA
 * Gestión de fecha, disponibilidad horaria y modalidad de atención.
 * Incluye lógica de validación cruzada con la disponibilidad del médico y estado de citas.
 */
export const PasoDetallesCita = ({ 
    medico, fecha, setFecha, hora, setHora, motivosSeleccionados, setMotivosSeleccionados, 
    esOtrosActivo, setEsOtrosActivo, motivoOtros, setMotivoOtros, tipoAtencion, setTipoAtencion,
    horariosDisponibles, esDiaValido, onAtras, onContinuar
}: PropsPasoDetalles) => {

    const opcionesMotivo = ["Control de Rutina", "Revisión de Exámenes", "Derivación", "Consulta por Síntomas", "Control de Tratamiento"];

    return (
        <>
            <h3>Detalles de la Cita</h3>
            {medico && <p className="aviso-dias">El médico atiende: <strong>{medico.diasDisponibles.join(', ')}</strong></p>}
            
            <input 
                type="date" 
                aria-label="Seleccione fecha" 
                value={fecha} 
                onChange={(e) => {
                    const val = e.target.value;
                    if(esDiaValido(val)) setFecha(val);
                    else { toast.error("Fecha no válida", { description: "El médico no atiende ese día." }); setFecha(''); }
                }} 
            />
            
            {fecha && (
                <select aria-label="Seleccione hora" value={hora} onChange={(e) => setHora(e.target.value)}>
                    <option value="">Seleccione hora</option>
                    {horariosDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
            )}

            <div className="grupo-motivo">
                <label className="label-selector">Motivos de la cita:</label>
                {opcionesMotivo.map(m => (
                    <label key={m} className={`item-motivo ${esOtrosActivo ? 'deshabilitado' : ''}`}>
                        <input 
                            type="checkbox" 
                            disabled={esOtrosActivo} 
                            checked={motivosSeleccionados.includes(m)} 
                            onChange={(e) => {
                                if(e.target.checked) setMotivosSeleccionados([...motivosSeleccionados, m]);
                                else setMotivosSeleccionados(motivosSeleccionados.filter(item => item !== m));
                            }} 
                        /> {m}
                    </label>
                ))}
                <label className="label-otros">
                    <input 
                        type="checkbox" 
                        checked={esOtrosActivo} 
                        onChange={(e) => {
                            setEsOtrosActivo(e.target.checked);
                            if(e.target.checked) setMotivosSeleccionados([]);
                        }} 
                    /> Otro motivo
                </label>
                <input 
                    type="text" 
                    placeholder="Especifique aquí..." 
                    disabled={!esOtrosActivo} 
                    value={motivoOtros} 
                    onChange={(e) => setMotivoOtros(e.target.value)} 
                />
            </div>

            <div className="grupo-tipo-cita">
                <label>Modalidad:</label>
                <div className="radio-group-container">
                    <label className="radio-item">
                        <input type="radio" value="Presencial" checked={tipoAtencion === 'Presencial'} onChange={(e) => setTipoAtencion(e.target.value as 'Presencial')} /> Presencial
                    </label>
                    <label className="radio-item">
                        <input type="radio" value="Virtual" checked={tipoAtencion === 'Virtual'} onChange={(e) => setTipoAtencion(e.target.value as 'Virtual')} /> Virtual
                    </label>
                </div>
            </div>

            <div className="grupo-botones">
                <button type="button" className="boton-volver" onClick={onAtras}>Atrás</button>
                <button 
                    type="button" 
                    className="boton-registro" 
                    onClick={() => fecha && hora ? onContinuar() : toast.warning("Atención", { description: "Complete fecha y hora antes de continuar." })}
                >Siguiente</button>
            </div>
        </>
    );
};