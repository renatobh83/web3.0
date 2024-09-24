import { useParams } from "react-router-dom";
import { Box, Fade, Toolbar } from "@mui/material";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAtendimentoTicketStore } from "../../store/atendimentoTicket";
import { useEffect, useRef, useState } from "react";
import { ChatMensagem } from "./ChatMenssage";
import { InputMenssagem } from "./InputMenssagem";

export type OutletContextType = {
    drawerWidth: number;
    handleDrawerToggle: () => void;
};


export const Chat = () => {

    // const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();


    const { mensagens, LocalizarMensagensTicket } = useAtendimentoTicketStore()
    const { ticketFocado, setTicketFocado } = useAtendimentoTicketStore()

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        return () => {
            setTicketFocado({
                whatsapp: undefined,
                channel: "",
                lastMessageAt: undefined,
                updatedAt: undefined,
                user: undefined,
                username: undefined,
                contactId: undefined,
                id: 0,
                name: "",
                lastMessage: "",
                profilePicUrl: ""
            })
        }
    }, [])

    const [loading, setLoading] = useState(false)



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
            {/* <InfoCabecalhoMenssagens /> */}
            {/* <Toolbar /> */}
            <Box id='page-container'
                sx={{
                    paddingTop: '61px',
                    paddingBottom: '73px'
                }}>
                {!mensagens.length ? (
                    <Fade in={true} timeout={4000}>
                        <div>Nao tem nada de novo</div>
                    </Fade>
                ) :

                    <InfiniteScroll

                        style={{
                            background: 'url(../wa-background.png)',
                            backgroundPosition: 'center center !important',
                            scrollbarWidth: 'none',
                            overflow: 'hidden !important'
                        }}
                        dataLength={mensagens.length}
                        next={onLoadMore}
                        hasMore={false}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                    >
                        <ChatMensagem menssagens={mensagens} />
                    </InfiniteScroll>
                }

                {/* <InputMenssagem ticketFocado={ticketFocado} /> */}
            </Box>
            {/* <Box id="scrollableDiv"
                sx={{
                    minHeight: "calc(100vh - 143px)",
                    height: "calc(100vh - 143px)",
                    width: '100%',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                {!mensagens.length ? (
                    <Fade in={true} timeout={4000}>
                        <div>Nao tem nada de novo</div>
                    </Fade>
                ) :
                    <Box
                        sx={{
                            width: '100% !important',
                            height: '100% !important',
                            overflow: 'auto',
                            scrollbarWidth: 'none'
                        }}
                        style={{
                            background: 'url(../wa-background.png) ',


                        }}
                        id="scrollableDiv2"
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



                            <ChatMensagem menssagens={mensagens} />
                        </InfiniteScroll>
                    </Box>
                }
            </Box> */}

        </Box >

    )
}