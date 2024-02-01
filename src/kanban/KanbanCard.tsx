import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@mui/material";
import { useEffect } from "react";

export interface KanbanCardOption {
    item : KanbanCardData
}

export interface KanbanCardData {
    id : string,
    content : string
}

export default function KanbanCard({
    item
} : KanbanCardOption){

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id, data : item });
    
    const style = {
        margin : '5px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    useEffect(()=>{
    },[isDragging]);
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card>
                <CardContent>
                    {item.content}
                </CardContent>
            </Card>
        </div>
    );
};
