import { Avatar, Box, IconButton, styled, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Tooltip } from "@mui/material";
import { filter } from "lodash";
import { useState } from "react";
import { useContatosStore } from "../../store/contatos";
import { useWhatsappStore } from "../../store/whatsapp";
import { Delete, Edit, Message } from "@mui/icons-material";

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
    // Customize styles with Tailwind CSS classes
    padding: theme.spacing(2),
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    "& .MuiTableCell-root": {
        padding: theme.spacing(1),
    },
}));
export const Contatos: React.FC<{
    isChatContact?: boolean;
}> = ({ isChatContact = false }) => {
    const columns = [
        {
            name: "profilePicUrl",
            label: "",
            field: "profilePicUrl",
            style: "w-[50px]",
            align: "center",
            renderCell: (params: { value: string | undefined }) => (
                <Box sx={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 1,

                    overflow: 'hidden'
                }} >
                    {params.value ? (
                        <Box component={'img'}
                            sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={params.value}
                            alt="Profile"

                        />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%'
                            }}
                            className="flex items-center justify-center w-full h-full text-gray-500">
                            <Avatar />
                        </Box>
                    )}
                </Box>
            ),
        },
        {
            name: "name",
            label: "Nome",
            field: "name",
            align: "left",
            style: "w-[300px]",
            format: (v: any, r: { number: any; name: any; pushname: any }) =>
                r.number && r.name === r.number && r.pushname ? r.pushname : r.name,
        },
        {
            name: "number",
            label: "WhatsApp",
            field: "number",
            align: "center",
            style: "w-[300px]",
        },
        {
            name: "wallet",
            label: "Carteira",
            field: "wallet",
            align: "center",
            style: "w-[300px]",
        },
        {
            name: "tags",
            label: "Etiquetas",
            field: "tags",
            align: "center",
            style: "w-[300px]",
            renderCell: (params: { value: any }) => (
                <div dangerouslySetInnerHTML={{ __html: params.value }} />
            ),
        },
        {
            name: "email",
            label: "Email",
            field: "email",
            style: "w-[500px]",
            align: "left",
        },

        {
            name: "birthdayDate",
            label: "Aniversário",
            field: "birthdayDate",
            style: "w-[500px]",
            align: "left",
        },

        {
            name: "acoes",
            label: "Ações",
            field: "acoes",
            align: "center",
            renderCell: (params: { row }) => (
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                    className="flex justify-center space-x-2">
                    {params.row.number && cSessionsWpp().length > 0 && (
                        <Tooltip title="Edit">
                            <IconButton
                            // onClick={() => handleSaveTicket(params.row, "whatsapp")}
                            >
                                <Message />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Edit">
                        <IconButton
                        // onClick={() => handleEdit(params.row.id)}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                        // onClick={() => handleDelete(params.row.id)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];
    function cSessionsWpp() {
        return whatsapp.filter(
            (w) =>
                ["whatsapp"].includes(w.type) &&
                !w.isDeleted &&
                w.status === "CONNECTED",
        );
    }

    const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 5 });
    const [filter, setFilter] = useState("");
    const contatos = useContatosStore((s) => s.contatos);
    const whatsapp = useWhatsappStore((s) => s.whatsApps);
    const [loading, setLoading] = useState(false);
    const handlePageChange = (event: unknown, newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };
    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPagination({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };
    const [params, setParams] = useState({
        pageNumber: 1,
        searchParam: null,
        hasMore: true,
    });



    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2, px: 4 }}>
            {isChatContact && (
                <Toolbar />
            )}
            <Box>Contatos</Box>
            <CustomTableContainer

                sx={{ bgcolor: 'background.paper' }}>
                <TableContainer
                    sx={{ mt: '4px' }}
                    id={`tabela-contatos-${isChatContact ? "atendimento" : ""}`}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.name}
                                    sx={{ width: `${100 / columns.length}%`, flexGrow: 1, textAlign: 'center' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contatos
                            .filter((row) => row.name.includes(filter))
                            .slice(
                                pagination.page * pagination.rowsPerPage,
                                pagination.page * pagination.rowsPerPage +
                                pagination.rowsPerPage,
                            )
                            .map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((col) => (
                                        <TableCell key={col.field} sx={{ width: `${100 / columns.length}%`, flexGrow: 1 }}>
                                            {col.renderCell
                                                ? col.renderCell({ value: row[col.field], row })
                                                : row[col.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </TableContainer>
            </CustomTableContainer>
            <TablePagination
                component="div"
                count={contatos.length}
                page={pagination.page}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Box>
    )

}