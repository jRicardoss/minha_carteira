import React, {
    createContext,
    useState,
    useEffect,
    useContext,
} from "react";

import api from "../services/api";

interface IUser {
    id: number;
    nome: string;
    email: string;
}

interface IAuthContextData {
    usuario: IUser | null;
    loading: boolean;

    login(
        email: string,
        senha: string
    ): Promise<void>;

    logout(): void;

    excluirConta(): Promise<void>;
}

const AuthContext = createContext<IAuthContextData>(
    {} as IAuthContextData
);

export const AuthProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {

    const [usuario, setUsuario] =
        useState<IUser | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem(
            "@MinhaCarteira:token"
        );

        const usuarioStorage = localStorage.getItem(
            "@MinhaCarteira:usuario"
        );

        if (token && usuarioStorage) {
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            setUsuario(
                JSON.parse(usuarioStorage)
            );
        }

        setLoading(false);
    }, []);

    const login = async (
        email: string,
        senha: string
    ) => {
        const response = await api.post(
            "/auth/login",
            {
                email,
                senha,
            }
        );

        const {
            token,
            usuario,
        } = response.data;

        localStorage.setItem(
            "@MinhaCarteira:token",
            token
        );

        localStorage.setItem(
            "@MinhaCarteira:usuario",
            JSON.stringify(usuario)
        );

        api.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        setUsuario(usuario);
    };
        const excluirConta = async () => {
        await api.delete("/usuarios/me");
        logout();
    };
    const logout = () => {
        localStorage.removeItem(
            "@MinhaCarteira:token"
        );

        localStorage.removeItem(
            "@MinhaCarteira:usuario"
        );

        delete api.defaults.headers.common[
            "Authorization"
        ];

        setUsuario(null);
    };

    return (
        <AuthContext.Provider
                value={{
                usuario,
                loading,
                login,
                logout,
                excluirConta,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): IAuthContextData {
    return useContext(AuthContext);
}