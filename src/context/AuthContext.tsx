import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * Define la estructura de los datos del usuario para mantener la consistencia.
 * Se añadió el campo 'id' para poder filtrar las citas por usuario.
 */
export interface UserData {
    id: string; // ID único necesario para el filtrado de citas
    nombre: string;
    rol: 'paciente' | 'medico';
    cedula: string;
    idMedico?: string;
}

/**
 * AuthContextType: Define qué funciones y estados están disponibles globalmente.
 * Se incluyó 'userData' para acceder a la información completa del usuario.
 */
export interface AuthContextType {
    isLoggedIn: boolean;
    userRole: 'paciente' | 'medico' | null;
    userData: UserData | null; // Nuevo estado para persistir el objeto completo
    login: (userData: UserData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    userRole: null,
    userData: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Inicialización "lazy": lee el objeto completo del usuario desde localStorage al montar.
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem('usuarioLogueado');
    });

    const [userRole, setUserRole] = useState<'paciente' | 'medico' | null>(() => {
        const data = localStorage.getItem('usuarioLogueado');
        return data ? JSON.parse(data).rol : null;
    });

    const [userData, setUserData] = useState<UserData | null>(() => {
        const data = localStorage.getItem('usuarioLogueado');
        return data ? JSON.parse(data) : null;
    });

    // login: Actualiza el estado global, el rol y el objeto userData completo.
    const login = useCallback((userData: UserData) => {
        localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUserRole(userData.rol);
        setUserData(userData);
    }, []);

    // logout: Limpia todos los estados y el almacenamiento local.
    const logout = useCallback(() => {
        localStorage.removeItem('usuarioLogueado');
        setIsLoggedIn(false);
        setUserRole(null);
        setUserData(null);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para consumir el contexto de forma segura y tipada.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};