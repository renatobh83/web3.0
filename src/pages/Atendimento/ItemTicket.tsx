import { Avatar, Badge, Box, Chip, IconButton, ListItem, ListItemAvatar, ListItemButton, Typography } from "@mui/material"
import type { Ticket } from "../../store/atendimentoTicket"
import PlayArrow from "@mui/icons-material/PlayArrow"

import { CheckCircle, WhatsApp } from "@mui/icons-material"
import { formatDistance, parseJSON } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ItemTicketProps {
    ticket: Ticket,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    filas: any[],
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    etiquetas: any[],
    buscaTicket: boolean

}

export const ItemTicket = ({ etiquetas, filas, ticket, buscaTicket }: ItemTicketProps) => {

    const obterNomeFila = (ticket: Ticket) => {
        const fila = filas.find((f) => f.id === ticket.queueId);
        return fila ? fila.queue : "";
    };
    const dataInWords = (timestamp: string, updated: string) => {
        const data = timestamp ? new Date(Number(timestamp)) : parseJSON(updated);
        return formatDistance(data, new Date(), { locale: ptBR });
    };
    if (!ticket) { return }

    return (
        <ListItem
            disablePadding
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',

            }}
        >
            <ListItemButton
                sx={{
                    height: 120,
                    width: '100%',
                    borderLeft: '6px solid',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: '100 !important'
                }}
            >
                {/* Imagem de perfil */}
                <ListItemAvatar>
                    {ticket.status === "pending" ?
                        <Avatar sx={{ width: 50, height: 50 }}>
                            <Badge
                                badgeContent={ticket.unreadMessages}
                                color="secondary"
                                sx={{ mr: 1 }}
                            >
                                <PlayArrow />
                            </Badge>
                        </Avatar> :
                        <Avatar
                            alt={ticket.name || ticket.contact.name}
                            src={ticket.profilePicUrl} // Substitua pelo caminho da imagem
                            sx={{ width: 48, height: 48, flexShrink: 0 }} // Largura fixa para o avatar
                        />}
                </ListItemAvatar>

                {/* Informações do ticket */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        minWidth: 0, // Garante que a largura do texto seja ajustada ao container
                        marginLeft: 1,
                        marginRight: 1, // Margem lateral entre texto e outros elementos
                        overflow: 'hidden', // Impede que o conteúdo estoure
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        // sx={{ width: '100%' }}
                    >
                        <Typography
                            // fontWeight="bold"/
                            variant="inherit"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'  // Limita o tamanho do nome
                            }}
                        >
                            {ticket.name || ticket.contact.name}
                        </Typography>

                     
                        {/* <Typography variant="caption" color="textSecondary" sx={{ flexShrink: 0 }}>
                            {dataInWords(ticket.lastMessageAt, ticket.updatedAt)}
                        </Typography> */}
                    </Box>

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                        }}
                    >
                        {ticket.lastMessage}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={1}
                        sx={{
                            maxWidth: '100%',   // Garante que o Box não ultrapasse o espaço disponível
                            overflow: 'hidden', // Impede o conteúdo de estourar
                            flexShrink: 1       // Permite que o Box diminua se necessário
                        }}
                    >
                        <Chip
                            // biome-ignore lint/complexity/useOptionalChain: <explanation>
                            label={ticket.whatsapp && ticket.whatsapp.name}
                            size="small"
                            sx={{
                                maxWidth: '50%',  // Limita o tamanho do Chip para garantir que não estoure
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        />
                        {ticket.channel === 'whatsapp' && (

                            <WhatsApp
                                fontSize="small"
                                sx={{ color: 'green !important' }}
                            />
                        )}
                    </Box>

                    <Typography variant="caption" color="textSecondary">
                        Usuário:  {ticket.username} {/* Substitua pela lógica */}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Fila: {ticket.queue || obterNomeFila(ticket)}
                    </Typography>
                </Box>

                {/* Ícone de verificação e número do ticket */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent='space-around'
                    height={'100%'}
                  
                    sx={{
                        minWidth: 50, // Tamanho fixo para a coluna da direita
                        flexShrink: 0 // Impede que a coluna da direita diminua
                    }}
                >
                       <Chip
                        label={dataInWords(ticket.lastMessageAt, ticket.updatedAt)}
                        size="small"
                      
                    />
                 
                    <Typography variant="body2" color="textSecondary">
                        #{ticket.id}
                    </Typography>
                    {ticket.status === "closed" && (
                
                        <CheckCircle fontSize="medium"  sx={{color: "green !important"}}/>
                   
                    )}
                </Box>
            </ListItemButton>
        </ListItem >
    )
}