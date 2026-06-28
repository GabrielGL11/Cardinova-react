import '../styles/FormularioCita.css';

interface PropsSelector {
    label: string;
    opciones: string[];
    valor: string;
    onChange: (valor: string) => void;
    placeholder?: string;
    disabled?: boolean; 
}
// -- COMPONENTE SELECTORPASO --
// Renderiza un menú desplegable personalizado y reutilizable para los pasos del formulario
export const SelectorPaso = ({ 
    label, 
    opciones, 
    valor, 
    onChange, 
    placeholder = "Seleccione...",
    disabled = false 
}: PropsSelector) => {
    // Genera un ID único basado en el texto del label para accesibilidad
    const idUnico = label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="contenedor-selector">
            <label className="label-selector" htmlFor={idUnico}>{label}</label>
            {/* Aplica estilos condicionales dependiendo de si el selector está habilitado o no */}
            <select 
                id={idUnico} 
                className={`select-estilo ${disabled ? 'disabled' : ''}`} 
                value={valor} 
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled} 
            >
                <option value="">{placeholder}</option>
                {/* Mapea el array de opciones recibidas como propiedades */}
                {opciones.map(op => (
                    <option key={op} value={op}>{op}</option>
                ))}
            </select>
        </div>
    );
};