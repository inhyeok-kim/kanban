import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard, { KanbanCardData } from "./KanbanCard"
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export interface KanbanListOption {
    itemList : KanbanListData
    // index : number
}

export interface KanbanListData {
    id : string,
    name : string,
    items : KanbanCardData[]
}

export default function KanbanList({
    itemList
    // ,index
} : KanbanListOption){
    const { id, items } = itemList;

    const { setNodeRef } = useDroppable({
      id
    });
  
    return (
        <Stack
            width={250}
        >
            <Card>
                <CardContent>
                    <Typography>
                        {itemList.name}
                    </Typography>
                    <SortableContext
                        key={id}
                        id={id}
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <Grid2 
                            ref={setNodeRef}
                            minHeight={60}
                        >
                            {items.map((item : any) => (
                                <KanbanCard key={item.id} item={item} />
                            ))}
                        </Grid2>
                    </SortableContext>
                </CardContent>
            </Card>
        </Stack>
    );
  }