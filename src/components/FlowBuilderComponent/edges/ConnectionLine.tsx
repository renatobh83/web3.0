import { type ConnectionLineComponentProps, getSimpleBezierPath } from "@xyflow/react";

export const ConnectionLine = ({ fromX, fromY, toX, toY, connectionStatus }: ConnectionLineComponentProps) => {
    const [d] = getSimpleBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY
    })
    let color = "black"
    if (connectionStatus === "valid") color = "#55dd99"
    if (connectionStatus === "invalid") color = "#ff6060"
    return <path fill="none" stroke={color} strokeWidth={1.5} d={d} />
}