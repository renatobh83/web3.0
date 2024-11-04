import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from './context/AuthContext'
import { MainLayout } from './layout/MainLayout'
import Login from './pages/Login'
import { Atendimento } from './pages/Atendimento'
import { Chat } from './pages/Atendimento/Chat'
import { Canais } from './pages/Canais'
import { Contatos } from './pages/Contatos'
import { Dashboard } from './pages/dashboard'
import { DashTicketsFilas } from './pages/dashboard/DashTicketsFilas'
import { Usuarios } from './pages/Usuarios'
import { Filas } from './pages/filas'
import { MensagensRapidas } from './pages/mensagensRapidas'
import { ChatFlow } from './pages/chatFlow/Index'
import { ListaChatFlow } from './pages/chatFlow/ListaChatFlow'
import { PanelChatFlow } from './components/FlowBuilderComponent/Panel'
import { HorarioAtendimento } from './pages/HorarioAtendimento'
import { Configuracoes } from './pages/Configuracoes'
import { Campanhas } from './pages/campanhas'
import { ContatosCampanha } from './pages/campanhas/ContatosCampanha'
import { ApiExternal } from './pages/api'

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <>
            <Route path="/" element={<MainLayout />}>
              <Route
                path="/contatos"
                element={<Contatos isChatContact={false} />}
              />
              <Route index element={<Dashboard />} />
              <Route
                path="/painel-atendimentos"
                element={<DashTicketsFilas />}
              />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/filas" element={<Filas />} />
              <Route path="/mensagens-rapidas" element={<MensagensRapidas />} />
              <Route path="/sessoes" element={<Canais />} />
              <Route path="/chat-flow" element={<ChatFlow />}>
                <Route index element={<ListaChatFlow />} />
                <Route path="builder" element={<PanelChatFlow />} />
              </Route>
              <Route
                path="/horarioAtendimento"
                element={<HorarioAtendimento />}
              />
              <Route
                path="/campanhas"
                element={<Campanhas />}
              >

              </Route>
              <Route
                path="/campanhas/:campanhaId"
                element={<ContatosCampanha />}
              />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/api-service" element={<ApiExternal />} />
            </Route>
            <Route path="/atendimento" element={<Atendimento />}>
              <Route path=":ticketId" element={<Chat />} />
              <Route
                path="chat-contatos"
                element={<Contatos isChatContact={true} />}
              />
            </Route>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      <Toaster richColors expand={true} closeButton position="top-center" />
    </>
  )
}
export function App() {
  return <AppRoutes />
}
