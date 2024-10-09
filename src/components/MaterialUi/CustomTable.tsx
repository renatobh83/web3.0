import styled from "@emotion/styled";
import { Table } from "@mui/material";

export const CustomTableContainer = styled(Table)(({ theme }) => ({
    // Customize styles with Tailwind CSS classes
    padding: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[3],
    '& .MuiTableCell-root': {
        padding: theme.spacing(1),
    },
}))