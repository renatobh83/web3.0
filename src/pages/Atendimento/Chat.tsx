import { Box, Button, Fade, Typography } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { useEffect, useRef, useState } from 'react'
import { ChatMensagem } from './ChatMenssage.tsx'
import { useMixinSocket } from '../../hooks/useMinxinScoket'

import { ModalAgendamentoMensagem } from './ModalAgendamentoMensagem'
import { useAtendimentoStore } from '../../store/atendimento'
import { InputMenssagem } from './InputMenssagem'
import { Close } from '@mui/icons-material'
import { formatarMensagemWhatsapp } from '../../utils/helpers'

import { EncaminharComponent } from '../../components/AtendimentoComponent/EncaminharComponent'

import { useOutletContext } from 'react-router-dom'

export type OutletContextType = {
  drawerWidth: number
  handleDrawerToggle: () => void
}

export const Chat = () => {
  const ctx: { mensagensRapidas: [] } = useOutletContext()

  const { socketTicketList } = useMixinSocket()
  // const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
  const { mensagens, LocalizarMensagensTicket } = useAtendimentoTicketStore()
  const modalAgendamento = useAtendimentoStore(s => s.modalAgendamento)
  const { ticketFocado, setTicketFocado, hasMore } = useAtendimentoTicketStore()
  const [loading, setLoading] = useState(false)
  const [replyingMessage, setReplyingMessage] = useState(null)
  const isEmpty = !replyingMessage || Object.keys(replyingMessage).length === 0

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

  const onLoadMore = async () => {
    console.log('load More')
    if (loading) return
    if (!hasMore || ticketFocado?.id) {
      return
    }
    const nextPageNumber = params.pageNumber + 1
    try {
      setLoading(true)
      await LocalizarMensagensTicket({ pageNumber: nextPageNumber, ticketId: (String(ticketFocado?.id)) })
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
  const [OpenModalEnc, setOpenModalEnc] = useState(false)
  const [_scrollIcon, _setScrollIcon] = useState(false)
  // const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [mensagensParaEncaminhar, setMensagensParaEncaminhar] = useState([])
  const resetMensagenParaEncaminhar = () => {

    setMensagensParaEncaminhar([])
  }
  const getMensagensParaEncaminhar = (msg) => {

    setMensagensParaEncaminhar([msg])
  }
  // const onScroll = (e: any) => {
  //   if (
  //     e.target.scrollTop + e.target.clientHeight >=
  //     e.target.scrollHeight - 2000
  //   ) {
  //     setScrollIcon(false)
  //   } else {
  //     setScrollIcon(true)
  //   }
  // }
  const [inputHeight, setInputHeight] = useState(0)

  const footerRef = useRef<HTMLDivElement>(null)
  const onResize = (entries: ResizeObserverEntry[]) => {
    const entry = entries[0]
    setInputHeight(entry.contentRect.height)
  }


  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const resizeObserver = new ResizeObserver(onResize)

    if (footerRef.current) {
      resizeObserver.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        resizeObserver.unobserve(footerRef.current)
      }
    }
  }, [])
  const openModalEcanminhar = () => {

    setOpenModalEnc(true)
  }
  function cStyleScroll(): React.CSSProperties {
    const loading = 0 // Substitua essa lógica conforme necessário
    const add = inputHeight + loading

    return {
      minHeight: `calc(100vh - ${62 + add}px)`,
      height: `calc(100vh - ${62 + add}px)`,
      width: '100%',
      overflowY: 'auto',
      contain: 'strict',
      willChange: 'scroll-position',
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


          <div style={cStyleScroll()}>
            <ChatMensagem
              mensagens={cMessages}
              setReplyingMessage={setReplyingMessage}
              getMensagenParaEncaminhar={getMensagensParaEncaminhar}
              openModalEcanminhar={openModalEcanminhar}
            />
          </div>
        </InfiniteScroll>
      )}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: { sm: 0, md: 380, xs: 0 },
          right: 0,
          zIndex: '2000',
        }}
        ref={footerRef}
        component={'footer'}
      >
        <Box id="Drop_area" sx={{ p: 0 }}>
          {!isEmpty && <Box sx={{
            maxHeight: '140px',
            py: 2,
            width: '100% !important',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative'
          }}>
            <Box

              sx={{
                width: '460px',
                // minWidth: '460px',
                // maxWidth: '460px',
                maxHeight: '110px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'nowrap',
                pb: { sm: '8px' },
                padding: '8px 16px',
                backgroundColor: 'background.paper',
                border: '1px solid black'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {!replyingMessage.fromMe &&
                  <Typography variant='caption' color='gray'>
                    {replyingMessage.contact?.name}
                  </Typography>
                }
                <Typography style={{ maxWidth: 290, overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatarMensagemWhatsapp(replyingMessage.body)}</Typography>
              </Box>
              <Button size='small' variant='outlined' onClick={() => setReplyingMessage(null)}><Close sx={{ fontSize: '18px' }} /></Button>
            </Box>
          </Box>}
          <InputMenssagem replyingMessage={replyingMessage} setReplyingMessage={setReplyingMessage} mensagensRapidas={ctx.mensagensRapidas} />
        </Box>
      </Box>
      {modalAgendamento && <ModalAgendamentoMensagem />}
      <EncaminharComponent
        open={OpenModalEnc}
        setClose={setOpenModalEnc}
        menssagemParaEncaminhar={mensagensParaEncaminhar}
        resetMensagenParaEncaminhar={resetMensagenParaEncaminhar}
      />

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
