import { Stack, Typography, Breadcrumbs, breadcrumbsClasses, styled } from "@mui/material";
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export function Header() {
    const location = useLocation()
    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <StyledBreadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextRoundedIcon fontSize="small" />}
            >
                {/* <Typography variant="body1">Dashboard</Typography> */}
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {(location.pathname).toUpperCase().replace("/", " ")}
                </Typography>
            </StyledBreadcrumbs>
            <Stack direction="row" sx={{ gap: 1 }}>

            </Stack>
        </Stack>
    )
}