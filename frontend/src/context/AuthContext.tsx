
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { login, logout } from "../features/auth/services/authService";

export interface AuthUser {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    approvalStatus?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthUser>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch(`${API_URL}/session`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const sessionUser: AuthUser = await response.json();
                    setUser(sessionUser);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, []);

    async function signIn(email: string, password: string): Promise<AuthUser> {
        const result = await login({ email, password });

        const loggedInUser: AuthUser = {
            userId: Number(result.userId),
            fullName: result.fullName || "User",
            email: result.email || email,
            role: result.role || "Bidder",
            approvalStatus: result.approvalStatus || "Pending",
        };

        setUser(loggedInUser);
        return loggedInUser;
    }

    async function signOut() {
        await logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
}
