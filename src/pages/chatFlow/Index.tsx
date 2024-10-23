import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const ChatFlow: React.FC = () => {
    const { decryptData } = useAuth()
    const userProfile = decryptData('profile')

    return (
        <>
            {userProfile === "admin" &&
                <Outlet />
            }
        </>
    )
}