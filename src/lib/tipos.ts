export interface Medico {
    idMedico: string;
    nombre: string;
    especialidad: string;
    ciudad: string;
    hospital: string;
    horarios: string[]; 
    diasDisponibles: string[]; 
}

export interface Paciente {
    idPaciente: string;
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
}

export interface Cita {
    idCita?: string;
    idMedico: string;
    idPaciente: string;
    fecha: string;
    hora: string;
    motivo: string;
    tipoAtencion: 'Presencial' | 'Virtual';
    estado?: 'Programada' | 'Cancelada' | 'Completada';
}
export interface FiltrosBusqueda {
    especialidad: string;
    ciudad: string;
    hospital: string;
    idMedico: string;
}