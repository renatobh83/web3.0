import { Card, CardContent, Toolbar, Typography } from "@mui/material"
import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export const Kanbans = () => {
    const [dropGroups, setDropGroups] = useState([]);
    const handleSave = async (updatedData) => {
     
      };
    return (
        <div style={{ padding: '8px' }}>
            <Card style={{ marginBottom: '16px' }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        Controle Visual de Atendimentos
                    </Typography>
                </CardContent>
            </Card>
            <DragDropContext onDragEnd={(result) => handleSave(result)}>
            {dropGroups.map(group => (
          
                <Droppable key={group.id} droppableId={group.id.toString()}>
                        <div>as</div>
                </Droppable>
            ))}
            </DragDropContext>

        </div>)
}