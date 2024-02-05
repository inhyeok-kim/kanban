import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard"
import { useDroppable } from "@dnd-kit/core";
import { Button, Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Column } from "../../lib/db/db";
import { useContext } from "react";
import { BoardContext } from "./KanbanBoard";

export interface KanbanListOption {
    itemList : Column
}

export default function KanbanList({
    itemList
} : KanbanListOption){
    const id = "Col"+itemList.id!;
    const items = itemList.items!;

    const boardContext = useContext(BoardContext);

    const { setNodeRef } = useDroppable({
        id
    });

    function createNewCard(){
        boardContext.createNewCard(id);
    }
  
    return (
        <Stack
            width={250}
            minWidth={250}
        >
            <Card
                sx={{background : 'rgba(255,255,255,0.5)'}}
            >
                <CardHeader
                    avatar={<></>}
                    title={itemList.name}
                    action={<Button onClick={createNewCard}>+</Button>}
                    sx={{paddingBottom : 0, padding : 0.5}}
                />
                <CardContent

                    sx={{paddingTop : 0, padding : 0.5, paddingBottom : '6px !important'}}
                >
                    <SortableContext
                        id={id}
                        //@ts-ignore
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <Grid2 
                            ref={setNodeRef}
                            minHeight={60}
                        >
                            {items.map((item : any) => (
                                <KanbanCard key={"Task"+item.id} item={item} />
                            ))}
                        </Grid2>
                    </SortableContext>
                </CardContent>
            </Card>
        </Stack>
    );
  }