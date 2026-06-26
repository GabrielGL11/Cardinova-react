import { useState } from 'react';
import { type Medico } from '../lib/tipos';
import { obtenerEspecialidades, obtenerCiudades, obtenerHospitales, obtenerMedicosFiltrados } from '../lib/utilidades';
import { SelectorPaso } from './SelectorPaso';
import { TarjetaMedico } from './TarjetaMedico';
import '../styles/FormularioCita.css';

export const FormularioCita = () => {
    const [esp, setEsp] = useState('');
    const [ciu, setCiu] = useState('');
    const [hosp, setHosp] = useState('');
    const [medico, setMedico] = useState<Medico | null>(null);

    return (
        <div className="contenedor-formulario">
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
                <div className="grupo-selector">
                    <label className="label-selector" htmlFor="selector-medico">Médico</label>
                    <select 
                        id="selector-medico"
                        className="select-estilo"
                        onChange={(e) => {
                            const m = obtenerMedicosFiltrados(esp, ciu, hosp).find(m => m.idMedico === e.target.value);
                            setMedico(m || null);
                        }}
                    >
                        <option value="">Seleccione...</option>
                        {obtenerMedicosFiltrados(esp, ciu, hosp).map(m => (
                            <option key={m.idMedico} value={m.idMedico}>{m.nombre}</option>
                        ))}
                    </select>
                </div>
            )}

            {medico && <TarjetaMedico medico={medico} />}
        </div>
    );
};