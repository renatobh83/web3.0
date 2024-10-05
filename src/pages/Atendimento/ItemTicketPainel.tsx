import { Box, ListItem } from '@mui/material'

export const ItemTicketPainel = () => {
  return (
    <Box
      component={'ul'}
      sx={{
        maxWidth: 370,
        pt: 1,
        px: '4px',
        pb: 0,
      }}
    >
      <ListItem>Item 1</ListItem>
    </Box>
  )
}
