// import { Box, Button, Fade, Typography } from '@mui/material'
// import InfiniteScroll from 'react-infinite-scroll-component'
// import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
// import { useEffect, useRef, useState } from 'react'
// import { ChatMensagem } from './ChatMenssage.tsx'
// import { useMixinSocket } from '../../hooks/useMinxinScoket'

// import { ModalAgendamentoMensagem } from './ModalAgendamentoMensagem'
// import { useAtendimentoStore } from '../../store/atendimento'
// import { InputMenssagem } from './InputMenssagem'
// import { Close } from '@mui/icons-material'
// import { formatarMensagemWhatsapp } from '../../utils/helpers'

// import { EncaminharComponent } from '../../components/AtendimentoComponent/EncaminharComponent'

// import { useOutletContext } from 'react-router-dom'

// export type OutletContextType = {
//   drawerWidth: number
//   handleDrawerToggle: () => void
// }

// export const Chat = () => {
//   const ctx: { mensagensRapidas: [] } = useOutletContext()

//   const { socketTicketList } = useMixinSocket()
//   // const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
//   const { mensagens, LocalizarMensagensTicket } = useAtendimentoTicketStore()
//   const modalAgendamento = useAtendimentoStore(s => s.modalAgendamento)
//   const { ticketFocado, setTicketFocado, hasMore } = useAtendimentoTicketStore()
//   const [loading, setLoading] = useState(false)
//   const [replyingMessage, setReplyingMessage] = useState(null)
//   const isEmpty = !replyingMessage || Object.keys(replyingMessage).length === 0
//   const [hasMoreC, setHasMoreC] = useState(true);
//   const [cMessages, setCMessages] = useState(mensagens.slice(-10))
//   const [params, setParams] = useState({
//     ticketId: null,
//     pageNumber: 1,
//   })

//   useEffect(() => {
//     setReplyingMessage(null)
//     setCMessages(mensagens)
//   }, [mensagens])

//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     socketTicketList()
//   }, [])
//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     return () => {
//       setTicketFocado({
//         whatsapp: undefined,
//         channel: '',
//         lastMessageAt: undefined,
//         updatedAt: undefined,
//         user: undefined,
//         username: undefined,
//         contactId: undefined,
//         id: 0,
//         name: '',
//         lastMessage: '',
//         profilePicUrl: '',
//       })
//     }
//   }, [])
//   const onLoadMore = () => {
//     console.log('LoadMore')
//     const currentLength = cMessages.length;
//     if (currentLength === mensagens.length) {
//       setHasMoreC(false); // Não há mais mensagens a carregar
//       return;
//     }

//     // Calcula o próximo lote
//     const newMessages = mensagens.slice(
//       Math.max(mensagens.length - currentLength - 10, 0),
//       mensagens.length - currentLength
//     );

//     setCMessages(prevMessages => [...newMessages, ...prevMessages]);
//   };
//   // const onLoadMore = async () => {
//   //   console.log('load More')
//   //   if (loading) return
//   //   if (!hasMore || ticketFocado?.id) {
//   //     return
//   //   }
//   //   const nextPageNumber = params.pageNumber + 1
//   //   try {
//   //     setLoading(true)
//   //     await LocalizarMensagensTicket({ pageNumber: nextPageNumber, ticketId: (String(ticketFocado?.id)) })
//   //     // Atualiza os params com a nova página após o carregamento
//   //     setParams(prevParams => ({
//   //       ...prevParams,
//   //       pageNumber: nextPageNumber, // Atualiza para a nova página
//   //     }))
//   //     setLoading(false)
//   //   } catch (error) {
//   //     setLoading(false)
//   //   }
//   // }
//   const [OpenModalEnc, setOpenModalEnc] = useState(false)
//   const [_scrollIcon, _setScrollIcon] = useState(false)
//   // const scrollContainerRef = useRef<HTMLDivElement | null>(null)
//   const [mensagensParaEncaminhar, setMensagensParaEncaminhar] = useState([])
//   const resetMensagenParaEncaminhar = () => {

//     setMensagensParaEncaminhar([])
//   }
//   const getMensagensParaEncaminhar = (msg) => {

//     setMensagensParaEncaminhar([msg])
//   }
//   // const onScroll = (e: any) => {
//   //   if (
//   //     e.target.scrollTop + e.target.clientHeight >=
//   //     e.target.scrollHeight - 2000
//   //   ) {
//   //     setScrollIcon(false)
//   //   } else {
//   //     setScrollIcon(true)
//   //   }
//   // }
//   const [inputHeight, setInputHeight] = useState(0)

