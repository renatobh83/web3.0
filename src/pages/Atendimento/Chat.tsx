import { Box, Fade, Toolbar, Typography } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { useEffect, useRef, useState } from 'react'
import { ChatMensagem } from './ChatMenssage'
import { useMixinSocket } from '../../hooks/useMinxinScoket'
import { useSocketInitial } from '../../hooks/useSocketInitial'
import { ModalAgendamentoMensagem } from './ModalAgendamentoMensagem'
import { useAtendimentoStore } from '../../store/atendimento'
import { InputMenssagem } from './InputMenssagem'

export type OutletContextType = {
  drawerWidth: number
  handleDrawerToggle: () => void
}

export const Chat = () => {
  const { socketTicket, socketTicketList } = useMixinSocket()
  // const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
  const { mensagens, LocalizarMensagensTicket } = useAtendimentoTicketStore()
  const modalAgendamento = useAtendimentoStore(s => s.modalAgendamento)
  const { ticketFocado, setTicketFocado, hasMore } = useAtendimentoTicketStore()
  const [loading, setLoading] = useState(false)
  const [replyingMessage, setReplyingMessage] = useState(null)
  const [cMessages, setCMessages] = useState([])
  const [params, setParams] = useState({
    ticketId: null,
    pageNumber: 1,
  })

  useEffect(() => {
    setReplyingMessage(null)
    setCMessages(mensagens)
  }, [mensagens])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    socketTicketList()
  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      setTicketFocado({
        whatsapp: undefined,
        channel: '',
        lastMessageAt: undefined,
        updatedAt: undefined,
        user: undefined,
        username: undefined,
        contactId: undefined,
        id: 0,
        name: '',
        lastMessage: '',
        profilePicUrl: '',
      })
    }
  }, [])

  useSocketInitial()
  const onLoadMore = async () => {
    if (loading) return
    // if (!hasMore || ticketFocado.id) {
    //     return
    // }
    const nextPageNumber = params.pageNumber + 1
    try {
      setLoading(true)
      const params = {
        ticketId: ticketFocado.id,
        pageNumber: nextPageNumber,
      }
      await LocalizarMensagensTicket(params)
      // Atualiza os params com a nova página após o carregamento
      setParams(prevParams => ({
        ...prevParams,
        pageNumber: nextPageNumber, // Atualiza para a nova página
      }))
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [scrollIcon, setScrollIcon] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const onScroll = (e: any) => {
    if (
      e.target.scrollTop + e.target.clientHeight >=
      e.target.scrollHeight - 2000
    ) {
      setScrollIcon(false)
    } else {
      setScrollIcon(true)
    }
  }

  return (
    <Box
      id="scrollInfinit"
      sx={{
        paddingTop: '61px',
        paddingBottom: '73px',

        overflowY: 'auto',
      }}
    >
      {!mensagens.length ? (
        <Fade in={true} timeout={2000}>
          <Box
            sx={{
              display: 'flex',
              height: '100vh',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Carregando mensagens.....
          </Box>
        </Fade>
      ) : (
        <InfiniteScroll
          style={{
            background: 'url(../wa-background.png)',
            backgroundPosition: 'center center !important',
            scrollbarWidth: 'none',
            overflow: 'hidden !important',
          }}
          dataLength={cMessages.length}
          next={onLoadMore}
          inverse={true}
          hasMore={hasMore}
          // biome-ignore lint/complexity/noUselessFragments: <explanation>
          loader={<></>}
          scrollableTarget="scrollarea_container"
        >
          <ChatMensagem menssagens={cMessages} />
        </InfiniteScroll>
      )}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: { sm: 0, md: 380, xs: 0 },
          right: 0,
          px: 1,
        }}
        component={'footer'}
      >
        <Box id="Drop_area">
          <InputMenssagem />
        </Box>
      </Box>
      {modalAgendamento && <ModalAgendamentoMensagem />}
    </Box>
    // <Box >
    // <InfoCabecalhoMenssagens drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
    //  <InfoCabecalhoMenssagens />
    // <Toolbar />

    //  <Box id="scrollableDiv"
    //             sx={{
    //                 minHeight: "calc(100vh - 143px)",
    //                 height: "calc(100vh - 143px)",
    //                 width: '100%',
    //                 overflowY: 'auto',
    //                 display: 'flex',
    //                 flexDirection: 'column-reverse',
    //             }}
    //         >
    //             {!mensagens.length ? (
    //                 <Fade in={true} timeout={4000}>
    //                     <div>Nao tem nada de novo</div>
    //                 </Fade>
    //             ) :
    //                 <Box
    //                     sx={{
    //                         width: '100% !important',
    //                         height: '100% !important',
    //                         overflow: 'auto',
    //                         scrollbarWidth: 'none'
    //                     }}
    //                     style={{
    //                         background: 'url(../wa-background.png) ',

    //                     }}
    //                     id="scrollableDiv2"
    //                     className="overflow-y-auto relative"
    //                     ref={scrollContainerRef}
    //                     onScroll={onScroll}
    //                 >
    //                     <InfiniteScroll
    //                         dataLength={mensagens.length}
    //                         next={onLoadMore}
    //                         hasMore={false}
    //                         loader={<h4>Loading...</h4>}
    //                         scrollableTarget="scrollableDiv"
    //                     >

    //                         <ChatMensagem menssagens={mensagens} />
    //                     </InfiniteScroll>
    //                 </Box>
    //             }
    //         </Box>
    // </Box >
  )
}
