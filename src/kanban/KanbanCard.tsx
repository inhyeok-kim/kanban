import { Button, Card, CardActions, CardContent } from "@mui/material";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";

export interface KanbanCardOption {
    item : KanbanCardData
    index : number
}

export interface KanbanCardData {
    id : string,
    title : string
}

export default memo(function KanbanCard({
    item
    ,index
} : KanbanCardOption){

    return (
        <Draggable
            key={item.id} 
            draggableId={item.id} 
            index={index}
        >
            {(provided, snapshot) => (
                <div 
                    key={item.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Card
                        sx={{margin:0.5}}
                    >
                        <CardContent>
                            {item.title}
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
});