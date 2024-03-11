import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RemoveIcon from '@mui/icons-material/Remove';
import {  Card, CardActionArea, CardContent, CardHeader, Chip, IconButton, Stack } from "@mui/material";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { Attributes, Task } from "../../lib/db/db";
import CardTitle from "./CardTitle";
import { selectTaskAttributeOfProject, selectTaskAttributeOfTtype, updateTitle } from "../service/KanbanService";
import { BoardContext } from "./KanbanBoard";

export interface KanbanCardOption {
    item : Task
}

export default function KanbanCard({
    item
} : KanbanCardOption){
    const boardContext = useContext(BoardContext);
    const [typeAttribute, setTypeAttribute] = useState<Attributes|null>();
    const [projectAttribute, setProjectAttribute] = useState<Attributes|null>();

    useEffect(()=>{
        selectTaskAttributeOfProject(item.id!).then(at=>{if(at) setProjectAttribute(at)});
        selectTaskAttributeOfTtype(item.id!).then(at=>{if(at)setTypeAttribute(at)});
    },[item]);

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
            <Card
            >
                <CardActionArea
                    onClick={(e)=>{if(e.clientX===0 && e.clientY ===0) {return false;} boardContext.openDrawer(item)}}
                >
                    <CardHeader
                        title={<CardTitle 
                            text={item.title}
                            onChange={changeHandler}
                        />}
                        titleTypographyProps={{
                            style:{height:'20px'}
                        }}
                        action={<IconButton size="small" onClick={deleteCard}><RemoveIcon fontSize="small" /></IconButton>}
                        sx={{paddingBottom:0, padding:1}}
                    />
                    <CardContent
                        sx={{paddingTop:0}}
                    >
                        <Stack direction={'row'} spacing={1}>
                            {typeAttribute ? <Chip 
                                label={typeAttribute?.name} 
                                sx={{fontSize : '0.7rem', fontWeight : 'bold'}} 
                                color={typeAttribute.id === 1 ? 'default' 
                                    : typeAttribute.id === 2 ? 'info'
                                    : typeAttribute.id === 3 ? 'success'
                                    : typeAttribute.id === 4 ? 'error'
                                    : 'default'
                                }
                                size="small" /> : ''}
                            {projectAttribute ? <Chip label={projectAttribute?.name} 
                                sx={{fontSize : '0.7rem', fontWeight : 'bold'}} 
                                color={projectAttribute.id === 9 ? 'default' 
                                : projectAttribute.id === 6 ? 'info'
                                : projectAttribute.id === 5 ? 'success'
                                : projectAttribute.id === 7 ? 'secondary'
                                : 'default'}
                                size="small" /> : ''}
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};
