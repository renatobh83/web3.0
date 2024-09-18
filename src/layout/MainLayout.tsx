import { Box, CssBaseline, Stack } from "@mui/material"
import { MenuDrawer } from "../components/MainComponents/MenuDrawer"
import { useCallback, useEffect, useState } from "react"
import { Header } from "../components/MainComponents/Header"
import AppTheme from "../Theme/AppTheme"
import { Outlet } from "react-router-dom"
import { useNotificationsStore } from "../store/notifications"
import { useWhatsappStore } from "../store/whatsapp"
import { toast } from "sonner"
import { ConsultarTickets } from "../services/tickets"
import { ListarConfiguracoes } from "../services/configuracoes"
import { ListarWhatsapps } from "../services/sessoesWhatsapp"





export const MainLayout: React.FC<{
    props?: {
        disableCustomTheme: boolean
    }
}> = ({ props }) => {
    const { updateNotifications, updateNotificationsP } = useNotificationsStore()
    const { whatsApps, loadWhatsApps } = useWhatsappStore()

    function cProblemaConexao() {
        const idx = whatsApps.findIndex(w =>
            ['PAIRING', 'TIMEOUT', 'DISCONNECTED'].includes(w.status)
        )
        return idx !== -1
    }
    function cQrCode() {
        const idx = whatsApps.findIndex(
            w => w.status === 'qrcode' || w.status === 'DESTROYED'
        )
        return idx !== -1
    }
    function cOpening() {
        const idx = whatsApps.findIndex(w => w.status === 'OPENING')
        return idx !== -1
    }
    const listarWhatsapps = useCallback(async () => {
        const { data } = await ListarWhatsapps();
        loadWhatsApps(data);
    }, [loadWhatsApps]);

    const listarConfiguracoes = useCallback(async () => {
        const { data } = await ListarConfiguracoes();
        localStorage.setItem("configuracoes", JSON.stringify(data));
    }, []);

    const consultarTickets = useCallback(async () => {
        const params = {
            searchParam: "",
            pageNumber: 1,
            status: ["open", "pending"],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: true,
            isNotAssignedUser: false,
            includeNotQueueDefined: true,
            // date: new Date(),
        };
        try {
            const { data } = await ConsultarTickets(params);
            updateNotifications(data);
            setTimeout(() => {
                updateNotifications(data);
            }, 500);
            // this.$store.commit('SET_HAS_MORE', data.hasMore)
        } catch (err) {
            toast.error("Algum problema ao consultar tickets");
            console.error(err);
        }
        const params2 = {
            searchParam: "",
            pageNumber: 1,
            status: ["pending"],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: false,
            isNotAssignedUser: false,
            includeNotQueueDefined: true,
            // date: new Date(),
        };
        try {
            const { data } = await ConsultarTickets(params2);

            // this.$store.commit("UPDATE_NOTIFICATIONS_P", data);
            updateNotificationsP(data);
            setTimeout(() => {
                updateNotificationsP(data);
            }, 500);
            // this.$store.commit('SET_HAS_MORE', data.hasMore)
            // console.log(this.notifications)
        } catch (err) {
            toast.error("Algum problema ao consultar tickets ");
            console.error(err);
        }
    }, [updateNotificationsP, updateNotifications])

    useEffect(() => {
        listarWhatsapps();
        listarConfiguracoes();
        consultarTickets();

    }, [listarWhatsapps, listarConfiguracoes, consultarTickets]);



    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    return (
        <AppTheme {...props} >
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <MenuDrawer />

                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 10,
                            mt: 8,
                        }}
                    >
                        {/* header inside main */}
                        <Header />
                        <Outlet />
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    )
}