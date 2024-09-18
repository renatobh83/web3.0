import { useOutletContext } from "react-router-dom";
import { InfoCabecalhoMenssagens } from "./InforCabecalhoChat"
import { Box, CssBaseline, Fade, Toolbar } from "@mui/material";
import AppTheme from "../../Theme/AppTheme";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWhatsappStore } from "../../store/whatsapp";
import { useAtendimentoTicketStore } from "../../store/atendimentoTicket";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMensagem";
import { useAtendimentoStore } from "../../store/atendimento";

export type OutletContextType = {
    drawerWidth: number;
    handleDrawerToggle: () => void;
};


export const Chat = () => {

    // const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
    const { mensagens, LocalizarMensagensTicket } = useAtendimentoTicketStore()

    const [mensagensTicket, setMensagensTicket] = useState([])


    const [loading, setLoading] = useState(false)

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        LocalizarMensagensTicket({
            ticketId: '23',
            pageNumber: 0
        })

    }, [])




    const onLoadMore = async () => {
        if (loading) return
        console.log("onload")
        try {
            setLoading(true)

        } catch (error) {

        }
        // if (!loading && ticketFocado) {
        //   setLoading(true);
        //   // Fetch more messages here...
        //   setLoading(false);
        // }
    };
    const [scrollIcon, setScrollIcon] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const onScroll = (e: any) => {
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 2000) {
            setScrollIcon(false);
        } else {
            setScrollIcon(true);
        }
    };
    return (

        <Box >
            {/* <InfoCabecalhoMenssagens drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} /> */}
            <InfoCabecalhoMenssagens />
            <Toolbar />

            <Box id="scrollableDiv"

                style={{
                    height: "calc(100vh - 124px)",
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}>
                {!mensagens.length ? (
                    <Fade in={true} timeout={4000}>
                        <div>Nao tem nada de novo</div>
                    </Fade>
                ) :
                    <Box
                        // style={{ background: 'url(../wa-background.png) no-repeat center center fixed' }}
                        id="scrollableDiv"
                        className="overflow-y-auto relative"
                        ref={scrollContainerRef}
                        onScroll={onScroll}
                    >
                        <InfiniteScroll
                            dataLength={mensagens.length}
                            next={onLoadMore}
                            hasMore={false}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>
                            <div>Menssagens</div>


                        </InfiniteScroll>
                    </Box>
                }

            </Box>

            <Box sx={{ height: '60px' }}>Input</Box>
        </Box >

    )
}