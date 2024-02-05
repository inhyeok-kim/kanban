import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, CardActionArea, CardContent, CardHeader, Drawer, IconButton } from "@mui/material";
import { MouseEvent, useContext, useEffect } from "react";
import { Task } from "../../lib/db/db";
import CardTitle from "./CardTitle";
import { updateTitle } from "../service/KanbanService";
import { BoardContext } from "./KanbanBoard";

export interface KanbanCardOption {
    item : Task
}

export default function KanbanCard({
    item
} : KanbanCardOption){
    const boardContext = useContext(BoardContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        data
    } = useSortable({ id: item.id!, data : item });
    
    const style = {
        margin : '5px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    useEffect(()=>{
    },[isDragging]);

    function changeHandler(value: string){
        data.title = value;
        item.title = value;
        updateTitle(item);
    }

    function deleteCard(e:MouseEvent){
        boardContext.deleteCard(item);
        e.stopPropagation();
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card>
                <CardActionArea
                    onClick={()=>{boardContext.openDrawer(item)}}
                >
                    <CardHeader
                        title={<CardTitle 
                            text={item.title}
                            onChange={changeHandler}
                        />}
                        titleTypographyProps={{
                            style:{height:'20px'}
                        }}
                        action={<IconButton size="small" onClick={deleteCard}>-</IconButton>}
                        sx={{paddingBottom:0, padding:1}}
                    />
                    <CardContent
                        sx={{paddingTop:0}}
                    >
                        
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};
