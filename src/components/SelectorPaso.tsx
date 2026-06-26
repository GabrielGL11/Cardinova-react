import '../styles/FormularioCita.css';

interface PropsSelector {
    label: string;
    opciones: string[];
    valor: string;
    onChange: (valor: string) => void;
    placeholder?: string;
}

export const SelectorPaso = ({ label, opciones, valor, onChange, placeholder = "Seleccione..." }: PropsSelector) => {
    const idUnico = label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="contenedor-selector">
            <label className="label-selector" htmlFor={idUnico}>{label}</label>
            <select 
                id={idUnico} 
                className="select-estilo" 
                value={valor} 
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {opciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
        </div>
    );
};