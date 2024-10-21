import { Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { ChatMensagem } from '../pages/Atendimento/ChatMenssage';

export const MolduraCelular = ({ children }) => {
    const Main = styled(Box)({
        width: '400px',
        height: '450px',
        backgroundColor: '#000000',
        padding: '30px',
        borderRadius: '2em',
    });

    const Inner = styled(Paper)({

        borderRadius: '2em',
        width: '390px',
        height: '430px',
        padding: '10px',
        marginLeft: '-25px',
        marginTop: '-24px',
        backgroundColor: '#fff',
    });

    const Cam = styled(Box)({
        backgroundColor: 'black',
        width: '20px',
        height: '20px',
        borderRadius: '20em',
        marginLeft: '50px',
    });

    const Speaker = styled(Box)({
        width: '40px',
        height: '10px',
        background: 'linear-gradient(90deg, grey 20%, white 30%, black 40%)',
        borderRadius: '0.5em',
        marginLeft: '165px',
        marginTop: '-12px',
    });

    const Screen = styled(Box)({
        backgroundColor: '#eeecece1',
        width: '380px',
        height: '370px',
        marginTop: '10px',
        marginLeft: '-5px',
        overflow: 'auto',
    });

    return (
        <Main>
            <Inner elevation={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" paddingBottom="10px">
                    <Cam />
                    <Speaker />
                </Box>
                <Screen>
                    {children}
                </Screen>
            </Inner>
        </Main>
    );
};

