import { BaseEdge, getSmoothStepPath, MarkerType, type EdgeProps } from "@xyflow/react"

export const DefaultEdge = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,

}: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,

    })

    return (
        <BaseEdge path={edgePath} style={{ strokeWidth: 2 }} />
    )
}