import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useAtendimentoStore } from "../../store/atendimento";
import { InfoCabecalhoMenssagens } from "../Atendimento/InforCabecalhoChat";

interface Message {
    id: number;
    content: string;
    fromMe: boolean;
}

const mockMessages = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    content: `Message ${i + 1}`,
    fromMe: i % 2 === 0,
})).reverse(); // Simula mensagens com IDs decrescentes (mais novas no final)

export const Atendimento2 = () => {
    const { drawerWidth } =
        useAtendimentoStore()
    const [messages, setMessages] = useState<Message[]>(mockMessages.slice(-10)); // Carrega as últimas 10 mensagens inicialmente
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const previousScrollHeight = useRef<number>(0);

    // Função para carregar mais mensagens no scroll
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop } = containerRef.current;

            if (scrollTop === 0 && hasMore) {
                // Salva a altura do contêiner antes de carregar novas mensagens
                previousScrollHeight.current = containerRef.current.scrollHeight;

                const currentLength = messages.length;
                const nextMessages = mockMessages.slice(
                    Math.max(0, mockMessages.length - currentLength - 10),
                    mockMessages.length - currentLength
                );

                setMessages((prev) => [...nextMessages, ...prev]);

                if (currentLength + nextMessages.length >= mockMessages.length) {
                    setHasMore(false);
                }
            }
        }
    };

    // Ajusta o scroll após carregar mensagens mais antigas
    useEffect(() => {
        if (containerRef.current && previousScrollHeight.current > 0) {
            const scrollDiff =
                containerRef.current.scrollHeight - previousScrollHeight.current;
            containerRef.current.scrollTop = scrollDiff; // Mantém a posição de scroll após adicionar novas mensagens
        }
    }, [messages]);

    // Scrolla automaticamente para baixo ao adicionar novas mensagens (apenas ao final da lista)
    useEffect(() => {
        if (containerRef.current && !previousScrollHeight.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setMessages((prev) => [
    //             ...prev,
    //             { id: prev.length + 1, content: 'new', fromMe: true }
    //         ])
    //     }, 1000);
    //     return () => clearInterval(interval)
    // }, [])
    return (
        <Box sx={{ display: 'flex' }}>
            <InfoCabecalhoMenssagens />
            <Box
                component="aside"
                sx={{
                    width: '380px',
                    flexShrink: { sm: 0 },
                    overflow: 'auto',
                }}
                aria-label="asside menu"
            >Asside Menu</Box>
            <Box
                ref={containerRef}
                onScroll={handleScroll}
                sx={{
                    paddingTop: '70px',
                    maxHeight: 'calc(100vh - 64px)',

                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    height: "500px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    padding: 2,
                    flexGrow: 1,
                    bgcolor: "#f0f0f0",
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: "flex",
                            justifyContent: msg.fromMe ? "flex-end" : "flex-start",
                            mb: 1,
                        }}
                    >
                        <Paper
                            sx={{
                                padding: 2,
                                maxWidth: "60%",
                                bgcolor: msg.fromMe ? "#dcf8c6" : "#fff",
                            }}
                        >
                            <Typography variant="body2">{msg.content}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};