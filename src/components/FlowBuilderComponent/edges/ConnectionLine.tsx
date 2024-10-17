import { useTheme } from "@mui/material";
import { type ConnectionLineComponentProps, getSimpleBezierPath } from "@xyflow/react";

export const ConnectionLine = ({ fromX, fromY, toX, toY, connectionStatus }: ConnectionLineComponentProps) => {
    const theme = useTheme(); // Obtém o tema atual
    const [d] = getSimpleBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY
    })
    const isDarkMode = theme.palette.mode === 'dark';
    let color = isDarkMode ? theme.palette.grey[200] : theme.palette.grey[600]
    if (connectionStatus === "valid") color = "#55dd99"
    if (connectionStatus === "invalid") color = "#ff6060"
    return <path fill="none" stroke={color} strokeWidth={1.5} d={d} />
}