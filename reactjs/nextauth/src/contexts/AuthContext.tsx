import Router, { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    user?: User;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
    children: ReactNode;
}

export function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');

    Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;
    const router = useRouter();

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data;

                setUser({
                    email,
                    permissions,
                    roles,
                })
            })
        }
    }, []);

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password,
            })

            const { token, refreshToken, permissions, roles } = response.data;

            const thirdDays = 60 * 60 * 24 * 30;

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: thirdDays,
                path: '/',
            });
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: thirdDays,
                path: '/',
            });

            setUser({ email, permissions, roles });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            
            router.push('/dashboard');
        } catch {
            signOut();
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
} 