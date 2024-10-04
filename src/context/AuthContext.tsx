import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import CryptoJS from 'crypto-js';
const secretKey = import.meta.env.VITE_APP_SECRET_KEY
// import { useWebSocket } from './WebSocketContext.js';
import { toast } from "sonner";
import { RealizarLogin } from "../services/login.js";
import { useUserStore } from "../store/user.js";
import { socketIO } from "../utils/socket.js";
import { Errors } from "../utils/error.js";
import { useApplicationStore } from "../store/application.js";

// import { socketIO } from "../utils/socket.js";

interface AuthContextType {
    isAuthenticated: boolean;
    decryptData: (encryptedData: string) => void
    encryptData: (data: string) => void
    login: (form: any) => void;
    logout: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const pesquisaTicketsFiltroPadrao = {
    searchParam: "",
    pageNumber: 1,
    status: ["open", "pending"],
    showAll: false,
    count: null,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true,
    // date: new Date(),
};
const logoff = () => {
    toast.error('Dados removido do localStorage, sera necessario logar na aplicacao novamente', {
        position: 'top-center'
    })
    // Remove todos os dados do localStorage
    localStorage.clear();

    setTimeout(() => {
        // Redireciona o usuário para a página de login (ou outro fluxo de logoff)
        window.location.href = '/login'; // Substitua '/login' pela rota de login da sua aplicação
    }, 2000);
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // const { socket } = useWebSocket()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
    const setProfileUser = useApplicationStore(s => s.setProfileUser)
    const setUserState = useUserStore((s) => s.setUserState);
    const encryptData = (data: string) => {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    }

    const decryptData = (key: string) => {
        const encrypted = localStorage.getItem(key);

        if (!encrypted) {
            // Se o dado não existir no localStorage, executa o logoff
            console.error(`A chave ${key} não foi encontrada. Fazendo logoff...`);
            logoff();
            return null;
        }

        try {
            // Tenta descriptografar o dado
            const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedData) {
                throw new Error(`Falha ao descriptografar a chave ${key}`);
            }

            return decryptedData;
        } catch (error) {
            console.error(`Erro ao descriptografar os dados para a chave ${key}:`, error);
            // Se a descriptografia falhar, também faz logoff
            logoff();
            return null;
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const login = async (form: any) => {
        try {
            const { data } = await RealizarLogin(form);

            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("username", data.username);
            localStorage.setItem("profile", encryptData(data.profile));
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("usuario", encryptData(JSON.stringify(data)));
            localStorage.setItem("queues", JSON.stringify(data.queues));
            localStorage.setItem("queues", JSON.stringify(data.queues));
            localStorage.setItem(
                "filtrosAtendimento",
                JSON.stringify(pesquisaTicketsFiltroPadrao),
            );

            // if (data?.configs?.filtrosAtendimento) {
            //     localStorage.setItem(
            //         "filtrosAtendimento",
            //         JSON.stringify(data.configs.filtrosAtendimento),
            //     );
            // }
            setUserState(data);

            // IMPLEMENTAR SOCKET
            const ws = socketIO()
            ws.emit(`${data.tenantId}:setUserActive`)
            ws.disconnect()
            ws.close()

            toast.success("Login realizado com sucesso!", {
                position: 'top-center'
            });

            if (data.profile === "admin") {
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000)

                // rota dash
            } else {
                window.location.href = "/atendimento";
                // 'rota atendimento'
            }
        } catch (error) {
            Errors(error)
        }

        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div>Loading...</div>; // Renderiza um estado de carregamento enquanto verifica o token
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, decryptData, encryptData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
