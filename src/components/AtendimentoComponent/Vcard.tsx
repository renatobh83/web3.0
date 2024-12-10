import { useCallback, useEffect, useState } from "react"
import { CriarContatoVcard, ObterContatoPeloNumero } from "../../services/contatos"
import { Avatar, Box, Button, Typography } from "@mui/material"
import { useWhatsappStore } from "../../store/whatsapp"
import { ModalNovoTicket } from "../../pages/Atendimento/ModalNovoTicket"
import { useApplicationStore } from "../../store/application"

interface VcardProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    vcard: any
}

export const Vcard = ({ vcard }: VcardProps) => {
    const { whatsApps } = useWhatsappStore()
    const [openModal, setOpenModal] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const { contatoSelecionado, setContatoSelecionado } = useApplicationStore()
    const [contact, setcontact] = useState(null)
    const isWhatsAppConnected = () => {
        return whatsApps.some(w => w.type === 'whatsapp' && w.status === 'CONNECTED');
    }
    const getInfoVCard = () => {
        const array = vcard.split('\n')

        const obj = []
        let contact = ''
        for (let index = 0; index < array.length; index++) {
            const v = array[index]
            const values = v.split(':')

            for (let ind = 0; ind < values.length; ind++) {

                if ((values[ind].includes('item1.TEL;waid='))) {

                    const result = values[ind].split('=')[1]
                    obj.push({ number: result })
                }
                if (values[ind].indexOf('FN') !== -1) {
                    contact = values[ind + 1]
                }
            }
        }
        return { contact, number: obj }
    }
    const fetchContact = useCallback(async (contact, number) => {

        try {
            const { data } = await ObterContatoPeloNumero(number[0].number.replace(/\D/g, ''))
            if (data) {
                setcontact(data)
            }
        } catch (error) {
            try {
                const contactObj = {
                    name: contact,
                    number: number[0].number.replace(/\D/g, ''),
                    email: '',
                }
                const { data } = await CriarContatoVcard(contactObj)
                setcontact(data)

            } catch (error) {

            }
        }
    }, [])
    const closeModal = () => {
        setContatoSelecionado(undefined)
        setOpenModal(false)
    }
    const handleSaveTicket = (contact) => {
        if (!contact.id) return
        setOpenModal(true)
        setContatoSelecionado(contact)

    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const { contact, number } = getInfoVCard()
        fetchContact(contact, number);
    }, [vcard])
    return (
        <Box sx={{ minWidth: '250px' }}>
            <Box sx={{ display: 'flex', gap: 2, padding: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                <Box>
                    <Avatar
                        sizes="50"
                        src={contact?.profilePicUrl}
                    /></Box>
                <Box>
                    <Typography>{contact?.name}</Typography>
                    <Typography>{contact?.number}</Typography>
                </Box>
            </Box>
            {isWhatsAppConnected() &&
                <Button
                    onClick={() => handleSaveTicket(contact)}
                    variant="contained" color="success" size="small" sx={{ mt: 1 / 2 }}>Abrir Ticket </Button>}
            <ModalNovoTicket open={openModal} close={closeModal} isContact={contatoSelecionado} />
        </Box >
    )
}