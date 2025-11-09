import { createContext, useState, useEffect, useContext } from "react";

// The type information for the authenticated user
interface User {
    id: string;
    email: string;
}

// Authentication response type
interface AuthResponse {
    status: "success" | "error";
    message: string;
}

// The context type for authentication
interface AuthContextType {
    user: User | null;
    register: (email: string, password: string) => void;
    login: (email: string, password: string) =>  void;
    logout: () => void;
}

// The AuthContext to be used in the application
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
    // State to hold the authenticated user
    const [user, setUser] = useState<User | null>(null);
    // State to hold session info
    const [session, setSession] = useState<any>(null);

    // Register function
    const register = async (email: string, password: string)=> {
        return null;
    };

    // Login function
    const login = async (email: string, password: string) => {
        return null;
    };

    // Simulate logout function
    const logout = async () => {
        return null;
    };


    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
