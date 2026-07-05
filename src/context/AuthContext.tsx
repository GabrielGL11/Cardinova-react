import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * AuthContext: Provee el estado de autenticación global a toda la aplicación.
 * Permite que componentes como Navbar y Login reaccionen en tiempo real 
 * a cambios de sesión sin necesidad de recargar la página.
 */
interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Inicialización del estado mediante función "lazy" para asegurar que 
    // lea el localStorage solo al montar el componente.
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem('usuarioLogueado');
    });

    // useCallback asegura que estas funciones mantengan su referencia 
    // y no provoquen re-renderizados innecesarios en los componentes que las consumen.
    const login = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para consumir el contexto de forma segura y tipada
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};