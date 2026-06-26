import medicosData from '../data/medicos.json';
import { type Medico } from '../lib/tipos';

// Obtener listas únicas para los selectores
export const obtenerEspecialidades = (): string[] => 
    Array.from(new Set(medicosData.map(m => m.especialidad)));

export const obtenerCiudades = (esp: string): string[] => 
    Array.from(new Set(medicosData.filter(m => m.especialidad === esp).map(m => m.ciudad)));

export const obtenerHospitales = (esp: string, ciu: string): string[] => 
    Array.from(new Set(medicosData.filter(m => m.especialidad === esp && m.ciudad === ciu).map(m => m.hospital)));

export const obtenerMedicosFiltrados = (esp: string, ciu: string, hosp: string): Medico[] => 
    medicosData.filter(m => m.especialidad === esp && m.ciudad === ciu && m.hospital === hosp);