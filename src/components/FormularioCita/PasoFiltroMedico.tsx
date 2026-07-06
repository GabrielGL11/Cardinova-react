import { type Medico } from '../../lib/tipos';
import { SelectorPaso } from '../SelectorPaso';
import { TarjetaMedico } from '../TarjetaMedico';
import { obtenerEspecialidades, obtenerCiudades, obtenerHospitales } from '../../lib/utilidades';

interface PropsPasoFiltro {
    esp: string; setEsp: (v: string) => void;
    ciu: string; setCiu: (v: string) => void;
    hosp: string; setHosp: (v: string) => void;
    medico: Medico | null;
    setMedico: (m: Medico | null) => void;
    medicosDisponibles: Medico[];
    onContinuar: () => void;
}

/**
 * COMPONENTE PASO 1: PASOFILTROMEDICO
 * Filtra el catálogo de médicos según los criterios seleccionados (Especialidad, Ciudad, Hospital).
 * Orquesta la navegación inicial para la elección del profesional.
 */
export const PasoFiltroMedico = ({ 
    esp, setEsp, ciu, setCiu, hosp, setHosp, medico, setMedico, medicosDisponibles, onContinuar 
}: PropsPasoFiltro) => {

    return (
        <>
            <SelectorPaso 
                label="Especialidad" 
                opciones={obtenerEspecialidades()} 
                valor={esp} 
                onChange={(v) => { setEsp(v); setCiu(''); setHosp(''); setMedico(null); }} 
            />
            
            {esp && (
                <SelectorPaso 
                    label="Ciudad" 
                    opciones={obtenerCiudades(esp)} 
                    valor={ciu} 
                    onChange={(v) => { setCiu(v); setHosp(''); setMedico(null); }} 
                />
            )}
            
            {ciu && (
                <SelectorPaso 
                    label="Hospital" 
                    opciones={obtenerHospitales(esp, ciu)} 
                    valor={hosp} 
                    onChange={(v) => { setHosp(v); setMedico(null); }} 
                />
            )}
            
            {hosp && (
                <SelectorPaso 
                    label="Médico" 
                    opciones={medicosDisponibles.map(m => m.nombre)} 
                    valor={medico?.nombre || ''} 
                    onChange={(n) => setMedico(medicosDisponibles.find(m => m.nombre === n) || null)} 
                />
            )}
            
            {medico && (
                <div className="tarjeta-medico">
                    <TarjetaMedico medico={medico} />
                    <button type="button" className="boton-continuar-paso1" onClick={onContinuar}>Continuar</button>
                </div>
            )}
        </>
    );
};