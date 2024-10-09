import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { PanelChatFlow } from "../../components/FlowBuilderComponent/Panel"

export const ChatFlow: React.FC = () => {
    const { decryptData } = useAuth()
    const userProfile = decryptData('profile')

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            {userProfile === "admin" &&
                // <Outlet />
                <PanelChatFlow />
            }
        </Box>
    )
}