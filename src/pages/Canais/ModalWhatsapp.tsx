import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material"

export const ModalWhatsapp = () => {
    return(
        <Dialog fullWidth maxWidth="sm" open={true}>
            <DialogContent>
                <Box sx={{display:'flex', justifyContent:"space-between", flexDirection:'column'}}>
 
                <Box sx={{minHeight: 50}}>Header</Box>
                <Box sx={{flexGrow:1}} component={'form'}>

                    <TextField fullWidth/>
                </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button>a</Button>
                <Button>a</Button>
            </DialogActions>
        </Dialog>
    )
}