//   const footerRef = useRef<HTMLDivElement>(null)
//   const onResize = (entries: ResizeObserverEntry[]) => {
//     const entry = entries[0]
//     setInputHeight(entry.contentRect.height)
//   }

//   useEffect(() => {
//     const container = document.getElementById("scrollarea_container");
//     if (container) {
//       container.scrollTop = container.scrollHeight; // Força o scroll para o final no início
//     }
//   }, [cMessages]);
//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     const resizeObserver = new ResizeObserver(onResize)

//     if (footerRef.current) {
//       resizeObserver.observe(footerRef.current)
//     }

//     return () => {
//       if (footerRef.current) {
//         resizeObserver.unobserve(footerRef.current)
//       }
//     }
//   }, [])
//   const openModalEcanminhar = () => {

//     setOpenModalEnc(true)
//   }
//   function cStyleScroll(): React.CSSProperties {
//     const loading = 0 // Substitua essa lógica conforme necessário
//     const add = inputHeight + loading

//     return {
//       minHeight: `calc(100vh - ${62 + add}px)`,
//       height: `calc(100vh - ${62 + add}px)`,
//       width: '100%',
//       overflowY: 'auto',
//       contain: 'strict',
//       willChange: 'scroll-position',
//     }
//   }
//   return (
//     <Box
//       id="scrollInfinit"
//       sx={{
//         paddingTop: '61px',
//         paddingBottom: '73px',
//         overflowY: 'auto',

//       }}
//     >
//       {!mensagens.length ? (
//         <Fade in={true} timeout={2000}>
//           <Box
//             sx={{
//               display: 'flex',
//               height: '100vh',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             Carregando mensagens.....
//           </Box>
//         </Fade>
//       ) : (
//         <InfiniteScroll
//           style={{
//             background: 'url(../wa-background.png)',
//             backgroundPosition: 'center center !important',
//             scrollbarWidth: 'none',
//             overflow: 'hidden !important',
//           }}
//           dataLength={cMessages.length}
//           next={onLoadMore}
//           inverse={true}
//           hasMore={hasMoreC}
//           // biome-ignore lint/complexity/noUselessFragments: <explanation>
//           loader={<p>Carregando mais mensagens...</p>}
//           scrollableTarget="scrollarea_container"
//         >


//           <div style={cStyleScroll()}>
//             <ChatMensagem
//               mensagens={cMessages}
//               setReplyingMessage={setReplyingMessage}
//               getMensagenParaEncaminhar={getMensagensParaEncaminhar}
//               openModalEcanminhar={openModalEcanminhar}
//             />
//           </div>
//         </InfiniteScroll>
//       )}
//       <Box
//         sx={{
//           position: 'fixed',
//           bottom: 0,
//           left: { sm: 0, md: 380, xs: 0 },
//           right: 0,
//           zIndex: '2000',
//         }}
//         ref={footerRef}
//         component={'footer'}
//       >
//         <Box id="Drop_area" sx={{ p: 0 }}>
//           {!isEmpty && <Box sx={{
//             maxHeight: '140px',
//             py: 2,
//             width: '100% !important',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             position: 'relative'
//           }}>
//             <Box

//               sx={{
//                 width: '460px',
//                 // minWidth: '460px',
//                 // maxWidth: '460px',
//                 maxHeight: '110px',
//                 borderRadius: '10px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 flexWrap: 'nowrap',
//                 pb: { sm: '8px' },
//                 padding: '8px 16px',
//                 backgroundColor: 'background.paper',
//                 border: '1px solid black'
//               }}
//             >
//               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                 {!replyingMessage.fromMe &&
//                   <Typography variant='caption' color='gray'>
//                     {replyingMessage.contact?.name}
//                   </Typography>
//                 }
//                 <Typography style={{ maxWidth: 290, overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatarMensagemWhatsapp(replyingMessage.body)}</Typography>
//               </Box>
//               <Button size='small' variant='outlined' onClick={() => setReplyingMessage(null)}><Close sx={{ fontSize: '18px' }} /></Button>
//             </Box>
//           </Box>}
//           <InputMenssagem replyingMessage={replyingMessage} setReplyingMessage={setReplyingMessage} mensagensRapidas={ctx.mensagensRapidas} />
//         </Box>
//       </Box>
//       {modalAgendamento && <ModalAgendamentoMensagem />}
//       <EncaminharComponent
//         open={OpenModalEnc}
//         setClose={setOpenModalEnc}
//         menssagemParaEncaminhar={mensagensParaEncaminhar}
//         resetMensagenParaEncaminhar={resetMensagenParaEncaminhar}
//       />

