// -- INTERFACES DEL MODELO DE DATOS --
// Define la estructura base de las entidades principales del sistema y sus relaciones para garantizar la consistencia en el estado global.

export interface Medico {
    idMedico: string;
    nombre: string;
    cedula: string;
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
    creadoPor?: string;
    fecha: string;
    hora: string;
    motivo: string;
    tipoAtencion: 'Presencial' | 'Virtual';
    estado?: 'Programada' | 'Cancelada' | 'Completada';
    medico?: Medico; // Propiedad opcional para población dinámica de datos
    paciente?: Paciente; // Propiedad opcional para población dinámica de datos
    nombrePaciente?: string; // Campo auxiliar para persistencia de pacientes no registrados en base de datos
    apellidoPaciente?: string; // Campo auxiliar para persistencia de pacientes no registrados en base de datos
}

export interface FiltrosBusqueda {
    especialidad: string;
    ciudad: string;
    hospital: string;
    idMedico: string;
}