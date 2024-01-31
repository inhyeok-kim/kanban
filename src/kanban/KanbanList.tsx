import { Button, Card, CardActions, CardContent, CardHeader, Stack } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanCard, { KanbanCardData } from "./KanbanCard";

export interface KanbanListOption {
    itemList : KanbanListData
    index : number
}

export interface KanbanListData {
    id : string,
    name : string,
    items : KanbanCardData[]
}

export default function KanbanList({
    itemList
    ,index
} : KanbanListOption){

    return (
        <Draggable
            draggableId={itemList.id} 
            index={index}
        >
            {(provided, snapshot) => (
                <div 
                    key={itemList.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Card
                        sx={{
                            margin:0.5,
                            background:blueGrey[200]
                        }}
                    >
                        <CardHeader
                            title={itemList.name}
                            titleTypographyProps={{fontSize:'1rem'}}

                        />
                        <CardContent
                            sx={{padding : 0}}
                        >
                            <Droppable
                                droppableId={`${index}`}
                                key={`${index}`}
                                type="task"
                            >
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}    
                                    >
                                        <Stack 
                                            // spacing={1}
                                            justifyContent={'flex-start'}
                                            width={250}
                                            padding={1}
                                            margin={0.5}
                                        >
                                            {itemList.items.map((item,index)=>(
                                                item?
                                                <KanbanCard key={item.id} item={item as KanbanCardData} index={index} />
                                                :''
                                            ))}
                                            
                                            {provided.placeholder}
                                        </Stack>
                                    </div>
                                )}
                            </Droppable>
                        </CardContent>
                        <CardActions>
                            <Button>New</Button>
                        </CardActions>
                    </Card>
            </div>
        )}
    </Draggable>
    )
}

