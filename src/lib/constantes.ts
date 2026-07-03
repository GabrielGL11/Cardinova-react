// -- CONSTANTES DEL DOMINIO --
// Define los tipos de atención permitidos y el conjunto de estados válidos para el ciclo de vida de una cita
export const TIPOS_ATENCION = ['Presencial', 'Virtual'] as const;

export const ESTADOS_CITA = {
    PROGRAMADA: 'Programada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada'
} as const;