//     </Box>
//     // <Box >
//     // <InfoCabecalhoMenssagens drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
//     //  <InfoCabecalhoMenssagens />
//     // <Toolbar />

//     //  <Box id="scrollableDiv"
//     //             sx={{
//     //                 minHeight: "calc(100vh - 143px)",
//     //                 height: "calc(100vh - 143px)",
//     //                 width: '100%',
//     //                 overflowY: 'auto',
//     //                 display: 'flex',
//     //                 flexDirection: 'column-reverse',
//     //             }}
//     //         >
//     //             {!mensagens.length ? (
//     //                 <Fade in={true} timeout={4000}>
//     //                     <div>Nao tem nada de novo</div>
//     //                 </Fade>
//     //             ) :
//     //                 <Box
//     //                     sx={{
//     //                         width: '100% !important',
//     //                         height: '100% !important',
//     //                         overflow: 'auto',
//     //                         scrollbarWidth: 'none'
//     //                     }}
//     //                     style={{
//     //                         background: 'url(../wa-background.png) ',

//     //                     }}
//     //                     id="scrollableDiv2"
//     //                     className="overflow-y-auto relative"
//     //                     ref={scrollContainerRef}
//     //                     onScroll={onScroll}
//     //                 >
//     //                     <InfiniteScroll
//     //                         dataLength={mensagens.length}
//     //                         next={onLoadMore}
//     //                         hasMore={false}
//     //                         loader={<h4>Loading...</h4>}
//     //                         scrollableTarget="scrollableDiv"
//     //                     >

//     //                         <ChatMensagem menssagens={mensagens} />
//     //                     </InfiniteScroll>
//     //                 </Box>
//     //             }
//     //         </Box>
//     // </Box >
//   )
// }
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket';
import { useEffect, useRef, useState } from 'react';
import { ChatMensagem } from './ChatMenssage.tsx';
import { useMixinSocket } from '../../hooks/useMinxinScoket';

import { ModalAgendamentoMensagem } from './ModalAgendamentoMensagem';
import { useAtendimentoStore } from '../../store/atendimento';
import { InputMenssagem } from './InputMenssagem';
import { Close } from '@mui/icons-material';
import { formatarMensagemWhatsapp } from '../../utils/helpers';

import { EncaminharComponent } from '../../components/AtendimentoComponent/EncaminharComponent';

import { useOutletContext } from 'react-router-dom';

export type OutletContextType = {
  drawerWidth: number;
  handleDrawerToggle: () => void;
};

