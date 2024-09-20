import * as React from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ArrowDownwardSharp, ContactEmergency, Home, Logout, Person } from '@mui/icons-material';
import { AppBar, Avatar, Button, Checkbox, FormControl, FormControlLabel, FormGroup, MenuItem, MenuList, SwipeableDrawer, Switch, Tab, Tabs, TextField, Tooltip, useColorScheme } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { debounce } from 'lodash'
import { format } from 'date-fns';

import { ItemTicket } from './ItemTicket';
import { SelectComponent } from '../../components/AtendimentoComponent/SelectComponent';
import { StyledMenu } from '../../components/MainComponents/MenusNavBar';
import { ListarConfiguracoes } from '../../services/configuracoes';
import { ListarEtiquetas } from '../../services/etiquetas';
import { ListarFilas } from '../../services/filas';
import { ListarWhatsapps } from '../../services/sessoesWhatsapp';
import { ConsultarTickets } from '../../services/tickets';
import { type Ticket, useAtendimentoTicketStore } from '../../store/atendimentoTicket';
import { useUsuarioStore } from '../../store/usuarios';
import { useWhatsappStore } from '../../store/whatsapp';
import AppTheme from '../../Theme/AppTheme';
import { gray } from '../../Theme/themePrimitives';
import ToggleColorMode from '../../components/MaterialUi/Login/ToggleColorMode';
import { useAtendimentoStore } from '../../store/atendimento';
import { useApplicationStore } from '../../store/application';
import { InfoCabecalhoMenssagens } from './InforCabecalhoChat';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ height: "calc(100% - 180px)", overflow: 'auto' }}

            {...other}
        >
            {value === index && (
                <div style={{ overflow: 'auto' }}> {children}</div>
            )
            }
        </div >
    );
}
function a11yProps(index: number, name: string) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
        name: name,
    };
}

// const drawerWidth = 380;
interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}

