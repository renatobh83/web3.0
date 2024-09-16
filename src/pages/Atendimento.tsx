import * as React from 'react';
import AppBar from '@mui/material/AppBar';
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
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, MenuItem, MenuList, Switch, Tab, Tabs, TextField, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledMenu } from '../components/MainComponents/MenusNavBar';
import { useCallback, useEffect, useState } from 'react';
import AppTheme from '../Theme/AppTheme';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { debounce } from 'lodash'
import { SelectComponent } from '../components/AtendimentoComponent/SelectComponent';
import { useAtendimentoTicketStore } from '../store/atendimentoTicket';
import { format } from 'date-fns';
import { ListarConfiguracoes } from '../services/configuracoes';
import { ConsultarTickets } from '../services/tickets';
import { useUsuarioStore } from '../store/usuarios';
import { ListarFilas } from '../services/filas';
import { ListarWhatsapps } from '../services/sessoesWhatsapp';
import { useWhatsappStore } from '../store/whatsapp';
import { ListarEtiquetas } from '../services/etiquetas';

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
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number, name: string) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
        name: name,
    };
}

const drawerWidth = 300;
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
    const { loadWhatsApps } = useWhatsappStore()

    const { setUsuarioSelecionado, toggleModalUsuario } = useUsuarioStore();

    const nav = useNavigate()
    const { window } = props;
    const tickets = useAtendimentoTicketStore((s) => s.tickets);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [tabTickets, setTabTickets] = useState(0);
    const [tabTicketsStatus, setTabTicketsStatus] = useState("pending");
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
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

    const handleChange = async (event: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        target: { name: any; checked: any };
    }) => {
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
        }, 100),
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


    const [etiquetas, setEtiquetas] = useState([])

    const listarEtiquetas = useCallback(async () => {
        const { data } = await ListarEtiquetas(true)
        setEtiquetas(data)
    }, [])


    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarFilas()
        listarWhatsapps()
        consultarTickets()
        listarEtiquetas()
    }, [])
    const drawer = (
        <div>
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

            <Divider />
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
                <Divider />

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
            </List>
            <Divider />

            {tabTickets === 0 && (
                <Tabs
                    sx={{ mt: 2 }}
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
                    sx={{ mt: 2 }}
                    variant="fullWidth"
                    value={tabTicketsStatus}
                    onChange={(event, newValue) => setTabTicketsStatus(newValue)}
                >
                    <Tab label="Abertos" value="open" disableRipple />


                    <Tab label="Pendente" value="pending" disableRipple />
                    <Tab label="Fechado" value="closed" disableRipple />
                </Tabs>
            )}
            <><TabPanel value={tabTickets} index={0}>
                <List
                    disablePadding={true}
                    sx={{
                        width: "100%",
                        maxWidth: 370,
                        bgcolor: "background.paper",
                        padding: 0,
                    }}
                >
                    {tickets
                        .filter((mensagem) => mensagem.status === tabTicketsStatus)
                        .map((mensagem) => (
                            // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                            <Box>
                                {mensagem.lastMessage}
                            </Box>
                            // <ItemTicket
                            //     key={mensagem.id}
                            //     ticket={mensagem}
                            //     abrirChatContato={() => { }} />
                        ))}
                </List>
            </TabPanel>
                <TabPanel value={tabTickets} index={1}>
                    {tabTickets === 1 && tabTicketsStatus === "open" && (
                        <div>open grupo</div>
                    )}
                    {tabTickets === 1 && tabTicketsStatus === "pending" && (
                        <div>pendentes grupo</div>
                    )}
                    {tabTickets === 1 && tabTicketsStatus === "closed" && (
                        <div>closed grupo</div>
                    )}
                </TabPanel>
            </>

        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <AppTheme>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline enableColorScheme />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Responsive drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <Typography sx={{ marginBottom: 2 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                        enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                        imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                        Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                        Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                        nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                        leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                        feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                        consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                        sapien faucibus et molestie ac.
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                        eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                        neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                        tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                        sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                        tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                        gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                        et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                        tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                        eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                        posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </Box>
            </Box>
        </AppTheme>
    );
}