export const Chat = () => {
  const ctx: { mensagensRapidas: [] } = useOutletContext();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeight = useRef<number>(0);
  const { isContactInfo } = useAtendimentoStore()
  const { socketTicketList } = useMixinSocket();
  const { mensagens, LocalizarMensagensTicket, hasMore } = useAtendimentoTicketStore();
  const modalAgendamento = useAtendimentoStore((s) => s.modalAgendamento);
  const { ticketFocado, setTicketFocado } = useAtendimentoTicketStore();
  const [replyingMessage, setReplyingMessage] = useState(null);
  const isEmpty = !replyingMessage || Object.keys(replyingMessage).length === 0;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [cMessages, setCMessages] = useState<any[]>(mensagens.slice(-10)); // Carrega as últimas 10 mensagens inicialmente

  const [params, setParams] = useState({
    ticketId: null,
    pageNumber: 1,
  })
  const [isLoading, setIsloading] = useState(false)
  const [OpenModalEnc, setOpenModalEnc] = useState(false);
  const [mensagensParaEncaminhar, setMensagensParaEncaminhar] = useState([]);
  // useEffect(() => {
  //   setReplyingMessage(null);
  //   setCMessages(mensagens.slice(-10)); // Inicia com as últimas 10 mensagens
  // }, [mensagens]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

    socketTicketList();
  }, []);
  // biome-ignore lint: nao tem
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
        id: undefined,
        name: '',
        lastMessage: '',
        profilePicUrl: '',
      });
    };

  }, []);




  const resetMensagenParaEncaminhar = () => {
    setMensagensParaEncaminhar([]);
  };

  const getMensagensParaEncaminhar = (msg) => {
    setMensagensParaEncaminhar([msg]);
  };

  // const [inputHeight, setInputHeight] = useState(0);

  const footerRef = useRef<HTMLDivElement>(null);
  // const onResize = (entries: ResizeObserverEntry[]) => {
  //   const entry = entries[0];
  //   console.log(entry)
  //   setInputHeight(entry.contentRect.height);
  // };

  // useEffect(() => {
  //   const resizeObserver = new ResizeObserver(onResize);

  //   if (footerRef.current) {
  //     resizeObserver.observe(footerRef.current);
  //   }

  //   return () => {
  //     if (footerRef.current) {
  //       resizeObserver.unobserve(footerRef.current);
  //     }
  //   };
  // }, []);

  const openModalEcanminhar = () => {
    setOpenModalEnc(true);
  };


  // Função para carregar mais mensagens no scroll
  const handleScroll = async () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      if (!hasMore || !ticketFocado || isLoading) {
        return
      }
      const nextPageNumber = params.pageNumber + 1

      if (scrollTop === 0 && hasMore) {
        // Salva a altura do contêiner antes de carregar novas mensagens
        previousScrollHeight.current = containerRef.current.scrollHeight;
        try {
          setIsloading(true)
          await LocalizarMensagensTicket({ pageNumber: nextPageNumber, ticketId: (String(ticketFocado?.id)) })
          // Atualiza os params com a nova página após o carregamento
          setParams(prevParams => ({
            ...prevParams,
            pageNumber: nextPageNumber, // Atualiza para a nova página
          }))
          setIsloading(false)
        } catch (error) {
          setIsloading(false)
        }
        const currentLength = cMessages.length;
        const nextMessages = mensagens.slice(
          Math.max(0, mensagens.length - currentLength - 10),
          mensagens.length - currentLength
        );

        setCMessages((prev) => [...nextMessages, ...prev]);

        if (currentLength + nextMessages.length >= mensagens.length) {
          // setHasMore(false);
        }
      }
    }
  };
  useEffect(() => {

    setCMessages(mensagens)
  }, [mensagens])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (containerRef.current && !isLoading) {
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 0);
    }
  }, [mensagens])
  // Ajusta o scroll após carregar mensagens mais antigas
  // biome-ignore lint : sem explicacao
  useEffect(() => {
    if (containerRef.current && previousScrollHeight.current > 0) {
      const scrollDiff =
        containerRef.current.scrollHeight - previousScrollHeight.current;
      containerRef.current.scrollTop = scrollDiff; // Mantém a posição de scroll após adicionar novas mensagens
    }

  }, [mensagens]);

  // Scrolla automaticamente para baixo ao adicionar novas mensagens (apenas ao final da lista)
  // biome-ignore lint:
  useEffect(() => {
    if (containerRef.current && !previousScrollHeight.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [mensagens]);
  const { drawerWidth } =
    useAtendimentoStore()
  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        background: 'url(../wa-background.png)',
        backgroundPosition: 'center center !important',
        maxHeight: 'calc(100vh - 80px)',
        // paddingLeft: { md: '380px', sm: '0' },
        width: { md: `calc(100% - ${drawerWidth}px)` },
        mr: isContactInfo ? '300px' : '0',
        height: 'calc(100vh - 77px)',
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        bgcolor: "#f0f0f0",
      }}
    >

      <ChatMensagem
        mensagens={cMessages}
        setReplyingMessage={setReplyingMessage}
        getMensagenParaEncaminhar={getMensagensParaEncaminhar}
        openModalEcanminhar={openModalEcanminhar}
      />


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
          {!isEmpty && (
            <Box
              sx={{
                maxHeight: '140px',
                py: 2,
                width: '100% !important',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: '460px',
                  maxHeight: '110px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'nowrap',
                  pb: { sm: '8px' },
                  padding: '8px 16px',
                  backgroundColor: 'background.paper',
                  border: '1px solid black',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {!replyingMessage.fromMe && (
                    <Typography variant="caption" color="gray">
                      {replyingMessage.contact?.name}
                    </Typography>
                  )}
                  <Typography
                    style={{
                      maxWidth: 290,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {formatarMensagemWhatsapp(replyingMessage.body)}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setReplyingMessage(null)}
                >
                  <Close sx={{ fontSize: '18px' }} />
                </Button>
              </Box>
            </Box>
          )}
          <InputMenssagem
            replyingMessage={replyingMessage}
            setReplyingMessage={setReplyingMessage}
            mensagensRapidas={ctx.mensagensRapidas}
          />
        </Box>
      </Box>
      {modalAgendamento && <ModalAgendamentoMensagem />}
      <EncaminharComponent
        open={OpenModalEnc}
        setClose={setOpenModalEnc}
        menssagemParaEncaminhar={mensagensParaEncaminhar}
        resetMensagenParaEncaminhar={resetMensagenParaEncaminhar}
      />
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10, // Garantir que o spinner fique acima dos outros elementos
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
