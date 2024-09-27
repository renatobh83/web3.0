import { AtualizarStatusTicket } from '../services/tickets.js';
import { useState } from 'react';
import { toast } from 'sonner';
import { Errors } from '../utils/error.js';

interface Ticket {
    id: number;
    name?: string;
    contact?: { name: string };
}

const userId = Number(localStorage.getItem('userId'));

export const useTicketService = () => {
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<{ status: string; ticket: Ticket } | null>(null);

    const iniciarAtendimento = async (ticket: Ticket) => {
        setLoading(true);
        try {
            await AtualizarStatusTicket(ticket.id, 'open', userId);
            toast.success(`Atendimento Iniciado || ${ticket.name} - Ticket: ${ticket.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Não foi possível atualizar o status');
        } finally {
            setLoading(false);
        }
    };

    const atualizarStatusTicket = (ticket: Ticket, status: 'open' | 'pending' | 'closed') => {
        const contatoName = ticket.contact?.name || '';
        const ticketId = ticket.id;
        console.log(ticket)
        // Define os textos de acordo com o status
        const title = {
            open: 'Atendimento será iniciado, ok?',
            pending: 'Retornar à fila?',
            closed: 'Encerrar o atendimento?',
        };

        const toastMessage = {
            open: 'Atendimento iniciado!',
            pending: 'Retornado à fila!',
            closed: 'Atendimento encerrado!',
        };

        // Abre o diálogo de confirmação
        setDialogData({ status, ticket });
        setDialogOpen(true);

        // Função para confirmar a ação
        const handleConfirm = async () => {
            setLoading(true);
            try {
                await AtualizarStatusTicket(ticketId, status, userId);
                toast.success(`${toastMessage[status]} || ${contatoName} (Ticket ${ticketId})`);
                setDialogOpen(false);
                // Exemplo de redirecionamento após encerrar atendimento
                // if (status !== 'open') navigate('/chat-empty');
            } catch (error) {
                if (error.status === 409)
                    toast.message('Não possivel fazer a reabertura desse ticket', {
                        description: 'Atendimento ja consta com um ticket em aberto, solicitar administrador para abrir um novo ticket',
                        position: 'top-center'
                    });
            } finally {
                setLoading(false);
            }
        };

        // Função para fechar o diálogo
        const handleClose = () => {
            setDialogOpen(false);
        };

        return { handleConfirm, handleClose };
    };

    return { iniciarAtendimento, atualizarStatusTicket, loading, dialogOpen, dialogData };
};
