export const obtenerDiaSemana = (fecha: string): string => {
    const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const [y, m, d] = fecha.split('-').map(Number);
    // Ajuste por zona horaria UTC para evitar errores de desfase de día
    return dias[new Date(y, m - 1, d).getUTCDay()];
};

export const esFechaValida = (fecha: string, medico: any): boolean => {
    const dia = obtenerDiaSemana(fecha);
    return medico.diasDisponibles.includes(dia);
};

export const validarCedula = (cedula: string): boolean => {
    return /^\d{10}$/.test(cedula); // Solo permite 10 dígitos numéricos
};