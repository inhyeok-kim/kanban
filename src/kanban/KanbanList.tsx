import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard"
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Column } from "../lib/db/db";

export interface KanbanListOption {
    itemList : Column
}

export default function KanbanList({
    itemList
} : KanbanListOption){
    const id = "Col"+itemList.id!;
    const items = itemList.items!;

    const { setNodeRef } = useDroppable({
        id
    });
  
    return (
        <Stack
            width={250}
        >
            <Card
                sx={{background : 'rgba(255,255,255,0.5)'}}
            >
                <CardContent>
                    <Typography>
                        {itemList.name}
                    </Typography>
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