export function Atendimento(props: Props) {
    // Stores
    const resetTickets = useAtendimentoTicketStore((s) => s.resetTickets);
    const setHasMore = useAtendimentoTicketStore((s) => s.setHasMore);
    const loadTickets = useAtendimentoTicketStore((s) => s.loadTickets);
    const { loadWhatsApps, whatsApps } = useWhatsappStore()

    const { setUsuarioSelecionado, toggleModalUsuario } = useUsuarioStore();
   
    const { drawerWidth, mobileOpen, setMobileOpen, isClosing, setIsClosing } = useAtendimentoStore()
    const nav = useNavigate()
    const { window } = props;
    const tickets = useAtendimentoTicketStore((s) => s.tickets);

    // const [mobileOpen, setMobileOpen] = React.useState(false);
    // const [isClosing, setIsClosing] = React.useState(false);
    const { isContactInfo } = useAtendimentoStore()
    const [tabTickets, setTabTickets] = useState(0);
    const [tabTicketsStatus, setTabTicketsStatus] = useState("pending");
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [etiquetas, setEtiquetas] = useState([])
    const [anchorElFiltro, setAnchorElFiltro] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false)
    const profile = localStorage.getItem("profile");

    const [switchStates, setSwitchStates] = useState(() => {
        const savedStates = JSON.parse(localStorage.getItem("filtrosAtendimento"));
        return {
            showAll: savedStates.showAll,
            isNotAssignedUser: savedStates.isNotAssignedUser,
            withUnreadMessages: savedStates.withUnreadMessages,
        };
    });
    const [pesquisaTickets, setPesquisaTickets] = useState(() => {
        const savedData = localStorage.getItem("filtrosAtendimento");
        return savedData ? JSON.parse(savedData) : { status: [], outrosCampos: "" };
    });

    const openNav = Boolean(anchorElNav)
    const openFiltro = Boolean(anchorElFiltro)

    const { themeMode, toggleThemeMode } = useApplicationStore()
    const { mode, setMode } = useColorScheme()

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setMode(themeMode);
    }, [themeMode, setMode]);

    const handleToggleColor = () => {
        toggleThemeMode(); // Alterna o tema na store
    }

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseFiltro = () => {
        setAnchorElFiltro(null);
    };
    const handleOpenFiltro = (event: React.MouseEvent<HTMLElement>) => {

        setAnchorElFiltro(event.currentTarget);
    };
    const username = localStorage.getItem("username");

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleChangeTabs = (_event: any, newValue: number) => {
        setTabTickets(newValue);
    };

    const handleChange = (event) => {
        const { name, checked } = event.target;
        // Atualizar o estado específico do switch
        setSwitchStates((prevStates) => ({
            ...prevStates,
            [name]: checked, // Atualiza apenas o switch correspondente
        }));
        setPesquisaTickets({
            ...pesquisaTickets,
            [event.target.name]: event.target.checked,
        });
    };




    const statusTickets = useCallback(
        debounce((novoStatus: string) => {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            setPesquisaTickets((prevPesquisaTickets: { status: any }) => {
                const { status } = prevPesquisaTickets;

                // Criar uma cópia do array de status atual
                let statusAtualizado: string[];

                if (status.includes(novoStatus)) {
                    // Remover o status se ele já estiver no array
                    statusAtualizado = status.filter((s: string) => s !== novoStatus);
                } else {
                    // Adicionar o status se ele não estiver no array
                    statusAtualizado = [...status, novoStatus];
                }

                // Retornar o novo estado com o status atualizado
                return {
                    ...prevPesquisaTickets, // Manter os outros campos do objeto
                    status: statusAtualizado, // Atualizar apenas o campo status
                };
            });
        }, 200),
        [],
    );
    const handleSearch = useCallback(
        debounce(async (term: string) => {
            setPesquisaTickets({
                ...pesquisaTickets,
                searchParam: term,
            });
        }, 700),
        [],
    ); // 10000ms = 10s

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        handleSearch(value); // Chama a função debounced
    };
    function cRouteContatos() {
        // return this.$route.name === 'chat-contatos'
    }
    function cFiltroSelecionado() {
        const { queuesIds, showAll, withUnreadMessages, isNotAssignedUser } = pesquisaTickets
        return !!(queuesIds?.length || showAll || withUnreadMessages || isNotAssignedUser)
    }
    function cIsExtraInfo() {
        // return this.ticketFocado?.contact?.extraInfo?.length > 0
    }
    function handlerNotifications(data) {
        const options = {
            body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
            icon: data.ticket.contact.profilePicUrl,
            tag: data.ticket.id,
            renotify: true
        }

        const notification = new Notification(`Mensagem de ${data.ticket.contact.name}`,
            options)

        setTimeout(() => {
            notification.close()
        }, 10000)

        notification.onclick = e => {
            e.preventDefault()

            // this.$store.dispatch('AbrirChatMensagens', data.ticket)
            // this.$router.push({ name: 'atendimento' })
            // history.push(`/tickets/${ticket.id}`);
        }

        // this.$nextTick(() => {
        //     // utilizar refs do layout
        //     this.$refs.audioNotificationPlay.play()
        // })
    }
    const abrirChatContato = async (x) => {
        redirectToChat: (ticketId: string) => {
            navigate(`/atendimento/${ticketId}`);
        }
        // AbrirChatMensagens(x)
    }
    const listarConfiguracoes = async () => {
        const { data } = await ListarConfiguracoes()
        localStorage.setItem('configuracoes', JSON.stringify(data))
    }
    const consultarTickets = async (paramsInit = {}) => {
        const params = {
            ...pesquisaTickets,
            ...paramsInit,
        };
        try {
            if (pesquisaTickets.status.lengh === 0) return;
            const { data } = await ConsultarTickets(params);
            loadTickets(data.tickets);
            setHasMore(data.hasMore);
        } catch (err) {
            console.error(err);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const BuscarTicketFiltro = useCallback(async () => {
        resetTickets();
        setLoading(true);
        await consultarTickets(pesquisaTickets);
        setLoading(false);
    }, [pesquisaTickets, resetTickets]);

    const onLoadMore = async () => {
        if (tickets.length === 0 || !hasMore || loading) {
            return
        }
        try {
            setLoading(true);
            pesquisaTickets.pageNumber++
            await consultarTickets()
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }
    const [filas, setFilas] = useState([])

    const listarFilas = useCallback(async () => {
        const { data } = await ListarFilas()
        setFilas(data)
        localStorage.setItem('filasCadastradas', JSON.stringify(data || []))
    }, [])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const listarWhatsapps = useCallback(async () => {
        const { data } = await ListarWhatsapps()
        // this.$store.commit('LOAD_WHATSAPPS', data)
        loadWhatsApps(data)
    }, [])



    useEffect(() => {
        localStorage.setItem("filtrosAtendimento", JSON.stringify(pesquisaTickets));
    }, [pesquisaTickets]); // Executa sempre que pesquisaTickets mudar

    useEffect(() => {
        BuscarTicketFiltro();
    }, [BuscarTicketFiltro]);

    const listarEtiquetas = useCallback(async () => {
        const { data } = await ListarEtiquetas(true)
        setEtiquetas(data)
    }, [])


 


    const pendingTickets = (): Ticket[] => {
        const filteredTickets = tickets.filter(ticket => ticket.status === 'pending' && !ticket.isGroup)
        const groupedTickets = filteredTickets.reduce((acc, ticket) => {
            const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`;
            if (!acc[key] || acc[key].id > ticket.id) {
                acc[key] = ticket;
            }
            return acc;
        }, {});
        const groupedTicketIds = new Set(Object.values(groupedTickets).map(ticket => ticket.id));
        const remainingTickets = filteredTickets.filter(ticket => !groupedTicketIds.has(ticket.id));
        // remainingTickets.forEach(ticket => {
        //     AtualizarStatusTicketNull(ticket.id, 'closed', ticket.userId);
        //     console.log(`Ticket duplo ${ticket.id} tratado.`);
        // });
        return Object.values(groupedTickets)
    }

    function openTickets(): Ticket[] {
        const filteredTickets = tickets.filter(ticket => ticket.status === 'open' && !ticket.isGroup)
        const groupedTickets = filteredTickets.reduce((acc, ticket) => {
            const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`;
            if (!acc[key] || acc[key].id > ticket.id) {
                acc[key] = ticket;
            }
            return acc;
        }, {});
        const groupedTicketIds = new Set(Object.values(groupedTickets).map(ticket => ticket.id));
        const remainingTickets = filteredTickets.filter(ticket => !groupedTicketIds.has(ticket.id));
        // remainingTickets.forEach(ticket => {
        //     AtualizarStatusTicketNull(ticket.id, 'closed', ticket.userId);
        //     console.log(`Ticket duplo ${ticket.id} tratado.`);
        // });
        // return Object.values(groupedTickets).slice(0, this.batchSize);
        return Object.values(groupedTickets)
    }
    function closedTickets(): Ticket[] {
        return tickets.filter(ticket => ticket.status === 'closed' && !ticket.isGroup)
        // return this.tickets.filter(ticket => ticket.status === 'closed' && !ticket.isGroup).slice(0, this.batchSize);
    }
    function closedGroupTickets(): Ticket[] {
        return tickets.filter(ticket => ticket.status === 'closed' && ticket.isGroup)
        // return this.tickets.filter(ticket => ticket.status === 'closed' && ticket.isGroup).slice(0, this.batchSize);
    }
    function openGroupTickets(): Ticket[] {
        // return this.tickets.filter(ticket => ticket.status === 'open' && ticket.isGroup)
        const filteredTickets = tickets.filter(ticket => ticket.status === 'open' && ticket.isGroup);
        const groupedTickets = filteredTickets.reduce((acc, ticket) => {
            const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`;
            if (!acc[key] || acc[key].id > ticket.id) {
                acc[key] = ticket;
            }
            return acc;
        }, {});
        return Object.values(groupedTickets);
        // return Object.values(groupedTickets).slice(0, this.batchSize);
    }
    function pendingGroupTickets(): Ticket[] {
        // return this.tickets.filter(ticket => ticket.status === 'pending' && ticket.isGroup)
        const filteredTickets = tickets.filter(ticket => ticket.status === 'pending' && ticket.isGroup);
        const groupedTickets = filteredTickets.reduce((acc, ticket) => {
            const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`;
            if (!acc[key] || acc[key].id > ticket.id) {
                acc[key] = ticket;
            }
            return acc;
        }, {});
        return Object.values(groupedTickets);
        // return Object.values(groupedTickets).slice(0, this.batchSize);
    }
    function privateMessages(): Ticket[] {
        return tickets.filter(ticket => ticket.unreadMessages && !ticket.isGroup)
    }
    function groupMessages(): Ticket[] {
        return tickets.filter(ticket => ticket.unreadMessages && ticket.isGroup)
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarFilas()
        listarWhatsapps()

        listarEtiquetas()
    }, [])
    const drawer = (
        <>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Button onClick={handleOpenNavMenu}>
                    {username}
                    <ArrowDownwardSharp fontSize='small' />
                </Button>
                <StyledMenu id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorElNav}
                    onClose={handleCloseNavMenu}
                    open={openNav}>
                    <MenuList>
                        <MenuItem>
                            <Person />
                            <Typography>Perfil</Typography>
                        </MenuItem>
                        <MenuItem
                        // onClick={efetuarLogout}
                        >
                            <Logout />
                            <Typography>Sair</Typography>
                        </MenuItem>
                        <Divider sx={{ mb: 1 }} />
                    </MenuList>
                </StyledMenu>
                <Button onClick={() => nav('/')}>
                    <Home />
                </Button>


            </Toolbar>
            <List>
                <Tabs
                    value={tabTickets}
                    onChange={handleChangeTabs}
                    aria-label="Vertical tabs example"
                    variant="fullWidth"
                    centered

                >
                    <Tooltip title="Conversas em Privadas" arrow>
                        <Tab
                            sx={{ borderRight: 1, borderColor: "divider" }}
                            icon={
                                <PersonIcon />
                            }
                            disableRipple
                            className="relative"
                            {...a11yProps(0, "private")}
                        />
                    </Tooltip>
                    <Tooltip title="Conversas em Grupo" arrow>
                        <Tab
                            icon={<PeopleAltIcon />}
                            {...a11yProps(1, "group")}
                        />
                    </Tooltip>
                </Tabs>


                <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
                    <Button onClick={handleOpenFiltro} size="medium">
                        <FilterAltIcon />
                    </Button>
                    <StyledMenu
                        id="filtro"
                        MenuListProps={{
                            'aria-labelledby': 'customized-button',
                        }}
                        anchorEl={anchorElFiltro}
                        onClose={handleCloseFiltro}
                        open={openFiltro}>
                        <MenuList>
                            <MenuItem>
                                {profile === "admin" && (
                                    <>
                                        <div
                                            className={`flex items-center ml-4 ${switchStates.showAll ? "mb-4" : ""}`}
                                        >
                                            <Switch
                                                name="showAll"
                                                checked={switchStates.showAll}
                                                onChange={handleChange}
                                                color="primary"
                                            />
                                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                            <label className="ml-2 text-sm text-gray-700">
                                                Visualizar Todos
                                            </label>
                                        </div>
                                        {pesquisaTickets.showAll && <Divider />}
                                    </>
                                )}

                            </MenuItem>
                            <MenuItem
                            // onClick={efetuarLogout}
                            >
                                {!pesquisaTickets.showAll && (
                                    <Box sx={{ gap: 2, flexDirection: 'column', display: 'flex' }}>
                                        <Divider />
                                        <SelectComponent
                                            cUserQueues={[]}
                                            pesquisaTickets={pesquisaTickets}
                                        />
                                        <FormControl component="fieldset">
                                            <FormGroup aria-label="position" >
                                                <FormControlLabel
                                                    value={pesquisaTickets.status.includes("open")}
                                                    control={
                                                        <Checkbox
                                                            checked={pesquisaTickets.status.includes("open")}
                                                            onChange={() => statusTickets("open")}
                                                        />}
                                                    label="Abertos"
                                                    labelPlacement="end"
                                                />
                                                <FormControlLabel
                                                    value={pesquisaTickets.status.includes("pending")}
                                                    control={<Checkbox
                                                        checked={pesquisaTickets.status.includes("pending")}
                                                        onChange={() => statusTickets("pending")} />}
                                                    label="Pendentes"
                                                    labelPlacement="end"
                                                />
                                                <FormControlLabel
                                                    value={pesquisaTickets.status.includes("closed")}
                                                    control={<Checkbox
                                                        checked={pesquisaTickets.status.includes("closed")}
                                                        onChange={() => statusTickets("closed")} />}
                                                    label="Resolvidos"
                                                    labelPlacement="end"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                        <Divider />

                                        <div className="flex items-center ml-4">
                                            <Switch
                                                checked={switchStates.withUnreadMessages}
                                                name="withUnreadMessages"
                                                onChange={handleChange}
                                                color="primary"
                                            />
                                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                            <label className="ml-2 text-sm text-gray-700">
                                                Somente Tickets com mensagens não lidas
                                            </label>
                                        </div>
                                        <div className="flex items-center ml-4">
                                            <Switch
                                                checked={switchStates.isNotAssignedUser}
                                                name="isNotAssignedUser"
                                                onChange={handleChange}
                                                color="primary"
                                            />
                                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                            <label className="ml-2 text-sm text-gray-700">
                                                Somente Tickets não atribuidos (sem usuário definido)
                                            </label>
                                        </div>
                                    </Box>
                                )}
                                {!pesquisaTickets.showAll && <Divider />}
                            </MenuItem>
                            <Divider sx={{ mb: 1 }} />
                        </MenuList>
                    </StyledMenu>
                    <TextField
                        id="standard-basic"
                        label="Pesquisa"
                        variant="standard"
                        size="small"
                        onChange={handleInputChange}
                    />
                    <ContactEmergency />
                </Toolbar>
                <Divider />
            </List>

            {tabTickets === 0 && (
                <Tabs
                    sx={{ mt: 2, minHeight: 60 }}
                    variant="fullWidth"
                    value={tabTicketsStatus}
                    onChange={(_event, newValue) => setTabTicketsStatus(newValue)}
                >
                    <Tab label="Aberto" value="open" disableRipple />
                    {/* <Badge color="error" className="absolute left-0 top-0" /> */}
                    <Tab label="Pendente" value="pending" disableRipple />
                    {/* <Badge color="error" className="absolute left-0 top-0" /> */}
                    <Tab label="Fechado" value="closed" disableRipple />
                    {/* <Badge color="error" className="absolute left-0 top-0" /> */}
                    {/* {chatBotLane === "enabled" && (
                                    <Tab
                                        icon={<Settings />}
                                        label="Chatbot"
                                        value="chatbot"
                                        className={clsx(darkMode ? "text-white" : "text-black")}
                                        disableRipple
                                    />
                                )}
                                {chatBotLane === "enabled" && (
                                    <Badge
                                        badgeContent={pendingTicketsChatBot}
                                        color="error"
                                        className="absolute left-0 top-0"
                                    />
                                )}
                                {chatBotLane === "enabled" && (
                                    <Tooltip title="Conversas Privadas" className="bg-padrao text-gray-900 font-bold" />
                                )} */}
                </Tabs>

            )}

            {tabTickets === 1 && (
                <Tabs
                    sx={{ mt: 2, mb: 2 }}
                    variant="fullWidth"
                    value={tabTicketsStatus}
                    onChange={(_event, newValue) => setTabTicketsStatus(newValue)}
                >
                    <Tab label="Abertos" value="open" disableRipple />


                    <Tab label="Pendente" value="pending" disableRipple />
                    <Tab label="Fechado" value="closed" disableRipple />
                </Tabs>
            )}


            <TabPanel value={tabTickets} index={0} >
                <List
                    sx={{
                        width: "100%",
                        gap: 1,
                    }}
                >
                    {tabTicketsStatus === 'open' && (

                        //  <ItemTicket key={tickets[0].id} ticket={tickets[0]} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                        openTickets().map((ticket) => (
                            <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                        ))
                    )}
                    {tabTicketsStatus === 'pending' && (
                        pendingTickets().map((ticket) => (
                            <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                        ))
                    )}
                    {tabTicketsStatus === 'closed' && (
                        closedTickets().map((ticket) => (
                            <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                        ))
                    )}



                </List>
            </TabPanel>

            <TabPanel value={tabTickets} index={1}>
                {tabTickets === 1 && tabTicketsStatus === "open" && (
                    openGroupTickets().map((ticket) => (
                        <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                    ))
                )}
                {tabTickets === 1 && tabTicketsStatus === "pending" && (
                    pendingGroupTickets().map((ticket) => (
                        <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                    ))
                )}
                {tabTickets === 1 && tabTicketsStatus === "closed" && (
                    closedGroupTickets().map((ticket) => (
                        <ItemTicket key={ticket.id} ticket={ticket} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
                    ))
                )}
            </TabPanel>
            <Box sx={{
                px: 2, height: 60, display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <ToggleColorMode
                    data-screenshot="toggle-mode"
                    mode={mode}
                    toggleColorMode={handleToggleColor}
                />
                {whatsApps?.map((item) => (
                    <Box key={item.id} sx={{ mx: 0.5, p: 0, display: 'flex', alignItems: 'center' }}> {/* Equivalente a `q-mx-xs` e `q-pa-none` */}
                        <Tooltip
                            title={item.status}
                            placement="top"
                            sx={{
                                maxHeight: 300,
                                bgcolor: 'blue.100',
                                color: 'grey.900',
                                overflowY: 'auto',
                            }}
                        >
                            <IconButton
                                sx={{
                                    borderRadius: '50%',  // Equivalente ao `rounded`
                                    opacity: item.status === 'CONNECTED' ? 1 : 0.5,  // Condição de opacidade
                                    p: 0,  // Remove padding para replicar `flat`
                                    width: 36,  // Tamanho equivalente ao `size="18px"` ajustado
                                    height: 36,
                                }}
                            >
                                {/* O ícone pode ser um `img` ou `Avatar` */}
                                <Avatar
                                    src={`../${item.type}-logo.png`}
                                    sx={{ width: 18, height: 18, }}  // Ajuste do tamanho do ícone
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}

            </Box>
        </>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        < >
            <Box sx={{ display: 'flex', }}>
                <InfoCabecalhoMenssagens />
                {/* <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ ml: 2, mt: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton> */}

                <Box
                    component="nav"
                    sx={{
                        // width: { sm: drawerWidth, md: 0 },
                        flexShrink: { sm: 0 },
                        overflow: 'auto'
                    }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { md: drawerWidth, sm: drawerWidth } },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{
                        paddingLeft: { md: '380px', sm: '0' },
                        mr: isContactInfo ? '300px' : '0',
                        flexGrow: 1,
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* <Outlet context={{ drawerWidth, handleDrawerToggle }} /> */}
                    <Outlet />
                </Box>
            </Box>

        </>
    );
}
