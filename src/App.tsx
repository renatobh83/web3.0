import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import Login from "./pages/Login";
import { Atendimento } from "./pages/Atendimento";
import { Chat } from "./pages/Atendimento/Chat";
import { Canais } from "./pages/Canais";
import { Contatos } from "./pages/Contatos";
import { Dashboard } from "./pages/dashboard";

const AppRoutes = () => {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<Routes>
				<Route path="/login" element={<Login />} />
				{isAuthenticated ? (
					<>
						<Route path="/" element={<MainLayout />}>

							<Route path="/contatos" element={<Contatos isChatContact={false} />} />
							<Route index element={<Dashboard />} />
							{/* <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/contatos" element={<Contatos isChatContact={false} />} />
              <Route path="/sessoes" element={<IndexSessoesWhatsapp />} /> */}
							<Route path="/sessoes" element={<Canais />} />
						</Route>
						<Route path="/atendimento" element={<Atendimento />}>
							<Route path=":ticketId" element={<Chat />} />
							<Route path='chat-contatos' element={<Contatos isChatContact={true} />} />
						</Route>

					</>
				) : (
					<Route path="*" element={<Navigate to="/login" />} />
				)}
			</Routes>
			<Toaster />
		</>
	);
};
export function App() {
	return <AppRoutes />;
}
